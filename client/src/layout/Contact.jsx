import ExternalForm from '../components/ExternalForms/ExternalForm'

import '../assets/styles/contact.css'

function Contact() {

  return(

    <div className="prefooter-container">
      <div className="pre-footer">
        <div className="grid-prefooter-container">
          <div className="contact-info-container">
            <div className="text-container">
              <h1>Contactanos</h1>
              <h1 className="hover-y">Ahora!</h1>
            </div>
            <picture>
              <source srcSet="/contact-home.webp" type="image/webp" />
              <source srcSet="/contact-home.png" type="image/png" />
              <img src="/assets/contact-home.png" alt="" className="contact-home" />
            </picture>
          </div>
          <div className="form-container">
            <ExternalForm/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;