import React from "react";
import { motion } from "framer-motion";
import usePostsData from "../../hooks/usePostsData";
import "../../assets/styles/post-card.css";

const toSrc = (src) =>
  /^(https?:|data:|blob:)/i.test(src)
    ? src
    : (src || "assets/postImg/post.webp").replace(/^\/+/, "");

export default function PostGrid3({ category, tag }) {
  const {
    items: posts,
    loading,
    error,
  } = usePostsData({ limit: 3, category, tag });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="post-grid">
      {posts.map((post, i) => {
        const title = post?.title || "Sin título";
        const img = toSrc(post?.featured_image);
        const href = post?.slug ? `post/${post.slug}` : "#";
        const featured = i === 1; // la del medio

        return (
          <article
            className={`post-card${featured ? " post-card--featured" : ""}`}
            key={post?.id ?? post?.slug ?? title}
          >
            <a className="post-link" href={href} rel="noopener">
              <div className="post-media-wrap">
                <motion.img
                  src={img}
                  alt={title}
                  className="post-media"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </div>
              <h3 className="post-title">{title}</h3>
            </a>
          </article>
        );
      })}
    </div>
  );
}
