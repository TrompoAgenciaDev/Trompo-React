import React, { useState } from "react";
import { Link } from "react-router-dom";
import usePostsData from "../../hooks/usePostsData";
import "../../assets/styles/post-card.css";

const BASE = import.meta.env.BASE_URL || "/";
const toSrc = (src) => (/^(https?:|data:|blob:)/i.test(src) ? src : `${BASE}${(src || "assets/postImg/post.webp").replace(/^\/+/, "")}`);

const PostCard = ({ initialLimit, maxLimit = 1000, category, tag }) => {
  const hardLimit = maxLimit; // tope real de fetch
  const [visiblePosts] = useState(
    Math.min(initialLimit ?? hardLimit, hardLimit)
  );

  const { items: posts, loading, error } = usePostsData({
    limit: hardLimit,
    category,
    tag,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const list = posts.slice(0, visiblePosts);

  return (
    <div className="post-card-container full-container">
      {list.map((post) => {
        const title = post?.title || "Sin título";
        const firstCategory = post?.categories?.[0] || "Sin categoría";
        const featuredImage = toSrc(post?.featured_image);

        return (
          <div
            className="full-container post-card"
            key={post?.id ?? post?.slug ?? title}
            style={{
              backgroundImage: `url("${featuredImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="container">
              <h3 className="post-title">{title}</h3>
              <Link to={post?.slug ? `/post/${post.slug}` : "#"} className="read-more-link">
                Ver nota
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 19.0001H36.5M36.5 19.0001L19 1.79175M36.5 19.0001L19 36.2084" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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