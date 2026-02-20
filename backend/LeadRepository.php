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
     * Indica si ya existe un lead con ese submission_id (anti-duplicación).
     */
    public function existsBySubmissionId($submissionId) {
        if ($submissionId === null || $submissionId === '') {
            return false;
        }
        $stmt = $this->pdo->prepare("SELECT 1 FROM form_leads_backup WHERE submission_id = :sid LIMIT 1");
        $stmt->execute([':sid' => $submissionId]);
        return (bool) $stmt->fetch();
    }

    /**
     * Guarda un lead. submission_id opcional; si existe ya, no insertar (usar existsBySubmissionId antes).
     */
    public function saveLead($formIdentifier, $payload, $ipAddress, $userAgent, $submissionId = null) {
        $sql = "INSERT INTO form_leads_backup (
            submission_id,
            form_identifier,
            payload,
            ip_address,
            user_agent,
            status,
            created_at
        ) VALUES (
            :submission_id,
            :form_identifier,
            :payload,
            :ip_address,
            :user_agent,
            'received',
            NOW()
        )";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':submission_id' => $submissionId,
            ':form_identifier' => $formIdentifier,
            ':payload' => json_encode($payload, JSON_UNESCAPED_UNICODE),
            ':ip_address' => $ipAddress,
            ':user_agent' => $userAgent
        ]);
        return $this->pdo->lastInsertId();
    }

    public function updateLeadStatus($leadId, $status, $errorMessage = null) {
        $sql = "UPDATE form_leads_backup SET status = :status, error_message = :error_message, updated_at = NOW() WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $leadId,
            ':status' => $status,
            ':error_message' => $errorMessage
        ]);
    }

    public function getLeadById($leadId) {
        $sql = "SELECT * FROM form_leads_backup WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $leadId]);
        return $stmt->fetch();
    }
}
