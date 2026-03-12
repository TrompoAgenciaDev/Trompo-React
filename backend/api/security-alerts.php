<?php
/**
 * SISTEMA DE ALERTAS TÉCNICAS (DECOUPLED)
 * Este archivo se encarga exclusivamente de notificar fallos técnicos o de seguridad.
 * Intenta usar SMTP del .env, si falla, usa mail() nativo como respaldo absoluto.
 */

function sendTechnicalAlert($reason, $error_msg, $data = []) {
    $to = 'desarrollo@trompoagencia.com';
    $subject = "[TROMPO SECURITY] Fallo en Formulario: $reason";
    
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $time = date('Y-m-d H:i:s');
    
    // Construir cuerpo del mensaje
    $body = "ALERTA TÉCNICA - TROMPO AGENCIA\n";
    $body .= "=================================\n\n";
    $body .= "FECHA: $time\n";
    $body .= "TIPO DE FALLO: $reason\n";
    $body .= "MENSAJE ERROR: $error_msg\n";
    $body .= "IP ORIGEN: $ip\n";
    $body .= "USER AGENT: $ua\n\n";
    $body .= "DATOS CAPTURADOS (PAYLOAD):\n";
    $body .= print_r($data, true);
    $body .= "\n\n---------------------------------\n";
    $body .= "Este es un aviso automático del sistema de seguridad.";

    // Intentar cargar PHPMailer si existe (más profesional/libre de spam)
    $autoload = __DIR__ . '/../vendor/autoload.php';
    if (file_exists($autoload)) {
        require_once $autoload;
        if (class_exists('\PHPMailer\PHPMailer\PHPMailer')) {
            try {
                $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
                $mail->isSMTP();
                $mail->Host = getenv('SMTP_HOST');
                $mail->SMTPAuth = true;
                $mail->Username = getenv('SMTP_USER');
                $mail->Password = getenv('SMTP_PASS');
                $mail->SMTPSecure = getenv('SMTP_ENCRYPTION') === 'ssl' ? 'ssl' : 'tls';
                $mail->Port = getenv('SMTP_PORT') ?: 587;
                $mail->CharSet = 'UTF-8';

                $mail->setFrom(getenv('SMTP_FROM') ?: getenv('SMTP_USER'), 'Seguridad Trompo');
                $mail->addAddress($to);
                $mail->Subject = $subject;
                $mail->Body    = $body;

                if ($mail->send()) return true;
            } catch (Exception $e) {
                // Si falla SMTP, permitimos que siga al mail() nativo
            }
        }
    }

    // Respaldo absoluto: mail() nativo de PHP
    $headers = "From: seguridad@trompoagencia.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    return @mail($to, $subject, $body, $headers);
}
