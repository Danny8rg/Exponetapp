import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import Axios from "axios";
import { ShopContextValues } from "../Context/ShopContext";
import "./ProductSamplerBuyCar.css";
import Cookies from "js-cookie";

function ProductSamplerBuyCar() {
  const { buyCarProducts, setBuyCarProducts } = useContext(ShopContextValues);
  const buyCarUser = Cookies.get("userId");

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    updateTotal();
  }, [buyCarProducts]);

  useEffect(() => {
    const initialQuantities = buyCarProducts.reduce((quantities, product) => {
      quantities[product.productId] = product.quantity || 0;
      return quantities;
    }, {});
    setSelectedQuantities(initialQuantities);
    updateTotal();
  }, [buyCarProducts]);

  const handleIncrement = (productId) => {
    const product = buyCarProducts.find((p) => p.productId === productId);

    if (product.productStock > 0) {
      const updatedQuantities = {
        ...selectedQuantities,
        [productId]: (selectedQuantities[productId] || 0) + 1,
      };
      setSelectedQuantities(updatedQuantities);

      const updatedProducts = buyCarProducts.map((p) =>
        p.productId === productId
          ? {
              ...p,
              quantity: updatedQuantities[productId],
              productStock: p.productStock - 1,
            }
          : p
      );

      setBuyCarProducts(updatedProducts);

      // Actualizar el total
      updateTotal();
    }
  };

  const handleDecrement = (productId) => {
    if (selectedQuantities[productId] > 0) {
      const updatedQuantities = {
        ...selectedQuantities,
        [productId]: selectedQuantities[productId] - 1,
      };
      setSelectedQuantities(updatedQuantities);

      const updatedProducts = buyCarProducts.map((p) =>
        p.productId === productId
          ? {
              ...p,
              quantity: updatedQuantities[productId],
              productStock: p.productStock + 1,
            }
          : p
      );

      setBuyCarProducts(updatedProducts);

      // Restar el precio al total
      updateTotal();
    }
  };

  const updateTotal = () => {
    const calculatedTotal = buyCarProducts.reduce((acc, product) => {
      const quantity = selectedQuantities[product.productId] || 0;
      const productTotal = product.productPrize * quantity;

      // Añadir el total del producto al array para futuras referencias
      setProductTotal(product.productId, productTotal);

      return acc + productTotal;
    }, 0);

    setTotal(calculatedTotal);
  };

  const setProductTotal = (productId, productTotal) => {
    setBuyCarProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId ? { ...product, productTotal } : product
      )
    );
  };

  const handleCompra = () => {
    buyCarUpdate("pendiente", buyCarUser);
    setBuyCarProducts([]);
    setSelectedQuantities({});
    setTotal(0);
    alert("Compra realizada con éxito");
    navigate("/UserHistory");
  };

  const buyCarUpdate = (buyCarState, buyCarUser) => {
    const selectedQuantitiesArray = buyCarProducts.map((product) => ({
      productId: product.productId,
      quantity: selectedQuantities[product.productId] || 0,
    }));

    const requestData = {
      buyCarContent: JSON.stringify({
        products: buyCarProducts,
        quantities: selectedQuantitiesArray,
      }),
      buyCarUser: buyCarUser,
      buyCarState: buyCarState,
    };

    Axios.post("http://localhost:3000/createBuyCar", requestData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
      });
  };

  const handleBorrar = () => {
    setBuyCarProducts([]);
    setSelectedQuantities({});
    setTotal(0);
    alert("Productos eliminados del carrito");
  };

  return (
    <>
      <div className="product-container-home">
        {buyCarProducts.map((product) => (
          <div key={product.productId} className="product-card-home">
            <div className="box-img-home">
              <img
                src={product.productimgurl}
                alt="imgProduct"
                className="prod-img-home"
              />
            </div>
            <p className="subtitle-descrip-home w-8">Descripción</p>
            <p className="value-descrip-home">{product.productDescription}</p>
            <section className="card-dates-home">
              <div className="card-left-home">
                <p className="subtitle">Precio</p>
                <p className="value">${product.productPrize}</p>
              </div>
              <div className="card-right-home">
                <p className="subtitle-home">Existencias</p>
                <p className="value-home">{product.productStock}</p>
              </div>
              <div>
                <p className="subtitle-Home">Total</p>
                <p className="value-home">${product.productTotal}</p>
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
                <p>{selectedQuantities[product.productId] || 0}</p>
                <button
                  className="btn-plus shadow-sm"
                  onClick={() => handleIncrement(product.productId)}
                  disabled={product.productStock <= 0}
                >
                  <span className="span-btn">
                    <FaPlus />
                  </span>
                </button>
              </div>
            </section>
          </div>
        ))}
      </div>
      <div>
        <p className="subtitle">Valor Total De La Compra</p>
        <p>${total}</p>
        <button onClick={handleCompra}>Comprar Productos</button>
        <button onClick={handleBorrar}>Borrar </button>
      </div>
    </>
  );
}

export default ProductSamplerBuyCar;

