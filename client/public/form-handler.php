<?php
/**
 * Form handler: envía los datos del formulario a Brevo.
 * Carga .env desde rutas compatibles con open_basedir en hosting compartido.
 */
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// Configuración de Seguridad
define('SECURITY_MIN_RECAPTCHA_SCORE', 0.5);
define('SECURITY_RECAPTCHA_ACTION', 'form_submit');
define('SECURITY_MIN_COMPLETION_TIME', 3);
define('SECURITY_RATE_LIMIT_MAX', 5); // Un poco más laxo para contactos directos
define('SECURITY_RATE_LIMIT_WINDOW', 600);

// Cargar .env: solo rutas permitidas por open_basedir (un nivel arriba o mismo directorio)
$envPath = __DIR__ . '/../.env';
if (!@file_exists($envPath)) {
    $envPath = __DIR__ . '/.env';
}
if (@file_exists($envPath)) {
    $vars = @parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if ($vars !== false) {
        foreach ($vars as $key => $value) {
            putenv("$key=$value");
        }
    }
}

$brevoApiKey = getenv('BREVO_API_KEY') ?: '';

$listMap = [
    "home"        => getenv('BREVO_LIST_HOME'),
    "desarrollo"  => getenv('BREVO_LIST_DESARROLLO'),
    "soporte"     => getenv('BREVO_LIST_SOPORTE'),
    "interaccion" => getenv('BREVO_LIST_INTERACCION'),
    "estrategia"  => getenv('BREVO_LIST_ESTRATEGIA'),
    "creatividad" => getenv('BREVO_LIST_CREATIVIDAD'),
];

// Soporte para JSON y POST tradicional
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

if ($jsonData) {
    // Si viene de React vía fetch(json)
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
    $honeypot = trim($fields['fax'] ?? '');
    $startTime = (int)($fields['_t'] ?? 0);
} else {
    // Si viene vía POST tradicional
    $nombre    = $_POST['NOMBRE'] ?? '';
    $apellidos = $_POST['APELLIDOS'] ?? '';
    $email     = $_POST['EMAIL'] ?? '';
    $empresa   = $_POST['EMPRESA'] ?? '';
    $smsCode   = $_POST['SMS_COUNTRY_CODE'] ?? '';
    $smsNum    = $_POST['SMS'] ?? '';
    $consulta  = $_POST['CONSULTA'] ?? '';
    $location  = $_POST['LOCATION'] ?? 'home';
    $recaptchaToken = trim($_POST['g-recaptcha-response'] ?? '');
    $honeypot = trim($_POST['fax'] ?? '');
    $startTime = (int)($_POST['_t'] ?? 0);
}

// Honeypot: si "fax" tiene valor, es un bot (humanos no completan este campo invisible)
$honeypot = trim($_POST['fax'] ?? '');
if ($honeypot !== '') {
    echo json_encode([
        "success" => true, // Bloqueo silencioso
        "message"   => "Mensaje recibido"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Time Trap
$startTime = (int)($_POST['_t'] ?? 0);
if ($startTime > 0 && (time() - $startTime) < SECURITY_MIN_COMPLETION_TIME) {
    echo json_encode([
        "success" => false,
        "error"   => "Error de envío. Por favor intente de nuevo."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// === Validar reCAPTCHA v2 (obligatorio si RECAPTCHA_SECRET está definido) ===
$recaptchaSecret = getenv('RECAPTCHA_SECRET') ?: '';
$recaptchaToken = trim($_POST['g-recaptcha-response'] ?? '');

if ($recaptchaSecret !== '') {
    if ($recaptchaToken === '') {
        echo json_encode([
            "success" => false,
            "error"   => "Validación de captcha requerida"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

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
        echo json_encode([
            "success" => false,
            "error"   => "Error al verificar captcha: " . $verifyErr
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $verifyJson = json_decode($verifyResponse, true);
    $score = $verifyJson['score'] ?? 0;
    $action = $verifyJson['action'] ?? 'none';

    if (!is_array($verifyJson) || empty($verifyJson['success'])) {
        echo json_encode([
            "success" => false,
            "error"   => "Captcha inválido"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($score < SECURITY_MIN_RECAPTCHA_SCORE || $action !== SECURITY_RECAPTCHA_ACTION) {
        // Bloqueo silencioso si es muy bajo
        if ($score < 0.3) {
            echo json_encode(["success" => true, "message" => "Recibido"]);
            exit;
        }
        echo json_encode([
            "success" => false,
            "error"   => "Petición rechazada por sistema anti-spam (Score: $score)"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
// Si no hay RECAPTCHA_SECRET o no se envió token, se permite el envío (sin validar captcha)

// Validaciones de Contenido
$required = ['NOMBRE', 'APELLIDOS', 'EMAIL', 'SMS', 'CONSULTA'];
foreach ($required as $f) {
    if (empty($$f)) { // $$f accede a la variable con el nombre contenido en $f
        echo json_encode([
            "success" => false,
            "error"   => "El campo $f es obligatorio"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "error"   => "El formato del email no es válido"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$listId = $listMap[$location] ?? $listMap['home'];

$payload = [
    "updateEnabled" => true,
    "email" => $email,
    "attributes" => [
        "NOMBRE"    => $nombre,
        "APELLIDOS" => $apellidos,
        "EMPRESA"   => $empresa,
        "SMS"       => $smsCode . $smsNum,
        "WHATSAPP"  => $smsCode . $smsNum,
        "CONSULTA"  => $consulta,
        "ORIGEN"    => $location,
    ],
    "listIds" => [(int)$listId]
];

$ch = curl_init("https://api.brevo.com/v3/contacts");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "api-key: $brevoApiKey"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode([
        "success" => false,
        "error"   => "cURL error: " . curl_error($ch)
    ], JSON_UNESCAPED_UNICODE);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$decoded = json_decode($response, true);

if ($decoded === null) {
    echo json_encode([
        "success" => false,
        "http"    => $httpCode,
        "error"   => $response
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($httpCode >= 200 && $httpCode < 300) {
    if (isset($decoded['id']) || isset($decoded['email'])) {
        echo json_encode([
            "success" => true,
            "brevo"   => $decoded
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            "success" => false,
            "error"   => $decoded ?: $response
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode([
        "success" => false,
        "http"    => $httpCode,
        "error"   => $decoded ?: $response
    ], JSON_UNESCAPED_UNICODE);
}
