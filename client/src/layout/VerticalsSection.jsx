import '../assets/styles/verticals.css';
export default function Verticals() {
    return (
        <>
            <section className="verticals" id="verticales">
                <div className="verticals-wrap">
                    <div className="verticals-header">
                        <div>
                            <div className="section-eyebrow reveal">03 · Industrias</div>
                            <h2 className="verticals-h reveal">
                                Sectores<br/>
                                en los que<br/>
                                <em>operamos.</em>
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
                            <p className="vertical-text">Agro, automotriz, transporte, autopartes, motos y maquinaria. La vertical más densa de nuestra cartera con más de 15 marcas activas.</p>
                            <div className="vertical-clients">Volvo · Denso · Super Walter · Kamax · Renault Trucks</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">02</div>
                            <h3 className="vertical-h">Servicios Financieros y Seguros</h3>
                            <p className="vertical-text">Bancos, fintech, seguros y prepagas. Comunicación que genera confianza y bancariza relación con el cliente.</p>
                            <div className="vertical-clients">Mercantil Andina · Western Union · CAMI · Femesa</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">03</div>
                            <h3 className="vertical-h">Hotelería y Turismo</h3>
                            <p className="vertical-text">Marca país, agencias de viaje, hoteles y experiencias. Marketing para inspirar la decisión de viaje y sostener la operación.</p>
                            <div className="vertical-clients">Buquebus · Argentina Late con Vos · Lozada · Ansenuza</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">04</div>
                            <h3 className="vertical-h">Salud y Belleza</h3>
                            <p className="vertical-text">Clínicas, centros de diagnóstico, estética médica y distribuidoras del sector. Captación de pacientes con criterio y compliance.</p>
                            <div className="vertical-clients">CEDIR · Clínica del Cerro · IMER · Korper</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">05</div>
                            <h3 className="vertical-h">Alimentos y Bebidas</h3>
                            <p className="vertical-text">Industria, retail y consumo masivo. Branding y performance para sostener la posición en góndola y digital.</p>
                            <div className="vertical-clients">Molino Cañuelas · Gaseosa Secco · 9 de Oro · Ardu Café</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">06</div>
                            <h3 className="vertical-h">Construcción y Hogar</h3>
                            <p className="vertical-text">Materiales, viviendas, mobiliario y decoración. Marketing para ciclos largos de decisión de compra B2B y B2C.</p>
                            <div className="vertical-clients">Mosaicos Blangino · Cerroplast · Viviendas Canadienses</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">07</div>
                            <h3 className="vertical-h">Indumentaria y Calzado</h3>
                            <p className="vertical-text">Marcas locales y diseño argentino. Presencia digital alineada a tendencias, e-commerce y comunidad.</p>
                            <div className="vertical-clients">AF Jeans · Batistella · Agostino · Guanaco</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">08</div>
                            <h3 className="vertical-h">Educación</h3>
                            <p className="vertical-text">Institutos, idiomas y formación profesional. Captación de matrículas y posicionamiento institucional sostenido.</p>
                            <div className="vertical-clients">CEICOS · Instituto Saber · Higland School</div>
                        </a>

                        <a href="#" className="vertical-card reveal" data-cursor-hover>
                            <div className="vertical-num">09</div>
                            <h3 className="vertical-h">Tecnología y Software</h3>
                            <p className="vertical-text">SaaS, soluciones tecnológicas y servicios digitales. Marketing B2B para ciclos de venta complejos y técnicos.</p>
                            <div className="vertical-clients">Starlight · Viditec · Ranko</div>
                        </a>

                    </div>
                </div>
            </section>
        </>
    );
}
