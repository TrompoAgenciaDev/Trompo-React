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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$maxPayloadSize = 256 * 1024;
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > $maxPayloadSize || $contentLength <= 0) {
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Payload demasiado grande'], JSON_UNESCAPED_UNICODE);
    exit;
}

ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

$logDir = __DIR__ . '/../logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}
$logFile = $logDir . '/form-backup.log';

/** Registra un paso del proceso (para depuración). */
function stepLog($logFile, $step, $status, $detail = '') {
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
    __DIR__ . '/../.env',       // backend/.env
    __DIR__ . '/../../.env',    // raíz (hermano de backend)
];
if (isset($_SERVER['DOCUMENT_ROOT']) && $_SERVER['DOCUMENT_ROOT'] !== '') {
    $envPaths[] = $_SERVER['DOCUMENT_ROOT'] . '/../.env';  // raíz desde document root (public_html/../.env)
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

function writeLog($logFile, $status, $data) {
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

function jsonResponse($success, $data = []) {
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
    $mailSent = false;

    if ($smtpHost !== '' && $smtpTo !== '') {
        stepLog($logFile, 'smtp_config', 'OK', 'host=' . $smtpHost . ' to=' . $smtpTo);
        $smtpPort = (int) (getenv('SMTP_PORT') ?: 587);
        $smtpUser = getenv('SMTP_USER') ?: '';
        $smtpPass = getenv('SMTP_PASS') ?: '';
        $smtpEncryption = getenv('SMTP_ENCRYPTION') ?: 'tls';
        $smtpFrom = getenv('SMTP_FROM') ?: $smtpUser;

        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUser;
            $mail->Password = $smtpPass;
            $mail->SMTPSecure = $smtpEncryption;
            $mail->Port = $smtpPort;
            $mail->CharSet = 'UTF-8';
            $mail->setFrom($smtpFrom, 'Backup Formulario - Trompo');
            foreach (array_map('trim', explode(',', $smtpTo)) as $to) {
                if ($to !== '') {
                    $mail->addAddress($to);
                }
            }
            $mail->Subject = 'Nuevo envío de formulario - Backup';
            $mail->isHTML(true);

            $rows = '';
            foreach ($fields as $label => $value) {
                $labelEsc = htmlspecialchars($label, ENT_QUOTES, 'UTF-8');
                $valueEsc = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                $rows .= "<tr><td><strong>{$labelEsc}</strong></td><td>{$valueEsc}</td></tr>";
            }
            $pageUrlEsc = htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8');
            $timestampEsc = htmlspecialchars($timestamp, ENT_QUOTES, 'UTF-8');
            $formIdEsc = htmlspecialchars($formId, ENT_QUOTES, 'UTF-8');

            $mail->Body = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>" .
                "<h2>Nuevo envío de formulario - Backup</h2>" .
                "<p><strong>Form ID:</strong> {$formIdEsc}</p>" .
                "<p><strong>Timestamp:</strong> {$timestampEsc}</p>" .
                "<p><strong>URL:</strong> <a href='{$pageUrlEsc}'>{$pageUrlEsc}</a></p>" .
                "<h3>Campos enviados</h3><table border='1' cellpadding='8'><thead><tr><th>Campo</th><th>Valor</th></tr></thead><tbody>{$rows}</tbody></table>" .
                "</body></html>";
            $mail->AltBody = "Form ID: {$formId}\nTimestamp: {$timestamp}\nURL: {$pageUrl}\n\nCampos:\n" . print_r($fields, true);
            $mail->send();
            $mailSent = true;
            stepLog($logFile, 'send_mail', 'OK', '');
        } catch (Exception $e) {
            $errMsg = $e->getMessage();
            stepLog($logFile, 'send_mail', 'ERROR', $errMsg);
            $logData['error'] = 'SMTP: ' . $errMsg;
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
