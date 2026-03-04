/**
 * Envía una copia del envío al endpoint de backup. Fallos no afectan Brevo.
 */
export function sendBackupNotification(data) {
  const url = `${import.meta.env.BASE_URL || '/'}api/form-backup.php`;
  const payload = {
    formId: data.formId ?? 'contact',
    fields: data.fields ?? {},
    timestamp: data.timestamp ?? new Date().toISOString(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
  };
  try {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.warn('[Backup]', err.message));
  } catch (err) {
    console.warn('[Backup]', err.message);
  }
}
