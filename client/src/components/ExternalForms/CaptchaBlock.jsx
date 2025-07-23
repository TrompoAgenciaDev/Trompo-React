import React, { useEffect } from 'react';

const CaptchaBlock = () => {
  useEffect(() => {
    // Función para manejar la respuesta del reCAPTCHA
    const handleCaptchaResponse = () => {
      const event = new Event('captchaChange');
      document.getElementById('sib-captcha').dispatchEvent(event);
    };

    // Asignar la función al ámbito global para que reCAPTCHA pueda llamarla
    window.handleCaptchaResponse = handleCaptchaResponse;

    // Cargar el script de reCAPTCHA
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?hl=es';
    script.async = true;
    document.body.appendChild(script);

    
    return () => {
      document.body.removeChild(script);
      delete window.handleCaptchaResponse;
    };
  }, []);

  return (
    <div style={{ padding: '8px 0' }}>
      <div className="sib-captcha sib-form-block">
        <div className="form__entry entry_block">
          <div className="form__label-row form__label-row--horizontal">
            {/* reCAPTCHA */}
            <div
              className="g-recaptcha sib-visible-recaptcha"
              id="sib-captcha"
              data-sitekey="6LfisDkoAAAAAFIZ8MptwMl2XB2Nn_LVtE1tUV2n"
              data-callback="handleCaptchaResponse"
              style={{ direction: 'ltr' }}
            ></div>
          </div>
          <label
            className="entry__error entry__error--primary"
            style={{
              fontSize: '16px',
              textAlign: 'left',
              fontFamily: 'Helvetica, sans-serif',
              color: '#661d1d',
              backgroundColor: '#ffeded',
              borderRadius: '3px',
              borderColor: '#ff4949',
            }}
          ></label>
        </div>
      </div>
    </div>
  );
};

export default CaptchaBlock;