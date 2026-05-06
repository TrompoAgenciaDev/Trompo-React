import '../assets/styles/intro-section.css';
export default function Intro() {
    return (
        <>
            <section className="intro">
                <div className="intro-grid">
                    <div className="intro-num reveal">
                        01
                        <small>Lo que sostenemos</small>
                    </div>
                    <div className="intro-text-block">
                        <h2 className="intro-h reveal">El marketing no es <span className="strike">un gasto.</span><br/>Es la <em>inversión</em> más directa<br/>al crecimiento del negocio.</h2>

                        <div className="intro-features">
                            <div className="intro-feature reveal">
                                <div className="intro-feature-num">A</div>
                                <div>
                                    <h3>Diagnóstico antes que propuesta</h3>
                                    <p>Una propuesta sin diagnóstico previo es una solución genérica aplicada a un problema específico. Entendemos el contexto primero. Recomendamos después. Esa es la disciplina.</p>
                                </div>
                            </div>
                            <div className="intro-feature reveal">
                                <div className="intro-feature-num">B</div>
                                <div>
                                    <h3>Dirección, no actividad</h3>
                                    <p>Producir mucho no equivale a avanzar. Definimos prioridades, ordenamos el roadmap y sostenemos la estrategia en el tiempo. La actividad sin dirección consume recursos sin generar resultado.</p>
                                </div>
                            </div>
                            <div className="intro-feature reveal">
                                <div className="intro-feature-num">C</div>
                                <div>
                                    <h3>Producción al servicio del negocio</h3>
                                    <p>Cada pieza producida cumple una función concreta dentro del sistema. No hacemos contenido decorativo ni piezas pensadas para el portfolio. El criterio es uno: ¿esto contribuye al negocio del cliente?</p>
                                </div>
                            </div>
                            <div className="intro-feature reveal">
                                <div className="intro-feature-num">D</div>
                                <div>
                                    <h3>Transparencia antes que reporte estético</h3>
                                    <p>Reportes hechos para decidir, no para archivar. Si algo no está funcionando, lo planteamos antes que nos pregunten. La transparencia metodológica es la base de cualquier relación profesional sostenida.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
