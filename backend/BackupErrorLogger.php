<?php
class BackupErrorLogger {
    private static $logDir;
    private static $logFile = 'backup-errors.log';

    private static function getLogPath() {
        if (self::$logDir === null) {
            self::$logDir = __DIR__ . '/logs';
            if (!is_dir(self::$logDir)) {
                @mkdir(self::$logDir, 0755, true);
            }
        }
        return self::$logDir . '/' . self::$logFile;
    }

    public static function log($step, $message, $context = []) {
        $path = self::getLogPath();
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = empty($context) ? '' : ' | ' . json_encode($context, JSON_UNESCAPED_UNICODE);
        $line = "[{$timestamp}] [{$step}] {$message}{$contextStr}" . PHP_EOL;
        @file_put_contents($path, $line, FILE_APPEND | LOCK_EX);
    }
}
