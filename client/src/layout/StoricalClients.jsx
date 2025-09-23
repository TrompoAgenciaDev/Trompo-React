import { AnimatePresence, motion } from "motion/react";
import useStoricalClients from "../hooks/useStoricalClients";
import "../assets/styles/storical-clients.css";

function toLabel(key) {
  return String(key).trim();
}

export default function StoricalClients() {
  const {
    listCategories,
    selectedCategory,
    setSelectedCategory,
    clientsOfSelected,
    loading,
    error,
  } = useStoricalClients();

  if (loading) {
    return (
      <section className="full-container storical">
        <div className="storical-loading">Cargando…</div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="full-container storical">
        <div className="storical-error">
          Error al cargar: {String(error.message || error)}
        </div>
      </section>
    );
  }

  const categories = listCategories();

  return (
    <section className="full-container storical">
      <div className="title-historical-container">
        <h3>
          Trayectoria y Confianza:{" "}
          <strong>Las Empresas que Escribieron Nuestra Historia</strong>
        </h3>
        <p>
          Un vistazo a los diversos sectores que han depositado su confianza en
          nuestra agencia para lograr sus objetivos
        </p>
      </div>
      <div
        className="storical-tabs"
        role="tablist"
        aria-label="Categorías de clientes"
      >
        {categories.map((key) => {
          const active = key === selectedCategory;
          return (
            <motion.button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              className={`storical-tab ${active ? "is-active" : ""}`}
              onClick={() => setSelectedCategory(key)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <span className="storical-tab-label">{toLabel(key)}</span>
              {/* subrayado animado */}
              <AnimatePresence initial={false}>
                {active && (
                  <motion.span
                    className="storical-tab-underline"
                    layoutId="storical-underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Listado de clientes */}
      <div className="storical-panel" role="tabpanel">
        <AnimatePresence mode="popLayout">
          <motion.ul
            key={selectedCategory}
            className="storical-list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            layout
          >
            {clientsOfSelected.map(({ id, cliente }) => (
              <motion.li
                key={id + "-" + cliente}
                className="storical-item"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <span className="storical-bullet" aria-hidden="true" />
                <span className="storical-name">{cliente}</span>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
        <div className="legal-footer-historical">
          <p>
            <span>*</span>La presencia de una marca no implica relación
            comercial vigente al día de hoy.
          </p>
          <p>
            <span>*</span>El listado refleja colaboraciones históricas
            (proyectos, campañas y/o consultorías) en distintos períodos.
          </p>
        </div>
      </div>
    </section>
  );
}
