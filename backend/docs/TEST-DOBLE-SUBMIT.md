# Prueba de doble submit y anti-duplicación

Objetivo: comprobar que **solo hay un insert real** por envío y que los logs permiten diagnosticar si el frontend o el navegador dispararon más de una request.

## Preparación

1. Asegurarse de que la tabla tiene la columna `submission_id` (ejecutar `database-add-submission-id.sql` si la tabla ya existía).
2. Tener el backend con logs activos: `backend/logs/form-flow.log`, `db.log`, `smtp.log`.

## Escenarios

### 1. Doble click rápido en "Enviar"

- Abrir el formulario, rellenar y hacer **doble click rápido** en el botón.
- **Frontend:** En consola (F12) debe aparecer `CLICK_SUBMIT` una o dos veces; si hay lock, el segundo intento debe verse como `DOUBLE_SUBMIT_BLOCKED` y solo un `BACKUP_FETCH_START`.
- **Backend:** En `form-flow.log` puede haber 1 o 2 entradas `REQUEST_RECEIVED`. Si hay 2, el mismo `SUBMISSION_ID` puede aparecer en ambas (si el segundo request llegó con el mismo id) o dos ids distintos (si el frontend generó dos ids antes del lock).
- **BD:** Debe haber **solo 1 fila nueva** con ese envío. Si llegaron 2 requests con el mismo `submission_id`, la segunda debe tener `DUPLICATE_DETECTED` y no insertar.
- **Respuesta:** La primera request devuelve `db_saved: true`; si hay segunda con mismo `submission_id`, devuelve `duplicate: true`, `db_saved: false`, `mail_sent: false`.

### 2. Refresh durante el envío (red lenta)

- En DevTools → Network, poner throttling "Slow 3G".
- Enviar el formulario y **refrescar la página** antes de que termine el fetch.
- **Frontend:** Puede haber un `BACKUP_FETCH_START` y luego la página se recarga (no hay BACKUP_FETCH_SUCCESS/ERROR en esa pestaña).
- **Backend:** En `form-flow.log` debe haber al menos una `REQUEST_RECEIVED`. Si el request llegó al servidor antes del refresh, habrá un insert; si el usuario envió de nuevo después del refresh, será otro `submission_id` y otra fila (comportamiento esperado: dos intenciones de envío = dos ids).

### 3. Una sola pulsación (flujo normal)

- Un solo click en "Enviar", esperar a que termine.
- **Consola:** Secuencia esperada: `CLICK_SUBMIT` → `ONSUBMIT_TRIGGERED` → `BACKUP_FETCH_START` → `BACKUP_FETCH_SUCCESS` (o ERROR) → `FORM_NATIVE_SUBMIT`.
- **form-flow.log:** Una entrada `REQUEST_RECEIVED` con un único `SERVER_REQUEST_ID` y `SUBMISSION_ID`.
- **db.log:** Una línea `INSERT_OK` con ese `SUBMISSION_ID`.
- **BD:** Una fila con ese `submission_id`.

## Diagnóstico rápido

| Pregunta | Dónde mirar |
|----------|-------------|
| ¿El frontend dispara 2 submits? | Consola: dos `ONSUBMIT_TRIGGERED` o dos `BACKUP_FETCH_START` con el mismo submissionId → problema en React (doble binding o StrictMode). |
| ¿El fetch corre 2 veces? | Consola: dos `BACKUP_FETCH_START` (mismo o distinto submissionId). |
| ¿El endpoint recibe 2 requests? | `form-flow.log`: dos bloques `REQUEST_RECEIVED` (mismo o distinto `SUBMISSION_ID`). |
| ¿Hay duplicado en BD? | Si dos requests con el **mismo** `SUBMISSION_ID`: el segundo debe verse como `DUPLICATE_DETECTED` en form-flow y db.log, y solo 1 insert. |
| ¿Brevo hace re-submit? | El flujo actual no reenvía por Brevo; el backup es independiente. Brevo recibe un solo submit desde el formulario nativo. |

## Verificación en BD

```sql
-- Contar envíos por submission_id (debe ser 1 por valor)
SELECT submission_id, COUNT(*) AS n
FROM form_leads_backup
WHERE submission_id IS NOT NULL
GROUP BY submission_id
HAVING n > 1;
-- Resultado esperado: 0 filas.
```
