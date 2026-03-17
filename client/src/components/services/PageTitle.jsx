import { motion } from "motion/react";
import "../../assets/styles/page-title.css";

function PageTitle({ title, subtitle = "", highlight = "", bgc = "#ffffff", location }) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const word = {
    hidden: { opacity: 0.1 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  function renderTitle(html) {
    if (!html) return null;

    // Renderizar el título sin spans por palabra, pero manteniendo los strong tags
    const tokens = String(html).split(/(<\/?strong>|<\/?b>)/gi);
    let inStrong = false;
    const out = [];

    tokens.forEach((tok, i) => {
      if (/^<(strong|b)>$/i.test(tok)) {
        inStrong = true;
        return;
      }
      if (/^<\/(strong|b)>$/i.test(tok)) {
        inStrong = false;
        return;
      }

      if (inStrong) {
        out.push(<strong key={`s-${i}`}>{tok}</strong>);
      } else {
        out.push(tok);
      }
    });

    return out;
  }

  function renderHighlight(html) {
    if (!html) return null;

    const tokens = String(html).split(/(<\/?strong>|<\/?b>)/gi);
    let inStrong = false;
    const out = [];

    tokens.forEach((tok, i) => {
      if (/^<(strong|b)>$/i.test(tok)) {
        inStrong = true;
        return;
      }
      if (/^<\/(strong|b)>$/i.test(tok)) {
        inStrong = false;
        return;
      }

      const chunks = tok.split(/(\s+)/);
      chunks.forEach((chunk, j) => {
        if (!chunk) return;

        if (/^\s+$/.test(chunk)) {
          out.push(" ");
          return;
        }

        const span = (
          <motion.span
            key={`w-${i}-${j}`}
            variants={word}
            style={{ display: "inline" }}
          >
            {chunk}
          </motion.span>
        );

        out.push(inStrong ? <strong key={`s-${i}-${j}`}>{span}</strong> : span);
      });
    });

    return out;
  }

  return (
    <section
      className="full-container diagonal-page-title"
      style={{ backgroundColor: bgc }}
    >
      <div className="full-container diagonal-title">
        <div className="title-container">
          <h1
            className={
              `title-page condensed${location === "multimedia" ? " multimedia-title" : ""}`
            }
          >
            {renderTitle(title)}{" "}
            {subtitle ? <span className="subtitle-page">{subtitle}</span> : ""}
          </h1>

          <p
            className="content"
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ margin: "-200px", once: true }}
            // variants={container}
          >
            {renderHighlight(highlight)}
          </p>
        </div>
      </div>
    </section>
  );
}

export default PageTitle;
