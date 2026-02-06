// import { useHover } from "../context/HoverContext";
import LazyImage from "./LazyImage";
import '../assets/styles/card.css';

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

function Card({ title, subtitle, description, className, id }) {
  
  // const { handleHover, handleLeave } = useHover();
  return (
    <div className={`card stikcy ${className}`}
      // onMouseEnter={() => handleHover(id)}
      // onMouseLeave={handleLeave}
    >
      <div className="card-header">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>
      <div className="card-body">        
        <p>{description}</p>
      </div>
      <div className="card-footer">
        <LazyImage 
          src={`${base}card-footer.webp`} 
          alt={title}
          placeholder="#f0f0f0"
          width={400}
          height={300}
        />
      </div>
    </div>
  );
}

export default Card;