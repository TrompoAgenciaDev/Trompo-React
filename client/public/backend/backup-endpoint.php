<?php
/**
 * Wrapper del endpoint de backup.
 * Delega en el backend real (fuera de public_html).
 * Mantiene .env y código sensible fuera del documento raíz.
 *
 * En producción (public_html y backend hermanos): si falla, usa:
 *   require_once __DIR__ . '/../../backend/backup-endpoint.php';
 */
require_once __DIR__ . '/../../../backend/backup-endpoint.php';
