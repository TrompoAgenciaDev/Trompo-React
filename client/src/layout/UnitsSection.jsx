import '../assets/styles/units.css';
export default function Units() {
    return (
        <>
            <section className="units" id="sistema">
                <div className="section-eyebrow reveal">02 · Cinco unidades</div>
                <h2 className="units-h reveal">
                    Cinco disciplinas<br/>
                    operando como un <em>sistema.</em>
                </h2>

                <div className="units-grid">
                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">01 / Diseño</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <h3 className="unit-h">Diseño</h3>
                        <p className="unit-text">Una marca visualmente desordenada compite con desventaja. La identidad no es decoración: es el primer activo de credibilidad que tiene un negocio.</p>
                    </div>

                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">02 / Multimedia</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <h3 className="unit-h">Multimedia</h3>
                        <p className="unit-text">La atención disponible es escasa. La producción audiovisual profesional es lo que diferencia a una marca recordable de una marca olvidable.</p>
                    </div>

                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">03 / Desarrollo Web</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2"/>
                            <path d="M8 21h8M12 17v4"/>
                        </svg>
                        <h3 className="unit-h">Desarrollo Web</h3>
                        <p className="unit-text">El sitio web es el punto de contacto digital más visitado del negocio. Tratarlo como folleto institucional es subutilizar el activo. Lo construimos como herramienta de venta.</p>
                    </div>

                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">04 / Paid Media</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>
                        </svg>
                        <h3 className="unit-h">Paid Media</h3>
                        <p className="unit-text">Cada peso de inversión publicitaria debe justificarse en términos de retorno. Las métricas que no se conectan con resultados de negocio carecen de utilidad operativa.</p>
                    </div>

                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">05 / Redes Sociales</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
                        </svg>
                        <h3 className="unit-h">Redes Sociales</h3>
                        <p className="unit-text">Las redes sociales son el canal de relación diaria con la audiencia. Operarlas sin estrategia subutiliza uno de los activos digitales más continuos del negocio.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
