import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Comments.css";

function Comments({ productId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          "https://exponetapp-8fxj.onrender.com/commentsList"
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de comentarios:", error);
      }
    };

    fetchComments();
  }, []);

  return (
    <>
      <div className="comments-container">
        {comments
          .filter((comment) => comment.productComment === productId) // Filtrar los comentarios por productId
          .map((comment, index) => (
            <div key={index} className="comments-card">
              <p>{comment.userName}</p>
              <p>{comment.appComment}</p>
              <p>{comment.CommentState}</p>
            </div>
          ))}
      </div>
    </>
  );
}

export default Comments;
