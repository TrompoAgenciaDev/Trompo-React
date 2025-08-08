import React, { useState } from "react";
import { Link } from "react-router-dom";
import useJsonConsulting from "../../hooks/useJsonConsulting";

import "../../assets/styles/post-card.css";

const PostCard = ({
  initialLimit = 999,
  maxLimit = 1000,
  category,
  tag,
  type = "posts",
}) => {
  const [visiblePosts, setVisiblePosts] = useState(initialLimit);
  const {
    items: posts,
    loading,
    error,
  } = useJsonConsulting({
    quantity: maxLimit,
    category,
    tag,
    type,
  });

  const handleLoadMore = () => {
    setVisiblePosts((prev) => Math.min(prev + 12, maxLimit));
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
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
        const category = post?.categories?.[0] || "Sin categoría";

        // si no hay una imagen, usar una imagen por defecto
        const featuredImage =
          post?.featured_image || "/assets/postImg/post.png";

        return (
          <div
            className="full-container post-card"
            key={post.id}
            style={{
              backgroundImage: `url(${featuredImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="container">
              <h3 className="post-title">{title}</h3>
              <Link to={`/post/${post.slug}`} className="read-more-link">
                Ver nota
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 19.0001H36.5M36.5 19.0001L19 1.79175M36.5 19.0001L19 36.2084"
                    stroke="#1E1E1E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostCard;
