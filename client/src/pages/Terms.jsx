import "../assets/styles/terms-conditions.css";

function Terms() {
  return (
    <>
      <div className="full-container black-bg hero-terms-container">
        <div className="container">
          <div className="terms-service-title-container">
            <h2>Términos</h2>
            <h2>Términos</h2>
            <h2>Términos</h2>
            <h2>Términos</h2>
          </div>
        </div>
        <div className="container terms-title-container">
          <h1 className="terms-main-title">Términos y Condiciones</h1>
        </div>
      </div>

      <div className="full-container white-bg terms-content-container">
        <div className="container terms-content">
          <section className="terms-section">
            <h1 className="terms-title">Términos y Condiciones Generales</h1>

            <ul className="terms-list">
              <li className="terms-item">
                <h2 className="terms-subtitle">1. Ámbito de aplicación</h2>
                <p className="terms-paragraph">
                  Estos Términos y Condiciones regulan la prestación de servicios de
                  marketing digital, branding y desarrollo web por parte de Trompo
                  Agencia. Su aceptación es obligatoria desde el primer contacto,
                  presupuesto o entrega de material.
                </p>
              </li>

              <li className="terms-item">
                <h2 className="terms-subtitle">2. Propiedad Intelectual</h2>
                <p className="terms-paragraph">
                  Todas las ideas, conceptos, bocetos, presentaciones, demos y
                  presupuestos generados por Trompo Agencia son de nuestra exclusiva
                  titularidad. Queda prohibida su reproducción, distribución o uso
                  sin autorización.
                </p>
              </li>

              <li className="terms-item">
                <h2 className="terms-subtitle">3. Alcance de los servicios</h2>
                <p className="terms-paragraph">
                  Cada servicio se describe en el acuerdo o presupuesto aprobado.
                  Cualquier trabajo adicional se cotiza y aprueba por separado.
                </p>
              </li>

              <li className="terms-item">
                <h2 className="terms-subtitle">4. Revisión y cambios</h2>
                <p className="terms-paragraph">
                  Incluimos "X" rondas de ajustes según lo pactado; los extras se
                  facturan aparte. El cliente revisa y aprueba el material antes de
                  su publicación o implementación.
                </p>
              </li>

              <li className="terms-item">
                <h2 className="terms-subtitle">5. Formas y plazos de pago</h2>
                <ul className="terms-sublist">
                  <li>
                    Servicios puntuales: pago a 30 días corridos contra factura.
                  </li>
                  <li>
                    Servicios recurrentes: abonarse entre el 1 y el 10 de cada mes.
                  </li>
                  <li>Mora genera intereses al tipo activo del Banco Nación.</li>
                </ul>
              </li>

              <li className="terms-item">
                <h2 className="terms-subtitle">6. Responsabilidad limitada</h2>
                <p className="terms-paragraph">
                  No respondemos por resultados comerciales, daños indirectos ni
                  decisiones estratégicas del cliente.
                </p>
              </li>

              <li className="terms-item">
                <h2 className="terms-subtitle">7. Propiedad y liberación de cuentas Ads</h2>
                <p className="terms-paragraph">
                  Las cuentas Ads creadas y configuradas por Trompo Agencia son de
                  nuestra titularidad hasta su liberación, cuyo costo se define en
                  contrato.
                </p>
                <p className="terms-paragraph">
                  Las cuentas preexistentes del cliente siguen siendo su propiedad y
                  él decide accesos.
                </p>
              </li>

              <li className="terms-item">
                <h2 className="terms-subtitle">8. Cancelación</h2>
                <p className="terms-paragraph">
                  Se requiere aviso con 30 días de anticipación para dar por
                  finalizado cualquier servicio recurrente; de lo contrario, se
                  facturará el mes siguiente.
                </p>
              </li>

              <li className="terms-item">
                <h2 className="terms-subtitle">9. Jurisdicción</h2>
                <p className="terms-paragraph">
                  Toda disputa se dirime en los tribunales de la Ciudad Autónoma de
                  Buenos Aires.
                </p>
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h1 className="terms-title">Aviso Legal y Política de Privacidad</h1>
            <p className="terms-paragraph">
              Trompo Agencia cumple con la normativa argentina de protección de
              datos y, de ser aplicable, con el RGPD europeo.
            </p>
            <p className="terms-paragraph">
              Los datos recabados (formularios, cookies, leads) se usan
              exclusivamente para fines de prestación de servicio y no se cederán a
              terceros sin consentimiento.
            </p>
            <p className="terms-paragraph">
              Los usuarios tienen derecho de acceso, rectificación, cancelación y
              oposición (ARCO) escribiendo a{" "}
              <a href="mailto:somos@trompoagencia.com" className="terms-link">
                somos@trompoagencia.com
              </a>
            </p>
          </section>

          <section className="terms-section">
            <h1 className="terms-title">Cláusula de No Exclusividad</h1>
            <p className="terms-paragraph">
              El cliente reconoce y acepta que Trompo Agencia puede prestar
              servicios similares a empresas del mismo sector, salvo pacto expreso y
              por escrito que establezca carácter exclusivo.
            </p>
          </section>

          <section className="terms-section">
            <h1 className="terms-title">Cláusula de Suspensión</h1>
            <p className="terms-paragraph">
              En caso de falta de pago en los plazos acordados, Trompo Agencia podrá
              suspender de inmediato la prestación de servicios hasta la
              regularización de los importes adeudados, sin perjuicio de iniciar
              acciones legales para el cobro.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default Terms;
