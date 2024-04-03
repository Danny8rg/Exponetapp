import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import Axios from "axios";
import { ShopContextValues } from "../Context/ShopContext";
import Cookies from "js-cookie";
import { TiDelete } from "react-icons/ti";
import Swal from "sweetalert2";
import "./ProductSamplerBuyCar.css";

function ProductSamplerBuyCar() {
  const { buyCarProducts, setBuyCarProducts } = useContext(ShopContextValues);
  const buyCarUser = Cookies.get("userId");

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showCardInput, setShowCardInput] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [bank, setBank] = useState("");
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    updateTotal();
  }, [buyCarProducts]);

  useEffect(() => {
    if (!userInfo) {
      getUserInfo(buyCarUser);
    }
  }, []);

  useEffect(() => {
    const initialQuantities = buyCarProducts.reduce((quantities, product) => {
      quantities[product.productId] = product.quantity || 0;
      return quantities;
    }, {});
    setSelectedQuantities(initialQuantities);
    updateTotal();
  }, [buyCarProducts]);

  const handleIncrement = (productId) => {
    console.log("handleIncrement");
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
    console.log("handledecrement");
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
    updateBuyCar("pendiente", buyCarUser);
    setBuyCarProducts([]);
    setSelectedQuantities({});
    setTotal(0);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Compra realizada con exito",
      showConfirmButton: false,
      timer: 1500,
    });
    navigate("/UserHistory");
  };

  const updateBuyCar = (buyCarState, buyCarUser) => {
    console.log("soy el buycarproducts antes de crear los arreglos");
    console.log(buyCarProducts);
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

    Axios.post("https://exponetapp-8fxj.onrender.com/createBuyCar", requestData)
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
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Productos eliminados del carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const updateUserCreditCard = (userCreditCard, userId, bank) => {
    Axios.put("https://exponetapp-8fxj.onrender.com/updateUserCreditCard", {
      userId: userId,
      userCreditCard: userCreditCard,
      bank: bank,
    })
      .then((response) => {
        console.log(response.data);
        // Manejar la respuesta del servidor según sea necesario
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        // Manejar errores según sea necesario
      });
  };

  const getUserInfo = (userId) => {
    Axios.get(
      `https://exponetapp-8fxj.onrender.com/readOneUser/${userId}`
    ).then((response) => {
      setUserInfo(response.data);
      console.log("soy el userInfo");
      console.log(response.data);
      console.log(userInfo);
    });
  };

  const handleBankChange = (e) => {
    setBank(e.target.value);
  };

  const deleteOneProduct = (productId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que desea eliminar el producto del carrito de compras?"
    );

    if (confirmDelete) {
      const updatedProducts = buyCarProducts.filter(
        (product) => product.productId !== productId
      );
      setBuyCarProducts(updatedProducts);
      setSelectedQuantities((prevQuantities) => {
        const updatedQuantities = { ...prevQuantities };
        delete updatedQuantities[productId];
        return updatedQuantities;
      });
      updateTotal();
    }
  };

  function sendMail(userName, userMail) {
    // Enviar los datos al backend utilizando Axios
    Axios.put("/sendSailMail", { userName, userMail })
      .then((response) => {
        // Manejar la respuesta del backend si es necesario
        console.log("Correo electrónico enviado con éxito:", response.data);
      })
      .catch((error) => {
        // Manejar errores en caso de que ocurran
        console.error("Error al enviar el correo electrónico:", error);
      });
  }

  return (
    <>
      <div className="product-container-cart">
        <div className="second-container-cart shadow-sm">
          <div className="box-title-cart">
            <h1 className="product-title-cart">Carrito de compras </h1>
          </div>
          {buyCarProducts.map((product) => (
            <div
              key={product.productId}
              className="product-card-home bg-gray-50"
            >
              <div className="box-img-home">
                <img
                  src={product.productimgurl}
                  alt="imgProduct"
                  className="prod-img-home"
                />
              </div>
              <h3 className="prod-title">{product.productName}</h3>
              <div className="card-item-descrip">
                <p className="value-descrip">{product.productDescription}</p>
              </div>
              <section className="card-dates">
                <div className="card-item">
                  <p className="subtitle">Existencias</p>
                  <p className="value">{product.productStock}</p>
                </div>
                <div className="card-item">
                  <p className="subtitle">Total</p>
                  <p className="value">${product.productTotal}</p>
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
              <div className="box-btn-delete">
                <button
                  className="btn-delete"
                  onClick={() => {
                    deleteOneProduct(product.productId);
                  }}
                >
                  <TiDelete />
                </button>
              </div>
            </div>
          ))}
          <div className="box-btn-buyCart">
            <div className="flex gap-2">
              <button
                className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-deleteCart"
                onClick={handleBorrar}
              >
                Borrar{" "}
              </button>
              <button
                className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-buyCart"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Comprar Productos
              </button>
            </div>
            <div className="w-64 flex flex-col items-center justify-center box-value-total">
              <p className="subtitle-buyCart">Valor total</p>
              <p className="value-buyCart">${total}</p>
            </div>
          </div>

          {/* modal inicio */}

          {showModal && (
            <div className="container-modal">
              <div className="modal2 shadow-sm">
                <div className="select-modal shadow-sm bg-gray-100">
                  <p className="">Forma de pago</p>
                  <select
                    name="DeliveredSelector"
                    id="DeliveredSelector"
                    onChange={(e) => {
                      if (e.target.value === "Targeta De Credito") {
                        setShowCardInput(true);
                      } else {
                        setShowCardInput(false);
                      }
                    }}
                  >
                    <option value="contraEntrega">Contra entrega</option>
                    <option value="Targeta De Credito">Pago con tarjeta</option>
                  </select>
                </div>
                {showCardInput && (
                  <div className="pago-tarjeta shadow-sm bg-gray-100">
                    <p className="title-bank">Banco</p>
                    <input
                      className="block m-0 w-full rounded-md px-3 py-1.5 text-gray-900 bg-white shadow-sm sm:text-sm sm:leading-6 input-modal"
                      id="cardNumber"
                      type="text"
                      placeholder="Número de tu cuenta"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                    {cardNumber.length !== 16 && (
                      <p className="format">Se requieren 16 dígitos.</p>
                    )}
                    <select
                      className="pago"
                      name="Bank"
                      id="Bank"
                      onChange={handleBankChange}
                    >
                      <option value="bancolombia">Bancolombia</option>
                      <option value="davivienda">Davivienda</option>
                      <option value="popular">Banco Popular</option>
                    </select>
                  </div>
                )}
                <div className="btn-modal flex gap-2">
                  <button
                    onClick={() => {
                      setShowModal(false);
                    }}
                    className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm cerrar"
                  >
                    Cerrar
                  </button>
                  <button
                    className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm comprar"
                    onClick={() => {
                      if (showCardInput == true) {
                        let name = userInfo[0].userName;
                        let adrees = userInfo[0].userAdress;
                        setShowModal(false);
                        setCardNumber(cardNumber);
                        setBank(bank);
                        updateUserCreditCard(cardNumber, buyCarUser, bank);
                        handleCompra();
                        Swal.fire({
                          position: "top-end",
                          icon: "success",
                          title: "Pagaste con tarjeta de crédito",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        let message = `Usuario ${name}, su pedido será entregado en ${adrees}. El dia de la entrega le será confirmado en las proximas horas, recibirá la notificación via correo electrónico.`;
                        Swal.fire(message);
                      } else {
                        getUserInfo(buyCarUser);
                        let name = userInfo[0].userName;
                        let adrees = userInfo[0].userAdress;
                        let message = `Usuario ${name}, su pedido será entregado en ${adrees}. El dia de la entrega le sera confirmado en las proximas horas `;
                        Swal.fire(message);
                        sendMail(userInfo[0].userName, userInfo[0].userMail);
                        handleCompra();
                      }
                    }}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* modal final */}
        </div>
      </div>
    </>
  );
}

export default ProductSamplerBuyCar;
