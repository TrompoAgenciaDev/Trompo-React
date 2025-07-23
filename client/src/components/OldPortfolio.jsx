import useHoverBackground from "../hooks/useHoverBackground";
import PortfolioCarruselSection from "../components/PortfolioCarruselSection";

//styles
import "../assets/styles/portfolio-section.css";

const PortfolioSection = () => {
  const {
    backgroundImage,
    opacity,
  } = useHoverBackground();

  return (
    <div className="container portfolio-section">
      <div
        className="bg-section"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          opacity: backgroundImage ? opacity : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />


      <div className="portfolio-header">
        <h2 className="portfolio-title">Portfolio</h2>
        <p className="portfolio-excerpt">
          <br />
          SOMO UN EQUIPO INTERDISCIPLINARIO CON MAS DE 10 AÑOS
          <br />
          DE EXPERIENCIA, BRINDAMOS RESPUESTAS A TRAVES DE LAS
          <br />
          MEJORES HERRAMIENTAS PARA GESTIONAR LA PRESENCIA DE
          <br />
          TU MARCA EN EL MUNDO ONLINE. NOS ENFOCAMOS EN EN-TENDER
          <br />
          LOS OBJETOS DE TUS NEGOCIOS Y CREAMOS ESTRATEGIAS
          <br />
          PERSONALIZADAS QUE CONECTEN MARCAS CON AUDIENCIAS
          <br />
          ESTRATEGICAS
        </p>
      </div>

      <PortfolioCarruselSection/>
    </div>
  );
};

export default PortfolioSection;