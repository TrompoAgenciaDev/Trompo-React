import '../assets/styles/teamStrip.css';
export default function TeamStrip() {
    return (
        <>
            <section className="team-strip" id="equipo">
                <div className="team-strip-header">
                    <div>
                        <div className="section-eyebrow reveal">04 · El equipo</div>
                        <h2 className="team-strip-h reveal">
                            Detrás de cada<br/>
                            marca, hay <em>un equipo</em><br/>
                            que la mueve.
                        </h2>
                    </div>
                    <div className="team-strip-meta reveal">
                        <strong>13+</strong>
                        personas trabajando<br/>
                        en oficina · Córdoba<br/>
                        Lun a Vie · 09–18 hs
                    </div>
                </div>

                <div className="team-strip-grid">
                    <div className="team-card reveal" data-cursor-hover>
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt="Equipo en reunión" />
                        <div className="team-card-label">Estrategia · Reunión semanal</div>
                    </div>
                    <div className="team-card reveal" data-cursor-hover>
                        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80" alt="Equipo trabajando" />
                        <div className="team-card-label">Diseño · Iteración cliente</div>
                    </div>
                    <div className="team-card reveal" data-cursor-hover>
                        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80" alt="Equipo en colaboración" />
                        <div className="team-card-label">Producción · Sprint en curso</div>
                    </div>
                    <div className="team-card reveal" data-cursor-hover>
                        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="Equipo planificando" />
                        <div className="team-card-label">Paid Media · Optimización</div>
                    </div>
                    <div className="team-card reveal" data-cursor-hover>
                        <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80" alt="Persona del equipo" />
                        <div className="team-card-label">Desarrollo · Code review</div>
                    </div>
                </div>
            </section>
        </>
    );
}
