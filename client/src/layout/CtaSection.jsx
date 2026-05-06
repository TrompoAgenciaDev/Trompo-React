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
                            Si compartís este<br />criterio, <em>conversemos.</em>
                        </h2>
                        <p className="reveal">Sin propuestas cerradas de antemano. Sin promesas de resultados sin diagnóstico previo. Una conversación clara para entender el contexto, una recomendación profesional honesta y una decisión informada por ambas partes.</p>
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
