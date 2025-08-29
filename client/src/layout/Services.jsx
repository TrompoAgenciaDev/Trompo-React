import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/services.css";
import useFetchServices from "../hooks/useFetchServices";

function Services() {
  const { items, loading, error } = useFetchServices();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="bg-yellow full-container services">
      <div className="banner full-container">
        <picture className="full-container mobile-banner">
          <source
            srcSet={`${
              import.meta.env.BASE_URL
            }assets/services/services-bg.webp`}
            type="image/webp"
          />
          <img
            src={`${import.meta.env.BASE_URL}assets/services/services-bg.webp`}
            alt="Banner Home"
          />
        </picture>
        <picture className="full-container desktop-banner">
          <source
            srcSet={`${
              import.meta.env.BASE_URL
            }assets/services/services-bg.webp`}
            type="image/webp"
          />
          <img
            src={`${import.meta.env.BASE_URL}assets/services/services-bg.webp`}
            alt="Banner Home"
          />
        </picture>
      </div>

      <div className="container">
        <p className="services-text">
          Con un Equipo interdisciplinario y años de experiencia, nos
          especializamos en entender las necesidades de cada cliente y
          convertirlas en <span className="bold">oportunidades</span> que
          impulsen su crecimiento.
        </p>
      </div>

      <div className="container">
        <div className="grid-services">
          {items.map((item) => {
            const content = (
              <div className="service-grid">
                <span className="service-title-grid">
                  <span className="title-grid title-grid-hover">
                    {item.title}
                    <span className="title-grid title-grid-hover hover-show">
                      {item.subtitle}
                    </span>
                  </span>
                </span>
                <div className="content-text-grid hover-show">
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 19.0001H36.5M36.5 19.0001L19 1.79175M36.5 19.0001L19 36.2084"
                      stroke="#1E1E1E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            );
            return (
              <Link
                to={item.service}
                className="service-section-row"
                key={item.id}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
