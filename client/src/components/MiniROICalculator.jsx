import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import "../assets/styles/Calculators.css";

/**
 * MiniROIBlock - Calculadora de ROI mensual para inversión publicitaria
 * Componente autocontenido con cálculos en tiempo real
 */
const MiniROICalculator = ({ onClose }) => {
  const [inversion, setInversion] = useState("");
  const [cpl, setCpl] = useState("");
  const [tasaCierre, setTasaCierre] = useState("");
  const [ticket, setTicket] = useState("");

  // Parsear valores numéricos (vacío = 0, evita NaN)
  const parseNum = (val) => {
    if (val === "" || val === null || val === undefined) return 0;
    const n = parseFloat(String(val).replace(/,/g, "."));
    return isNaN(n) ? 0 : Math.max(0, n);
  };

  const inv = parseNum(inversion);
  const cplVal = parseNum(cpl);
  const tasa = parseNum(tasaCierre);
  const ticketVal = parseNum(ticket);

  // Cálculos en tiempo real
  const calculated = useMemo(() => {
    // Evitar división por cero
    const leads = cplVal > 0 ? inv / cplVal : 0;
    const ventas = leads * (tasa / 100);
    const ingresos = ventas * ticketVal;
    const roi = inv > 0 ? ((ingresos - inv) / inv) * 100 : 0;

    return {
      leads: Math.round(leads * 100) / 100,
      ventas: Math.round(ventas * 100) / 100,
      ingresos: Math.round(ingresos * 100) / 100,
      roi: Math.round(roi * 100) / 100,
    };
  }, [inv, cplVal, tasa, ticketVal]);

  // Formatear como moneda ARS
  const formatARS = (n) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  // Validación: solo números en inputs
  const handleNumericChange = (setter, value) => {
    const cleaned = (value || "").replace(/[^0-9.,]/g, "").replace(",", ".");
    setter(cleaned);
  };

  const roiMessage = calculated.roi > 0
    ? "El modelo es escalable. El siguiente paso es optimizar y amplificar."
    : "La estructura puede mejorarse. Ajustemos variables antes de invertir más.";

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

        <div className="header-card roi">
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
              <h2>Simulador de Rentabilidad Publicitaria</h2>
              <h3 className="subtitle-text-calculator">Proyectá el impacto real de tu inversión en medios.</h3>
              <div className="description-container">
                <p className="desktop-text">Antes de escalar una campaña, entendemos la ecuación completa.</p>
                <p className="desktop-text">Este simulador te permite visualizar cómo influyen variables clave como inversión, CPL, tasa de cierre y ticket promedio en tu rentabilidad proyectada.</p>
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
            {/* Toggle Seguidores / Alcance */}
            <p className="desktop-text" style={{marginBottom:"20px"}}>Ingresá tu alcance mensual estimado y tasa de interacción promedio. Visualizá cómo podría traducirse en oportuniades reales.</p>
                    
            {/* Sección Inputs */}
            <div className="calculator-inputs roi">
              <div className="input-group">
                <label htmlFor="inversion">Inversión mensual</label>
                <input
                  id="inversion"
                  type="text"
                  inputMode="decimal"
                  value={inversion}
                  onChange={(e) => handleNumericChange(setInversion, e.target.value)}
                  placeholder="1000000"
                />
              </div>
              <div className="input-group">
                <label htmlFor="cpl">CPL promedio</label>
                <input
                  id="cpl"
                  type="text"
                  inputMode="decimal"
                  value={cpl}
                  onChange={(e) => handleNumericChange(setCpl, e.target.value)}
                  placeholder="10000"
                />
              </div>
              <div className="input-group">
                <label htmlFor="tasa">Tasa de cierre (%)</label>
                <input
                  id="tasa"
                  type="text"
                  inputMode="decimal"
                  value={tasaCierre}
                  onChange={(e) => handleNumericChange(setTasaCierre, e.target.value)}
                  placeholder="10"
                />
              </div>
              <div className="input-group">
                <label htmlFor="ticket">Ticket promedio</label>
                <input
                  id="ticket"
                  type="text"
                  inputMode="decimal"
                  value={ticket}
                  onChange={(e) => handleNumericChange(setTicket, e.target.value)}
                  placeholder="300000"
                />
              </div>
            </div>

            {/* Sección Resultados */}
            <div className="calculator-results">
              <motion.div
                className="result-item"
                key={`leads-${calculated.leads}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="result-label">Leads generados</span>
                <span className="result-value">{calculated.leads.toLocaleString("es-AR")}</span>
              </motion.div>
              <motion.div
                className="result-item"
                key={`ventas-${calculated.ventas}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="result-label">Ventas</span>
                <span className="result-value">{calculated.ventas.toLocaleString("es-AR")}</span>
              </motion.div>
              <motion.div
                className="result-item"
                key={`ingresos-${calculated.ingresos}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="result-label">Ingresos</span>
                <span className="result-value result-ingresos">{formatARS(calculated.ingresos)}</span>
              </motion.div>
              <motion.div
                className={`result-item result-roi ${calculated.roi >= 0 ? "roi-positive" : "roi-negative"}`}
                key={`roi-${calculated.roi}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="result-label">ROI</span>
                <span className="result-value">{calculated.roi >= 0 ? "+" : ""}{calculated.roi}%</span>
              </motion.div>
            </div>

            <h5 className="result-message mobile" style={{marginBottom: "16px"}}>{roiMessage}</h5>
            <p className="mobile-text">Este simulador te permite visualizar cómo influyen variables clave como inversión, CPL, tasa de cierre y ticket promedio en tu rentabilidad proyectada.</p>
          </div>
        </div>

        <div className="bottom-card">
          <h5>¿Querés validar este escenario con datos reales?</h5>
          <a href="#contact" className="popup-close-back active" onClick={onClose}>Coordinar análisis estratégico</a>
        </div>
      </div>
    </>
  );
};

export default MiniROICalculator;
