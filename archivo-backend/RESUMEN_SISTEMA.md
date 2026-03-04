# 📦 Resumen del Sistema de Backup Paralelo

## ✅ Sistema Completado

Se ha creado un sistema de backup **completamente independiente** que:

- ✅ **NO modifica** ningún formulario existente
- ✅ **NO toca** la integración con Brevo
- ✅ **NO bloquea** el flujo principal
- ✅ Ejecuta en **paralelo** sin interferir
- ✅ Guarda **todos los leads** en base de datos
- ✅ Envía **notificaciones por correo**
- ✅ Si falla, **NO afecta** al usuario

## 📁 Archivos Creados

### Backend PHP (carpeta `backend/`)

1. **`config.php`** - Configuración PDO y carga de .env
2. **`LeadRepository.php`** - Gestión de leads en base de datos
3. **`MailService.php`** - Envío de correos con PHPMailer
4. **`NotificationTemplate.php`** - Generador de templates HTML
5. **`backup-endpoint.php`** - Endpoint receptor principal
6. **`database.sql`** - Script para crear la tabla
7. **`composer.json`** - Dependencias PHP (PHPMailer)

### Documentación

8. **`README.md`** - Documentación completa del sistema
9. **`INSTALACION.md`** - Guía paso a paso de instalación
10. **`FLUJO_COMPLETO.md`** - Explicación detallada del flujo
11. **`env.example.txt`** - Ejemplo de configuración
12. **`.gitignore`** - Archivos a ignorar en git

### Frontend Modificado

13. **`client/src/hooks/useFormBrevo.js`** - Modificado para envío paralelo

## 🚀 Pasos para Activar

### 1. Instalar dependencias PHP
```bash
cd backend
composer install
```

### 2. Crear tabla en base de datos
```bash
mysql -u usuario -p base_de_datos < backend/database.sql
```

### 3. Agregar variables al .env existente

Abre el `.env` en la raíz del proyecto y agrega:

```env
# Sistema de Backup
DB_HOST=localhost
DB_NAME=trompo_db
DB_USER=tu_usuario
DB_PASS=tu_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
SMTP_FROM=tu-email@gmail.com
SMTP_TO=notificaciones@ejemplo.com
```

### 4. Configurar acceso al endpoint

**Opción Simple**: Mueve `backup-endpoint.php` a `client/public/backend/backup-endpoint.php`

**Opción Segura**: Configura un alias en Apache/Nginx (ver `INSTALACION.md`)

### 5. (Opcional) Configurar URL del endpoint en frontend

Si el endpoint está en otra URL, agrega a `.env`:
```env
VITE_BACKUP_ENDPOINT=/backend/backup-endpoint.php
```

## 🎯 Cómo Funciona

1. Usuario envía formulario → React ejecuta **dos peticiones en paralelo**:
   - `form-handler.php` → Brevo (principal, bloquea)
   - `backup-endpoint.php` → Backup (paralelo, no bloquea)

2. Backup procesa:
   - Guarda en BD (`form_leads_backup`)
   - Envía correo con todos los datos
   - Si falla → Solo se registra en log

3. Usuario ve resultado:
   - Si Brevo OK → Redirige a `/gracias`
   - Si Brevo falla → Muestra error
   - **El backup nunca afecta la experiencia del usuario**

## 📊 Base de Datos

Tabla creada: `form_leads_backup`

Campos:
- `id` - ID único
- `form_identifier` - Identificador (LOCATION: home, desarrollo, etc.)
- `payload` - JSON completo con todos los datos
- `ip_address` - IP del cliente
- `user_agent` - Navegador usado
- `status` - Estado: received, notified, error
- `error_message` - Mensaje de error si aplica
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

## 📧 Notificaciones

- **Asunto**: `"Nueva consulta - {form_identifier}"`
- **Formato**: HTML responsive con estilos inline
- **Contenido**: Todos los campos del formulario formateados
- **Destinatario**: Configurado en `SMTP_TO` (puede ser múltiple)

## 🔍 Verificación

### Verificar que funciona:

1. **Enviar un formulario de prueba**
2. **Verificar en BD**:
```sql
SELECT * FROM form_leads_backup ORDER BY created_at DESC LIMIT 1;
```
3. **Verificar correo** en la bandeja de entrada
4. **Verificar consola del navegador** (no debe haber errores)

### Si algo falla:

- Revisa `INSTALACION.md` sección "Solución de Problemas"
- Revisa logs de PHP del servidor
- Verifica que todas las variables de `.env` estén correctas

## 📚 Documentación Completa

- **`README.md`** - Documentación general y características
- **`INSTALACION.md`** - Guía detallada de instalación
- **`FLUJO_COMPLETO.md`** - Explicación técnica del flujo

## ⚠️ Importante

- El `.env` debe estar **fuera de public_html** y **no ser accesible vía web**
- El backup es **independiente**: si falla, NO afecta Brevo
- Todos los errores se registran en **logs de PHP**
- El sistema está listo para producción

## 🎉 Listo para Usar

Una vez completados los pasos de instalación, el sistema funcionará automáticamente cada vez que se envíe un formulario, sin necesidad de cambios adicionales.
