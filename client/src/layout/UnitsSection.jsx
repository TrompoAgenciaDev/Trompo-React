import '../assets/styles/units.css';
export default function Units() {
    return (
        <>
            <section className="units" id="sistema">
                <div className="section-eyebrow reveal">02 · Sistema integrado</div>
                <h2 className="units-h reveal">
                    Cinco unidades<br/>
                    que <em>trabajan como una.</em>
                </h2>

                <div className="units-grid">
                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">01 / Diseño</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <h3 className="unit-h">Diseño</h3>
                        <p className="unit-text">Identidad y sistema visual que ordena, diferencia y profesionaliza la marca en cada punto de contacto.</p>
                    </div>

                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">02 / Multimedia</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <h3 className="unit-h">Multimedia</h3>
                        <p className="unit-text">Motion, edición y producción audiovisual para comunicar con impacto y humanizar la marca.</p>
                    </div>

                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">03 / Desarrollo Web</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2"/>
                            <path d="M8 21h8M12 17v4"/>
                        </svg>
                        <h3 className="unit-h">Desarrollo Web</h3>
                        <p className="unit-text">Sitios y plataformas que posicionan, convierten y escalan. Performance técnica al servicio del negocio.</p>
                    </div>

                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">04 / Paid Media</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>
                        </svg>
                        <h3 className="unit-h">Paid Media</h3>
                        <p className="unit-text">Google, Meta, LinkedIn Ads, performance y posicionamiento. Inversión publicitaria que devuelve negocio.</p>
                    </div>

                    <div className="unit reveal" data-cursor-hover>
                        <div className="unit-num">05 / Redes Sociales</div>
                        <svg className="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
                        </svg>
                        <h3 className="unit-h">Redes Sociales</h3>
                        <p className="unit-text">Contenido, comunidad y narrativa diaria que construye cultura de marca y sostiene relación con la audiencia.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
