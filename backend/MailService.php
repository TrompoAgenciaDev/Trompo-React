<?php
/**
 * Servicio de envío de correos usando PHPMailer
 * Funciona con Composer (vendor/) o con PHPMailer incluido en backend/phpmailer/ (hosting sin Composer)
 */

use PHPMailer\PHPMailer\PHPMailer;

$autoloadPath = __DIR__ . '/vendor/autoload.php';
$phpmailerDir = __DIR__ . '/phpmailer';

if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
} elseif (file_exists($phpmailerDir . '/Exception.php')) {
    // Hosting sin Composer: PHPMailer incluido en backend/phpmailer/
    require_once $phpmailerDir . '/Exception.php';
    require_once $phpmailerDir . '/SMTP.php';
    require_once $phpmailerDir . '/PHPMailer.php';
} else {
    throw new \Exception("PHPMailer no encontrado. Sube la carpeta backend/phpmailer/ (o ejecuta 'composer install' en backend/).");
}

class MailService {
    private $mailer;
    private $smtpHost;
    private $smtpPort;
    private $smtpUser;
    private $smtpPass;
    private $smtpEncryption;
    private $smtpFrom;
    private $smtpTo;

    /** @var callable|null (event, data) para flowLog desde form-backup */
    private $flowLogCallback;

    public function __construct(callable $flowLogCallback = null) {
        $this->flowLogCallback = $flowLogCallback;

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

    private function flowLog($message, $data = null) {
        if ($this->flowLogCallback !== null) {
            ($this->flowLogCallback)($message, $data);
        }
    }

    /**
     * Configura PHPMailer: por defecto 587 + STARTTLS (no SSL implícito).
     * .env: SMTP_USE_LOCALHOST_25=true para probar localhost:25 sin auth.
     */
    private function configureMailer() {
        try {
            $this->mailer->Timeout = 10;
            $this->mailer->SMTPKeepAlive = false;

            $useLocalhost25 = (getenv('SMTP_USE_LOCALHOST_25') ?: '') === 'true' || (getenv('SMTP_USE_LOCALHOST_25') ?: '') === '1';

            if ($useLocalhost25) {
                $this->mailer->Host = 'localhost';
                $this->mailer->Port = 25;
                $this->mailer->SMTPAuth = false;
                $this->mailer->SMTPSecure = false;
                $this->mailer->SMTPAutoTLS = false;
                $this->flowLog('SMTP_CONFIG_USING_LOCALHOST_25');
            } else {
                $this->mailer->Host = $this->smtpHost;
                $this->mailer->Port = 587;
                $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $this->mailer->SMTPAuth = true;
                $this->mailer->Username = $this->smtpUser;
                $this->mailer->Password = $this->smtpPass;
                $this->mailer->setFrom($this->smtpFrom ?: $this->smtpUser, 'Sistema de Backup - Trompo');
                $this->flowLog('SMTP_CONFIG_USING_587_TLS');
            }

            $this->mailer->isSMTP();
            $this->mailer->CharSet = 'UTF-8';

            // Solo para test: SSL permisivo (evita fallos por certificado)
            $this->mailer->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ];

            if ($this->flowLogCallback !== null) {
                $this->mailer->SMTPDebug = 2;
                $this->mailer->Debugoutput = function ($str, $level) {
                    $this->flowLog('SMTP_DEBUG', ['level' => $level, 'message' => trim($str)]);
                };
            }
        } catch (\Throwable $e) {
            error_log("Error al configurar PHPMailer: " . $e->getMessage());
            throw new \Exception("Error en configuración de correo");
        }
    }

    /**
     * Envía una notificación de nuevo lead
     */
    public function sendLeadNotification($formIdentifier, $formData, $htmlBody) {
        try {
            if (empty($this->smtpTo)) {
                throw new \Exception("SMTP_TO no está configurado en .env");
            }

            $this->mailer->clearAddresses();
            $this->mailer->clearAttachments();

            $recipients = explode(',', $this->smtpTo);
            foreach ($recipients as $recipient) {
                $recipient = trim($recipient);
                if (!empty($recipient)) {
                    $this->mailer->addAddress($recipient);
                }
            }

            $this->mailer->isHTML(true);
            $this->mailer->Subject = "Nueva consulta - {$formIdentifier}";
            $this->mailer->Body = $htmlBody;
            $this->mailer->AltBody = $this->generatePlainTextBody($formIdentifier, $formData);

            $this->flowLog('SMTP_BEFORE_SEND');
            $result = $this->mailer->send();
            $this->flowLog('SMTP_AFTER_SEND', ['result' => $result]);
            return true;
        } catch (\Throwable $e) {
            $this->flowLog('SMTP_EXCEPTION', [
                'errorInfo' => $this->mailer->ErrorInfo ?? '',
                'exception' => $e->getMessage(),
            ]);
            error_log("Error al enviar correo: " . $this->mailer->ErrorInfo);
            throw new \Exception("Error al enviar correo: " . $e->getMessage());
        }
    }

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
