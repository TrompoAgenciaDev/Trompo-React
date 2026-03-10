<?php
/**
 * Endpoint de backup de formularios.
 * Acepta JSON POST, registra en log (siempre) y envía notificación por email.
 * Sin base de datos. Independiente de Brevo.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Limpieza de salida: evita que Warnings de PHP ensucien la respuesta JSON
ob_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_clean();
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$maxPayloadSize = 256 * 1024;
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > $maxPayloadSize || $contentLength <= 0) {
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Payload demasiado grande'], JSON_UNESCAPED_UNICODE);
    exit;
}

ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

/**
 * Resuelve el directorio de logs: intenta backend/logs; si falla (open_basedir, permisos),
 * usa public_html/api/logs como log de emergencia.
 */
function resolveLogFile()
{
    $candidates = [
        __DIR__ . '/../logs', // backend/logs cuando __DIR__ = backend/api
    ];
    if (isset($_SERVER['DOCUMENT_ROOT']) && $_SERVER['DOCUMENT_ROOT'] !== '') {
        $docRoot = rtrim($_SERVER['DOCUMENT_ROOT'], '/\\');
        $candidates[] = $docRoot . '/api/logs'; // public_html/api/logs (fallback open_basedir)
    }
    $candidates[] = __DIR__ . '/logs'; // api/logs si script está en public_html/api
    foreach ($candidates as $dir) {
        $resolved = @realpath($dir);
        if ($resolved === false) {
            if (@mkdir($dir, 0755, true) && is_dir($dir)) {
                $resolved = @realpath($dir);
            }
        }
        if ($resolved !== false && is_dir($resolved) && @is_writable($resolved)) {
            return $resolved . DIRECTORY_SEPARATOR . 'form-backup.log';
        }
    }
    return null;
}

$logFile = resolveLogFile();

/** Registra un paso del proceso (para depuración). */
function stepLog($logFile, $step, $status, $detail = '')
{
    if ($logFile === null || $logFile === '') {
        return;
    }
    $record = [
        'type' => 'step',
        'timestamp' => date('Y-m-d H:i:s'),
        'step' => $step,
        'status' => $status,
    ];
    if ($detail !== '') {
        $record['detail'] = $detail;
    }
    $line = json_encode($record, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

// Cargar .env: intentar varias rutas (raíz del proyecto = hermano de backend, o dentro de backend)
$envPaths = [
    __DIR__ . '/../.env', // backend/.env
    __DIR__ . '/../../.env', // raíz (hermano de backend)
];
if (isset($_SERVER['DOCUMENT_ROOT']) && $_SERVER['DOCUMENT_ROOT'] !== '') {
    $envPaths[] = $_SERVER['DOCUMENT_ROOT'] . '/../.env'; // raíz desde document root (public_html/../.env)
    $envPaths[] = dirname($_SERVER['DOCUMENT_ROOT']) . '/.env';
}
$envLoaded = false;
$envPathFound = false;
foreach ($envPaths as $candidate) {
    $resolved = @realpath($candidate);
    if ($resolved !== false && @is_readable($resolved)) {
        $envPathFound = true;
        $lines = @file($resolved, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines !== false) {
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || (strlen($line) > 0 && $line[0] === '#')) {
                    continue;
                }
                if (strpos($line, '=') !== false) {
                    $key = trim(substr($line, 0, strpos($line, '=')));
                    $value = trim(substr($line, strpos($line, '=') + 1));
                    if ($key !== '') {
                        $value = trim($value, '"\'');
                        putenv("$key=$value");
                    }
                }
            }
            $envLoaded = true;
            stepLog($logFile, 'load_env', 'OK', 'file=' . $resolved);
        } else {
            stepLog($logFile, 'load_env', 'ERROR', 'read_failed path=' . $candidate);
        }
        break;
    }
}
if (!$envPathFound) {
    stepLog($logFile, 'load_env', 'ERROR', 'not_found tried=' . implode(' | ', $envPaths));
}

function writeLog($logFile, $status, $data)
{
    if ($logFile === null || $logFile === '') {
        return;
    }
    $record = [
        'timestamp' => date('Y-m-d H:i:s'),
        'status' => $status,
        'log_version' => 2,
        'formId' => $data['formId'] ?? '',
        'pageUrl' => $data['pageUrl'] ?? '',
        'ip' => $data['ip'] ?? '',
        'user_agent' => isset($data['user_agent']) ? substr($data['user_agent'], 0, 200) : '',
        'fields' => $data['fields'] ?? [],
    ];
    if (isset($data['error'])) {
        $record['error'] = $data['error'];
    }
    if (isset($data['mail_sent'])) {
        $record['mail_sent'] = $data['mail_sent'];
    }
    $line = json_encode($record, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

function jsonResponse($success, $data = [])
{
    while (ob_get_level()) {
        ob_end_clean();
    }
    echo json_encode(array_merge(['success' => $success], $data), JSON_UNESCAPED_UNICODE);
}

$logData = [
    'ip' => preg_replace('/[^\d\.\:\s]/', '', trim($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '')),
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
];

try {
    stepLog($logFile, 'request', 'OK', 'POST start');

    $rawInput = file_get_contents('php://input');
    if ($rawInput === false) {
        stepLog($logFile, 'read_input', 'ERROR', 'file_get_contents failed');
        $logData['formId'] = 'unknown';
        $logData['pageUrl'] = '';
        $logData['fields'] = [];
        $logData['error'] = 'No se pudo leer el body';
        writeLog($logFile, 'ERROR', $logData);
        http_response_code(400);
        jsonResponse(false, ['error' => 'Body inválido']);
        exit;
    }
    stepLog($logFile, 'read_input', 'OK', 'bytes=' . strlen($rawInput));

    $data = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
        stepLog($logFile, 'json_decode', 'ERROR', json_last_error_msg());
        $logData['formId'] = 'unknown';
        $logData['pageUrl'] = '';
        $logData['fields'] = [];
        $logData['error'] = 'JSON inválido: ' . json_last_error_msg();
        writeLog($logFile, 'ERROR', $logData);
        http_response_code(400);
        jsonResponse(false, ['error' => 'JSON inválido']);
        exit;
    }
    stepLog($logFile, 'json_decode', 'OK', '');

    $formId = isset($data['formId']) ? trim(preg_replace('/[^\p{L}\p{N}\-_]/u', '', (string) $data['formId'])) : 'unknown';
    $formId = $formId !== '' ? $formId : 'unknown';
    $timestamp = isset($data['timestamp']) ? trim((string) $data['timestamp']) : date('c');
    $pageUrl = isset($data['pageUrl']) ? trim((string) $data['pageUrl']) : '';
    $pageUrl = strlen($pageUrl) > 2048 ? substr($pageUrl, 0, 2048) : $pageUrl;
    $fields = isset($data['fields']) && is_array($data['fields']) ? $data['fields'] : [];

    foreach ($fields as $k => $v) {
        if (!is_string($k) || !is_scalar($v)) {
            unset($fields[$k]);
            continue;
        }
        $fields[$k] = trim((string) $v);
    }

    $logData['formId'] = $formId;
    $logData['pageUrl'] = $pageUrl;
    $logData['fields'] = $fields;

    stepLog($logFile, 'parse_fields', 'OK', 'formId=' . $formId);

    // Honeypot: si "fax" tiene valor, es un bot (humanos no completan este campo invisible)
    $honeypot = isset($fields['fax']) ? trim((string) $fields['fax']) : '';
    if ($honeypot !== '') {
        stepLog($logFile, 'honeypot', 'BLOCKED', 'bot_detected');
        $logData['error'] = 'Envío no válido';
        writeLog($logFile, 'HONEYPOT', $logData);
        http_response_code(400);
        jsonResponse(false, ['error' => 'Hubo un error. Por favor intentá de nuevo.']);
        exit;
    }

    // Validar reCAPTCHA v2 solo si se envía token (opcional en servidor).
    $recaptchaSecret = getenv('RECAPTCHA_SECRET') ?: '';
    $recaptchaToken = isset($fields['g-recaptcha-response']) ? trim((string) $fields['g-recaptcha-response']) : '';
    if ($recaptchaSecret !== '' && $recaptchaToken !== '') {
        $verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
        $verifyPayload = http_build_query([
            'secret' => $recaptchaSecret,
            'response' => $recaptchaToken,
            'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
        ]);

        $vh = curl_init($verifyUrl);
        curl_setopt($vh, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($vh, CURLOPT_POST, true);
        curl_setopt($vh, CURLOPT_POSTFIELDS, $verifyPayload);
        curl_setopt($vh, CURLOPT_HTTPHEADER, ["Content-Type: application/x-www-form-urlencoded"]);
        $verifyResponse = curl_exec($vh);
        $verifyErr = $verifyResponse === false ? curl_error($vh) : '';
        curl_close($vh);

        if ($verifyResponse === false) {
            stepLog($logFile, 'recaptcha', 'ERROR', 'curl_error ' . $verifyErr);
            $logData['error'] = 'Error al verificar captcha';
            writeLog($logFile, 'ERROR', $logData);
            http_response_code(500);
            jsonResponse(false, ['error' => 'Error al verificar captcha']);
            exit;
        }

        $verifyJson = json_decode($verifyResponse, true);
        if (!is_array($verifyJson) || empty($verifyJson['success'])) {
            stepLog($logFile, 'recaptcha', 'ERROR', 'invalid');
            $logData['error'] = 'Captcha inválido';
            writeLog($logFile, 'ERROR', $logData);
            http_response_code(400);
            jsonResponse(false, ['error' => 'Captcha inválido']);
            exit;
        }

        stepLog($logFile, 'recaptcha', 'OK', '');
    }

    $autoloadPath = __DIR__ . '/../vendor/autoload.php';
    if (!file_exists($autoloadPath)) {
        stepLog($logFile, 'autoload', 'ERROR', 'file_not_found path=' . $autoloadPath);
        $logData['error'] = 'Autoload no encontrado (vendor/autoload.php)';
        writeLog($logFile, 'ERROR', $logData);
        http_response_code(500);
        jsonResponse(false, ['error' => 'Error interno']);
        exit;
    }
    require_once $autoloadPath;
    stepLog($logFile, 'autoload', 'OK', '');

    $smtpHost = getenv('SMTP_HOST') ?: '';
    $smtpTo = getenv('SMTP_TO') ?: '';
    $smtpCco = getenv('SMTP_CCO') ?: '';
    $mailSent = false;

    // --- Lógica de Base de Datos ---
    $dbHost = getenv('DB_HOST') ?: '';
    $dbName = getenv('DB_NAME') ?: '';
    $dbUser = getenv('DB_USER') ?: '';
    $dbPass = getenv('DB_PASS') ?: '';
    $dbLogged = false;

    if ($dbHost !== '' && $dbName !== '') {
        try {
            $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            // 1. Asegurar que la tabla existe
            $pdo->exec("CREATE TABLE IF NOT EXISTS `form_submissions` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `form_id` VARCHAR(100) NOT NULL,
                `url` TEXT NOT NULL,
                `ip` VARCHAR(45) NOT NULL,
                `user_agent` TEXT,
                `fields` JSON NOT NULL,
                `created_at` DATETIME NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            // 2. Insertar el registro
            $stmt = $pdo->prepare("INSERT INTO `form_submissions` 
                (`form_id`, `url`, `ip`, `user_agent`, `fields`, `created_at`) 
                VALUES (?, ?, ?, ?, ?, ?)");

            $stmt->execute([
                $formId,
                $pageUrl,
                $logData['ip'],
                $logData['user_agent'],
                json_encode($fields, JSON_UNESCAPED_UNICODE),
                date('Y-m-d H:i:s')
            ]);

            $dbLogged = true;
            stepLog($logFile, 'db_save', 'OK', 'id=' . $pdo->lastInsertId());
        } catch (PDOException $e) {
            stepLog($logFile, 'db_save', 'ERROR', $e->getMessage());
            // No detenemos el flujo si falla la DB, pero lo logueamos
        }
    }

    if ($smtpHost !== '' && $smtpTo !== '') {
        stepLog($logFile, 'smtp_config', 'OK', 'host=' . $smtpHost . ' to=' . $smtpTo . ($smtpCco !== '' ? ' cco=' . $smtpCco : ''));
        $smtpUser = getenv('SMTP_USER') ?: '';
        $smtpPass = getenv('SMTP_PASS') ?: '';

        // Gmail: setFrom debe ser idéntico a SMTP_USER (requisito estricto de Google)
        $smtpFrom = getenv('SMTP_FROM') ?: $smtpUser;
        $isGmail = stripos($smtpHost, 'gmail.com') !== false;
        if ($isGmail) {
            $smtpFrom = $smtpUser;
        }

        // Configuraciones a probar: 587+TLS primero; si falla, 465+SSL (muchos hostings bloquean 587)
        $envPort = (int) (getenv('SMTP_PORT') ?: 587);
        $envEnc = getenv('SMTP_ENCRYPTION') ?: 'tls';
        $attempts = $isGmail
            ? [['port' => 587, 'encryption' => 'tls'], ['port' => 465, 'encryption' => 'ssl']]
            : [['port' => $envPort, 'encryption' => $envEnc]];
        if (!$isGmail && $envPort === 587 && $envEnc === 'tls') {
            $attempts[] = ['port' => 465, 'encryption' => 'ssl'];
        }

        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPass;
        $mail->CharSet = 'UTF-8';
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => false,
                'allow_self_signed' => false,
            ],
        ];
        // Debug SMTP profundo: salida al archivo de log, nunca al navegador
        if (strtolower(trim(getenv('SMTP_DEBUG') ?: '')) === '1' && $logFile !== null) {
            $mail->SMTPDebug = 2;
            $mail->Debugoutput = function ($str) use ($logFile) {
                $line = json_encode(['type' => 'step', 'timestamp' => date('Y-m-d H:i:s'), 'step' => 'smtp_debug', 'detail' => trim($str)], JSON_UNESCAPED_UNICODE) . PHP_EOL;
                @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
            };
        }
        $mail->setFrom($smtpFrom, 'Contacto de Formulario');
        foreach (array_map('trim', explode(',', $smtpTo)) as $to) {
            if ($to !== '') {
                $mail->addAddress($to);
            }
        }
        if ($smtpCco !== '') {
            foreach (array_map('trim', explode(',', $smtpCco)) as $cco) {
                if ($cco !== '') {
                    $mail->addBCC($cco);
                }
            }
        }
        $mail->Subject = 'Nuevo mensaje de contacto - Trompo';
        $mail->isHTML(true);

        $pageUrlEsc = htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8');
        $rows = "<tr>
                    <th style='text-align: left; padding: 12px; background-color: #f9f9fb; border-top: 1px solid #eeeeee; width: 30%; color: #6b6b75; font-size: 13px; text-transform: uppercase; font-family: Helvetica, Arial, sans-serif;'>URL DE ORIGEN</th>
                    <td style='padding: 12px; border-top: 1px solid #eeeeee; font-size: 11px; color: #6b6b75; font-family: Helvetica, Arial, sans-serif;'><a href='{$pageUrlEsc}' style='color: #6b6b75; text-decoration: none;'>{$pageUrlEsc}</a></td>
                  </tr>";

        foreach ($fields as $label => $value) {
            if ($label === 'g-recaptcha-response' || $label === 'LOCATION')
                continue; // Ocultar token y location
            $labelEsc = htmlspecialchars($label, ENT_QUOTES, 'UTF-8');
            $valueEsc = nl2br(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
            $rows .= "<tr>
                        <th style='text-align: left; padding: 12px; background-color: #f9f9fb; border-top: 1px solid #eeeeee; width: 30%; color: #6b6b75; font-size: 13px; text-transform: uppercase; font-family: Helvetica, Arial, sans-serif;'>{$labelEsc}</th>
                        <td style='padding: 12px; border-top: 1px solid #eeeeee; font-size: 15px; color: #0f0f12; font-family: Helvetica, Arial, sans-serif;'>{$valueEsc}</td>
                      </tr>";
        }

        $pageUrlEsc = htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8');
        $timestampEsc = htmlspecialchars($timestamp, ENT_QUOTES, 'UTF-8');
        $formIdEsc = htmlspecialchars($formId, ENT_QUOTES, 'UTF-8');

        $mail->Body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
        </head>
        <body style='font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; color: #0f0f12;'>
            <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f7; padding: 40px 0;'>
                <tr>
                    <td align='center'>
                        <table width='100%' max-width='600' style='background-color: #ffffff; margin: 0 auto; max-width: 600px; border-spacing: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);'>
                            <tr>
                                <td style='background-color: #FEE070; padding: 40px; text-align: center;'>
                                    <h1 style='margin: 0; font-size: 32px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 5px; font-style: italic;'>TROMPO</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style='padding: 40px 30px;'>
                                    <h2 style='margin-top: 0; font-size: 22px; color: #0f0f12; border-bottom: 4px solid #FEE070; padding-bottom: 10px; display: inline-block; font-weight: 800; text-transform: uppercase;'>Nuevo contacto</h2>
                                    <p style='line-height: 1.6; margin: 20px 0; font-size: 16px; color: #333333;'>Has recibido un mensaje desde el formulario web. Aquí tienes los detalles:</p>
                                    
                                    <table width='100%' style='border-collapse: collapse; margin-top: 25px; border: 1px solid #eeeeee;'>
                                        {$rows}
                                    </table>
                                    
                                    <div style='margin-top: 40px; font-size: 12px; color: #999999; background: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #f0f0f0;'>
                                        <p style='margin: 5px 0;'><strong>Enviado desde:</strong> <a href='{$pageUrlEsc}' style='color: #6b6b75; text-decoration: none;'>{$pageUrlEsc}</a></p>
                                        <p style='margin: 5px 0;'><strong>Fecha:</strong> {$timestampEsc} | <strong>ID:</strong> {$formIdEsc}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style='padding: 20px; text-align: center; font-size: 11px; color: #aaaaaa; background-color: #ffffff;'>
                                    <p>&copy; " . date('Y') . " Trompo Agencia. Todos los derechos reservados.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>";

        $mail->AltBody = "NUEVO CONTACTO - TROMPO\n\n" .
            "Has recibido un mensaje desde el formulario web.\n\n" .
            "ID Formulario: {$formId}\n" .
            "Timestamp: {$timestamp}\n" .
            "URL: {$pageUrl}\n\n" .
            "Campos:\n" . strip_tags(str_replace(['<tr>', '</th>', '</td>'], ["\n", ": ", ""], $rows));

        $lastError = '';
        foreach ($attempts as $idx => $cfg) {
            try {
                $mail->SMTPSecure = $cfg['encryption'];
                $mail->Port = $cfg['port'];
                stepLog($logFile, 'send_mail', 'OK', 'attempt=' . ($idx + 1) . ' port=' . $cfg['port'] . ' enc=' . $cfg['encryption']);
                $mail->send();
                $mailSent = true;
                stepLog($logFile, 'send_mail', 'OK', 'port=' . $cfg['port']);
                break;
            } catch (Exception $e) {
                $lastError = $e->getMessage();
                stepLog($logFile, 'send_mail', 'RETRY', 'port=' . $cfg['port'] . ' error=' . $lastError);
            }
        }
        if (!$mailSent) {
            stepLog($logFile, 'send_mail', 'ERROR', $lastError);
            $logData['error'] = 'SMTP: ' . $lastError;
        }
    } else {
        $reason = [];
        if ($smtpHost === '') {
            $reason[] = 'SMTP_HOST vacío';
        }
        if ($smtpTo === '') {
            $reason[] = 'SMTP_TO vacío';
        }
        stepLog($logFile, 'smtp_config', 'ERROR', implode('; ', $reason));
        if ($smtpHost === '' || $smtpTo === '') {
            $logData['error'] = 'SMTP no configurado (falta SMTP_HOST o SMTP_TO en .env)';
        }
    }

    $logData['mail_sent'] = $mailSent;
    $statusLog = $mailSent ? 'OK' : (isset($logData['error']) ? 'ERROR' : 'OK_NO_SMTP');
    stepLog($logFile, 'write_log', 'OK', 'status=' . $statusLog);
    writeLog($logFile, $statusLog, $logData);

    stepLog($logFile, 'response', 'OK', '200');
    http_response_code(200);
    jsonResponse(true, ['message' => 'Backup registrado']);
} catch (Exception $e) {
    stepLog($logFile, 'exception', 'ERROR', $e->getMessage());
    $logData['formId'] = $logData['formId'] ?? 'unknown';
    $logData['pageUrl'] = $logData['pageUrl'] ?? '';
    $logData['fields'] = $logData['fields'] ?? [];
    $logData['error'] = $e->getMessage();
    writeLog($logFile, 'ERROR', $logData);
    http_response_code(500);
    jsonResponse(false, ['error' => 'Error interno']);
}
