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

                        <FormIndex location="home" />
                    </div>
                </div>
            </section>
        </>
    );
}
