# Flujo Completo del Sistema de Backup

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│  Usuario completa formulario en React                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  FormIndex.jsx: handleSubmit()                              │
│  - Crea FormData con todos los campos                       │
│  - Agrega LOCATION (identificador del formulario)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  useFormBrevo.js: submitForm()                              │
│                                                              │
│  Promise.allSettled([                                        │
│    ┌──────────────────────────────────────┐                 │
│    │ fetch(form-handler.php)             │  ← PRINCIPAL    │
│    │ → Envía a Brevo                     │                 │
│    │ → Bloquea el flujo                  │                 │
│    │ → Usuario espera respuesta           │                 │
│    └──────────────────────────────────────┘                 │
│                                                              │
│    ┌──────────────────────────────────────┐                 │
│    │ fetch(backup-endpoint.php)           │  ← PARALELO    │
│    │ → Envía backup                       │                 │
│    │ → NO bloquea el flujo                │                 │
│    │ → Si falla, solo se registra en log  │                 │
│    └──────────────────────────────────────┘                 │
│  ])                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────────┐        ┌──────────────────┐
│ form-handler.php │        │ backup-endpoint  │
│                  │        │      .php        │
│ 1. Valida datos  │        │                  │
│ 2. Envía a Brevo │        │ 1. Valida datos  │
│ 3. Retorna JSON  │        │ 2. Guarda en BD  │
│                  │        │ 3. Envía email   │
└────────┬─────────┘        │ 4. Retorna JSON  │
         │                  └────────┬─────────┘
         │                           │
         │                           │ (Si falla, solo log)
         │                           │
         ▼                           ▼
┌─────────────────────────────────────────────┐
│  React procesa respuesta de Brevo           │
│  - Si success → Redirige a /gracias        │
│  - Si error → Muestra mensaje de error     │
│  - Backup se ignora si falla               │
└─────────────────────────────────────────────┘
```

## 🔄 Flujo Detallado del Backup

### 1. Recepción de Datos

```php
// backup-endpoint.php recibe:
$_POST = [
    'NOMBRE' => 'Juan',
    'APELLIDOS' => 'Pérez',
    'EMAIL' => 'juan@ejemplo.com',
    'EMPRESA' => 'Mi Empresa',
    'SMS_COUNTRY_CODE' => '+54',
    'SMS' => '1234567890',
    'CONSULTA' => 'Quiero información',
    'LOCATION' => 'home'  // ← Identificador del formulario
]
```

### 2. Captura de Metadatos

```php
$ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'];
```

### 3. Guardado en Base de Datos

```php
// LeadRepository::saveLead()
INSERT INTO form_leads_backup (
    form_identifier,  // 'home'
    payload,          // JSON completo
    ip_address,       // '192.168.1.1'
    user_agent,       // 'Mozilla/5.0...'
    status            // 'received'
)
```

### 4. Generación de Template HTML

```php
// NotificationTemplate::generate()
- Crea HTML con estilos inline
- Formatea todos los campos
- Incluye identificador del formulario
- Diseño responsive
```

### 5. Envío de Correo

```php
// MailService::sendLeadNotification()
- Configura PHPMailer con SMTP
- Asunto: "Nueva consulta - home"
- Cuerpo: HTML generado
- Destinatario: SMTP_TO del .env
```

### 6. Actualización de Estado

```php
// Si el correo se envía correctamente:
UPDATE form_leads_backup 
SET status = 'notified' 
WHERE id = $leadId

// Si hay error:
UPDATE form_leads_backup 
SET status = 'error',
    error_message = '...'
WHERE id = $leadId
```

## 🎯 Identificadores de Formularios

El sistema identifica formularios por el campo `LOCATION`:

| LOCATION | Descripción |
|----------|-------------|
| `home` | Formulario de la página principal |
| `desarrollo` | Formulario de página de desarrollo |
| `soporte` | Formulario de soporte |
| `interaccion` | Formulario de interacción |
| `estrategia` | Formulario de estrategia |
| `creatividad` | Formulario de creatividad |

El identificador aparece en:
- ✅ Asunto del correo: `"Nueva consulta - {LOCATION}"`
- ✅ Base de datos: columna `form_identifier`
- ✅ Logs y reportes

## 🔒 Manejo de Errores

### Errores que NO afectan el flujo principal:

1. **Error de conexión a BD**
   - Se registra en log
   - Se retorna JSON con error
   - El usuario NO ve el error
   - Brevo sigue funcionando normalmente

2. **Error al enviar correo**
   - Se registra en log
   - El lead queda con `status = 'error'`
   - Se guarda `error_message`
   - El usuario NO ve el error
   - Brevo sigue funcionando normalmente

3. **Error de validación**
   - Se retorna JSON con error
   - Se registra en log
   - El usuario NO ve el error
   - Brevo sigue funcionando normalmente

### Errores que SÍ afectan el flujo principal:

**Ninguno.** El sistema está diseñado para que el backup sea completamente independiente.

## 📧 Ejemplo de Correo Generado

```
┌─────────────────────────────────────────┐
│  Nueva Consulta Recibida                │
│  Formulario: home                       │
├─────────────────────────────────────────┤
│                                         │
│  Datos del Cliente                      │
│                                         │
│  Nombre: Juan                          │
│  Apellidos: Pérez                      │
│  Email: juan@ejemplo.com               │
│  Empresa: Mi Empresa                   │
│  Sms: +541234567890                    │
│                                         │
│  Consulta:                             │
│  ┌─────────────────────────────────┐   │
│  │ Quiero información sobre...     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Fecha: 2024-01-15 14:30:25           │
└─────────────────────────────────────────┘
```

## 🧪 Testing

### Test 1: Verificar que el backup no bloquea

```javascript
// En consola del navegador
const formData = new FormData();
formData.append('NOMBRE', 'Test');
formData.append('EMAIL', 'test@test.com');
formData.append('LOCATION', 'home');

// Envío principal (simulado)
const brevo = fetch('/form-handler.php', {
  method: 'POST',
  body: formData
});

// Backup en paralelo
const backup = fetch('/backend/backup-endpoint.php', {
  method: 'POST',
  body: formData
});

// Ambos se ejecutan en paralelo
Promise.allSettled([brevo, backup]).then(results => {
  console.log('Brevo:', results[0]);
  console.log('Backup:', results[1]);
});
```

### Test 2: Verificar guardado en BD

```sql
SELECT * FROM form_leads_backup 
ORDER BY created_at DESC 
LIMIT 1;
```

### Test 3: Verificar envío de correo

Revisa tu bandeja de entrada (o spam) después de enviar un formulario de prueba.

## 📈 Monitoreo

### Consultas útiles para monitoreo:

```sql
-- Leads recibidos hoy
SELECT COUNT(*) FROM form_leads_backup 
WHERE DATE(created_at) = CURDATE();

-- Leads por formulario
SELECT form_identifier, COUNT(*) as total
FROM form_leads_backup
GROUP BY form_identifier;

-- Tasa de éxito de notificaciones
SELECT 
    status,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM form_leads_backup), 2) as porcentaje
FROM form_leads_backup
GROUP BY status;
```

## 🚨 Alertas Recomendadas

Configura alertas si:
- Más del 10% de los backups fallan
- No hay backups en las últimas 24 horas (si normalmente hay actividad)
- Hay errores repetidos de SMTP

## ✅ Checklist de Verificación

- [ ] Composer install ejecutado
- [ ] Tabla `form_leads_backup` creada
- [ ] Variables de entorno configuradas
- [ ] Endpoint accesible desde frontend
- [ ] SMTP configurado y probado
- [ ] Frontend modificado (useFormBrevo.js)
- [ ] Test de envío completo realizado
- [ ] Verificación en BD de datos guardados
- [ ] Verificación de correo recibido
