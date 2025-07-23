import Hero from '../layout/Hero';
import PostCard from '../components/posts/PostCard';

function News() {
  return (
    <>
      <Hero location="news" />
      <div className="flex-container container">
        <PostCard
          maxLimit={4}
        /> 
      </div>
    </>
  );
}

export default News;
