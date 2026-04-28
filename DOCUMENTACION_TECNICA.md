# Documentación técnica — Trompo Agencia (Trompo-React)

Documento técnico de referencia del proyecto: stack, arquitectura, backend, mailing de respaldo, SEO, performance, variables de entorno y convenciones.

---

## 1. Resumen del proyecto

- **Dominio:** https://trompoagencia.com  
- **Tipo:** SPA (Single Page Application) con React + Vite. Formularios de contacto enviados a **Brevo** (CRM/email) y, en paralelo, a un sistema de **backup** (log + notificación por correo vía SMTP).
- **Prioridad funcional:** El envío principal es Brevo; el backup es secundario y no debe bloquear ni alterar la respuesta al usuario.

---

## 2. Estructura del repositorio

```
Trompo-React/
├── .env                          # Variables de entorno (raíz; no versionado)
├── client/                       # Frontend React (Vite)
│   ├── public/                   # Assets estáticos y entrypoints PHP
│   │   ├── api/
│   │   │   └── form-backup.php   # Stub: delega en backend/api/form-backup.php
│   │   ├── form-handler.php      # Handler principal: envía a Brevo (POST multipart)
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   ├── sw.js                 # Service Worker (cache estático)
│   │   └── index.html
│   ├── src/
│   │   ├── assets/               # Estilos, fuentes, imágenes
│   │   ├── components/           # Componentes reutilizables y formularios
│   │   ├── config/               # routesConfig (rutas + lazy components)
│   │   ├── context/
│   │   ├── hooks/                # useFormBrevo, usePrefetchRoutes, usePreloadResources, etc.
│   │   ├── layout/               # Header, Footer, Hero, Contact
│   │   ├── pages/                # Páginas por ruta
│   │   ├── routes/               # AppRoutes (Routes + Suspense)
│   │   ├── templates/            # singlePost, singlePortfolio
│   │   ├── utils/                # sendBackupNotification, publicUrl
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── postcss.config.js         # PurgeCSS en producción
│   └── package.json
├── backend/                      # PHP (sin base de datos)
│   ├── api/
│   │   └── form-backup.php       # Endpoint: log + SMTP
│   ├── logs/
│   │   └── form-backup.log       # Generado en runtime (no versionado)
│   ├── vendor/                   # Composer (PHPMailer)
│   ├── composer.json
│   └── composer.lock
└── archivo-backend/              # Documentación y referencias históricas
    └── INSTALACION.md            # Guía instalación backup
```

En producción, típicamente:
- **Document root:** contenido de `client` (build en `dist/` + `public/`).
- **Backend:** carpeta `backend/` como hermana de `public_html/` (o equivalente). El `.env` puede estar en la raíz del proyecto (hermano de `backend/`) o en `backend/.env`.

---

## 3. Frontend

### 3.1 Stack

- **Runtime:** React 19.x, React DOM 19.x  
- **Build:** Vite 7.x, `@vitejs/plugin-react-swc`  
- **Router:** React Router DOM 7.x (`BrowserRouter`, `Routes`, `Route`)  
- **Animaciones:** Motion (ex Framer Motion) 12.x, GSAP 3.x  
- **Otros:** react-google-recaptcha, video.js, vite-plugin-svgr, vite-plugin-compression (Brotli)

### 3.2 Entrada y routing

- **Entrada:** `client/index.html` carga `src/main.jsx`, que monta `App.jsx` en `#root`.
- **Rutas:** Definidas en `src/config/routesConfig.js`. Se aplanan y de-duplican por `path` en `AppRoutes.jsx`. Home (`/`) se renderiza **sin** `Suspense` para priorizar LCP; el resto de rutas van con `<Suspense fallback={null}>` y componentes en **lazy** (`React.lazy()`).
- **Alias:** `@` → `/src`, `@a` → `/src/assets`, `@as` → `/src/assets/styles`, `@ai` → `/src/assets/icons`, `@ap` → `/src/assets/portfolioImg`.

### 3.3 Formularios y flujo de envío

- **Componente de formulario:** `FormIndex` (`src/components/forms/FormIndex.jsx`). Recibe `location` (ej. `"home"`, `"contacto"`, `"desarrollo"`) para mapear a listas de Brevo.
- **Hook:** `useFormBrevo` (`src/hooks/useFormBrevo.js`):
  1. Construye `FormData` desde el formulario; el padre debe asegurar `formData.append("LOCATION", location)` antes de enviar (ya hecho en `FormIndex` con `submitForm(formData)`).
  2. Llama **sin await** a `sendBackupNotification()` (backup en paralelo; errores solo en consola).
  3. Hace `POST` a `form-handler.php` con `FormData`; la respuesta determina éxito/error para el usuario (Brevo).
  4. En éxito redirige a `/gracias`.
- **Backup desde el cliente:** `sendBackupNotification` (`src/utils/sendBackupNotification.js`) hace `POST` con JSON a `api/form-backup.php` (`Content-Type: application/json`). No bloquea la UI; fallos se registran con `console.warn`.

### 3.4 Layout y datos

- **Layout:** `Header`, `Footer`, `MenuPopup`, `ScrollTop`; `Contact` incluye `FormIndex` con `location`/`form` según página.
- **Datos:** JSON estáticos en `public/` (posts, portfolio, services, testimonials, values, members, faqs, clientes-storic). Hooks como `usePosts`, `usePortfolioData`, `useFetchServices`, etc. consumen esos JSON (o endpoints si se añaden).

---

## 4. Backend

### 4.1 form-handler.php (Brevo)

- **Ubicación:** `client/public/form-handler.php` (en producción suele ser la raíz del sitio o la carpeta public).
- **Función:** Recibe `POST` con `application/x-www-form-urlencoded` o `multipart/form-data`; extrae campos (NOMBRE, APELLIDOS, EMAIL, EMPRESA, SMS_COUNTRY_CODE, SMS, CONSULTA, LOCATION). EMAIL obligatorio.
- **.env:** Se carga desde `__DIR__ . '/../.env'` o `__DIR__ . '/.env'` (compatible con restricciones `open_basedir` en hosting compartido). Usa `parse_ini_file` y `putenv`.
- **Brevo:**  
  - `BREVO_API_KEY` para autenticación.  
  - Listas por `LOCATION`: `BREVO_LIST_HOME`, `BREVO_LIST_DESARROLLO`, `BREVO_LIST_SOPORTE`, `BREVO_LIST_INTERACCION`, `BREVO_LIST_ESTRATEGIA`, `BREVO_LIST_CREATIVIDAD`.
- **API:** `POST https://api.brevo.com/v3/contacts` con payload de contacto y `listIds`. Respuesta siempre JSON (`success`, `error` o `brevo`).

### 4.2 form-backup.php (log + correo de respaldo)

- **Lógica principal:** `backend/api/form-backup.php`.
- **Punto de entrada en producción:** `client/public/api/form-backup.php` (stub) que:
  1. Escribe en `backend/logs/form-backup.log` una línea de paso `entry_point` (para verificar que se ejecuta este archivo).
  2. Hace `require_once __DIR__ . '/../../backend/api/form-backup.php'`.

**Comportamiento del endpoint:**

- **Método:** Solo `POST`; CORS con `Access-Control-Allow-Origin: *`.
- **Body:** JSON con `formId`, `fields`, `timestamp`, `pageUrl`. Tamaño máximo 256 KB.
- **.env:** Se intentan varias rutas: `backend/.env`, raíz del proyecto (`__DIR__ . '/../../.env'`), y rutas derivadas de `DOCUMENT_ROOT` (`../.env`, `dirname(DOCUMENT_ROOT)/.env`). El archivo se parsea línea a línea (comentarios `#`, valores con comillas); no se usa `parse_ini_file` para evitar problemas con caracteres especiales en contraseñas.
- **Log:**  
  - **Pasos (depuración):** `stepLog()` escribe líneas JSON con `type: "step"`, `step`, `status`, `detail` (ej. `load_env`, `read_input`, `json_decode`, `parse_fields`, `autoload`, `smtp_config`, `send_mail`, `write_log`, `response`, `exception`).  
  - **Registro por envío:** `writeLog()` escribe una línea por request con `timestamp`, `status` (OK | ERROR | OK_NO_SMTP), `log_version: 2`, `formId`, `pageUrl`, `ip`, `user_agent`, `fields`, `error` (si aplica), `mail_sent`.
- **SMTP:** Si existen `SMTP_HOST` y `SMTP_TO` en el entorno, se usa PHPMailer (Composer) para enviar un correo HTML con los campos del formulario. Múltiples destinatarios en `SMTP_TO` separados por coma. Cualquier excepción se registra en `stepLog` y en el registro final; el endpoint responde igual 200 con `success: true` para no acoplar la UX al estado del backup.
- **Autoload:** `backend/vendor/autoload.php`; si no existe, se devuelve 500 y se registra en el log.

---

## 5. Variables de entorno (.env)

Archivo en la **raíz del proyecto** (o en `backend/` según despliegue). No debe versionarse.

### 5.1 Brevo y formulario principal

| Variable            | Uso                                                                 |
|---------------------|---------------------------------------------------------------------|
| `BREVO_API_KEY`     | API key de Brevo para `/v3/contacts` (form-handler.php).            |
| `BREVO_LIST_ID`      | ID de lista por defecto (si se usa).                                |
| `BREVO_LIST_HOME`   | ID lista para formulario home.                                     |
| `BREVO_LIST_DESARROLLO` | ID lista desarrollo.                                           |
| `BREVO_LIST_SOPORTE`| ID lista soporte.                                                   |
| `BREVO_LIST_INTERACCION` | ID lista interacción.                                         |
| `BREVO_LIST_ESTRATEGIA`  | ID lista estrategia.                                          |
| `BREVO_LIST_CREATIVIDAD`| ID lista creatividad.                                          |
| `RECAPTCHA_SECRET`   | Clave secreta reCAPTCHA (si se valida en servidor).                 |

### 5.2 Backup (log + SMTP)

| Variable         | Uso                                                                 |
|------------------|---------------------------------------------------------------------|
| `SMTP_HOST`      | Servidor SMTP (ej. smtp.gmail.com, aq000097.ferozo.com).            |
| `SMTP_PORT`      | Puerto (465 SSL, 587 TLS).                                          |
| `SMTP_ENCRYPTION`| `ssl` o `tls`.                                                      |
| `SMTP_USER`      | Usuario SMTP.                                                       |
| `SMTP_PASS`      | Contraseña (en Gmail usar contraseña de aplicación).                |
| `SMTP_FROM`      | Remitente del correo de backup.                                    |
| `SMTP_TO`        | Destinatario(s), separados por coma.                               |

### 5.3 Base de datos (referencia / no usado por backup)

Variables `DB_*` están presentes en el .env; el sistema de backup **no usa base de datos**. Se documentan por si se reutilizan en otro módulo:

- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_CHARSET`.

---

## 6. SEO y crawling

### 6.1 Meta y documento base

- **HTML:** `client/index.html` con `lang="en"`, `charset="UTF-8"`, `viewport`, título "Trompo Agencia", favicon.
- **Título por página:** En algunas rutas se ajusta `document.title` (ej. NotFound, Gracias, Maintenance). No hay hook centralizado tipo `usePageSEO`; las meta dinámicas por ruta son limitadas.

### 6.2 robots.txt

- **Ubicación:** `client/public/robots.txt`.
- **Contenido:** `User-agent: *` con `Allow: /`. `Disallow` para `/api/`, `/clear-cache`, `/gracias`, `/maintenance`, `/not-found`. `Sitemap: https://trompoagencia.com/sitemap.xml`.

### 6.3 sitemap.xml

- **Ubicación:** `client/public/sitemap.xml`.
- **Formato:** XML urlset (sitemaps.org). URLs estáticas con `changefreq` y `priority`: home (1.0), nosotros/servicios/contactanos/faqs (0.7–0.9), subpáginas de servicios (0.8), terms (0.4). Dominio base: `https://trompoagencia.com`.

### 6.4 Analíticas

- **Google Tag Manager:** Inyectado en `index.html`. `dataLayer` inicializado de forma no bloqueante; el script de GTM se carga después de `window.load` (o timeout 3 s). Se excluye la ruta `/clear-cache` de las analíticas. ID: `GTM-WTCNM4L`.

---

## 7. Performance

### 7.1 Build (Vite)

- **Salida:** `dist/`, `assetsDir: "assets"`. Sin source maps en producción. `minify: "terser"`. `cssCodeSplit: true`. Target `esnext`. `chunkSizeWarningLimit: 800`.
- **Compresión:** `vite-plugin-compression` con Brotli (`.br`), umbral 1024 bytes, sin borrar el original.
- **Code splitting:** `manualChunks`: `vendor-react` (react, react-dom, scheduler), `vendor-framer` (motion/framer-motion), `vendor-router` (react-router, @remix-run/router), `vendor-general` (resto de node_modules). Nombres de chunk con hash en `entryFileNames`, `chunkFileNames`, `assetFileNames`.
- **Define:** `import.meta.env.BUILD_TIME` con timestamp de build.

### 7.2 CSS

- **PurgeCSS:** En producción (`postcss.config.js`), `@fullhuman/postcss-purgecss` con `content` en `index.html` y `src/**/*.{js,jsx,ts,tsx}`. Safelist para clases dinámicas (ej. `motion-`, `video-`, `swiper-`, sufijos `-enter`, `-exit`, `-active`, `-done`). Extractor custom que combina coincidencias amplias y `className` en JSX.

### 7.3 Carga de recursos críticos (index.html)

- **DNS prefetch / preconnect:** fonts.googleapis.com, fonts.gstatic.com, googletagmanager.com, sibforms.com, use.typekit.net, p.typekit.net.
- **Preload:** Logo header (`black.webp`), video hero (desktop `.webm`, mobile `.mp4`), posters hero (desktop/mobile `.webp`), fuentes Montserrat (woff2) y Neue Haas Grotesk Display Pro (ttf). `fetchpriority="high"` donde aplica.
- **Prefetch:** Rutas probables `/nosotros`, `/servicios`, `/contactanos`, `/faqs`.
- **Fuentes:** Google Fonts y TypeKit con `media="print"` y `onload="this.media='all'"` para no bloquear el primer render; fallback con `<noscript>`.

### 7.4 LCP y rutas

- **Home sin Suspense:** La ruta `/` renderiza el componente Home directamente para mejorar LCP.
- **CSS crítico inline:** En `index.html`, bloque `<style>` con estilos mínimos del header y del hero para reducir CLS y mejorar LCP.
- **Brevo (Sibforms):** No se utiliza en este proyecto (formulario propio React + handler PHP).

### 7.5 Hooks de preload y prefetch

- **usePreloadResources:** Según `location.pathname`, añade preload de video hero e imágenes críticas; ejecución diferida con `requestIdleCallback` o `setTimeout`. Limpia preloads de video anteriores.
- **usePrefetchRoutes:** Tras 2 s, hace prefetch de rutas “relacionadas” según la ruta actual (ej. desde home → nosotros, contactanos, paid-media, diseno). Inserta `<link rel="prefetch" href="...">`.
- **usePrefetchOnHover:** Devuelve `onMouseEnter`/`onFocus` para prefetch de una ruta dada (útil para enlaces del menú).

### 7.6 Service Worker

- **Archivo:** `client/public/sw.js`. Registrado en `main.jsx` solo en `import.meta.env.PROD`.
- **Estrategia:** Cache first para GET same-origin. Cache con nombre `trompo-static-{CACHE_VERSION}`.
- **Instalación:** Cachea una lista fija de rutas y assets (index, favicon, JSON estáticos, imágenes). `skipWaiting()` en install.
- **Activación:** Elimina caches antiguos con prefijo `trompo-static-` y `clients.claim()`.
- **Exclusiones:** No cachea `/clear-cache`, `form-handler.php`, `.php`, `sw.js`. Solo se cachean respuestas 200, type `basic`.

---

## 8. Áreas clave (resumen)

| Área              | Ubicación principal                          | Notas                                           |
|-------------------|----------------------------------------------|-------------------------------------------------|
| Envío a Brevo     | `client/public/form-handler.php`, `useFormBrevo` | FormData POST; LOCATION → listId.               |
| Backup (log+mail) | `backend/api/form-backup.php`, stub `api/form-backup.php` | JSON POST; stepLog + writeLog; PHPMailer.       |
| Formulario UI     | `FormIndex`, `Contact`                       | LOCATION antes de submitForm; una sola llamada. |
| Rutas             | `routesConfig.js`, `AppRoutes.jsx`          | Lazy + Suspense; Home sin Suspense.            |
| Performance       | `vite.config.js`, `index.html`, hooks, SW   | Chunks, Brotli, preload/prefetch, PurgeCSS.     |
| SEO / crawling    | `robots.txt`, `sitemap.xml`, GTM en index   | Sitemap y robots en public.                     |
| Configuración     | `.env` en raíz (o backend/)                 | Brevo + SMTP; sin BD en backup.                 |

---

## 9. Método y convenciones

- **Idioma de código/comentarios:** Español en mensajes de usuario y comentarios de negocio; nombres de variables/funciones en inglés.
- **Respuestas API:** JSON con `success` (boolean) y, en error, `error` (string). Codificación UTF-8 (`JSON_UNESCAPED_UNICODE` en PHP).
- **Backup no bloqueante:** El cliente no espera al backup; el usuario solo depende de la respuesta de `form-handler.php`. El backup registra éxito/fallo en log y, si está configurado, envía correo.
- **Despliegue:** Build de Vite en `client/dist/`; contenido de `client/public/` (incl. `form-handler.php`, `api/form-backup.php`, `robots.txt`, `sitemap.xml`, `sw.js`) debe estar en el document root. Backend (`backend/`) como hermana de la raíz web; `.env` en raíz o en `backend/` según hosting.

---

## 10. Referencias rápidas

- **Instalación del backup:** `archivo-backend/INSTALACION.md`.
- **Log del backup:** `backend/logs/form-backup.log` (líneas JSON; `type: "step"` para pasos; registro final con `log_version`, `mail_sent`, `status`).
- **Dominio y sitemap:** https://trompoagencia.com, https://trompoagencia.com/sitemap.xml.


## 11. Modificación Final del sitio:
 
- **Nuevo site:** `solo se mantenienen los componentes respectivos al formulario, luego, el resto se eliminará del proyecto`
- **Rutas:** `El ruteo del sitio se mantiene casi intacto, según la documentación inicial.`
- **Formulario:** `el formulario queda intacto`
- **SEO:** `el SEO se actualizará con los nuevos campos que se soliciten`
- **Performance:** `el performance se mantiene con los mismos principios, solo hay que adapta las nuevas modificaciones al proyecto.`
- **Configuración:** `Se mantiene intacta`