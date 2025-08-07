import '../assets/styles/postHero.css';


function PostHero ({text}){
  return (
    <section className="section full-container">
    <div className="container home-content text-post-hero">
      {text}
    </div>
  </section>
  );
}

export default PostHero;