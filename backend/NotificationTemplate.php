<?php
/**
 * Generador de templates HTML para notificaciones de leads
 */

class NotificationTemplate {
    public static function generate($formIdentifier, $formData) {
        $fields = self::formatFields($formData);

        $html = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva consulta - {$formIdentifier}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 30px; background: linear-gradient(135deg, #FEE070 0%, #fdd835 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #1E1E1E; font-size: 24px; font-weight: 600;">Nueva Consulta Recibida</h1>
                            <p style="margin: 10px 0 0 0; color: #1E1E1E; font-size: 14px; opacity: 0.8;">Formulario: <strong>{$formIdentifier}</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1E1E1E; font-size: 18px; font-weight: 600;">Datos del Cliente</h2>
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">{$fields}</table>
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                <p style="margin: 0; color: #666; font-size: 12px;">Este correo fue generado automáticamente por el sistema de backup de formularios.</p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Fecha: <strong>{$formData['timestamp'] ?? date('Y-m-d H:i:s')}</strong></p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 30px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="margin: 0; color: #999; font-size: 11px;">© {$formData['year'] ?? date('Y')} Trompo - Sistema de Backup</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

        return $html;
    }

    private static function formatFields($formData) {
        $rows = '';
        $excludeFields = ['LOCATION', 'timestamp', 'year'];

        foreach ($formData as $key => $value) {
            if (in_array($key, $excludeFields) || empty($value)) {
                continue;
            }
            $label = ucfirst(str_replace('_', ' ', $key));
            $displayValue = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
            $isLongField = strlen($value) > 100 || $key === 'CONSULTA';

            if ($isLongField) {
                $rows .= "<tr><td style=\"padding: 12px 0; vertical-align: top;\"><strong style=\"color: #1E1E1E; font-size: 14px; display: block; margin-bottom: 5px;\">{$label}:</strong><div style=\"color: #333; font-size: 14px; line-height: 1.6; background-color: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-wrap;\">{$displayValue}</div></td></tr>";
            } else {
                $rows .= "<tr><td style=\"padding: 12px 0; border-bottom: 1px solid #f0f0f0;\"><strong style=\"color: #1E1E1E; font-size: 14px; display: inline-block; min-width: 120px;\">{$label}:</strong><span style=\"color: #333; font-size: 14px;\">{$displayValue}</span></td></tr>";
            }
        }
        return $rows;
    }
}
