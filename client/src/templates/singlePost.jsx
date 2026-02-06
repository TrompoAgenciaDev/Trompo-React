import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import "../assets/styles/single-post.css";

const getPrimaryCategory = (post) => {
  const cats = Array.isArray(post?.category) ? post.category
    : Array.isArray(post?.categories) ? post.categories
    : post?.category ? [post.category]
    : post?.categories ? [post.categories]
    : [];
  return cats[0] ?? "";
};

const SinglePost = () => {
  const { slug } = useParams();
  const { posts, loading, error } = usePosts();

  const post = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug]);
  const primaryCategory = useMemo(() => (post ? getPrimaryCategory(post) : ""), [post]);

  if (loading) return <p>Cargando post…</p>;
  if (error)   return <p>{error}</p>;
  if (!post)   return <p>Post no encontrado</p>;

  return (
    <div className="full-container single-post-container">
      <div className="full-container post-title-container bg-yellow">
        <div className="container post-header">
          <div className="post-meta">
            <span className="post-category">Notas de <span>{primaryCategory}</span></span>
            <span className="post-date">{post.date}</span>
          </div>
          <h1 className="post-main-title">{post.title}</h1>
        </div>
      </div>
      <div className="container featured-image-container">
        {post.featured_image && (
          <img className="featured-image" src={post.featured_image} alt="" width={1200} height={675} style={{ aspectRatio: '16/9', maxWidth: '100%', height: 'auto' }} loading="lazy" decoding="async" />
        )}
        <div className="post-content-container">
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
