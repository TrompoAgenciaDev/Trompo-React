import { motion } from "motion/react";
import "../../assets/styles/page-title.css";

function PageTitle({ title, highlight }) {
  const words = highlight ? highlight.split(" ") : [];

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const word = {
    hidden: { opacity: 0.1 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="full-container diagonal-page-title">
      <div className="full-container diagonal-title">
        <div className="container">
          <h1 className="title-page">{title}</h1>

          <motion.p
            className="content"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-200px", once: true }}
            variants={container}
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                style={{ display: "inline" }}
              >
                {w}
                {" "}
              </motion.span>
            ))}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default PageTitle;
