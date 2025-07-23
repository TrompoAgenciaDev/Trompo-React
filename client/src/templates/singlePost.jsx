import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "../json/posts.json";


import '../assets/styles/single-post.css'


const SinglePost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Buscar el post por su slug
    const foundPost = Posts.find(post => post.slug === slug);
    setPost(foundPost);
  }, [slug]); // Se vuelve a ejecutar cada vez que el slug cambia

  if (!post) {
    return <p>Post no encontrado</p>;
  }

  return (
    <>
      <div className="single-post-container">
        <div className="post-card">
          <h1 className="post-title title">{post.title}</h1>
          <img className="featured-image" src={post.featured_image} alt="" />
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.long_description }}
          />
        </div>
      </div>
      <div className="clip-container">
        <div className="pre-footer-clip"></div>
      </div>
    </>
  );
};

export default SinglePost;
