import { useEffect, useRef } from 'react';
import '../assets/styles/stats-band.css';

export default function StatsBand() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const counters = section.querySelectorAll('.counter');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                let current = 0;
                const increment = target / 35;

                const update = () => {
                    current += increment;

                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target;
                    }
                };

                update();
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach((counter) => observer.observe(counter));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="stats-band" ref={sectionRef}>
            <div className="stats-eyebrow">Trompo en números</div>

            <div className="stats-grid">
                <div className="stat-cell reveal">
                    <div className="stat-big">
                        <span className="counter" data-target="15">0</span><em>+</em>
                    </div>
                    <div className="stat-label-band">Años de experiencia<br />en marketing digital</div>
                </div>

                <div className="stat-cell reveal">
                    <div className="stat-big">
                        <span className="counter" data-target="10">0</span><em>+</em>
                    </div>
                    <div className="stat-label-band">Años operando<br />como Trompo Agencia</div>
                </div>

                <div className="stat-cell reveal">
                    <div className="stat-big">
                        <span className="counter" data-target="80">0</span><em>+</em>
                    </div>
                    <div className="stat-label-band">Marcas argentinas<br />en nuestra trayectoria</div>
                </div>

                <div className="stat-cell reveal">
                    <div className="stat-big">G<em>·</em>P</div>
                    <div className="stat-label-band">Google Partner<br />Certified desde el inicio</div>
                </div>
            </div>
        </section>
    );
}