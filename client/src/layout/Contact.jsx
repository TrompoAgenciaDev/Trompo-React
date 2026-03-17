
import "../assets/styles/contact.css";
import FormIndex from "../components/forms/FormIndex";

function Contact({ location = "home", form }) {
  const base = import.meta.env.BASE_URL;

  const getBgStyle = () => {
    if (location === "contacto") {
      return {
        "--contact-bg-desktop": `url(${base}assets/img/contacto.webp)`,
        "--contact-bg-mobile": `url(${base}assets/img/contacto-mobile.webp)`,
      };
    }else{
      return { 
        "--contact-bg-desktop": `url(${base}assets/img/form.webp)`,
        "--contact-bg-mobile": `url(${base}assets/img/form-mobile.webp)`,
      };
    }
  };

  const sectionClass = location === "contacto"
    ? "full-container contact-section contact-section--contacto black-bg"
    : "full-container contact-section contact-section--form black-bg";

  return (
    <section
      id="contact"
      className={sectionClass}
      style={getBgStyle()}
    >
      <div className="container">
        <div className="grid-contact">
          <div className="grid-contact-item">
            <div className="grid-item-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="88"
                viewBox="0 0 90 88"
                fill="none"
              >
                <path
                  d="M87.2254 43.5033C87.2254 66.7491 68.3333 85.5936 45.0287 85.5936C21.7241 85.5936 2.83203 66.7491 2.83203 43.5033C2.83203 20.2575 21.7241 1.41309 45.0287 1.41309C68.3333 1.41309 87.2254 20.2575 87.2254 43.5033Z"
                  fill="white"
                />
                <path
                  d="M22.7793 42.4721L67.0287 42.4721M67.0287 42.4721L44.904 20.771M67.0287 42.4721L44.904 64.1732"
                  stroke="#1D1D1B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="grid-item-title">
              <h5>
                Completá el siguiente formulario.
              </h5>
              <p>
              Definamos tu próximo paso estratégico.
              </p>
            </div>
          </div>
          <div className="grid-contact-item">
            <FormIndex location={form}/>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;