import '../assets/styles/stats-band.css';
export default function StatsBand() {
    return (
        <>
            <section className="stats-band">
                <div className="stats-eyebrow">Trompo en números</div>
                <div className="stats-grid">
                    <div className="stat-cell reveal">
                        <div className="stat-big"><span className="counter" data-target="15">0</span><em>+</em></div>
                        <div className="stat-label-band">Años de experiencia<br/>en marketing digital</div>
                    </div>
                    <div className="stat-cell reveal">
                        <div className="stat-big"><span className="counter" data-target="10">0</span><em>+</em></div>
                        <div className="stat-label-band">Años operando<br/>como Trompo Agencia</div>
                    </div>
                    <div className="stat-cell reveal">
                        <div className="stat-big"><span className="counter" data-target="80">0</span><em>+</em></div>
                        <div className="stat-label-band">Marcas argentinas<br/>en nuestra trayectoria</div>
                    </div>
                    <div className="stat-cell reveal">
                        <div className="stat-big">G<em>·</em>P</div>
                        <div className="stat-label-band">Google Partner<br/>Certified desde el inicio</div>
                    </div>
                </div>
            </section>
        </>
    );
}
