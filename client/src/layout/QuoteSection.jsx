import '../assets/styles/quote-section.css';
export default function QuoteSection() {

    const base = import.meta.env.BASE_URL;

    return (
        <>
            <section className="quote-section" id="nosotros">
                <div className="quote-grid">
                    <div>
                        <div className="quote-mark reveal">"</div>
                        <p className="quote-text reveal">Trabajamos el marketing como creemos que <strong>debe trabajarse:</strong> con diagnóstico previo, con criterio profesional y con foco en el negocio del cliente. No hay otro estándar aceptable para nosotros.</p>
                        <p className="quote-author reveal">Equipo Trompo · <span>Trece profesionales, un mismo criterio</span></p>
                    </div>

                    <div className="quote-founder-photo reveal">
                        <img src={`${base}assets/img/esteban.jpeg`} alt="Esteban Raparo, Founder" />
                        <div className="quote-founder-tag">Equipo Trompo · operando desde 2016</div>
                    </div>
                </div>
            </section>
        </>
    );
}