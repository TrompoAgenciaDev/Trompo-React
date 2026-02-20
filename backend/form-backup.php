<?php
/**
 * Endpoint independiente de backup de formularios.
 * POST /api/form-backup.php
 *
 * - Trazabilidad paso a paso con flowLog() en form-flow.log
 * - Acepta JSON (php://input) o FormData ($_POST)
 * - Responde SIEMPRE JSON (success, duplicate, db_saved, mail_sent, submission_id, server_request_id, debug)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'duplicate' => false,
        'db_saved' => false,
        'mail_sent' => false,
        'submission_id' => null,
        'server_request_id' => null,
        'debug' => ['error' => 'Método no permitido'],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$logDir = __DIR__ . '/logs';
@mkdir($logDir, 0755, true);

function flowLog($message, $data = null) {
    $logFile = __DIR__ . '/logs/form-flow.log';
    $timestamp = date('Y-m-d H:i:s');
    $entry = "\n[{$timestamp}]\nEVENT: {$message}\n";
    if ($data !== null) {
        $encoded = is_string($data) ? $data : json_encode($data, JSON_UNESCAPED_UNICODE);
        if (strlen($encoded) > 2000) {
            $encoded = substr($encoded, 0, 2000) . '...(truncated)';
        }
        $entry .= "DATA: " . $encoded . "\n";
    }
    $entry .= "----------------------------------------\n";
    @file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
}

// --- Cargar .env lo antes posible (para BACKUP_DEBUG) ---
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $vars = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if ($vars !== false) {
        foreach ($vars as $key => $value) {
            putenv("$key=$value");
        }
    }
}

$debug = (getenv('BACKUP_DEBUG') ?: '') === 'true' || (getenv('BACKUP_DEBUG') ?: '') === '1';
if ($debug) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(E_ALL);
    ini_set('log_errors', 1);
}

flowLog('SCRIPT_START');

flowLog('REQUEST_RECEIVED', [
    'method' => $_SERVER['REQUEST_METHOD'] ?? null,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
]);

flowLog('RAW_INPUT_CAPTURE_START');
$rawInput = file_get_contents('php://input');
flowLog('RAW_INPUT_CAPTURED', $rawInput === '' ? '(empty)' : $rawInput);

flowLog('POST_SUPERGLOBAL', $_POST);

flowLog('JSON_DECODE_START');
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$data = null;
if (strpos($contentType, 'application/json') !== false && $rawInput !== '') {
    $data = json_decode($rawInput, true);
    flowLog('JSON_DECODE_RESULT', $data);
} else {
    $data = $_POST;
    flowLog('DATA_FROM_POST', array_keys($data));
}

flowLog('VALIDATION_START');

if ($data === null || $data === [] || (is_array($data) && empty($data))) {
    $errorReason = 'Body vacío o JSON inválido';
    flowLog('VALIDATION_FAILED', $errorReason);
    $response = [
        'success' => false,
        'duplicate' => false,
        'db_saved' => false,
        'mail_sent' => false,
        'submission_id' => null,
        'server_request_id' => uniqid('req_', true),
        'debug' => $debug ? ['error' => $errorReason] : [],
    ];
    flowLog('RESPONSE_SENT', $response);
    http_response_code(400);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

flowLog('VALIDATION_PASSED');

$serverRequestId = uniqid('req_', true);
$submissionId = isset($data['SUBMISSION_ID']) ? trim((string) $data['SUBMISSION_ID']) : null;
$formIdentifier = isset($data['LOCATION']) ? trim(preg_replace('/[^a-zA-Z0-9_-]/', '', $data['LOCATION'])) : 'unknown';
$formData = [];
foreach ($data as $key => $value) {
    $formData[$key] = is_string($value) ? trim($value) : $value;
}
$formData['timestamp'] = date('Y-m-d H:i:s');
$formData['year'] = date('Y');

$ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

$out = [
    'success' => false,
    'duplicate' => false,
    'db_saved' => false,
    'mail_sent' => false,
    'submission_id' => $submissionId,
    'server_request_id' => $serverRequestId,
    'debug' => [],
];

// --- Conexión BD (necesaria para duplicate check e insert) ---
$pdo = null;
try {
    $dbHost = getenv('DB_HOST') ?: 'localhost';
    $dbName = getenv('DB_NAME') ?: 'trompo_db';
    $dbUser = getenv('DB_USER') ?: 'root';
    $dbPass = getenv('DB_PASS') ?: '';
    $dbCharset = getenv('DB_CHARSET') ?: 'utf8mb4';
    $dsn = "mysql:host={$dbHost};dbname={$dbName};charset={$dbCharset}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
    flowLog('DB_CONNECTION_OK');
} catch (PDOException $e) {
    flowLog('DB_CONNECTION_ERROR', $e->getMessage());
    $out['debug']['db_error'] = $debug ? $e->getMessage() : 'Error de conexión BD';
    flowLog('RESPONSE_SENT', $out);
    http_response_code(500);
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/LeadRepository.php';
$repo = new LeadRepository($pdo);

flowLog('DUPLICATE_CHECK_START', $submissionId);

$isDuplicate = false;
if ($submissionId !== null && $submissionId !== '') {
    try {
        $isDuplicate = $repo->existsBySubmissionId($submissionId);
        flowLog('DUPLICATE_CHECK_RESULT', ['exists' => $isDuplicate]);
    } catch (Exception $e) {
        flowLog('DUPLICATE_CHECK_ERROR', $e->getMessage());
        flowLog('DUPLICATE_CHECK_RESULT', ['exists' => false, 'error' => $e->getMessage()]);
    }
} else {
    flowLog('DUPLICATE_CHECK_RESULT', ['exists' => false, 'reason' => 'no_submission_id']);
}

if ($isDuplicate) {
    flowLog('DUPLICATE_EXIT');
    $out['duplicate'] = true;
    $out['success'] = true;
    $out['debug'] = [];
    flowLog('RESPONSE_SENT', $out);
    http_response_code(200);
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
}

flowLog('DB_INSERT_START');

$leadId = null;
try {
    $leadId = $repo->saveLead($formIdentifier, $formData, $ipAddress, $userAgent, $submissionId);
    $out['db_saved'] = true;
    flowLog('DB_INSERT_SUCCESS', ['lead_id' => $leadId]);
} catch (PDOException $e) {
    flowLog('DB_INSERT_ERROR', $e->getMessage());
    $out['debug']['db_error'] = $debug ? $e->getMessage() : 'Error al guardar';
    flowLog('RESPONSE_SENT', $out);
    http_response_code(500);
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
} catch (Exception $e) {
    flowLog('DB_INSERT_ERROR', $e->getMessage());
    $out['debug']['db_error'] = $debug ? $e->getMessage() : 'Error al guardar';
    flowLog('RESPONSE_SENT', $out);
    http_response_code(500);
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
}

flowLog('SMTP_BLOCK_START');

$smtpHost = getenv('SMTP_HOST') ?: 'localhost';

flowLog('SOCKET_TEST_465_START');
$connection465 = @fsockopen($smtpHost, 465, $errno465, $errstr465, 5);
if (!$connection465) {
    flowLog('SOCKET_465_FAILED', [
        'errno' => $errno465,
        'error' => $errstr465,
    ]);
} else {
    flowLog('SOCKET_465_SUCCESS');
    fclose($connection465);
}

flowLog('SOCKET_TEST_587_START');
$connection587 = @fsockopen($smtpHost, 587, $errno587, $errstr587, 5);
if (!$connection587) {
    flowLog('SOCKET_587_FAILED', [
        'errno' => $errno587,
        'error' => $errstr587,
    ]);
} else {
    flowLog('SOCKET_587_SUCCESS');
    fclose($connection587);
}

try {
    flowLog('SMTP_INIT');
    require_once __DIR__ . '/MailService.php';
    require_once __DIR__ . '/NotificationTemplate.php';
    $mailService = new MailService(function ($event, $data = null) {
        flowLog($event, $data);
    });
    $htmlBody = NotificationTemplate::generate($formIdentifier, $formData);
    $mailService->sendLeadNotification($formIdentifier, $formData, $htmlBody);
    $out['mail_sent'] = true;
    flowLog('SMTP_SEND_SUCCESS');

    if ($leadId && $repo) {
        try {
            $repo->updateLeadStatus($leadId, 'notified');
        } catch (Exception $e) {
            flowLog('UPDATE_STATUS_AFTER_MAIL_ERROR', $e->getMessage());
        }
    }
} catch (Exception $e) {
    flowLog('SMTP_ERROR', $e->getMessage());
    if (empty($out['debug'])) {
        $out['debug']['mail_error'] = $debug ? $e->getMessage() : 'Error al enviar correo';
    }
    if ($leadId && $repo) {
        try {
            $repo->updateLeadStatus($leadId, 'error', $e->getMessage());
        } catch (Exception $e2) {
            flowLog('UPDATE_STATUS_ERROR', $e2->getMessage());
        }
    }
}

$out['success'] = $out['db_saved'] || $out['mail_sent'];
if ($out['success']) {
    $out['debug'] = [];
}

flowLog('RESPONSE_SENT', $out);

http_response_code($out['success'] ? 200 : 500);
echo json_encode($out, JSON_UNESCAPED_UNICODE);
