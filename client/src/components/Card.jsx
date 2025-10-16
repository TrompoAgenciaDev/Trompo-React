// import { useHover } from "../context/HoverContext";
import LazyImage from "./LazyImage";
import '../assets/styles/card.css';

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
          src="./card-footer.webp" 
          alt={title}
          placeholder="#f0f0f0"
        />
      </div>
    </div>
  );
}

export default Card;