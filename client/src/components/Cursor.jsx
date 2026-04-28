import '../assets/styles/cursor.css';
import { useEffect } from 'react';

export default function Cursor() {
    useEffect(() => {
        const cursor = document.getElementById('cursor');
        const trail = document.getElementById('cursor-trail');
        const coord = document.getElementById('cursor-coord');

        if (!cursor || !trail || !coord) return;

        let mouseX = 0;
        let mouseY = 0;
        let trailX = 0;
        let trailY = 0;
        let rafId;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            coord.style.transform = `translate(${mouseX + 18}px, ${mouseY + 18}px)`;
            coord.textContent = `x:${mouseX.toString().padStart(4, '0')} / y:${mouseY.toString().padStart(4, '0')}`;
        };

        const animateTrail = () => {
            trailX += (mouseX - trailX) * 0.18;
            trailY += (mouseY - trailY) * 0.18;
            trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
            rafId = requestAnimationFrame(animateTrail);
        };

        const hoverElements = document.querySelectorAll('[data-cursor-hover]');
        const addHover = () => cursor.classList.add('hover');
        const removeHover = () => cursor.classList.remove('hover');

        document.addEventListener('mousemove', handleMouseMove);
        hoverElements.forEach((el) => {
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', removeHover);
        });

        animateTrail();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            hoverElements.forEach((el) => {
                el.removeEventListener('mouseenter', addHover);
                el.removeEventListener('mouseleave', removeHover);
            });
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <>
            <div className="cursor" id="cursor"></div>
            <div className="cursor-trail" id="cursor-trail"></div>
            <div className="cursor-coord" id="cursor-coord">x:0 / y:0</div>
        </>
    );
}
