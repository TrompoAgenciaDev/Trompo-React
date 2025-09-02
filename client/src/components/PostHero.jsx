import '../assets/styles/postHero.css';


function PostHero ({text}){
  return (
    <div className="container home-content text-post-hero">
      {text}
    </div>
  );
}

export default PostHero;