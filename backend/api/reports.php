<?php
/**
 * Reports API: Maneja la autenticación y la lectura de datos para la página de reportes.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/** Resolucion de log dedicado para reportes */
function resolveReportsLog()
{
    $dir = __DIR__ . '/../logs';
    if (!@is_dir($dir))
        @mkdir($dir, 0755, true);
    if (@is_writable($dir))
        return $dir . '/reports.log';
    return null;
}
$logFile = resolveReportsLog();

function stepLog($logFile, $step, $status, $detail = '')
{
    if (!$logFile)
        return;
    $record = ['timestamp' => date('Y-m-d H:i:s'), 'step' => $step, 'status' => $status, 'detail' => $detail];
    @file_put_contents($logFile, json_encode($record, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
}

// Cargar .env
$envPaths = [__DIR__ . '/../../.env', __DIR__ . '/../.env'];
foreach ($envPaths as $candidate) {
    if (@file_exists($candidate)) {
        $vars = @parse_ini_file($candidate, false, INI_SCANNER_RAW);
        if ($vars !== false) {
            foreach ($vars as $k => $v) {
                putenv("$k=$v");
            }
        }
        break;
    }
}

// --- CONFIGURACIÓN DB ---
$dbHost = getenv('DB_HOST') ?: '';
$dbName = getenv('DB_NAME') ?: '';
$dbUser = getenv('DB_USER') ?: '';
$dbPass = getenv('DB_PASS') ?: '';

try {
    $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Crear tabla de usuarios de reportes si no existe
    $pdo->exec("CREATE TABLE IF NOT EXISTS `reports_users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) NOT NULL UNIQUE,
        `password_hash` VARCHAR(255) NOT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Verificar si hay algún usuario, si no, crear el default (admin / trompo2024!)
    $check = $pdo->query("SELECT COUNT(*) FROM `reports_users`")->fetchColumn();
    if ($check == 0) {
        $defaultUser = 'admin';
        $defaultPass = 'trompo2024!';
        $hash = password_hash($defaultPass, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO `reports_users` (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$defaultUser, $hash]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error de BD: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

// --- LOGIN ---
if ($action === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $inUser = $input['user'] ?? '';
    $inPass = $input['pass'] ?? '';

    $stmt = $pdo->prepare("SELECT password_hash FROM `reports_users` WHERE username = ?");
    $stmt->execute([$inUser]);
    $userRow = $stmt->fetch();

    if ($userRow && password_verify($inPass, $userRow['password_hash'])) {
        // Token basado en un secret dinámico o hash de la pass actual para validar sesión
        $token = base64_encode($inUser . ':' . hash('sha256', $userRow['password_hash']));
        echo json_encode(['success' => true, 'token' => $token]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Credenciales incorrectas']);
    }
    exit;
}

// --- VERIFICAR TOKEN (Middleware simplificado) ---
function verifyToken($pdo)
{
    // Intentar obtener el header de varias formas para compatibilidad con diferentes servidores
    $auth = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } else {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $auth = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $auth = $headers['authorization'];
        }
    }

    if (strpos($auth, 'Bearer ') !== 0) {
        stepLog($GLOBALS['logFile'], 'auth', 'ERROR', 'No Bearer token. Header: ' . substr($auth, 0, 15) . '...');
        return false;
    }

    $token = substr($auth, 7);
    $decoded = base64_decode($token);
    if (!$decoded || strpos($decoded, ':') === false) {
        stepLog($GLOBALS['logFile'], 'auth', 'ERROR', 'Invalid token format.');
        return false;
    }

    list($user, $clientHash) = explode(':', $decoded);

    $stmt = $pdo->prepare("SELECT password_hash FROM `reports_users` WHERE username = ?");
    $stmt->execute([$user]);
    $userRow = $stmt->fetch();

    if (!$userRow) {
        stepLog($GLOBALS['logFile'], 'auth', 'ERROR', 'User not found: ' . $user);
        return false;
    }

    $serverHash = hash('sha256', $userRow['password_hash']);
    $isValid = hash_equals($serverHash, $clientHash);

    if (!$isValid) {
        stepLog($GLOBALS['logFile'], 'auth', 'ERROR', 'Hash mismatch for user: ' . $user);
    } else {
        stepLog($GLOBALS['logFile'], 'auth', 'OK', 'User: ' . $user);
    }

    return $isValid;
}

if ($action === 'data' || $action === 'export') {
    if (!verifyToken($pdo)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'No autorizado']);
        exit;
    }
}

// --- TRAER DATOS ---
if ($action === 'data') {
    try {
        $stmt = $pdo->query("SELECT * FROM `form_submissions` ORDER BY id DESC");
        $results = $stmt->fetchAll();

        // Limpiar/decodificar campos JSON para el frontend
        foreach ($results as &$row) {
            if (isset($row['fields'])) {
                $row['fields'] = json_decode($row['fields'], true);
            }
        }

        echo json_encode(['success' => true, 'data' => $results]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Acción no válida']);
