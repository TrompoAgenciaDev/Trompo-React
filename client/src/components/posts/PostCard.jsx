import React, { useState } from "react";
import { Link } from "react-router-dom";
import useJsonConsulting from "../../hooks/useJsonConsulting";

import '../assets/styles/post-card.css'

const PostCard = ({ initialLimit = 999, maxLimit = 1000, category, tag, type = "posts" }) => {
  const [visiblePosts, setVisiblePosts] = useState(initialLimit);
  const { items: posts, loading, error } = useJsonConsulting({
    quantity: maxLimit,
    category,
    tag,
    type,
  });

  const handleLoadMore = () => {
    setVisiblePosts((prev) => Math.min(prev + 12, maxLimit));
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="post-card-container">
      <div className="card-container">
        {posts.slice(0, visiblePosts).map((post) => {
          // Usar el título y la primera categoría
          const title = post?.title || "Sin título";
          const category = post?.categories?.[0] || "Sin categoría"; // Obtener la primera categoría

          // Manejar la imagen de portada, si no hay una imagen, usar una imagen por defecto
          const featuredImage = post?.featured_image || "/assets/postImg/post.png"; 

          return (
            <div className="post-card" key={post.id} style={{
              backgroundImage: `url(${featuredImage})`
            }}>
              <div className="info-container">
                <p className="post-category text">{truncateText(category, 100)}</p> {/* Mostrar la categoría como texto */}
                <h3 className="post-title">{title}</h3>
                {/* <a href={`/posts/post/${post.slug}`} className="read-more-link">Ver más</a> */}
                <Link to={`/post/${post.slug}`} className="read-more-link">
                  Ver más
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostCard;
