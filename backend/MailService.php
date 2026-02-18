<?php
/**
 * Servicio de envío de correos usando PHPMailer
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/vendor/autoload.php';

class MailService {
    private $mailer;
    private $smtpHost;
    private $smtpPort;
    private $smtpUser;
    private $smtpPass;
    private $smtpEncryption;
    private $smtpFrom;
    private $smtpTo;

    public function __construct() {
        // Cargar configuración SMTP desde .env
        $this->smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $this->smtpPort = (int)(getenv('SMTP_PORT') ?: 587);
        $this->smtpUser = getenv('SMTP_USER') ?: '';
        $this->smtpPass = getenv('SMTP_PASS') ?: '';
        $this->smtpEncryption = getenv('SMTP_ENCRYPTION') ?: 'tls';
        $this->smtpFrom = getenv('SMTP_FROM') ?: $this->smtpUser;
        $this->smtpTo = getenv('SMTP_TO') ?: '';

        $this->mailer = new PHPMailer(true);
        $this->configureMailer();
    }

    /**
     * Configura PHPMailer con los parámetros SMTP
     */
    private function configureMailer() {
        try {
            // Configuración del servidor
            $this->mailer->isSMTP();
            $this->mailer->Host = $this->smtpHost;
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = $this->smtpUser;
            $this->mailer->Password = $this->smtpPass;
            $this->mailer->SMTPSecure = $this->smtpEncryption;
            $this->mailer->Port = $this->smtpPort;
            $this->mailer->CharSet = 'UTF-8';

            // Remitente
            $this->mailer->setFrom($this->smtpFrom, 'Sistema de Backup - Trompo');
        } catch (Exception $e) {
            error_log("Error al configurar PHPMailer: " . $e->getMessage());
            throw new Exception("Error en configuración de correo");
        }
    }

    /**
     * Envía una notificación de nuevo lead
     * 
     * @param string $formIdentifier Identificador del formulario
     * @param array $formData Datos del formulario
     * @param string $htmlBody Cuerpo HTML del correo
     * @return bool True si se envió correctamente
     * @throws Exception Si hay error en el envío
     */
    public function sendLeadNotification($formIdentifier, $formData, $htmlBody) {
        try {
            // Validar que existe destinatario
            if (empty($this->smtpTo)) {
                throw new Exception("SMTP_TO no está configurado en .env");
            }

            // Limpiar destinatarios previos
            $this->mailer->clearAddresses();
            $this->mailer->clearAttachments();

            // Configurar destinatario
            $recipients = explode(',', $this->smtpTo);
            foreach ($recipients as $recipient) {
                $recipient = trim($recipient);
                if (!empty($recipient)) {
                    $this->mailer->addAddress($recipient);
                }
            }

            // Configurar contenido
            $this->mailer->isHTML(true);
            $this->mailer->Subject = "Nueva consulta - {$formIdentifier}";
            $this->mailer->Body = $htmlBody;
            $this->mailer->AltBody = $this->generatePlainTextBody($formIdentifier, $formData);

            // Enviar
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Error al enviar correo: " . $this->mailer->ErrorInfo);
            throw new Exception("Error al enviar correo: " . $e->getMessage());
        }
    }

    /**
     * Genera versión texto plano del correo
     * 
     * @param string $formIdentifier Identificador del formulario
     * @param array $formData Datos del formulario
     * @return string Cuerpo en texto plano
     */
    private function generatePlainTextBody($formIdentifier, $formData) {
        $text = "Nueva consulta recibida desde: {$formIdentifier}\n\n";
        $text .= "Datos del formulario:\n";
        $text .= str_repeat("=", 40) . "\n\n";

        foreach ($formData as $key => $value) {
            if (!empty($value)) {
                $text .= ucfirst(str_replace('_', ' ', $key)) . ": {$value}\n";
            }
        }

        return $text;
    }
}
