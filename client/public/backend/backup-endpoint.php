<?php
/**
 * Wrapper del endpoint de backup.
 * Delega en el backend real (fuera de public_html / fuera del documento raíz).
 *
 * Nota: la ruta puede variar entre local y hosting, así que probamos alternativas.
 */

header('Content-Type: application/json; charset=utf-8');

$candidates = [
    __DIR__ . '/../../../backend/backup-endpoint.php', // repo: client/public/backend -> raíz del proyecto -> backend/
    __DIR__ . '/../../backend/backup-endpoint.php',    // hosting típico: public_html/backend -> raíz de cuenta -> backend/
];

foreach ($candidates as $path) {
    if (file_exists($path)) {
        require_once $path;
        exit;
    }
}

error_log('Backup wrapper: no se encontró el backend real. Probados: ' . implode(', ', $candidates));
http_response_code(500);
echo json_encode([
    'success' => false,
    'error' => 'No se encontró el backend real del sistema de backup'
], JSON_UNESCAPED_UNICODE);
