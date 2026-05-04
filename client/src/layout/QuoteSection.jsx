import '../assets/styles/quote-section.css';
export default function QuoteSection() {

  const base = import.meta.env.BASE_URL;

    return (
        <>
            <section className="quote-section" id="nosotros">
                <div className="quote-grid">
                    <div>
                        <div className="quote-mark reveal">"</div>
                        <p className="quote-text reveal">
                            Trabajamos para que cada peso
                            invertido en marketing empuje en 
                            <br/><strong>la misma dirección</strong> —
                            la del negocio.
                        </p>
                        <p className="quote-author reveal">Esteban Raparo · <span>Founder Trompo Agencia</span></p>
                    </div>

                    <div className="quote-founder-photo reveal">
                        <img src={`${base}assets/img/esteban.jpeg`} alt="Esteban Raparo, Founder" />
                        <div className="quote-founder-tag">15+ años · Google Certified</div>
                    </div>
                </div>
            </section>
        </>
    );
}
