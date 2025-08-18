
import '../../assets/styles/page-title.css';

function PageTitle({ title, highlight }) {
  return (
    <section className="full-container bg-yellow diagonal-page-title">
      <div className="full-container diagonal-title">
        <div className="container page-title">
          <h1 className="title-page">{title}</h1>
          <p className="content">{highlight}</p>
        </div>
      </div>
    </section>
  );
}


export default PageTitle;