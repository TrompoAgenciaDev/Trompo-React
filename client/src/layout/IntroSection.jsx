import '../assets/styles/intro-section.css';
export default function Intro() {
    return (
        <>
            <section className="intro">
                <div className="intro-grid">
                    <div className="intro-num reveal">
                        01
                        <small>Cómo trabajamos</small>
                    </div>
                    <div className="intro-text-block">
                        <h2 className="intro-h reveal">
                            No vendemos <span className="strike">campañas.</span><br/>
                            Construimos <em>sistemas</em><br/>
                            que mueven el negocio.
                        </h2>

                        <div className="intro-features">
                            <div className="intro-feature reveal">
                                <div className="intro-feature-num">A</div>
                                <div>
                                    <h3 className="intro-feature-h">Diagnóstico antes de propuesta</h3>
                                    <p className="intro-feature-text">Entendemos antes de ejecutar. Marca, negocio, contexto y audiencias bajo una misma lectura estratégica.</p>
                                </div>
                            </div>
                            <div className="intro-feature reveal">
                                <div className="intro-feature-num">B</div>
                                <div>
                                    <h3 className="intro-feature-h">Dirección, no tácticas sueltas</h3>
                                    <p className="intro-feature-text">Definimos rumbo, no acciones aisladas. Roadmap digital claro, prioridades bien ordenadas y foco en impacto real.</p>
                                </div>
                            </div>
                            <div className="intro-feature reveal">
                                <div className="intro-feature-num">C</div>
                                <div>
                                    <h3 className="intro-feature-h">Producción que activa</h3>
                                    <p className="intro-feature-text">Creamos activos que convierten. Diseño, contenido y desarrollo listos para escalar — nada decorativo, todo funcional.</p>
                                </div>
                            </div>
                            <div className="intro-feature reveal">
                                <div className="intro-feature-num">D</div>
                                <div>
                                    <h3 className="intro-feature-h">Optimización continua</h3>
                                    <p className="intro-feature-text">Medimos para crecer, no para reportar. Datos, decisiones y mejora continua orientada a resultados de negocio reales.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
