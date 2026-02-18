<?php
/**
 * Endpoint de backup para formularios
 * Recibe datos en paralelo y los guarda en BD + envía notificación
 * 
 * IMPORTANTE: Este endpoint funciona en paralelo y no debe afectar el flujo principal
 */

// Headers CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Método no permitido'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Desactivar display de errores en producción (solo log)
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

try {
    // Cargar dependencias
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/LeadRepository.php';
    require_once __DIR__ . '/MailService.php';
    require_once __DIR__ . '/NotificationTemplate.php';

    // Capturar datos del POST
    $formData = $_POST;
    
    // Validar que existe LOCATION (identificador del formulario)
    $formIdentifier = $formData['LOCATION'] ?? 'unknown';
    
    // Validar que hay datos mínimos
    if (empty($formData)) {
        throw new Exception('No se recibieron datos del formulario');
    }

    // Capturar metadatos
    $ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    // Agregar timestamp a los datos
    $formData['timestamp'] = date('Y-m-d H:i:s');
    $formData['year'] = date('Y');

    // Inicializar repositorio
    $leadRepo = new LeadRepository($pdo);
    
    // Guardar en base de datos
    $leadId = $leadRepo->saveLead($formIdentifier, $formData, $ipAddress, $userAgent);

    // Intentar enviar notificación (no debe fallar si hay error)
    $notificationSent = false;
    try {
        $mailService = new MailService();
        $htmlBody = NotificationTemplate::generate($formIdentifier, $formData);
        $notificationSent = $mailService->sendLeadNotification($formIdentifier, $formData, $htmlBody);
        
        // Actualizar estado a 'notified'
        $leadRepo->updateLeadStatus($leadId, 'notified');
    } catch (Exception $mailError) {
        // Log del error pero no fallar el proceso
        error_log("Error al enviar notificación para lead #{$leadId}: " . $mailError->getMessage());
        
        // Actualizar estado a 'error' con el mensaje
        $leadRepo->updateLeadStatus($leadId, 'error', $mailError->getMessage());
    }

    // Respuesta exitosa
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'lead_id' => $leadId,
        'form_identifier' => $formIdentifier,
        'notification_sent' => $notificationSent,
        'message' => 'Backup guardado correctamente'
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Error de base de datos
    error_log("Error de BD en backup: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al guardar en base de datos'
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    // Error general
    error_log("Error en backup endpoint: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
