<?php
/**
 * Comprobación rápida en el servidor (subir a public_html y abrir por navegador).
 * BORRAR después de diagnosticar (no dejar en producción).
 */
header('Content-Type: text/plain; charset=utf-8');

$base = __DIR__;
$envPath = __DIR__ . '/../.env';
$backendPath = __DIR__ . '/../backend/backup-endpoint.php';

echo "=== Diagnóstico servidor ===\n\n";
echo "Carpeta actual (donde está este script): " . $base . "\n\n";

echo ".env (raíz de cuenta):\n";
echo "  Ruta probada: " . $envPath . "\n";
echo "  Existe: " . (file_exists($envPath) ? 'SÍ' : 'NO') . "\n";
if (file_exists($envPath)) {
    echo "  Legible: " . (is_readable($envPath) ? 'SÍ' : 'NO') . "\n";
    $vars = @parse_ini_file($envPath, false, INI_SCANNER_RAW);
    echo "  Variables cargadas: " . (is_array($vars) ? count($vars) : 0) . "\n";
    if (is_array($vars)) {
        echo "  Tiene BREVO_API_KEY: " . (isset($vars['BREVO_API_KEY']) && $vars['BREVO_API_KEY'] !== '' ? 'SÍ' : 'NO') . "\n";
        echo "  Tiene DB_HOST: " . (isset($vars['DB_HOST']) ? 'SÍ' : 'NO') . "\n";
        echo "  Tiene SMTP_HOST: " . (isset($vars['SMTP_HOST']) ? 'SÍ' : 'NO') . "\n";
    }
}

echo "\nBackend (endpoint real):\n";
echo "  Ruta probada: " . $backendPath . "\n";
echo "  Existe: " . (file_exists($backendPath) ? 'SÍ' : 'NO') . "\n";

echo "\n=== Al terminar, borrá este archivo (check-env.php) ===\n";
