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
}

if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
    if (
        file_exists($phpmailerDir . '/Exception.php') &&
        file_exists($phpmailerDir . '/SMTP.php') &&
        file_exists($phpmailerDir . '/PHPMailer.php')
    ) {
        require_once $phpmailerDir . '/Exception.php';
        require_once $phpmailerDir . '/SMTP.php';
        require_once $phpmailerDir . '/PHPMailer.php';
    }
}

if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
    throw new \Exception("PHPMailer no encontrado. Revisá vendor/ o backend/phpmailer/.");
}

class MailService
{
    private $mailer;
    private $smtpHost;
    private $smtpPort;
    private $smtpUser;
    private $smtpPass;
    private $smtpEncryption;
    private $smtpFrom;
    private $smtpTo;
    private $smtpBcc;

    /** @var callable|null (event, data) para flowLog desde form-backup */
    private $flowLogCallback;

    public function __construct(callable $flowLogCallback = null)
    {
        $this->flowLogCallback = $flowLogCallback;

        // Cargar configuración SMTP desde .env
        $this->smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $this->smtpPort = (int) (getenv('SMTP_PORT') ?: 587);
        $this->smtpUser = getenv('SMTP_USER') ?: '';
        $this->smtpPass = getenv('SMTP_PASS') ?: '';
        $this->smtpEncryption = getenv('SMTP_ENCRYPTION') ?: 'tls';
        $this->smtpFrom = getenv('SMTP_FROM') ?: $this->smtpUser;
        $this->smtpTo = getenv('SMTP_TO') ?: '';
        $this->smtpBcc = getenv('SMTP_CCO') ?: '';

        $this->mailer = new PHPMailer(true);
        $this->configureMailer();
    }

    private function flowLog($message, $data = null)
    {
        if ($this->flowLogCallback !== null) {
            ($this->flowLogCallback)($message, $data);
        }
    }

    /**
     * Configura PHPMailer: por defecto 587 + STARTTLS (no SSL implícito).
     * .env: SMTP_USE_LOCALHOST_25=true para probar localhost:25 sin auth.
     */
    private function configureMailer()
    {
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
                $host = trim((string)$this->smtpHost);
                $user = trim((string)$this->smtpUser);
                $pass = (string)$this->smtpPass;
                $from = trim((string)($this->smtpFrom ?: $user));
                $enc = strtolower(trim((string)$this->smtpEncryption));

                if ($host === '') {
                    throw new \Exception('SMTP_HOST no está configurado en .env');
                }

                // Puerto: usar el de .env si está, si no elegir default según encriptación
                $port = (int)$this->smtpPort;
                if ($port <= 0) {
                    $port = ($enc === 'ssl' || $enc === 'smtps') ? 465 : 587;
                }

                // Encriptación: tls/starttls | ssl/smtps | none
                $smtpSecure = false;
                $smtpAutoTls = true;
                if ($enc === 'ssl' || $enc === 'smtps') {
                    $smtpSecure = PHPMailer::ENCRYPTION_SMTPS;
                    $smtpAutoTls = false;
                } elseif ($enc === 'tls' || $enc === 'starttls' || $enc === '') {
                    $smtpSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $smtpAutoTls = true;
                } elseif ($enc === 'none' || $enc === 'false' || $enc === '0') {
                    $smtpSecure = false;
                    $smtpAutoTls = false;
                }

                $this->mailer->Host = $host;
                $this->mailer->Port = $port;
                $this->mailer->SMTPSecure = $smtpSecure;
                $this->mailer->SMTPAutoTLS = $smtpAutoTls;

                // Auth
                $this->mailer->SMTPAuth = true;
                if ($user === '' || $pass === '') {
                    throw new \Exception('Faltan credenciales SMTP (SMTP_USER / SMTP_PASS) en .env');
                }
                $this->mailer->Username = $user;
                $this->mailer->Password = $pass;

                if ($from === '') {
                    throw new \Exception('SMTP_FROM no está configurado en .env');
                }
                $this->mailer->setFrom($from, 'Sistema de Backup - Trompo');

                $this->flowLog('SMTP_CONFIG_USING_ENV', [
                    'host' => $host,
                    'port' => $port,
                    'encryption' => $enc === '' ? 'tls' : $enc
                ]);
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
    public function sendLeadNotification($formIdentifier, $formData, $htmlBody)
    {
        try {
            if (empty($this->smtpTo)) {
                throw new \Exception("SMTP_TO no está configurado en .env");
            }

            $this->mailer->clearAddresses();
            $this->mailer->clearAttachments();
            $this->mailer->clearBCCs();

            // Destinatarios principales
            $recipients = explode(',', $this->smtpTo);
            foreach ($recipients as $recipient) {
                $recipient = trim($recipient);
                if (!empty($recipient)) {
                    $this->mailer->addAddress($recipient);
                }
            }

            // Copia oculta (BCC / CCO)
            if (!empty($this->smtpBcc)) {
                $recipientsBcc = explode(',', $this->smtpBcc);
                foreach ($recipientsBcc as $bcc) {
                    $bcc = trim($bcc);
                    if (!empty($bcc)) {
                        $this->mailer->addBCC($bcc);
                    }
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

    private function generatePlainTextBody($formIdentifier, $formData)
    {
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
