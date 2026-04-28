import '../assets/styles/cta-section.css';
import FormIndex from '../components/forms/FormIndex';


export default function CtaSection() {
    return (
        <>
            <section className="cta-section" id="contacto">
                <div className="cta-bg-mega">Trompo</div>
                <div className="cta-wrap">
                    <div>
                        <div className="cta-eyebrow">06 · Conversemos</div>
                        <h2 className="cta-h">
                            Definamos tu<br />
                            <em>próximo paso</em><br />
                            estratégico.
                        </h2>
                        <p className="cta-sub">
                            Una conversación corta para entender cómo está hoy tu marketing y mostrarte cómo trabajamos. Sin propuesta cerrada, sin presión — diagnóstico genuino.
                        </p>
                    </div>

                    <div className="cta-form-card reveal">
                        <h3 className="cta-form-h">Completá el siguiente formulario.</h3>
                        <p className="cta-form-sub">Definamos tu próximo paso estratégico.</p>

                        <form>
                            <div className="form-group">
                                <label className="form-label">Ingresá tu nombre*</label>
                                <input type="text" className="form-input" placeholder="Nombre" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ingresá tu apellido*</label>
                                <input type="text" className="form-input" placeholder="Apellido" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ingresá tu email corporativo*</label>
                                <input type="email" className="form-input" placeholder="info@miempresa.com" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ingresá la URL de la empresa*</label>
                                <input type="url" className="form-input" placeholder="www.miempresa.com" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Describí brevemente tu consulta*</label>
                                <textarea className="form-textarea" placeholder="Tu consulta..."></textarea>
                            </div>
                            <button type="submit" className="form-submit">Enviar →</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
