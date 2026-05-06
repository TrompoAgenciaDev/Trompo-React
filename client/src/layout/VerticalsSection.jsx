import '../assets/styles/verticals.css';
export default function Verticals() {
    return (
        <>
            <section className="verticals" id="verticales">
                <div className="verticals-wrap">
                    <div className="verticals-header">
                        <div>
                            <div className="section-eyebrow reveal">03 · Sectores</div>
                            <h2 className="verticals-h reveal">
                                Sectores en los<br/>
                                que <em>operamos.</em>
                            </h2>
                        </div>
                        <div className="verticals-meta reveal">
                            <strong>9</strong>
                            verticales activas<br/>
                            con cartera consolidada<br/>
                            en cada sector
                        </div>
                    </div>

                    <div className="verticals-grid">

                        <a href="#" className="vertical-card feat reveal" data-cursor-hover>
                            <div className="vertical-num">01 / Vertical destacada</div>
                            <h3 className="vertical-h">Industrias del Movimiento</h3>
                            <p className="vertical-text">Agro, automotriz, transporte, autopartes, motos y maquinaria. La vertical más densa de la cartera: más de 15 marcas industriales activas.</p>
                            <div className="vertical-clients">Volvo · Denso · Super Walter · Kamax · Renault Trucks</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">02</div>
                            <h3 className="vertical-h">Servicios Financieros y Seguros</h3>
                            <p className="vertical-text">Bancos, fintech, seguros y prepagas. Sectores donde la confianza es parte del producto. La creatividad debe ir acompañada de rigor metodológico.</p>
                            <div className="vertical-clients">Mercantil Andina · Western Union · CAMI · Femesa</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">03</div>
                            <h3 className="vertical-h">Hotelería y Turismo</h3>
                            <p className="vertical-text">Hotelería, agencias de viaje y destinos. Comunicar experiencias requiere un tratamiento estratégico distinto al de productos tangibles.</p>
                            <div className="vertical-clients">Buquebus · Argentina Late con Vos · Lozada · Ansenuza</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">04</div>
                            <h3 className="vertical-h">Salud y Belleza</h3>
                            <p className="vertical-text">Clínicas, centros de diagnóstico y estética médica. Sectores donde cada palabra tiene impacto regulatorio y reputacional. La comunicación se trabaja con responsabilidad.</p>
                            <div className="vertical-clients">CEDIR · Clínica del Cerro · IMER · Korper</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">05</div>
                            <h3 className="vertical-h">Alimentos y Bebidas</h3>
                            <p className="vertical-text">Industria, retail y consumo masivo. Sostener una marca en góndola y en digital simultáneamente exige integración entre branding y performance.</p>
                            <div className="vertical-clients">Molino Cañuelas · Gaseosa Secco · 9 de Oro · Ardu Café</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">06</div>
                            <h3 className="vertical-h">Construcción y Hogar</h3>
                            <p className="vertical-text">Materiales, viviendas y mobiliario. Ciclos de decisión extendidos que requieren acompañamiento comunicacional sostenido a lo largo del recorrido del cliente.</p>
                            <div className="vertical-clients">Mosaicos Blangino · Cerroplast · Viviendas Canadienses</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">07</div>
                            <h3 className="vertical-h">Indumentaria y Calzado</h3>
                            <p className="vertical-text">Indumentaria local y diseño argentino. La integración de tendencia, ecommerce y comunidad es uno de los desafíos más exigentes del marketing actual.</p>
                            <div className="vertical-clients">AF Jeans · Batistella · Agostino · Guanaco</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">08</div>
                            <h3 className="vertical-h">Educación</h3>
                            <p className="vertical-text">Institutos, idiomas y formación profesional. Captación recurrente de matrículas sin saturar a la audiencia: un equilibrio que requiere planificación anual.</p>
                            <div className="vertical-clients">CEICOS · Instituto Saber · Higland School</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">09</div>
                            <h3 className="vertical-h">Tecnología y Software</h3>
                            <p className="vertical-text">SaaS, software y servicios técnicos. Marketing B2B para audiencias técnicamente formadas, donde subestimar al comprador equivale a perder la oportunidad comercial.</p>
                            <div className="vertical-clients">Starlight · Viditec · Ranko</div>
                        </a>
                        
                    </div>
                </div>
            </section>
        </>
    );
}
