import '../assets/styles/quote-section.css';
export default function QuoteSection() {
    return (
        <>
            <section className="quote-section" id="nosotros">
                <div className="quote-grid">
                    <div>
                        <div className="quote-mark reveal">"</div>
                        <p className="quote-text reveal">
                            Trabajamos para que cada peso<br/>
                            invertido en marketing empuje<br/>
                            en <strong>la misma dirección</strong> —<br/>
                            la del negocio.
                        </p>
                        <p className="quote-author reveal">Esteban Raparo · <span>Founder Trompo Agencia</span></p>
                    </div>

                    <div className="quote-founder-photo reveal">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80" alt="Esteban Raparo, Founder" />
                        <div className="quote-founder-tag">15+ años · Google Certified</div>
                    </div>
                </div>
            </section>
        </>
    );
}
