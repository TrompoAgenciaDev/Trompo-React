import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Registrar Service Worker para cacheo offline
if ('serviceWorker' in navigator) {
  // Registrar solo en producción o cuando no estemos en desarrollo local
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registrado exitosamente:', registration.scope);
          
          // Verificar actualizaciones periódicamente
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[SW] Nueva versión disponible. Recarga la página para actualizar.');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('[SW] Error al registrar Service Worker:', error);
        });
    });
  }
}

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleReCaptchaProvider 
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>,
)
