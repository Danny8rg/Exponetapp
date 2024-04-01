import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./OrdersManagment.css";
import { ShopContextValues } from "../Components/Context/ShopContext";
import Swal from "sweetalert2";
import "./OrdersManagment.css";

function OrdersManagment() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [productsId, setProductsId] = useState([]);
  const [productsQuantity, setProductQuantity] = useState([]);
  const { globalShopId, setGlobalShopId } = useContext(ShopContextValues);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "https://exponetapp-8fxj.onrender.com/ordersManagmentUsers"
        );
        const ordersResponse = await axios.get(
          "https://exponetapp-8fxj.onrender.com/ordersManagmentBuyCarList"
        );

        setUsers(usersResponse.data);
        setOrders(ordersResponse.data); // Almacena los datos de los carritos de compras
        console.log("soy orders");
        console.log(orders);
        console.log("soy users");
        console.log(users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  function ChangeState(buyCarContent, globalShopId) {
    const parsedContent = JSON.parse(buyCarContent);
    console.dir(
      "soy el buyCarContent de la funcion change state",
      parsedContent
    );

    parsedContent.products.forEach((product) => {
      if (
        product.productShopOwner === globalShopId &&
        product.productState.trim() === "pendiente"
      ) {
        product.productState = "Entregado";
      } else if (product.productState.trim() === "pendiente") {
        // Aquí se cambió la comparación
        product.productState = "pendiente";
      }
    });
    console.dir("soy el buycarcontent con el estado cambiado", parsedContent);
    return JSON.stringify(parsedContent);
  }

  function orderDelivered(buyCarContent, globalShopId, buyCarId) {
    console.log("soy funcion");
    console.dir("soy el buy car original que llega ", buyCarContent);

    const newBuyCarContent = ChangeState(buyCarContent, globalShopId);

    const parsedContent = JSON.parse(buyCarContent);
    console.dir(parsedContent);

    const productsIds = parsedContent.products.map(
      (product) => product.productId
    );
    console.dir("soy lista de ids", productsIds);

    const productsQuantities = parsedContent.products.map(
      (product) => product.quantity
    );

    console.dir("soy product quantities", productsQuantities);

    const productsShopOwners = parsedContent.products.map(
      (product) => product.productShopOwner
    );

    console.log("soy el product shop owner", productsShopOwners);
    console.log("soy el newbuycarcontent del final", newBuyCarContent);

    axios
      .post("https://exponetapp-8fxj.onrender.com/ProductStockUpdate", {
        productsIds,
        productsQuantities,
        productsShopOwners,
        newBuyCarContent,
        buyCarId,
      })
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Pedido despachado",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el stock del producto:", error);
      });

    console.log("soy el buyCarId Entre Los Axios", buyCarId);
    console.log("soy el nuevo buycarcontent entre los axios", newBuyCarContent);

    axios
      .put("https://exponetapp-8fxj.onrender.com/updateBuyCar", {
        buyCarId,
        newBuyCarContent,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("error al actualizar el carro de compras", error);
      });
  }

  function ChangeState(buyCarContent, globalShopId) {
    const parsedContent = JSON.parse(buyCarContent);
    console.dir(
      "soy el buyCarContent de la funcion change state",
      parsedContent
    );

    parsedContent.products.forEach((product) => {
      if (
        product.productShopOwner === globalShopId &&
        product.productState.trim() === "pendiente"
      ) {
        product.productState = "Entregado";
      } else if (product.productState.trim() === "pendiente") {
        // Aquí se cambió la comparación
        product.productState = "pendiente";
      }
    });
    console.dir("soy el buycarcontent con el estado cambiado", parsedContent);
    return JSON.stringify(parsedContent);
  }

  function ChangeStateCanceled(buyCarContent, globalShopId) {
    const parsedContentCanceled = JSON.parse(buyCarContent);
    console.dir(
      "soy el buyCarContentcanceled de la funcion change state Canceled",
      parsedContentCanceled
    );

    parsedContentCanceled.products.forEach((product) => {
      if (
        product.productShopOwner === globalShopId &&
        product.productState.trim() === "pendiente"
      ) {
        product.productState = "Cancelado";
      } else if (product.productState.trim() === "pendiente") {
        // Aquí se cambió la comparación
        product.productState = "pendiente";
      }
    });

    console.log(
      "soy el parsedCOntent de changestatecanceled",
      parsedContentCanceled
    );

    axios
      .put("https://exponetapp-8fxj.onrender.com/updateBuyCar", {
        buyCarId,
        parsedContentCanceled,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("error al actualizar el carro de compras", error);
      });
  }

  const DeleteBuyCar = (buyCarId) => {
    const confirmation = window.confirm(
      "¿Seguro que desea eliminar el Carrito?"
    );

    if (!confirmation) {
      return;
    }

    axios
      .put(`https://exponetapp-8fxj.onrender.com/deleteBuyCar/${buyCarId}`)
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Carrito eliminado",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <>
      <Header />
      <h1 className="subtitles"> Orders Management </h1>
      <div className="orders-container">
        {users.map((user, userId) => {
          const userOrders = orders.filter(
            (order) => order.buyCarUser === user.userId
          );
          if (userOrders.length > 0) {
            return (
              <li key={userId}>
                <div className="userInfo">
                  <h5 className="info-client">
                    <b>Información del cliente</b>
                  </h5>
                  <p>
                    <b>ID:</b> {user.userId}
                  </p>
                  <p>
                    <b>Nombre:</b> {user.userName}
                  </p>
                  <p>
                    <b>Dirección:</b> {user.userAdress}
                  </p>
                  <p>
                    <b>Correo Electrónico:</b> {user.userMail}
                  </p>
                </div>
                <h5 className="title-compra">
                  <b>Informacion de compra</b>
                </h5>
                <table className="product-container">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>ID Tienda</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Unidades</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order, orderId) => (
                      <React.Fragment key={orderId}>
                        {JSON.parse(order.buyCarContent).products.map(
                          (product, productId) => {
                            if (product.productShopOwner === globalShopId) {
                              const total =
                                product.productPrize * product.quantity;
                              return (
                                <tr className="compra" key={productId}>
                                  <td>{product.productName}</td>
                                  <td>{product.productShopOwner}</td>
                                  <td>{product.productDescription}</td>
                                  <td>{product.productPrize}</td>
                                  <td>{product.quantity}</td>
                                  <td>{total}</td>
                                  <td className="action-button">
                                    <button
                                      className="despachar"
                                      onClick={() => {
                                        orderDelivered(
                                          order.buyCarContent,
                                          globalShopId,
                                          order.buyCarId
                                        );
                                      }}
                                    >
                                      Despachar
                                    </button>
                                    <button
                                      className="cancelar"
                                      onClick={() => {
                                        ChangeStateCanceled(
                                          order.buyCarContent,
                                          globalShopId
                                        );
                                      }}
                                    >
                                      Cancelar
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else {
                              return null;
                            }
                          }
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </li>
            );
          } else {
            return null;
          }
        })}
      </div>
      <Footer />
    </>
  );
}

export default OrdersManagment;
