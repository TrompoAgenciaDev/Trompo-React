import { useState } from "react";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo";

//styles
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Google = () => {
  const [activeTab, setActiveTab] = useState("graficos");

  const tabs = [
    { id: "busqueda", label: "Anuncios de búsqueda" },
    { id: "graficos", label: "Anuncios Gráficos" },
    { id: "video", label: "Anuncios de video" },
  ];

  // Contenido para cada tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "busqueda":
        return (
          <div className="tab-content">
            <h2>Anuncios de búsqueda</h2>
            <p>Contenido para anuncios de búsqueda...</p>
          </div>
        );
      case "graficos":
        return (
          <div className="tab-content">
            <h2>Anuncios Gráficos</h2>
            <p>Contenido para anuncios gráficos...</p>
          </div>
        );
      case "video":
        return (
          <div className="tab-content">
            <h2>Anuncios de video</h2>
            <p>Contenido para anuncios de video...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/creatividad-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/creatividad-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/creatividad-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/creatividad-hero-mobile-poster.webp`}
      />

      <div className="full-container">
        <div className="container title-container">
          [Estrategia]
          <svg xmlns="http://www.w3.org/2000/svg" width={110} height={101} viewBox="0 0 110 101" fill="none">
            <path d="M37.4324 12.6788C38.4956 9.88269 39.9575 7.3085 42.1282 5.22252C50.8112 -3.25454 65.1646 -1.12418 71.0566 9.52763C75.4866 17.6053 80.1825 25.5053 84.7455 33.4942L107.605 73.3497C113.94 84.4897 107.073 98.559 94.4916 100.467C86.7833 101.621 79.5623 98.0708 75.5752 91.1471L55.4627 56.1737C55.3298 55.9074 55.1526 55.6855 54.9754 55.4636C54.2666 54.8866 53.9565 54.0433 53.5135 53.2888L38.7171 27.5913C36.9894 24.5733 36.192 21.289 36.2806 17.8272C36.4135 16.0519 36.635 14.2766 37.4324 12.6788Z" fill="#3C8BD9"/>
            <path d="M37.4347 12.6788C37.0359 14.2766 36.6815 15.8744 36.5929 17.5609C36.46 21.289 37.3903 24.7509 39.251 27.9908L53.8259 53.2445C54.2689 53.999 54.6233 54.7535 55.0663 55.4636L47.0479 69.2666L35.8398 88.6173C35.6626 88.6173 35.6183 88.5286 35.574 88.3954C35.5297 88.0404 35.6626 87.7297 35.7512 87.3746C37.5676 80.7172 36.0613 74.8144 31.4984 69.7548C28.7074 66.6924 25.1634 64.9615 21.0877 64.3845C15.7716 63.63 11.0758 65.0058 6.8672 68.3345C6.11409 68.9115 5.62678 69.7548 4.74077 70.1986C4.56357 70.1986 4.47496 70.1098 4.43066 69.9767L10.7657 58.9254L37.1245 13.167C37.2131 12.9895 37.346 12.8564 37.4347 12.6788Z" fill="#FABC04"/>
            <path d="M4.60629 70.1097L7.13142 67.8462C17.8965 59.3247 34.0662 65.4939 36.4142 78.9862C36.9901 82.2261 36.68 85.3329 35.7053 88.4397C35.661 88.706 35.6167 88.9279 35.5281 89.1942C35.1294 89.9043 34.775 90.6588 34.332 91.3689C30.3893 97.8931 24.5859 101.133 16.9662 100.645C8.23894 100.024 1.37234 93.4549 0.176222 84.7559C-0.399687 80.5396 0.442026 76.5895 2.61276 72.9502C3.05576 72.1513 3.58737 71.4412 4.07468 70.6423C4.29618 70.4647 4.20758 70.1097 4.60629 70.1097Z" fill="#34A852"/>
            <path d="M4.60747 70.1097C4.43027 70.2872 4.43027 70.5979 4.12017 70.6422C4.07587 70.3316 4.25307 70.154 4.43027 69.9321L4.60747 70.1097Z" fill="#FABC04"/>
            <path d="M35.528 89.1941C35.3508 88.8834 35.528 88.6615 35.7052 88.4396L35.8824 88.6171L35.528 89.1941Z" fill="#E1C025"/>
          </svg>
        </div>
        <div className="container grid-container">
          <div className="container">
            <div className="title-google">
              <h1>Empieza a convertir nuevos clientes con Google Ads</h1>
              <p>
                Llega a millones de personas en Google con campañas de máximo rendimiento. Capta más ventas en la Búsqueda, YouTube, Gmail y más, todo desde una sola campaña.
              </p>
            </div>
          </div>
          <div className="container">
          <svg xmlns="http://www.w3.org/2000/svg" width={253} height={253} viewBox="0 0 253 253" fill="none">
            <path
              d="M129.191 61.9043L129.191 193.787M129.191 193.787L193.787 127.846M129.191 193.787L64.5956 127.846"
              stroke="#1D1D1B"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </div>
        </div>
      </div>

      <div className="full-container">
        <div className="container tabs">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="full-container tab-content-container">
        <div className="container">
          {renderTabContent()}
        </div>
      </div>

      <Faqs location="estrategia" />

      <Contact form="estrategia" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Google;
