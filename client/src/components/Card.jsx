// import { useHover } from "../context/HoverContext";
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
        <img src="./card-footer.png" alt={title} />
      </div>
    </div>
  );
}

export default Card;