import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import { ShopContextValues } from "../Context/ShopContext";
import { MdDeleteForever } from "react-icons/md";
import "../ProductsSampler/ProductSampler.css";
import Swal from "sweetalert2";
import Comments from "../Comments/Comments";

function ProductSampler({ products, stock, quantityCards, Route }) {
  const [selectedProducts, setSelectedProducts] = useState({});
  const { globalShopId, setGlobalShopId, searchText, setSearchText } =
    useContext(ShopContextValues);
  const {
    globalShopName,
    setGlobalShopName,
    buyCarProducts,
    setBuyCarProducts,
  } = useContext(ShopContextValues);
  const valor = globalShopId;
  const [productState, setProductSate] = useState("pendiente ");

  const calculateTotalPrice = (productId) => {
    const product = products.find((p) => p.productId === productId);
    const quantity = selectedProducts[productId] || 0;
    return product ? product.productPrize * quantity : 0;
  };

  const handleIncrement = (productId) => {
    if (stock[productId] > 0) {
      setSelectedProducts((prevSelectedProducts) => {
        const updatedProducts = { ...prevSelectedProducts };
        updatedProducts[productId] = (updatedProducts[productId] || 0) + 1;

        localStorage.setItem(
          "selectedProducts",
          JSON.stringify(updatedProducts)
        );
        return updatedProducts;
      });

      setStock((prevStock) => {
        const updatedStock = { ...prevStock };
        updatedStock[productId] = (updatedStock[productId] || 0) - 1;
        return updatedStock;
      });
    }
  };

  const handleDecrement = (productId) => {
    if (selectedProducts[productId] > 0) {
      setSelectedProducts((prevSelectedProducts) => {
        const updatedProducts = { ...prevSelectedProducts };
        updatedProducts[productId] -= 1;

        localStorage.setItem(
          "selectedProducts",
          JSON.stringify(updatedProducts)
        );
        return updatedProducts;
      });

      setStock((prevStock) => {
        const updatedStock = { ...prevStock };
        updatedStock[productId] = (updatedStock[productId] || 0) + 1;
        return updatedStock;
      });
    }
  };

  function addToBuyCar(
    productId,
    productName,
    productDescription,
    productPrize,
    productStock,
    productCategory,
    productimgurl,
    productShopOwner,
    productState
  ) {
    // Verificar si el producto ya está en el carrito
    const alreadyInCart = buyCarProducts.some(
      (item) => item.productId === productId
    );

    if (alreadyInCart) {
      // Mostrar alerta de que el producto ya está en el carrito
      alert(
        "¡Ya has comprado este producto! si deseas comprar otra unidad de este producto ve al carrito de compras y selecciona la cantidad"
      );
    } else {
      // Incrementar la cantidad a 1 si es 0
      const selectedQuantity =
        selectedProducts[productId] <= 0 ? 1 : selectedProducts[productId];

      // Agregar el producto al carrito
      setBuyCarProducts((prevBuyCarProducts) => [
        ...prevBuyCarProducts,
        {
          productId,
          productName,
          productDescription,
          productPrize,
          productStock,
          productCategory,
          productimgurl,
          productShopOwner,
          quantity: selectedQuantity,
          productState,
        },
      ]);

      // Mostrar mensaje de éxito
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto añadido al carrito",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  function borrarCarrito() {
    setBuyCarProducts([]);
    alert("carrito borrado");
  }

  // Filtrar productos según globalShopId
  const filteredProducts = globalShopId
    ? products.filter(
        (product) =>
          product.productShopOwner === valor &&
          product.productName.toLowerCase().includes(searchText.toLowerCase())
      )
    : products.filter((product) =>
        product.productName.toLowerCase().includes(searchText.toLowerCase())
      );

  return (
    <>
      <div className="product-container-stores">
        <div className="box-title-principal">
          <h1 className="product-title-principal">{globalShopName}</h1>
        </div>
        {filteredProducts.slice(0, quantityCards).map((product) => (
          <div
            key={product.productId}
            className="product-card shadow-sm bg-gray-50"
          >
            <section className="box-btn">
              <button
                className="card-btn"
                onClick={() =>
                  addToBuyCar(
                    product.productId,
                    product.productName,
                    product.productDescription,
                    product.productPrize,
                    product.productStock,
                    product.productCategory,
                    product.productimgurl,
                    product.productShopOwner,
                    productState
                  )
                }
              >
                Comprar
              </button>
            </section>
            <div className="box-img">
              <img
                src={product.productimgurl}
                alt="imgProduct"
                className="prod-img"
              />
            </div>
            <h3 className="prod-title">{product.productName}</h3>
            <div className="card-item-descrip">
              <p className="value-descrip">{product.productDescription}</p>
            </div>
            <section className="card-dates">
              <div className="card-item">
                <p className="subtitle">Stock</p>
                <p className="value">{stock[product.productId]}</p>
              </div>
              <div className="card-item">
                <p className="subtitle">Total</p>
                <p className="value">
                  ${calculateTotalPrice(product.productId)}
                </p>
              </div>
            </section>
              <div className="card-item-price">
                <p className="value-price">${product.productPrize}</p>
              </div>
            <div className="quantity-controls">
              <button
                className="btn-minor shadow-sm"
                onClick={() => handleDecrement(product.productId)}
              >
                <span className="span-btn">
                  <FaMinus />
                </span>
              </button>
              <span className="span-quan">
                {selectedProducts[product.productId] || 0}
              </span>
              <button
                className="btn-plus shadow-sm"
                onClick={() => handleIncrement(product.productId)}
              >
                <span className="span-btn">
                  <FaPlus />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Comments />
    </>
  );
}

export default ProductSampler;
