import '../assets/styles/trompo-3d.css';

export default function Trompo3D() {
    return (
        <>
            <section className="trompo-3d">
                <div>
                    <div className="trompo-3d-eyebrow">Le damos un giro</div>
                    <h2 className="trompo-3d-h">
                        Cinco unidades<br />
                        empujando en<br />
                        <em>la misma dirección.</em>
                    </h2>
                    <p>
                        Detrás de cada marca con la que trabajamos hay un equipo coordinado: estrategia, diseño, producción y performance funcionando como un sistema, no como áreas separadas.
                    </p>
                    <p>
                        Diseño, multimedia, desarrollo web, paid media y redes sociales — coordinados para mover el negocio del cliente.
                    </p>
                    <div className="trompo-3d-hint">Equipo en oficina · Córdoba</div>
                </div>

                <div id="trompo-canvas-wrap" data-cursor-hover>
                    <div className="trompo-3d-corners"></div>
                    <video className="trompo-video" autoPlay muted loop playsInline>
                        <source src="https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                    </video>
                    <div className="trompo-video-overlay"></div>
                    <div className="trompo-video-tag">
                        <span>Equipo en oficina · Córdoba</span>
                    </div>
                </div>
            </section>
        </>
    );
}
