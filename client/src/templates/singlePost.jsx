import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import "../assets/styles/single-post.css";

const SinglePost = () => {
  const { slug } = useParams();
  const { posts, loading, error } = usePosts();

  const post = useMemo(
    () => posts.find((p) => p.slug === slug),
    [posts, slug]
  );

  if (loading) return <p>Cargando post…</p>;
  if (error)   return <p>{error}</p>;
  if (!post)   return <p>Post no encontrado</p>;

  return (
    <div className="full-container single-post-container">
      <div className="container">
        <div className="post-card">
          <h1 className="title">{post.title}</h1>
          {post.featured_image && (
            <img className="featured-image" src={post.featured_image} alt="" />
          )}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.long_description }}
          />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
