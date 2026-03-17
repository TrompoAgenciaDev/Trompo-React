# Sistema de Backup Paralelo para Formularios

Sistema de respaldo independiente que guarda todos los envíos de formularios en base de datos y envía notificaciones por correo, sin interferir con el flujo principal de Brevo.

## 📋 Características

- ✅ **Backup en paralelo**: No bloquea el envío principal a Brevo
- ✅ **Almacenamiento en BD**: Todos los leads se guardan con metadatos completos
- ✅ **Notificaciones SMTP**: Correos HTML con todos los datos del formulario
- ✅ **Manejo de errores**: Si el backup falla, no afecta el flujo principal
- ✅ **Configuración flexible**: Todo configurable vía `.env`
- ✅ **CORS configurado**: Listo para recibir peticiones desde React

## 📁 Estructura de Archivos

```
backend/
├── config.php                 # Configuración PDO y carga de .env
├── LeadRepository.php         # Gestión de leads en base de datos
├── MailService.php           # Envío de correos con PHPMailer
├── NotificationTemplate.php  # Generador de templates HTML
├── backup-endpoint.php       # Endpoint receptor principal
├── database.sql              # Script SQL para crear tabla
├── composer.json             # Dependencias PHP
├── .env.example              # Ejemplo de configuración
└── README.md                 # Esta documentación
```

## 🚀 Instalación

### 1. Instalar dependencias PHP

```bash
cd backend
composer install
```

### 2. Configurar base de datos

Ejecuta el script SQL para crear la tabla:

```bash
mysql -u tu_usuario -p tu_base_de_datos < database.sql
```

O ejecuta manualmente el contenido de `database.sql` en tu gestor de base de datos.

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y completa con tus datos:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Base de datos
DB_HOST=localhost
DB_NAME=trompo_db
DB_USER=tu_usuario
DB_PASS=tu_password

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
SMTP_FROM=tu-email@gmail.com
SMTP_TO=notificaciones@ejemplo.com
```

### 4. Configurar acceso al endpoint

El endpoint debe ser accesible desde el frontend. Opciones:

**Opción A: Fuera de public_html (Recomendado)**
- Ubica `backend/` fuera de `public_html/`
- Configura un alias en Apache/Nginx que apunte a `backup-endpoint.php`
- Ejemplo Apache:
```apache
Alias /backup-endpoint /ruta/absoluta/backend/backup-endpoint.php
```

**Opción B: Dentro de public_html**
- Mueve `backup-endpoint.php` a `public_html/backend/backup-endpoint.php`
- Ajusta las rutas de `require_once` en el archivo

### 5. Configurar CORS (si es necesario)

Si el endpoint está en un dominio diferente, ajusta los headers CORS en `backup-endpoint.php`:

```php
header('Access-Control-Allow-Origin: https://tu-dominio.com');
```

## 🔧 Configuración del Frontend

El hook `useFormBrevo.js` ya está modificado para enviar en paralelo. Solo necesitas configurar la URL del endpoint:

### Opción 1: Variable de entorno (Recomendado)

Crea o edita `.env` en la raíz del proyecto:

```env
VITE_BACKUP_ENDPOINT=https://tu-dominio.com/backend/backup-endpoint.php
```

### Opción 2: Ruta relativa

Si el endpoint está en el mismo dominio, usa ruta relativa:

```javascript
// En useFormBrevo.js, la ruta por defecto es:
'/backend/backup-endpoint.php'
```

## 📊 Flujo de Funcionamiento

```
1. Usuario envía formulario
   ↓
2. React ejecuta Promise.allSettled([
     - fetch(form-handler.php) → Brevo (principal)
     - fetch(backup-endpoint.php) → Backup (paralelo)
   ])
   ↓
3. Si Brevo responde OK → Usuario ve "gracias"
   Si Brevo falla → Usuario ve error
   ↓
4. Backup (en paralelo):
   - Guarda en BD (form_leads_backup)
   - Envía notificación SMTP
   - Si falla → Solo se registra en log, no afecta al usuario
```

## 🗄️ Estructura de la Base de Datos

La tabla `form_leads_backup` almacena:

- `id`: ID único del lead
- `form_identifier`: Identificador del formulario (LOCATION)
- `payload`: JSON completo con todos los datos
- `ip_address`: IP del cliente
- `user_agent`: User agent del navegador
- `status`: Estado (received, notified, error)
- `error_message`: Mensaje de error si aplica
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

## 📧 Template de Notificación

El correo incluye:
- Header con identificador del formulario
- Todos los campos del formulario formateados
- Timestamp de recepción
- Diseño responsive con estilos inline

**Asunto del correo**: `Nueva consulta - {form_identifier}`

## 🔍 Consultas Útiles

### Ver todos los leads recibidos
```sql
SELECT * FROM form_leads_backup ORDER BY created_at DESC;
```

### Ver leads por formulario
```sql
SELECT * FROM form_leads_backup 
WHERE form_identifier = 'home' 
ORDER BY created_at DESC;
```

### Ver leads con errores
```sql
SELECT * FROM form_leads_backup 
WHERE status = 'error' 
ORDER BY created_at DESC;
```

### Estadísticas por formulario
```sql
SELECT 
    form_identifier,
    COUNT(*) as total,
    SUM(CASE WHEN status = 'notified' THEN 1 ELSE 0 END) as notificados,
    SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as errores
FROM form_leads_backup
GROUP BY form_identifier;
```

## 🛠️ Troubleshooting

### El backup no se ejecuta

1. Verifica que la URL del endpoint sea correcta
2. Revisa la consola del navegador para errores CORS
3. Verifica que el archivo `.env` esté en la ubicación correcta
4. Revisa los logs de PHP

### Error de conexión a BD

1. Verifica credenciales en `.env`
2. Verifica que la tabla existe: `SHOW TABLES LIKE 'form_leads_backup';`
3. Revisa permisos del usuario de BD

### Error al enviar correo

1. Verifica credenciales SMTP en `.env`
2. Para Gmail, usa "App Password" (no la contraseña normal)
3. Verifica que `SMTP_TO` esté configurado
4. Revisa logs de PHP para detalles del error

### CORS errors

1. Ajusta `Access-Control-Allow-Origin` en `backup-endpoint.php`
2. Verifica que el servidor permita peticiones desde tu dominio

## 🔒 Seguridad

- ✅ El endpoint valida y sanitiza todos los datos
- ✅ Las credenciales están en `.env` (no hardcodeadas)
- ✅ Los errores no exponen información sensible
- ✅ CORS configurado correctamente
- ⚠️ **Importante**: El `.env` debe estar fuera de `public_html` y no ser accesible vía web

## 📝 Notas Importantes

- El sistema de backup es **independiente** del flujo principal
- Si el backup falla, **NO afecta** el envío a Brevo
- Todos los errores se registran en logs de PHP
- El backup se ejecuta en paralelo, no bloquea la experiencia del usuario

## 📞 Soporte

Para problemas o preguntas, revisa:
1. Logs de PHP del servidor
2. Consola del navegador (errores de red)
3. Logs de la base de datos
4. Logs del servidor SMTP
