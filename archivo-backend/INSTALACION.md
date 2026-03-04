# Guía de Instalación - Sistema de Backup (sin base de datos)

El backup de formularios **no usa base de datos**. Solo registra cada envío en un archivo de log y envía una notificación por email vía SMTP.

## Qué hace el sistema

- Recibe por POST (JSON) los datos que el frontend envía en paralelo al enviar el formulario a Brevo.
- **Escribe siempre** un registro en `backend/logs/form-backup.log` (OK o ERROR).
- Si está configurado SMTP, envía un correo con los datos del formulario.
- Si algo falla (log o correo), el envío principal a Brevo **no se ve afectado**.

## Paso 1: Instalar dependencias PHP

```bash
cd backend
composer install
```

Si no tienes Composer instalado:
- Windows: https://getcomposer.org/download/
- Linux/Mac: `curl -sS https://getcomposer.org/installer | php`

## Paso 2: Configurar variables de entorno

Solo se usan variables **SMTP** (no hay base de datos).

Copia el ejemplo y completa con tus datos:

```bash
# En backend/ o en la raíz del proyecto
cp backend/.env.example .env
```

Edita `.env` y configura:

```env
SMTP_HOST=tu-servidor-smtp.com
SMTP_PORT=465
SMTP_ENCRYPTION=ssl
SMTP_USER=tu-usuario
SMTP_PASS=tu-password
SMTP_FROM=no-reply@tudominio.com
SMTP_TO=destino1@tudominio.com,destino2@tudominio.com
```

- El endpoint busca `.env` en `backend/` o en la raíz del proyecto.
- `SMTP_TO` puede ser varios correos separados por comas.
- Si no configuras SMTP, el backup seguirá funcionando y solo escribirá en el log.

## Paso 3: Carpeta de logs escribible

El script escribe en `backend/logs/form-backup.log`. Asegúrate de que la carpeta exista y el servidor web tenga permiso de escritura:

```bash
# Si no existe, se crea al primer uso; puedes crearla antes:
mkdir -p backend/logs
chmod 755 backend/logs
```

En hosting compartido, suele bastar con que la carpeta `logs/` exista (el script crea el archivo si no existe).

## Paso 4: Cómo se expone el endpoint en producción

En producción, `backend/` va al mismo nivel que `public_html/` (hermanas). El frontend llama a `/api/form-backup.php`.

- En `public_html/` debe estar el stub: `public_html/api/form-backup.php`, que hace:
  ```php
  <?php
  require_once __DIR__ . '/../../backend/api/form-backup.php';
  ```
- Al desplegar el build de React (Vite), asegúrate de que ese archivo `api/form-backup.php` esté dentro de lo que subes a `public_html/` (por ejemplo en `client/public/api/form-backup.php` en el repo, que se copia al build).

No hace falta mover nada más: el código real está en `backend/api/form-backup.php`, fuera del document root.

## Paso 5: Verificar instalación

1. **Composer**: En `backend/` debe existir la carpeta `vendor/` con PHPMailer.
2. **Endpoint**: Desde el navegador o con curl, un POST vacío o inválido debe devolver JSON (por ejemplo error de validación), no HTML ni error 500 de PHP:
   ```bash
   curl -X POST https://tu-dominio.com/api/form-backup.php -H "Content-Type: application/json" -d '{}'
   ```
   Deberías recibir algo como `{"success":false,"error":"JSON inválido"}`.
3. **Log**: Después de un envío real del formulario, revisa que exista o se cree `backend/logs/form-backup.log` y que tenga líneas en JSON (una por envío).
4. **Correo**: Si configuraste SMTP, revisa la bandeja (y spam) del destinatario `SMTP_TO`.

## Solución de problemas

### "Class 'PHPMailer\PHPMailer\PHPMailer' not found"
- Ejecuta `composer install` dentro de `backend/`.
- Comprueba que exista `backend/vendor/autoload.php`.

### El correo no se envía
- Revisa SMTP en `.env` (usuario, contraseña, puerto, SSL/TLS).
- En el log `backend/logs/form-backup.log` cada línea tiene `"status":"OK"` o `"status":"ERROR"` y, si hay fallo de correo, `"error":"SMTP: ..."`.
- No hay base de datos donde mirar; toda la información está en ese log.

### No se crea o no se escribe el log
- Comprueba que la carpeta `backend/logs/` exista y sea escribible por el usuario del servidor web.
- Revisa los logs de PHP del hosting por permisos o rutas.

### Error CORS
- El endpoint envía headers `Access-Control-Allow-Origin: *`. Si usas otro dominio en el frontend, comprueba que la petición llegue a `/api/form-backup.php` y que el servidor no sobrescriba esos headers.

## Estructura del backend (solo lo que se sube)

```
backend/
├── api/
│   └── form-backup.php   # Endpoint: log + email, sin BD
├── logs/
│   └── .gitkeep         # La carpeta se versiona; form-backup.log no
├── vendor/              # Generado por composer install
├── .env.example         # Ejemplo de variables (solo SMTP)
├── .gitignore
├── composer.json
└── composer.lock
```

No hay base de datos ni scripts SQL. El archivo `database.sql` en `archivo-backend/` es solo referencia histórica.
