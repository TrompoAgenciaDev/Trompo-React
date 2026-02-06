import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePostsData from "../../hooks/usePostsData";
import "../../assets/styles/post-card.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const toSrc = (src) => {
  if (!src) return `${base}assets/postImg/post.webp`;
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  // Si ya empieza con base, devolverlo tal cual
  if (src.startsWith(base)) return src;
  // Si empieza con /, reemplazarlo con base
  if (src.startsWith('/')) return `${base}${src.replace(/^\/+/, '')}`;
  // Si no, agregar base al inicio
  return `${base}${src}`;
};

export default function PostGrid3({ category, tag }) {
  const {
    items: posts,
    loading,
    error,
  } = usePostsData({ limit: 3, category, tag });
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || posts.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length);
    }, 3000); // cada 3 segundos
    return () => clearInterval(interval);
  }, [isMobile, posts]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="post-grid">
      {isMobile ? (
        <div className="post-carousel">
          <AnimatePresence mode="wait">
            {posts.length > 0 && (
              <motion.article
                key={
                  posts[current]?.id ??
                  posts[current]?.slug ??
                  posts[current]?.title
                }
                className="post-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
              >
                <a
                  className="post-link"
                  href={
                    posts[current]?.slug ? `post/${posts[current].slug}` : "#"
                  }
                  rel="noopener"
                >
                  <div className="post-media-wrap">
                    <motion.img
                      src={toSrc(posts[current]?.featured_image)}
                      alt={posts[current]?.title || "Sin título"}
                      className="post-media"
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={400}
                      style={{ aspectRatio: '3/2', maxWidth: '100%', height: 'auto' }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </div>
                  <h3 className="post-title">
                    {posts[current]?.title || "Sin título"}
                  </h3>
                </a>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      ) : (
        posts.map((post, i) => {
          const title = post?.title || "Sin título";
          const img = toSrc(post?.featured_image);
          const href = post?.slug ? `post/${post.slug}` : "#";
          const featured = i === 1;

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
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={400}
                    style={{ aspectRatio: '3/2', maxWidth: '100%', height: 'auto' }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
                <h3 className="post-title">{title}</h3>
              </a>
            </article>
          );
        })
      )}
    </div>
  );
}
