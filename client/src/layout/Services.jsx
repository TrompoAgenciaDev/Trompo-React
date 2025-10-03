import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/services.css";
import useFetchServices from "../hooks/useFetchServices";

function Services() {
  const { items, loading, error } = useFetchServices();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="full-container services  bg-yellow-2">
      <div className="banner full-container">
        <video
          src={`${import.meta.env.BASE_URL}assets/services/loop.mp4`}
          autoPlay
          muted
          loop
        ></video>
      </div>

      <div className="container services-link-container">
        <h1 className="services-title">
          Con más de 10 años de experiencia, diseñamos soluciones integrales a través de cinco <span className="secondary-font">pilares clave</span>:
        </h1>
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
