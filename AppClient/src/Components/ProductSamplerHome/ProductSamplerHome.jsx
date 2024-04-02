import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ProductSamplerHome.css";
import Comments from "../Comments/Comments";
import { ShopContextValues } from "../Context/ShopContext";

function ProductSamplerHome({ products, stock, quantityCards, Route }) {
  const [selectedProducts, setSelectedProducts] = useState({});
  const { globalShopId, setGlobalShopId, setGlobalShopName } =
    useContext(ShopContextValues);
  const valor = globalShopId;
  setGlobalShopName("FreeChocolate");
  const Ruta = "/Shops";
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Filtrar productos según globalShopId
  const filteredProducts = globalShopId
    ? products.filter((product) => product.productShopOwner === valor)
    : products;

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
      <div className="product-container-home">
        <div className="box-title-sampler">
          <h1 className="product-title-sampler">Productos de interés</h1>
        </div>
        {filteredProducts.slice(0, quantityCards).map((product) => (
          <div
            key={product.productId}
            className="product-card-home shadow-sm bg-gray-50"
          >
            <Link to={Ruta} className="card-btn-home">
              Ir a tiendas
            </Link>
            <div className="box-img-home">
              <img
                src={product.productimgurl}
                alt="imgProduct"
                className="prod-img-home"
              />
            </div>
            <h3 className="prod-title-home">{product.productName}</h3>
            <div className="dates-box-descrip">
              <p className="value-descrip-home">{product.productDescription}</p>
            </div>
            <div className="dates-box-two">
              <p className="value-home-price">${product.productPrize}</p>
            </div>
            <button
              onClick={() => {
                setSelectedProductId(product.productId);
                setShowModal(true);
              }}
            >
              Abrir Modal
            </button>
          </div>
        ))}
      </div>
      {/*  el modal inicio*/}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal">
            <div className="comments-container">
              {comments
                .filter(
                  (comment) => comment.productComment === selectedProductId
                )
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
            <button
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cerrar Modal
            </button>
          </div>
        </div>
      )}

      {/*  el modal final*/}
    </>
  );
}

export default ProductSamplerHome;
