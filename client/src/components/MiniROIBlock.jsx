import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import "./MiniROIBlock.css";

/**
 * MiniROIBlock - Calculadora de ROI mensual para inversión publicitaria
 * Componente autocontenido con cálculos en tiempo real
 */
const MiniROIBlock = () => {
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
    const cleaned = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setter(cleaned);
  };

  return (
    <div className="roi-calculator-block bg-yellow-2">
      <div className="roi-calculator-header">
        <h3 className="roi-calculator-title">MINI ROI BLOCK</h3>
        <p className="roi-calculator-subtitle">Calculá el potencial de tu inversión</p>
      </div>

      <div className="roi-calculator-body">
        {/* Sección Inputs */}
        <div className="roi-calculator-inputs">
          <div className="roi-input-group">
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
          <div className="roi-input-group">
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
          <div className="roi-input-group">
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
          <div className="roi-input-group">
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

        {/* Separador visual */}
        <div className="roi-calculator-separator" />

        {/* Sección Resultados */}
        <div className="roi-calculator-results">
          <motion.div
            className="roi-result-item"
            key={`leads-${calculated.leads}`}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="roi-result-label">Leads generados</span>
            <span className="roi-result-value">{calculated.leads.toLocaleString("es-AR")}</span>
          </motion.div>
          <motion.div
            className="roi-result-item"
            key={`ventas-${calculated.ventas}`}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="roi-result-label">Ventas</span>
            <span className="roi-result-value">{calculated.ventas.toLocaleString("es-AR")}</span>
          </motion.div>
          <motion.div
            className="roi-result-item"
            key={`ingresos-${calculated.ingresos}`}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="roi-result-label">Ingresos</span>
            <span className="roi-result-value roi-result-ingresos">{formatARS(calculated.ingresos)}</span>
          </motion.div>
          <motion.div
            className={`roi-result-item roi-result-roi ${calculated.roi >= 0 ? "roi-positive" : "roi-negative"}`}
            key={`roi-${calculated.roi}`}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="roi-result-label">ROI</span>
            <span className="roi-result-value">{calculated.roi >= 0 ? "+" : ""}{calculated.roi}%</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MiniROIBlock;
