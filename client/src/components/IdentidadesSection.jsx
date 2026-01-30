import "../assets/styles/identidades-section.css";

const IdentidadesSection = ({ 
  backgroundClass = "black-bg"
}) => {
  return (
    <div className={`full-container ${backgroundClass}`}>
      <div className="container identidades">
        <div className="card-identidades">
          <h3>Las marcas son identidades vivas.</h3>
          <p>Nuestro propósito es concebirlas y cultivarlas desde su núcleo más auténtico. A través de un sistema de marca sólido, construimos el fundamento estratégico y visual que permite a las empresas posicionarse con claridad, diferenciarse con fuerza y potenciar su activo más valioso: su identidad en el mundo.</p>
        </div>
        <div className="span-identidades">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default IdentidadesSection;
