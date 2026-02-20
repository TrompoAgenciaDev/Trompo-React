# Instalación - Sistema de Backup (solo subir)

No hace falta editar archivos. Solo build, subir y ejecutar el SQL una vez.

---

## En tu PC (una vez)

1. **Build del frontend**
   ```bash
   cd client
   npm run build
   ```
   Se genera la carpeta `client/dist/` con el sitio listo para publicar.

2. **.env en el servidor**  
   El backend usa el mismo `.env` que ya tenés al nivel de `public_html/` y `backend/` (raíz de la cuenta). No hace falta meterlo en `backend/` ni cambiar nada de lo que ya funciona.

---

## En el servidor (DonWeb u otro)

Estructura objetivo en el hosting (el `.env` queda donde ya lo tenés):

```
raíz_de_tu_cuenta/
├── .env                    ← mismo .env de siempre (Brevo + backup), sin moverlo
├── public_html/            ← todo el contenido de client/dist/
│   ├── index.html
│   ├── assets/
│   ├── backend/
│   │   └── backup-endpoint.php   (ya viene en dist)
│   ├── form-handler.php
│   └── ...
└── backend/                ← carpeta backend del proyecto (sin .env dentro)
    ├── config.php
    ├── LeadRepository.php
    ├── MailService.php
    ├── NotificationTemplate.php
    ├── BackupErrorLogger.php
    ├── backup-endpoint.php
    ├── database.sql
    ├── phpmailer/
    └── logs/               (se crea solo si hay errores)
```

### Pasos

1. **Subir el sitio**  
   Subí **todo el contenido** de `client/dist/` a la carpeta pública del hosting (ej. `public_html/`). Ahí ya va incluido `backend/backup-endpoint.php` (wrapper) y `form-handler.php` si estaban en `client/public/`.

2. **Subir el backend**  
   Subí la carpeta **`backend/`** completa al mismo nivel que la carpeta pública (hermana de `public_html/`), no dentro. Debe incluir:
   - `config.php`, `LeadRepository.php`, `MailService.php`, `NotificationTemplate.php`, `BackupErrorLogger.php`, `backup-endpoint.php`, `database.sql`, `composer.json`, `phpmailer/`

3. **.env**  
   El backend lee el `.env` que está al mismo nivel que `backend/` y `public_html/` (raíz de la cuenta). No lo pongas dentro de `backend/`; así no tocás nada de lo que ya funciona (Brevo, etc.).

4. **Base de datos (una sola vez)**  
   En phpMyAdmin (o el panel de MySQL de DonWeb):
   - Elegí la base de datos.
   - Ejecutá el contenido de `backend/database.sql` (pestaña SQL → pegar → ejecutar).
   - **Si la tabla `form_leads_backup` ya existía:** ejecutá además `backend/database-add-submission-id.sql` para añadir la columna `submission_id` (anti-duplicación).

---

## Verificación

- **Sitio:** Entrá a tu dominio y comprobá que el sitio carga.
- **Backup:** En el navegador podés abrir `https://tu-dominio.com/backend/backup-endpoint.php`; deberías ver un JSON (ej. método no permitido). Al enviar un formulario, el backup se llama solo y, si algo falla, el detalle queda en `backend/logs/backup-errors.log` en el servidor.

---

## Resumen

| Qué | Dónde |
|-----|--------|
| Contenido de `client/dist/` | Dentro de `public_html/` (o la carpeta que use tu hosting como web root) |
| Carpeta `backend/` completa | Al mismo nivel que `public_html/`, **fuera** del documento raíz |
| Archivo `.env` | En la raíz de la cuenta (mismo nivel que `public_html/` y `backend/`), como ya lo tenés |
| SQL | Ejecutar una vez en tu base MySQL con `backend/database.sql` |

No tenés que editar rutas ni archivos PHP: el wrapper y el backend ya están preparados para esta estructura.

---

## Backup: endpoint y debug

- **Endpoint de backup:** `POST /api/form-backup.php` (recibe el form en paralelo a Brevo, guarda en BD y envía mail; nunca hace redirect).
- **Logs por capa** (en `backend/logs/`):
  - `form-flow.log`: flujo de la request (REQUEST_RECEIVED, DUPLICATE_DETECTED, etc.).
  - `db.log`: operaciones de BD (INSERT_OK, INSERT_ERROR, DUPLICATE_DETECTED).
  - `smtp.log`: envío de correo (MAIL_SENT, SMTP_ERROR).
- **Modo debug:** En el `.env` podés agregar `BACKUP_DEBUG=true`. Si está activo, el JSON del backup devuelve el mensaje de error detallado; si está `false` o no existe, solo devuelve `success: false` sin detalles.
- **Respuesta JSON:** Siempre incluye `success`, `duplicate`, `db_saved`, `mail_sent`, `submission_id`, `server_request_id`, `debug`.
- **Test manual:** Subir `client/public/api/test-backup.php` a `public_html/api/test-backup.php` y abrir en el navegador. Permite enviar datos al backup sin React y ver el JSON. Borrar o restringir en producción.

### Diagnóstico SMTP (form-flow.log)

Si el flujo se corta en `SMTP_INIT` y no llega a `SMTP_SEND_SUCCESS` ni `SMTP_ERROR`, el endpoint hace **pruebas de socket** antes de PHPMailer:

- `SOCKET_TEST_465_START` / `SOCKET_465_SUCCESS` o `SOCKET_465_FAILED` (errno, error)
- `SOCKET_TEST_587_START` / `SOCKET_587_SUCCESS` o `SOCKET_587_FAILED` (errno, error)

Con eso podés ver si el puerto 465 o 587 está bloqueado. Además, con el callback de form-backup se registra `SMTP_DEBUG` (nivel y mensaje de PHPMailer) en cada paso del handshake.

**Opciones en .env para probar otra configuración:**

| Variable | Efecto |
|----------|--------|
| `SMTP_USE_587_TLS=true` | Fuerza puerto 587 y STARTTLS en lugar de 465/SSL. Se loguea `SMTP_CONFIG_USING_587_TLS`. |
| `SMTP_USE_LOCALHOST_25=true` | Usa `localhost:25` sin auth ni SSL (Exim local). Se loguea `SMTP_CONFIG_USING_LOCALHOST_25`. |

Timeout SMTP: 10 segundos; si no hay respuesta, no queda colgado indefinidamente.

---

## Si no llega el mail, no llega a Brevo y no se guarda en la base

Si al enviar el formulario no pasa nada (ni Brevo, ni backup en BD, ni correo del backup), revisá en este orden:

### 1. Navegador (F12 → pestaña Network)

- Enviá el formulario y mirá si aparecen **dos** peticiones:
  - `form-handler.php` (Brevo)
  - `backend/backup-endpoint.php` (backup)
- Clic en cada una y mirá **Status** (ej. 200, 404, 500) y **Response** (qué devuelve el servidor). Eso dice si el problema es de ruta, de PHP o del .env.

### 2. Que el .env esté donde corresponde

- El `.env` tiene que estar en la **raíz de la cuenta** (mismo nivel que `public_html/` y `backend/`), no dentro de `public_html/` ni de `backend/`.
- Para comprobarlo sin tocar nada delicado: en el proyecto hay un archivo `client/public/check-env.php`. Subilo a `public_html/` (queda junto a `form-handler.php`), entrá en el navegador a `https://tu-dominio.com/check-env.php` y revisá que diga que el .env existe, es legible y tiene variables (BREVO_API_KEY, DB_HOST, SMTP_HOST). **Después borrá `check-env.php`** del servidor.

### 3. Log del backup

- En el servidor, en la carpeta `backend/logs/`, revisá `form-flow.log`, `db.log` y `smtp.log`. Los errores de flujo y BD aparecen ahí. Si no existe la carpeta o los archivos, el backup probablemente no se está ejecutando o el wrapper no encuentra el backend.

### 4. Resumen de causas frecuentes

| Síntoma | Revisar |
|--------|--------|
| No aparece ninguna petición en Network al enviar | Que el formulario use el hook que hace fetch a `form-handler.php` y que la URL del sitio sea la correcta (mismo dominio). |
| 404 en form-handler o en backend/backup-endpoint | Rutas en el servidor: contenido de `dist/` dentro de `public_html/`, carpeta `backend/` hermana de `public_html/`. |
| 500 en form-handler o en backup-endpoint | Errores de PHP: ver respuesta en Network y, si hay, `backend/logs/backup-errors.log` o logs de PHP del hosting. |
| 200 pero Brevo no recibe / BD vacía | .env mal ubicado o no leído: que esté en la raíz de la cuenta y que `check-env.php` muestre que se cargan las variables. |
