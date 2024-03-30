import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContextValues } from "../Context/ShopContext";
import "./ProductSamplerHome.css";

function ProductSamplerHome({ products, stock, quantityCards, Route }) {
  const [selectedProducts, setSelectedProducts] = useState({});
  const { globalShopId, setGlobalShopId, setGlobalShopName } =
    useContext(ShopContextValues);
  const valor = globalShopId;
  setGlobalShopName("FreeChocolate");
  const Ruta = "/Shops";

  // Filtrar productos según globalShopId
  const filteredProducts = globalShopId
    ? products.filter((product) => product.productShopOwner === valor)
    : products;

  // IMPLEMENTACIÓN DE LA MODAL
  // const [modalOpen, setModalOpen] = useState(false);

  // const openModal = () => {
  //   setModalOpen(true);
  // };

  // const closeModal = () => {
  //   setModalOpen(false);
  // };

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
              {/* <p className="subtitle-home">Descripción</p> */}
              <p className="value-descrip-home">{product.productDescription}</p>
            </div>
            {/* <div className="dates-box-one">
              <p className="subtitle-home">Existencias</p>
              <p className="value-home">{stock[product.productId]}</p>
            </div> */}
            <div className="dates-box-two">
              {/* <p className="subtitle-home">Precio</p> */}
              <p className="value-home-price">${product.productPrize}</p>
            </div>
          </div>
          //   <Modal isOpen={modalOpen} onClose={closeModal}>
          //    <h2>Contenido del Modal</h2>
          //    <p>¡Aquí puedes poner lo que quieras dentro del modal!</p>
          //    <button onClick={closeModal}>Cerrar Modal</button>
          //   </Modal>
        ))}
      </div>
    </>
  );
}

export default ProductSamplerHome;
