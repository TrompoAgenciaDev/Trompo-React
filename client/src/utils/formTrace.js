/**
 * Trazabilidad del flujo de formularios (click → backup → Brevo).
 * Cada evento se registra con submissionId, formIdentifier, timestamp ISO y performance.now().
 */

const LOG_PREFIX = "[FormTrace]";

/**
 * Genera un UUID v4 para identificar de forma única cada envío.
 * @returns {string}
 */
export function generateSubmissionId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Registra un evento del flujo del formulario.
 * @param {string} eventName - CLICK_SUBMIT | ONSUBMIT_TRIGGERED | BACKUP_FETCH_START | BACKUP_FETCH_SUCCESS | BACKUP_FETCH_ERROR | FORM_NATIVE_SUBMIT
 * @param {string} submissionId - UUID del envío
 * @param {Object} extraData - { formIdentifier, ... }
 */
export function traceEvent(eventName, submissionId, extraData = {}) {
  const entry = {
    event: eventName,
    submissionId,
    timestamp: new Date().toISOString(),
    performanceNow: typeof performance !== "undefined" ? performance.now() : 0,
    ...extraData,
  };
  if (typeof window !== "undefined") {
    if (!window.submissionTrace) window.submissionTrace = [];
    window.submissionTrace.push(entry);
  }
  console.log(LOG_PREFIX, eventName, submissionId, entry.timestamp, entry.performanceNow, extraData);
  return entry;
}
