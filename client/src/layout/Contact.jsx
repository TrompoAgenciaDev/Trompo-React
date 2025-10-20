
import "../assets/styles/contact.css";
import FormIndex from "../components/forms/FormIndex";

const BGS = {
  home: "form.webp",
  contactanos: "contact-bg.webp", // Nueva imagen específica para contacto
  default: "form.webp", // Fallback
};

function Contact({ location = "home", form }) {
  const base = import.meta.env.BASE_URL;
  const key = String(location).toLowerCase();
  const file = BGS[key] || BGS.default;
  const bg = `url(${base}assets/contact/${file})`;

  return (
    <section
      id="contact"
      className="full-container contact-section"
      style={{ backgroundImage: bg }}
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
              <h1>
                Hablemos de lo que tu marca necesita. 
              </h1>
              <p>
                Cada proyecto es único. Completá el formulario y diseñemos la estrategia que tu marca necesita para evolucionar
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
