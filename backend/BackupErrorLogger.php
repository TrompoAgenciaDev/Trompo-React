<?php
/**
 * Logger de errores del sistema de backup.
 * Persiste cada fallo (validación, BD, envío de mail) en backend/logs/backup-errors.log.
 */

class BackupErrorLogger {
    private static $logDir;
    private static $logFile = 'backup-errors.log';

    /**
     * Obtiene la ruta del archivo de log (crea el directorio si no existe).
     */
    private static function getLogPath() {
        if (self::$logDir === null) {
            self::$logDir = __DIR__ . '/logs';
            if (!is_dir(self::$logDir)) {
                @mkdir(self::$logDir, 0755, true);
            }
        }
        return self::$logDir . '/' . self::$logFile;
    }

    /**
     * Registra un error en el archivo de log.
     *
     * @param string $step    Fase del flujo: validation, config, database, mail, general
     * @param string $message Mensaje del error
     * @param array  $context Datos opcionales (form_identifier, lead_id). Sin payloads completos.
     */
    public static function log($step, $message, array $context = []) {
        $path = self::getLogPath();
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = empty($context) ? '' : ' | ' . json_encode($context, JSON_UNESCAPED_UNICODE);
        $line = "[{$timestamp}] [{$step}] {$message}{$contextStr}" . PHP_EOL;
        @file_put_contents($path, $line, FILE_APPEND | LOCK_EX);
    }
}
