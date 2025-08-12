
import '../../assets/styles/page-title.css';

function PageTitle({ title, highlight }) {
  return (
    <section className="full-container diagonal-title bg-yellow">
      <div className="container page-title">
        <h1 className="title-page">{title}</h1>
        <p className="content">{highlight}</p>
      </div>
    </section>
  );
}


export default PageTitle;