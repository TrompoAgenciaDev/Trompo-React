import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClearCache = () => {
  const [status, setStatus] = useState("Limpiando caché...");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Prevenir indexación en motores de búsqueda
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", "noindex, nofollow");

    // Forzar no-cache en esta página
    const metaTags = [
      { httpEquiv: "Cache-Control", content: "no-cache, no-store, must-revalidate" },
      { httpEquiv: "Pragma", content: "no-cache" },
      { httpEquiv: "Expires", content: "0" },
    ];

    metaTags.forEach((tag) => {
      let meta = document.querySelector(`meta[http-equiv="${tag.httpEquiv}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("http-equiv", tag.httpEquiv);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", tag.content);
    });

    const clearCache = async () => {
      try {
        setProgress(10);
        setStatus("Limpiando caché del navegador...");

        // Limpiar Service Workers si existen
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            await registration.unregister();
            setProgress(30);
          }
        }

        setProgress(40);
        setStatus("Limpiando caché de recursos...");

        // Limpiar caché de la API Cache
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map((cacheName) => {
              setProgress(40 + (cacheNames.indexOf(cacheName) / cacheNames.length) * 20);
              return caches.delete(cacheName);
            })
          );
        }

        setProgress(70);
        setStatus("Limpiando localStorage y sessionStorage...");

        // Limpiar almacenamiento local (opcional, comentado por seguridad)
        // localStorage.clear();
        // sessionStorage.clear();

        setProgress(90);
        setStatus("Forzando recarga de recursos...");

        // Agregar timestamp a recursos para forzar recarga
        const links = document.querySelectorAll("link[rel='stylesheet'], script[src]");
        links.forEach((link) => {
          if (link.href) {
            const url = new URL(link.href, window.location.origin);
            url.searchParams.set("_nocache", Date.now());
            link.href = url.toString();
          } else if (link.src) {
            const url = new URL(link.src, window.location.origin);
            url.searchParams.set("_nocache", Date.now());
            link.src = url.toString();
          }
        });

        setProgress(100);
        setStatus("¡Caché limpiado exitosamente!");

        // Redirigir después de 2 segundos
        setTimeout(() => {
          // Forzar recarga completa sin caché
          window.location.href = window.location.origin + window.location.pathname + "?nocache=" + Date.now();
        }, 2000);
      } catch (error) {
        setStatus(`Error: ${error.message}`);
        setProgress(100);
      }
    };

    clearCache();
  }, []);

  const handleManualReload = () => {
    // Forzar recarga sin caché
    window.location.href = window.location.origin + "?nocache=" + Date.now();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "2rem", color: "#333" }}>🧹 Limpieza de Caché</h1>

        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              width: "100%",
              height: "24px",
              backgroundColor: "#e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#4CAF50",
                transform: `scaleX(${progress / 100})`,
                transformOrigin: "left center",
                transition: "transform 0.3s ease",
                willChange: "transform",
              }}
            />
          </div>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>{status}</p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={handleManualReload}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              marginRight: "1rem",
            }}
          >
            Recargar Ahora
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#757575",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            Ir al Inicio
          </button>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "6px",
            fontSize: "0.85rem",
            color: "#666",
            textAlign: "left",
          }}
        >
          <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>💡 Consejos:</p>
          <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
            <li>Presiona <strong>Ctrl+Shift+R</strong> (Windows) o <strong>Cmd+Shift+R</strong> (Mac) para recargar sin caché</li>
            <li>En DevTools: <strong>F12 → Network → Disable cache</strong></li>
            <li>Agrega <strong>?nocache=timestamp</strong> a cualquier URL</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClearCache;

