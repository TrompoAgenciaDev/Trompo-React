<?php
/**
 * Test manual del endpoint de backup (sin depender de React).
 *
 * Qué hace:
 * - Muestra un formulario con campos típicos (LOCATION, NOMBRE, EMAIL, etc.).
 * - Al enviar, hace POST a /api/form-backup.php y muestra el JSON de respuesta.
 *
 * Cómo probar:
 * 1. Subir este archivo a public_html/api/test-backup.php (o abrirlo en local si tenés el backend).
 * 2. Abrir en el navegador: https://tu-dominio.com/api/test-backup.php
 * 3. Completar campos y enviar. Verás { success, db_saved, mail_sent, error }.
 *
 * Cómo revisar logs:
 * - En el servidor: backend/logs/form-backup.log (cada error se escribe ahí con fecha y tipo).
 * - Activar BACKUP_DEBUG=true en .env para que el JSON devuelva el mensaje de error detallado.
 *
 * Seguridad: borrar o restringir acceso en producción.
 */
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test backup formulario</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
    label { display: block; margin-top: 0.5rem; }
    input, textarea { width: 100%; box-sizing: border-box; padding: 0.25rem; }
    button { margin-top: 1rem; padding: 0.5rem 1rem; }
    pre { background: #f5f5f5; padding: 1rem; overflow: auto; white-space: pre-wrap; }
    .error { color: #c00; }
    .ok { color: #080; }
  </style>
</head>
<body>
  <h1>Test backup formulario</h1>
  <p>Envía datos al endpoint <code>/api/form-backup.php</code> y muestra el JSON de respuesta. No usa React.</p>

  <form id="f">
    <label>LOCATION (identificador del form) <input type="text" name="LOCATION" value="test-backup" required></label>
    <label>NOMBRE <input type="text" name="NOMBRE" value="Test"></label>
    <label>EMAIL <input type="email" name="EMAIL" value="test@test.com"></label>
    <label>CONSULTA <textarea name="CONSULTA" rows="2">Mensaje de prueba desde test-backup.php</textarea></label>
    <button type="submit">Enviar a backup</button>
  </form>

  <h2>Respuesta JSON</h2>
  <pre id="out">(enviá el formulario para ver el resultado)</pre>

  <script>
    document.getElementById('f').addEventListener('submit', function (e) {
      e.preventDefault();
      var out = document.getElementById('out');
      out.textContent = 'Enviando...';
      var formData = new FormData(this);
      fetch('form-backup.php', { method: 'POST', body: formData })
        .then(function (r) {
          return r.text();
        })
        .then(function (text) {
          var data;
          try {
            data = JSON.parse(text);
          } catch (err) {
            out.textContent = text || 'No se pudo parsear JSON';
            out.className = 'error';
            return;
          }
          out.textContent = JSON.stringify(data, null, 2);
          out.className = data.success ? 'ok' : 'error';
        })
        .catch(function (err) {
          out.textContent = 'Error: ' + err.message;
          out.className = 'error';
        });
    });
  </script>
</body>
</html>
