<?php
/**
 * Form handler: envía los datos del formulario a Brevo.
 * Carga .env desde rutas compatibles con open_basedir en hosting compartido.
 */
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

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

$nombre    = $_POST['NOMBRE'] ?? '';
$apellidos = $_POST['APELLIDOS'] ?? '';
$email     = $_POST['EMAIL'] ?? '';
$empresa   = $_POST['EMPRESA'] ?? '';
$smsCode   = $_POST['SMS_COUNTRY_CODE'] ?? '';
$smsNum    = $_POST['SMS'] ?? '';
$consulta  = $_POST['CONSULTA'] ?? '';
$location  = $_POST['LOCATION'] ?? 'home';

if (empty($email)) {
    echo json_encode([
        "success" => false,
        "error"   => "El campo EMAIL es obligatorio"
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
