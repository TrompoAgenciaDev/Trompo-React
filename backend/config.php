<?php
/**
 * Configuración del sistema de backup de formularios
 * Carga variables de entorno y configura PDO
 */

// .env al mismo nivel que backend/ (raíz de cuenta: .env, public_html/, backend/)
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $vars = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if ($vars !== false) {
        foreach ($vars as $key => $value) {
            putenv("$key=$value");
        }
    }
}

// La base de datos ha sido desactivada según requerimiento.
// Los leads se guardarán en un archivo de texto plano (logs).
