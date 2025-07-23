import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.API_BASE_URL || "https://trompoagencia.com/wp-json/wp/v2/";

const useFetchPosts = (limit = 100, order = "desc") => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch(`${API_BASE_URL}posts?per_page=${limit}&order=${order}&_embed`)
      .then((res) => res.json())
      .then((data) => {
        // Filtrar solo los posts que tienen imagen destacada
        const filteredPosts = data.filter(post => post._embedded?.["wp:featuredmedia"]?.[0]?.source_url);
        setPosts(filteredPosts);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, [limit, order]);

  return posts;
};


export default useFetchPosts;