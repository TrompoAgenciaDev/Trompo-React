import '../assets/styles/teamStrip.css';
export default function TeamStrip() {

    const base = import.meta.env.BASE_URL;

    return (
        <>
            <section className="team-strip" id="equipo">
                <div className="team-strip-header">
                    <div>
                        <div className="section-eyebrow reveal">04 · El equipo</div>
                        <h2 className="team-strip-h reveal">
                            Detrás de cada cuenta<br />hay un <span class="italic">equipo</span><br />con criterio propio.
                        </h2>
                    </div>
                    <div className="team-strip-meta reveal">
                        <strong>13+</strong>
                        personas trabajando<br />
                        en oficina · Córdoba<br />
                        Lun a Vie · 09-18 hs
                    </div>
                </div>

                <div className="team-strip-grid">
                    <div className="team-card reveal" data-cursor-hover>
                        <img src={`${base}assets/img/home/estrategia.jpeg`} alt="Equipo en reunión" />
                        <div className="team-card-label">Estrategia · planificación semanal</div>
                    </div>
                    <div className="team-card reveal" data-cursor-hover>
                        <img src={`${base}assets/img/home/disenio.jpeg`} alt="Equipo trabajando" />
                        <div className="team-card-label">Diseño · revisión con cliente</div>
                    </div>
                    <div className="team-card reveal" data-cursor-hover>
                        <img src={`${base}assets/img/home/produccion.jpeg`} alt="Equipo en colaboración" />
                        <div className="team-card-label">Producción · sprint en curso</div>
                    </div>
                    <div className="team-card reveal" data-cursor-hover>
                        <img src={`${base}assets/img/home/paid-media.jpeg`} alt="Equipo planificando" />
                        <div className="team-card-label">Paid Media · optimización de cuentas</div>
                    </div>
                    <div className="team-card reveal" data-cursor-hover>
                        <img src={`${base}assets/img/home/desarrollo.jpeg`} alt="Persona del equipo" />
                        <div className="team-card-label">Desarrollo · Code review</div>
                    </div>
                </div>
            </section>
        </>
    );
}
