import '../assets/styles/dock.css';

export default function Dock({ links = [] }) {
    return (
        <div className="dock">
            <div className="dock-status">
                <span className="live-dot"></span>
                <span>Online</span>
            </div>

            {links.map((link, i) => (
                <a
                    key={i}
                    href={link.anchor}
                    className={link.cta ? "dock-cta" : "dock-link"}
                    data-cursor-hover
                >
                    {link.title}
                </a>
            ))}
        </div>
    );
}
