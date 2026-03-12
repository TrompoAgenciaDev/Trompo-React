import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import "../assets/styles/Calculators.css";

/**
 * EngagementCalculator - Calculadora de tasa de engagement para redes sociales
 * Permite estimar el engagement sobre seguidores o alcance
 * Componente autocontenido con cálculos en tiempo real
 */
const EngagementCalculator = ({ onClose }) => {
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768);
  // Modo: "seguidores" o "alcance"
  const [mode, setMode] = useState("seguidores");

  // Valores vacíos por defecto (se usan placeholders como guía)
  const [seguidores, setSeguidores] = useState("");
  const [alcance, setAlcance] = useState("");
  const [likes, setLikes] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [compartidos, setCompartidos] = useState("");
  const [guardados, setGuardados] = useState("");

  // Parsear valores numéricos (vacío = 0, evita NaN)
  const parseNum = (val) => {
    if (val === "" || val === null || val === undefined) return 0;
    const n = parseFloat(String(val).replace(/[^\d.,]/g, "").replace(",", "."));
    return isNaN(n) ? 0 : Math.max(0, n);
  };

  const segVal = parseNum(seguidores);
  const alcVal = parseNum(alcance);
  const likesVal = parseNum(likes);
  const comentariosVal = parseNum(comentarios);
  const compartidosVal = parseNum(compartidos);
  const guardadosVal = parseNum(guardados);

  // Cálculos en tiempo real
  const calculated = useMemo(() => {
    const totalInteracciones = likesVal + comentariosVal + compartidosVal + guardadosVal;
    const divisor = mode === "seguidores" ? segVal : alcVal;
    const engagement = divisor > 0 ? (totalInteracciones / divisor) * 100 : 0;

    return {
      totalInteracciones,
      engagement: Math.round(engagement * 100) / 100,
    };
  }, [segVal, alcVal, likesVal, comentariosVal, compartidosVal, guardadosVal, mode]);

  // Clasificación del rendimiento
  const getPerformance = () => {
    if (calculated.engagement < 1) return { label: "Bajo rendimiento", className: "low" };
    if (calculated.engagement < 3) return { label: "Rendimiento aceptable", className: "mid" };
    return { label: "Alto rendimiento", className: "high" };
  };

  const performance = getPerformance();

  const impactMessage = performance.className === "high"
    ? "Tu comunidad tiene potencial de conversión estructural."
    : "El contenido necesita dirección estratégica para generar impacto real.";

  // Formatear números con separador de miles
  const formatNumber = (n) => {
    return new Intl.NumberFormat("es-AR").format(Math.round(n));
  };

  // Validación: solo números en inputs
  const handleNumericChange = (setter, value) => {
    const cleaned = (value || "").replace(/[^0-9.,]/g, "").replace(",", ".");
    setter(cleaned);
  };

  return (
    <>
    <div className="popup-overlay"></div>
    <div className="calculator-popup bg-yellow-2">
      <button className="popup-close" onClick={onClose}>
        <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
          <g fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(5 5)">
            <path d="m10.5 10.5-10-10z"/>
            <path d="m10.5.5-10 10"/>
          </g>
        </svg>
      </button>

      <div className="header-card">
        {/* Textos */}
        <div className="left-card-grid">
          <div className="icon-popup-head">
            <svg 
              className="svg-icon svg-white"
              xmlns="http://www.w3.org/2000/svg" 
              width="102" 
              height="102" 
              viewBox="0 0 102 102" 
              fill="none"
              style={{transform: "rotate(180deg)"}}
            >
              <g clipPath="url(#clip0_3525_2018_white)">
                <path d="M102 94L-1.52588e-05 94" stroke="#1E1E1E" strokeWidth="20" fill="none"/>
                <path d="M8 0L8 102" stroke="#1E1E1E" strokeWidth="20" fill="none"/>
                <path d="M95.9375 5.93756L5.87504 96" stroke="#1E1E1E" strokeWidth="20" fill="none"/>
              </g>
            </svg>
          </div>
          <div className="text-popup">
            <h2>Simulador de Impacto Social</h2>
            <h3 className="subtitle-text-calculator">Medí cómo tu comunidad puede transformarse en oportunidad.</h3>
            <div className="description-container">
              <p className="desktop-text">Las redes no son solo alcance, son percepción, influencia y conversión asistida.</p>
              <p className="tablet-popup-description">Este simulador estima cómo el engagement y la tasa de interacción pueden impactar en generación de leads u oportunidades comerciales cuando el ecosistema está bien estructurado.</p>
              <p className="desktop-text">Porque la conversación correcta también tiene retorno.</p>
              <p className="mobile-popup-description">Ingresá tus datos y visualizá las  oportunidades  que podría generar tu comunidad.</p>
            </div>
          </div>
          <div className="icon-popup-head icon-desktop">
            <svg
              className="svg-icon svg-white"
              xmlns="http://www.w3.org/2000/svg"
              width="102"
              height="102"
              viewBox="0 0 102 102"
              fill="none"
              style={{transform: "rotate(180deg)"}}
            >
              <g clipPath="url(#clip0_3525_2018_white)">
                <path d="M102 94L-1.52588e-05 94" stroke="#1E1E1E" strokeWidth="20" fill="none"/>
                <path d="M8 0L8 102" stroke="#1E1E1E" strokeWidth="20" fill="none"/>
                <path d="M95.9375 5.93756L5.87504 96" stroke="#1E1E1E" strokeWidth="20" fill="none"/>
              </g>
            </svg>
          </div>
        </div>
        {/* Calculadora */}
        <div className="right-card-grid">
          <div className="mobile-calculator">
            {/* Toggle Seguidores / Alcance */}
            <p className="mobile-popup-description">
              Calcular:
            </p>
            <div className="toggle-wrapper">              
              <button
                type="button"
                className={`toggle-btn ${mode === "seguidores" ? "active" : ""}`}
                onClick={() => setMode("seguidores")}
              >
                Sobre Seguidores
              </button>
              <button
                type="button"
                className={`toggle-btn ${mode === "alcance" ? "active" : ""}`}
                onClick={() => setMode("alcance")}
              >
                Sobre Alcance
              </button>
            </div>

            {/* Sección Inputs */}
            <div className="calculator-inputs">
              {mode === "seguidores" ? (
                <div className="input-group">
                  <label className="desktop-text" htmlFor="seguidores">Seguidores</label>
                  <input
                    id="seguidores"
                    type="text"
                    inputMode="numeric"
                    value={seguidores}
                    onChange={(e) => handleNumericChange(setSeguidores, e.target.value)}
                    placeholder="Seguidores"
                    
                  />
                </div>
              ) : (
                <div className="input-group">
                  <label className="desktop-text" htmlFor="alcance">Alcance</label>
                  <input
                    id="alcance"
                    type="text"
                    inputMode="numeric"
                    value={alcance}
                    onChange={(e) => handleNumericChange(setAlcance, e.target.value)}
                    placeholder="Alcance"
                  />
                </div>
              )}
              <div className="input-group">
                <label className="desktop-text" htmlFor="likes">Likes</label>
                <input
                  id="likes"
                  type="text"
                  inputMode="numeric"
                  value={likes}
                  onChange={(e) => handleNumericChange(setLikes, e.target.value)}
                  placeholder="Likes"
                />
              </div>
              <div className="input-group">
                <label className="desktop-text" htmlFor="comentarios">Comentarios</label>
                <input
                  id="comentarios"
                  type="text"
                  inputMode="numeric"
                  value={comentarios}
                  onChange={(e) => handleNumericChange(setComentarios, e.target.value)}
                  placeholder="Comentarios"
                />
              </div>
              <div className="input-group">
                <label className="desktop-text" htmlFor="compartidos">Compartidos</label>
                <input
                  id="compartidos"
                  type="text"
                  inputMode="numeric"
                  value={compartidos}
                  onChange={(e) => handleNumericChange(setCompartidos, e.target.value)}
                  placeholder="Compartidos"
                />
              </div>
              <div className="input-group">
                <label className="desktop-text" htmlFor="guardados">Guardados</label>
                <input
                  id="guardados"
                  type="text"
                  inputMode="numeric"
                  value={guardados}
                  onChange={(e) => handleNumericChange(setGuardados, e.target.value)}
                  placeholder="Guardados"
                />
              </div>
            </div>

            {/* Sección Resultados */}
            <div className="calculator-results">
              <motion.div
                className="result-item"
                key={`total-${calculated.totalInteracciones}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h5 className="result-label">Total de interacciones</h5>
                <span className="result-value">{formatNumber(calculated.totalInteracciones)}</span>
              </motion.div>
              <motion.div
                className={`result-item rate ${performance.className}`}
                key={`${calculated.engagement}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h5 className="result-label">Engagement Rate</h5>
                <span className="result-value result-main">
                  {calculated.engagement.toFixed(2)}%
                </span>
                <span className="result-main">{performance.label}</span>
              </motion.div>
            </div>

            <p className="result-message">Este simulador estima cómo el engagement y la interacción pueden generar leads cuando el ecosistema digital está bien estructurado.</p>

          </div>
          <div className="desktop-calculator">
            {/* Toggle Seguidores / Alcance */}
            <p className="desktop-text">Ingresá tu alcance mensual estimado y tasa de interacción promedio. Visualizá cómo podría traducirse en oportuniades reales.</p>
            <div className="toggle-wrapper">              
              <button
                type="button"
                className={`toggle-btn ${mode === "seguidores" ? "active" : ""}`}
                onClick={() => setMode("seguidores")}
              >
                Calcular sobre Seguidores
              </button>
              <button
                type="button"
                className={`toggle-btn ${mode === "alcance" ? "active" : ""}`}
                onClick={() => setMode("alcance")}
              >
                Calcular sobre Alcance
              </button>
            </div>

            {/* Sección Inputs */}
            <div className="calculator-inputs">
              {mode === "seguidores" ? (
                <div className="input-group">
                  <label htmlFor="seguidores">Seguidores</label>
                  <input
                    id="seguidores"
                    type="text"
                    inputMode="numeric"
                    value={seguidores}
                    onChange={(e) => handleNumericChange(setSeguidores, e.target.value)}
                    placeholder="10000"
                  />
                </div>
              ) : (
                <div className="input-group">
                  <label htmlFor="alcance">Alcance</label>
                  <input
                    id="alcance"
                    type="text"
                    inputMode="numeric"
                    value={alcance}
                    onChange={(e) => handleNumericChange(setAlcance, e.target.value)}
                    placeholder="5000"
                  />
                </div>
              )}
              <div className="input-group">
                <label htmlFor="likes">Likes</label>
                <input
                  id="likes"
                  type="text"
                  inputMode="numeric"
                  value={likes}
                  onChange={(e) => handleNumericChange(setLikes, e.target.value)}
                  placeholder="350"
                />
              </div>
              <div className="input-group">
                <label htmlFor="comentarios">Comentarios</label>
                <input
                  id="comentarios"
                  type="text"
                  inputMode="numeric"
                  value={comentarios}
                  onChange={(e) => handleNumericChange(setComentarios, e.target.value)}
                  placeholder="40"
                />
              </div>
              <div className="input-group">
                <label htmlFor="compartidos">Compartidos</label>
                <input
                  id="compartidos"
                  type="text"
                  inputMode="numeric"
                  value={compartidos}
                  onChange={(e) => handleNumericChange(setCompartidos, e.target.value)}
                  placeholder="20"
                />
              </div>
              <div className="input-group">
                <label htmlFor="guardados">Guardados</label>
                <input
                  id="guardados"
                  type="text"
                  inputMode="numeric"
                  value={guardados}
                  onChange={(e) => handleNumericChange(setGuardados, e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>

            {/* Sección Resultados */}
            <div className="calculator-results">
              <motion.div
                className="result-item"
                key={`total-${calculated.totalInteracciones}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="result-label">Total de interacciones</span>
                <div className="results">
                  <span className="result-value">{formatNumber(calculated.totalInteracciones)}</span>
                </div>
              </motion.div>
              <motion.div
                className={`result-item rate ${performance.className}`}
                key={`${calculated.engagement}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="result-label">Engagement Rate</span>
                <div className="results">
                  <span className="result-value result-main">
                    {calculated.engagement.toFixed(2)}%
                  </span>
                  <span className="result-interpretation">{performance.label}</span>
                </div>
              </motion.div>
            </div>

            <h5 className="result-message">{impactMessage}</h5>

          </div>
        </div>
      </div>
      <div className="bottom-card">
        <h5>¿Querés profesionalizar tu ecosistema social?</h5>
        <a href="#contact" className="popup-close-back active" onClick={onClose}>Diseñar estrategia social</a>
      </div>
    </div>
    </>
  );
};

export default EngagementCalculator;