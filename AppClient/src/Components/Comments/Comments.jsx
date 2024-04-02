import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

import "./Comments.css";

function Comments({ productId }) {
  const [comments, setComments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
      <button onClick={() => setModalIsOpen(true)}>Abrir modal</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Comentarios"
      >
        <div className="comments-container">
          {comments
            .filter((comment) => comment.productComment === productId)
            .map((comment, index) => (
              <div key={index} className="comments-card">
                <p className="nameUser">
                  <b>{comment.userName}</b>
                </p>
                <p className="commentTarjet">{comment.appComment}</p>
                <p className="commentState">
                  <b>{comment.CommentState}</b>
                </p>
              </div>
            ))}
           
        </div>
        <button onClick={()=>{
              setModalIsOpen(false)
            }}>Cerrar Modal</button>
      </Modal>
    </>
  );
}

export default Comments;
