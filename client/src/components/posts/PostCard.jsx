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
    <div className="post-card-container full-container">
      {posts.slice(0, visiblePosts).map((post) => {
          // Usar el título y la primera categoría
          const title = post?.title || "Sin título";
          const category = post?.categories?.[0] || "Sin categoría"; // Obtener la primera categoría

          // Manejar la imagen de portada, si no hay una imagen, usar una imagen por defecto
          const featuredImage = post?.featured_image || "/assets/postImg/post.png"; 

          return (
            <div className="container post-card" key={post.id} style={{
              backgroundImage: `url(${featuredImage})`
            }}>
              <h3 className="post-title">{title}</h3>
                {/* <a href={`/posts/post/${post.slug}`} className="read-more-link">Ver más</a> */}
                <Link to={`/post/${post.slug}`} className="read-more-link">
                  Ver nota
                  <svg
                    height="21"
                    viewBox="0 0 21 21"
                    width="21"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="translate(4 6)"
                    >
                      <path d="m9.5.497 4 4.002-4 4.001" />
                      <path d="m.5 4.5h13" />
                    </g>
                  </svg>
                </Link>
            </div>
          );
        })}
    </div>
  );
};

export default PostCard;
