<?php
/**
 * Wrapper del endpoint de backup.
 * En producción: public_html/api/form-backup.php -> requiere backend real (hermano de public_html).
 */
header('Content-Type: application/json; charset=utf-8');

$candidates = [
    __DIR__ . '/../../../backend/form-backup.php',
    __DIR__ . '/../../backend/form-backup.php',
];

foreach ($candidates as $path) {
    if (file_exists($path)) {
        require_once $path;
        exit;
    }
}

http_response_code(500);
echo json_encode([
    'success' => false,
    'db_saved' => false,
    'mail_sent' => false,
    'error' => 'Backend form-backup no encontrado'
], JSON_UNESCAPED_UNICODE);
