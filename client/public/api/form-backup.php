<?php
/**
 * Punto de entrada público para el backup de formularios.
 * Delega en backend/api/form-backup.php (backend y public_html son hermanas en producción).
 * Escribe un paso "entry_point" al inicio para comprobar que este archivo es el que se ejecuta.
 */
$logDir = __DIR__ . '/../../backend/logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}
$logFile = $logDir . '/form-backup.log';
$line = json_encode([
    'type' => 'step',
    'timestamp' => date('Y-m-d H:i:s'),
    'step' => 'entry_point',
    'status' => 'OK',
    'detail' => 'stub_loaded'
], JSON_UNESCAPED_UNICODE) . "\n";
@file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

require_once __DIR__ . '/../../backend/api/form-backup.php';
