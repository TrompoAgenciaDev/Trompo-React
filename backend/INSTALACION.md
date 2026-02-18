# Guía de Instalación - Sistema de Backup

## Paso 1: Instalar Dependencias PHP

```bash
cd backend
composer install
```

Si no tienes Composer instalado:
- Windows: Descarga desde https://getcomposer.org/download/
- Linux/Mac: `curl -sS https://getcomposer.org/installer | php`

## Paso 2: Crear la Base de Datos

Ejecuta el script SQL en tu base de datos. Puedes hacerlo desde phpMyAdmin o línea de comandos:

```bash
mysql -u aq000097_wp_ta -p aq000097_wp_ta < backend/database.sql
```

O desde phpMyAdmin:
1. Abre phpMyAdmin
2. Selecciona la base de datos `aq000097_wp_ta`
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido de `backend/database.sql`
5. Ejecuta

## Paso 3: Configurar Variables de Entorno

Las variables de entorno ya están configuradas en el archivo `.env` en la raíz del proyecto:

```env
# Sistema de Backup - Base de Datos
DB_HOST=localhost
DB_NAME=aq000097_wp_ta
DB_USER=aq000097_wp_ta
DB_PASS=79nigoWOza
DB_CHARSET=utf8mb4

# Sistema de Backup - Configuración SMTP (DonWeb)
SMTP_HOST=aq000097.ferozo.com
SMTP_PORT=465
SMTP_ENCRYPTION=ssl
SMTP_USER=no-reply@trompoagencia.com
SMTP_PASS=@qjjyV79jW
SMTP_FROM=no-reply@trompoagencia.com
SMTP_TO=desarrollo@trompoagencia.com,marketing@trompoagencia.com
```

**Nota**: El archivo `.env` ya contiene estas configuraciones. Solo verifica que estén correctas.

## Paso 4: Mover el Endpoint a la Carpeta Pública

Mueve el archivo `backend/backup-endpoint.php` a `client/public/backend/backup-endpoint.php`:

```bash
# Desde la raíz del proyecto
mkdir -p client/public/backend
cp backend/backup-endpoint.php client/public/backend/backup-endpoint.php
```

**Importante**: Después de mover el archivo, necesitas ajustar las rutas de `require_once` en `backup-endpoint.php` para que apunten correctamente a los archivos del backend.

El archivo `.htaccess` ya está configurado para permitir el acceso directo a archivos PHP.

## Paso 5: Ajustar Rutas en backup-endpoint.php

Una vez movido el archivo a `client/public/backend/backup-endpoint.php`, edita las rutas de los `require_once` para que apunten a la carpeta `backend/` original:

```php
// Cambiar de:
require_once __DIR__ . '/config.php';

// A:
require_once __DIR__ . '/../../../backend/config.php';
```

O mejor aún, crea un archivo `backup-endpoint.php` en `client/public/backend/` que incluya el endpoint original:

```php
<?php
// Redirigir al endpoint real
require_once __DIR__ . '/../../../backend/backup-endpoint.php';
```

## Paso 6: Verificar Instalación

1. **Verificar BD**: Ejecuta en tu base de datos:
```sql
SHOW TABLES LIKE 'form_leads_backup';
```

2. **Verificar PHP**: Accede directamente al endpoint:
```
https://tu-dominio.com/backend/backup-endpoint.php
```
Deberías ver un JSON con error (es normal, necesita POST).

3. **Probar desde consola del navegador**:
```javascript
fetch('/backend/backup-endpoint.php', {
  method: 'POST',
  body: new FormData()
}).then(r => r.json()).then(console.log);
```

## Solución de Problemas Comunes

### Error: "Class 'PHPMailer\PHPMailer\PHPMailer' not found"
**Dónde verlo**: 
- Consola del navegador (F12 → Console) al enviar formulario
- Respuesta del endpoint al hacer POST (ver JSON de error)
- Logs de PHP del servidor

**Solución**: Ejecuta `composer install` en la carpeta `backend/`

### Error: "Access denied for user"
**Dónde verlo**: 
- Respuesta del endpoint al hacer POST (ver JSON de error)
- Logs de PHP del servidor (generalmente en `/var/log/php_errors.log` o panel de hosting)
- Consola del navegador si el error se propaga

**Solución**: Verifica credenciales de BD en `.env` (DB_HOST, DB_NAME, DB_USER, DB_PASS)

### Error: "Table 'form_leads_backup' doesn't exist"
**Dónde verlo**: 
- Respuesta del endpoint al hacer POST (ver JSON de error)
- Logs de PHP del servidor
- Al ejecutar consultas SQL directamente

**Solución**: Ejecuta el script `database.sql` en tu base de datos

### Error CORS
**Dónde verlo**: 
- Consola del navegador (F12 → Console) - verás: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"
- Pestaña Network (F12 → Network) - la petición aparecerá en rojo con error CORS

**Solución**: El `.htaccess` ya está configurado. Si persiste, verifica que el endpoint esté accesible y que los headers CORS estén correctos en `backup-endpoint.php`

### El correo no se envía
**Dónde verlo**: 
- Respuesta del endpoint: el JSON mostrará `"notification_sent": false` y `"status": "error"` en la BD
- Base de datos: consulta `SELECT * FROM form_leads_backup WHERE status = 'error'` para ver `error_message`
- Logs de PHP del servidor (panel de hosting o `/var/log/php_errors.log`)

**Solución**: 
1. Verifica credenciales SMTP en `.env`
2. Verifica que el puerto 465 y SSL estén correctos
3. Revisa logs de PHP del servidor
4. Consulta la tabla `form_leads_backup` para ver el mensaje de error específico

## Estructura Final

```
proyecto/
├── .env                    # Variables de entorno (incluye backup + brevo)
├── backend/                # Sistema de backup
│   ├── config.php
│   ├── LeadRepository.php
│   ├── MailService.php
│   ├── NotificationTemplate.php
│   ├── backup-endpoint.php  # Endpoint original
│   ├── database.sql
│   ├── composer.json
│   └── vendor/            # Generado por composer install
└── client/
    └── public/
        ├── .htaccess       # Ya configurado para PHP
        ├── backend/
        │   └── backup-endpoint.php  # Endpoint accesible vía web
        └── form-handler.php   # Endpoint actual de Brevo
```
