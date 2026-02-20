<?php
/**
 * Endpoint de backup para formularios
 * Recibe datos en paralelo y los guarda en BD + envía notificación
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

require_once __DIR__ . '/BackupErrorLogger.php';

try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/LeadRepository.php';
    require_once __DIR__ . '/MailService.php';
    require_once __DIR__ . '/NotificationTemplate.php';

    $formData = $_POST;
    $formIdentifier = $formData['LOCATION'] ?? 'unknown';

    if (empty($formData)) {
        BackupErrorLogger::log('validation', 'No se recibieron datos del formulario', ['form_identifier' => $formIdentifier]);
        throw new Exception('No se recibieron datos del formulario');
    }

    $ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    $formData['timestamp'] = date('Y-m-d H:i:s');
    $formData['year'] = date('Y');

    $leadRepo = new LeadRepository($pdo);
    $leadId = $leadRepo->saveLead($formIdentifier, $formData, $ipAddress, $userAgent);

    $notificationSent = false;
    try {
        $mailService = new MailService();
        $htmlBody = NotificationTemplate::generate($formIdentifier, $formData);
        $notificationSent = $mailService->sendLeadNotification($formIdentifier, $formData, $htmlBody);
        $leadRepo->updateLeadStatus($leadId, 'notified');
    } catch (Exception $mailError) {
        error_log("Error al enviar notificación para lead #{$leadId}: " . $mailError->getMessage());
        BackupErrorLogger::log('mail', $mailError->getMessage(), ['lead_id' => $leadId, 'form_identifier' => $formIdentifier]);
        $leadRepo->updateLeadStatus($leadId, 'error', $mailError->getMessage());
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'lead_id' => $leadId,
        'form_identifier' => $formIdentifier,
        'notification_sent' => $notificationSent,
        'message' => 'Backup guardado correctamente'
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error_log("Error de BD en backup: " . $e->getMessage());
    BackupErrorLogger::log('database', $e->getMessage(), ['form_identifier' => $formIdentifier ?? 'unknown']);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al guardar en base de datos'], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    error_log("Error en backup endpoint: " . $e->getMessage());
    BackupErrorLogger::log('general', $e->getMessage(), ['form_identifier' => $formIdentifier ?? 'unknown']);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
