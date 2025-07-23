import PostCard from "../components/posts/PostCard";

//styles
import "@as/news.css";

const News = () => {
  return (
    <section className="news-section">
      <div className="news-container">
        <div className="title-section">
          <h1 className="title">Noticias</h1>
          <p>
            <span className="bold-text">Somos</span> el puente entre <br />
          </p>
          <p>
            grandes <span className="bold-text">ideas y resultados.</span>
          </p>
        </div>

        {/* Gallery News Component */}
        <PostCard initialLimit={3} maxLimit={3} />
      </div>
    </section>
  );
};

export default News;
