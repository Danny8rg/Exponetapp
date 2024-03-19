import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import Axios from "axios";
import { ShopContextValues } from "../Context/ShopContext";
import Cookies from "js-cookie";
import "./ProductSamplerBuyCar.css";

function ProductSamplerBuyCar() {
  const { buyCarProducts, setBuyCarProducts } = useContext(ShopContextValues);
  const buyCarUser = Cookies.get("userId");

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

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

    Axios.post("https://exponet-app-pjv8.vercel.app/createBuyCar", requestData)
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
      <div className="product-container-stores">
        {buyCarProducts.map((product) => (
          <div key={product.productId} className="product-card-home">
            <div className="box-img-home">
              <img
                src={product.productimgurl}
                alt="imgProduct"
                className="prod-img-home"
              />
            </div>
            <h3 className="prod-title">{product.productName}</h3>
            <div className="card-item-descrip">
              <p className="subtitle-descrip">Descripción</p>
              <p className="value-descrip">{product.productDescription}</p>
            </div>
            <section className="card-dates">
              <div className="card-item">
                <p className="subtitle">Precio</p>
                <p className="value">${product.productPrize}</p>
              </div>
              <div className="card-item">
                <p className="subtitle">Existencias</p>
                <p className="value">{product.productStock}</p>
              </div>
              <div className="card-item">
                <p className="subtitle">Total</p>
                <p className="value">${product.productTotal}</p>
              </div>
            </section>
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
                {selectedQuantities[product.productId] || 0}
              </span>
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
          </div>
        ))}
        <div className="box-btn-buyCart">
          <div>
            <p className="subtitle-buyCart">Valor Total De La Compra</p>
            <p className="value-buyCart">${total}</p>
          </div>
          <div className="flex flex-col gap-1">
            <button className="btn-buyCart" onClick={handleCompra}>
              Comprar Productos
            </button>
            <button className="btn-buyCart" onClick={handleBorrar}>
              Borrar{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductSamplerBuyCar;
