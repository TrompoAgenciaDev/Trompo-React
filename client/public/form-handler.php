<?php
/**
 * FORM HANDLER UNIFICADO - TROMPO
 * Gestión de leads: reCAPTCHA v3 + Base de Datos Local + Email SMTP.
 * Independiente de Brevo.
 */

// 1. Configuración de Errores (Activar para diagnóstico si hay 500)
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// Configuración de Seguridad
define('RECAPTCHA_BLOCK_SCORE', 0.3);
define('RECAPTCHA_LOW_CONFIDENCE_SCORE', 0.5);
define('SECURITY_RECAPTCHA_ACTION', 'form_submit');
define('SECURITY_MIN_TIME_TRAP', 2);
define('SECURITY_MAX_TIME_TRAP', 3600);

// --- Función de Trazabilidad (Log) ---
function flowLog($message, $data = null) {
    // Intentar encontrar el log en raíz o carpeta logs
    $candidates = [
        __DIR__ . '/../../form-flow.log',
        __DIR__ . '/../form-flow.log',
        __DIR__ . '/form-flow.log'
    ];
    $logFile = null;
    foreach ($candidates as $c) {
        if (@file_exists($c) || @is_writable(dirname($c))) {
            $logFile = $c;
            break;
        }
    }
    if (!$logFile) return;

    $timestamp = date('Y-m-d H:i:s');
    $entry = "\n[{$timestamp}]\nEVENT: {$message}\n";
    if ($data !== null) {
        $encoded = is_string($data) ? $data : json_encode($data, JSON_UNESCAPED_UNICODE);
        if (strlen($encoded) > 1000) $encoded = substr($encoded, 0, 1000) . '...';
        $entry .= "DATA: " . $encoded . "\n";
    }
    $entry .= "----------------------------------------\n";
    @file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
}

flowLog('SCRIPT_START_UNIFIED', ['ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown']);

// 2. Procesamiento de Input (Soporta FormData y JSON)
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

if ($jsonData) {
    $fields    = $jsonData['fields'] ?? [];
    $nombre    = $fields['NOMBRE'] ?? '';
    $apellidos = $fields['APELLIDOS'] ?? '';
    $email     = $fields['EMAIL'] ?? '';
    $empresa   = $fields['EMPRESA'] ?? '';
    $smsCode   = $fields['SMS_COUNTRY_CODE'] ?? '';
    $smsNum    = $fields['SMS'] ?? '';
    $consulta  = $fields['CONSULTA'] ?? '';
    $location  = $jsonData['formId'] ?? $fields['LOCATION'] ?? 'home';
    $recaptchaToken = $fields['g-recaptcha-response'] ?? '';
    $timeField = $fields['_t'] ?? 0;
    $honeypotField = $fields['fax'] ?? '';
    $submissionId = $fields['SUBMISSION_ID'] ?? null;
} else {
    $nombre    = $_POST['NOMBRE'] ?? '';
    $apellidos = $_POST['APELLIDOS'] ?? '';
    $email     = $_POST['EMAIL'] ?? '';
    $empresa   = $_POST['EMPRESA'] ?? '';
    $smsCode   = $_POST['SMS_COUNTRY_CODE'] ?? '';
    $smsNum    = $_POST['SMS'] ?? '';
    $consulta  = $_POST['CONSULTA'] ?? '';
    $location  = $_POST['LOCATION'] ?? 'home';
    $recaptchaToken = $_POST['g-recaptcha-response'] ?? '';
    $timeField = $_POST['_t'] ?? 0;
    $honeypotField = $_POST['fax'] ?? '';
    $submissionId = $_POST['SUBMISSION_ID'] ?? null;
}

// === Validaciones de Seguridad ===
$isLowConfidence = false;
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if (empty($ua)) $isLowConfidence = true;

// Honeypot
if (trim((string)$honeypotField) !== '') {
    flowLog('HONEYPOT_BLOCKED');
    echo json_encode(["success" => true, "message" => "Mensaje recibido"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Time Trap
$startTime = (int)$timeField;
$duration = ($startTime > 0) ? (time() - $startTime) : 0;
if ($startTime > 0 && ($duration < SECURITY_MIN_TIME_TRAP || $duration > SECURITY_MAX_TIME_TRAP)) {
    $isLowConfidence = true;
}

// reCAPTCHA v3
$recaptchaScore = null;
$recaptchaSecret = getenv('RECAPTCHA_SECRET') ?: ''; // Se carga después con config.php, pero validamos token aquí

// 3. Cargar Sistema de Backend (Base de Datos + SMTP)
$backendPath = __DIR__ . '/../backend';
if (!is_dir($backendPath)) { $backendPath = __DIR__ . '/../../backend'; }

if (!is_dir($backendPath)) {
    flowLog('CRITICAL_ERROR', 'No se encontró carpeta /backend');
    echo json_encode(["success" => false, "error" => "Error de configuración del sistema (backend)"], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require_once $backendPath . '/config.php'; // Carga .env y crea $pdo
    require_once $backendPath . '/LeadRepository.php';
    require_once $backendPath . '/MailService.php';
    require_once $backendPath . '/NotificationTemplate.php';

    $repo = new LeadRepository($pdo);
    $mailService = new MailService(function($msg, $data) { flowLog($msg, $data); });

    // Validar reCAPTCHA v3 seriamente
    $recaptchaSecret = getenv('RECAPTCHA_SECRET') ?: '';
    if ($recaptchaSecret !== '' && !empty($recaptchaToken)) {
        $verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
        $vh = curl_init($verifyUrl);
        curl_setopt($vh, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($vh, CURLOPT_POST, true);
        curl_setopt($vh, CURLOPT_POSTFIELDS, http_build_query([
            'secret' => $recaptchaSecret,
            'response' => $recaptchaToken,
            'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
        ]));
        curl_setopt($vh, CURLOPT_TIMEOUT, 10);
        $res = curl_exec($vh);
        curl_close($vh);

        if ($res) {
            $vj = json_decode($res, true);
            $recaptchaScore = $vj['score'] ?? 0;
            if (!($vj['success'] ?? false)) { $isLowConfidence = true; }
            elseif ($recaptchaScore < RECAPTCHA_BLOCK_SCORE) {
                flowLog('RECAPTCHA_BLOCK', ['score' => $recaptchaScore]);
                echo json_encode(["success" => true, "message" => "Recibido"], JSON_UNESCAPED_UNICODE);
                exit;
            }
            elseif ($recaptchaScore < RECAPTCHA_LOW_CONFIDENCE_SCORE) { $isLowConfidence = true; }
        } else {
            $isLowConfidence = true; // Fall abierto
        }
    }

    // Validaciones de Contenido
    if (empty($nombre) || empty($email) || empty($smsNum) || empty($consulta)) {
        flowLog('VALIDATION_ERROR', 'Campos requeridos vacíos');
        echo json_encode(["success" => false, "error" => "Por favor completá todos los campos obligatorios."], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Guardado y Envío
    flowLog('PROCESSING_LEAD', ['id' => $submissionId, 'loc' => $location]);

    if ($repo->existsBySubmissionId($submissionId)) {
        flowLog('DUPLICATE_EXIT');
        echo json_encode(["success" => true, "duplicate" => true], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $formData = [
        'NOMBRE'    => $nombre,
        'APELLIDOS' => $apellidos,
        'EMPRESA'   => $empresa,
        'SMS'       => $smsCode . $smsNum,
        'EMAIL'     => $email,
        'CONSULTA'  => $consulta,
        'ORIGEN'    => $location,
        'LOW_CONFIDENCE' => $isLowConfidence ? '1' : '0',
        'timestamp' => date('Y-m-d H:i:s'),
        'year'      => date('Y')
    ];

    $leadId = $repo->saveLead($location, $formData, $_SERVER['REMOTE_ADDR'] ?? 'unknown', $ua, $submissionId);
    flowLog('DB_SAVE_OK', ['lead_id' => $leadId]);

    $htmlBody = NotificationTemplate::generate($location, $formData);
    $mailSent = $mailService->sendLeadNotification($location, $formData, $htmlBody);
    flowLog('SMTP_RESULT', ['success' => $mailSent]);

    if ($mailSent) {
        $repo->updateLeadStatus($leadId, 'notified');
    }

    echo json_encode([
        "success" => true,
        "db_saved" => true,
        "mail_sent" => $mailSent,
        "low_confidence" => $isLowConfidence
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    flowLog('FATAL_EXCEPTION', $e->getMessage());
    echo json_encode(["success" => false, "error" => "Error interno del servidor. Reintente más tarde."], JSON_UNESCAPED_UNICODE);
}
