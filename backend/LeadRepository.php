<?php
/**
 * Repositorio para gestión de leads en base de datos
 */

class LeadRepository {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Guarda un lead en la base de datos
     * 
     * @param string $formIdentifier Identificador del formulario (LOCATION)
     * @param array $payload Datos completos del formulario
     * @param string $ipAddress IP del cliente
     * @param string $userAgent User agent del cliente
     * @return int ID del lead guardado
     */
    public function saveLead($formIdentifier, $payload, $ipAddress, $userAgent) {
        $sql = "INSERT INTO form_leads_backup (
            form_identifier,
            payload,
            ip_address,
            user_agent,
            status,
            created_at
        ) VALUES (
            :form_identifier,
            :payload,
            :ip_address,
            :user_agent,
            'received',
            NOW()
        )";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':form_identifier' => $formIdentifier,
            ':payload' => json_encode($payload, JSON_UNESCAPED_UNICODE),
            ':ip_address' => $ipAddress,
            ':user_agent' => $userAgent
        ]);

        return $this->pdo->lastInsertId();
    }

    /**
     * Actualiza el estado de un lead
     * 
     * @param int $leadId ID del lead
     * @param string $status Nuevo estado (notified, error)
     * @param string|null $errorMessage Mensaje de error si aplica
     */
    public function updateLeadStatus($leadId, $status, $errorMessage = null) {
        $sql = "UPDATE form_leads_backup 
                SET status = :status,
                    error_message = :error_message,
                    updated_at = NOW()
                WHERE id = :id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $leadId,
            ':status' => $status,
            ':error_message' => $errorMessage
        ]);
    }

    /**
     * Obtiene un lead por ID
     * 
     * @param int $leadId ID del lead
     * @return array|null Datos del lead o null si no existe
     */
    public function getLeadById($leadId) {
        $sql = "SELECT * FROM form_leads_backup WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $leadId]);
        return $stmt->fetch();
    }
}
