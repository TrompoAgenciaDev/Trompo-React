import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import "./EngagementCalculator.css";

/**
 * EngagementCalculator - Calculadora de tasa de engagement para redes sociales
 * Permite estimar el engagement sobre seguidores o alcance
 * Componente autocontenido con cálculos en tiempo real
 */
const EngagementCalculator = () => {
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
    if (calculated.engagement < 1) return { label: "Bajo rendimiento", className: "engagement-low" };
    if (calculated.engagement < 3) return { label: "Rendimiento aceptable", className: "engagement-mid" };
    return { label: "Alto rendimiento", className: "engagement-high" };
  };

  const performance = getPerformance();

  // Formatear números con separador de miles
  const formatNumber = (n) => {
    return new Intl.NumberFormat("es-AR").format(Math.round(n));
  };

  // Validación: solo números en inputs
  const handleNumericChange = (setter, value) => {
    const cleaned = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setter(cleaned);
  };

  return (
    <div className="engagement-calculator-block">
      <div className="engagement-calculator-header">
        <h3 className="engagement-calculator-title">Calculá tu Engagement</h3>
        <p className="engagement-calculator-subtitle">Medí el rendimiento real de tu contenido</p>
      </div>

      <div className="engagement-calculator-body">
        {/* Toggle Seguidores / Alcance */}
        <div className="engagement-toggle-wrapper">
          <button
            type="button"
            className={`engagement-toggle-btn ${mode === "seguidores" ? "active" : ""}`}
            onClick={() => setMode("seguidores")}
          >
            Calcular sobre Seguidores
          </button>
          <button
            type="button"
            className={`engagement-toggle-btn ${mode === "alcance" ? "active" : ""}`}
            onClick={() => setMode("alcance")}
          >
            Calcular sobre Alcance
          </button>
        </div>

        {/* Sección Inputs */}
        <div className="engagement-calculator-inputs">
          {mode === "seguidores" ? (
            <div className="engagement-input-group">
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
            <div className="engagement-input-group">
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
          <div className="engagement-input-group">
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
          <div className="engagement-input-group">
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
          <div className="engagement-input-group">
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
          <div className="engagement-input-group">
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

        {/* Separador visual */}
        <div className="engagement-calculator-separator" />

        {/* Sección Resultados */}
        <div className="engagement-calculator-results">
          <motion.div
            className="engagement-result-item"
            key={`total-${calculated.totalInteracciones}`}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="engagement-result-label">Total de interacciones</span>
            <span className="engagement-result-value">{formatNumber(calculated.totalInteracciones)}</span>
          </motion.div>
          <motion.div
            className={`engagement-result-item engagement-rate ${performance.className}`}
            key={`engagement-${calculated.engagement}`}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="engagement-result-label">Engagement Rate</span>
            <span className="engagement-result-value engagement-result-main">
              {calculated.engagement.toFixed(2)}%
            </span>
            <span className="engagement-result-interpretation">{performance.label}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EngagementCalculator;
