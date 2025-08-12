import "../assets/styles/contact.css";
import FormIndex from "../components/forms/FormIndex";

function Contact() {
  return (
    <section className="full-container contact-section">
      <div className="container">
        <div className="grid-contact">
          <div className="grid-contact-item">
            <h1>
              Transformemos obstáculos en ventajas competitivas
            </h1>
          </div>
          <div className="grid-contact-item">
            <FormIndex />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
