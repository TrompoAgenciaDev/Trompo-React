import '../assets/styles/footer.css';
export default function Footer() {
    return (
        <>
            <footer>
                <div className="footer-top">
                    <div className="footer-brand-col">
                        <div className="footer-logo">
                            Trompo
                        </div>
                        <div className="footer-tagline">Vanguardia digital · Córdoba</div>
                        <p className="footer-desc">
                            Marketing para marcas que mueven el negocio. Diez años de operación desde Córdoba con clientes en toda Argentina.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-col-h">Institucional</h4>
                        <ul className="footer-list">
                            <li><a href="#" data-cursor-hover>Inicio</a></li>
                            <li><a href="#nosotros" data-cursor-hover>Nosotros</a></li>
                            <li><a href="#contacto" data-cursor-hover>Contactanos</a></li>
                            <li><a href="#" data-cursor-hover>Términos</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-col-h">Sistema</h4>
                        <ul className="footer-list">
                            <li><a href="#" data-cursor-hover>Diseño</a></li>
                            <li><a href="#" data-cursor-hover>Multimedia</a></li>
                            <li><a href="#" data-cursor-hover>Desarrollo Web</a></li>
                            <li><a href="#" data-cursor-hover>Paid Media</a></li>
                            <li><a href="#" data-cursor-hover>Redes Sociales</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-col-h">Horarios</h4>
                        <ul className="footer-list">
                            <li>Lunes a Viernes</li>
                            <li>09:00 a 18:00 hs</li>
                            <li>&nbsp;</li>
                            <li><strong style={{ color: "var(--ink)" }}>Córdoba, Argentina</strong></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-base">
                    <span>© 2026 Trompo Agencia · Sistema digital v.2030.04</span>
                    <a href="mailto:somos@trompoagencia.com" data-cursor-hover>somos@trompoagencia.com</a>
                </div>
            </footer>
        </>
    );
}
