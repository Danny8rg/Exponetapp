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
      <div className="orders-container">
        <div className="box-title-orders">
          <h1 className="product-title-orders">Historial de entregas</h1>
        </div>
        {users.map((user, userId) => {
          const userOrders = orders.filter(
            (order) => order.buyCarUser === user.userId
          );
          if (userOrders.length > 0) {
            return (
              <li className="shadow-sm bg-gray-50" key={userId}>
                <h5 className="m-0 info-client">Información del cliente</h5>
                <div className="user-info">
                  <p className="m-0 w-24 shadow-sm">
                    <span className="text-gray-400">ID</span> {user.userId}
                  </p>
                  <p className="m-0 w-72 shadow-sm">
                    <span className="text-gray-400">Nombre cliente</span>
                    {user.userName}
                  </p>
                  <p className="m-0 w-96 shadow-sm">
                    <span className="text-gray-400">Dirección</span>{" "}
                    {user.userAdress}
                  </p>
                  <p className="m-0 w-96 shadow-sm">
                    <span className="text-gray-400">Correo electrónico</span>{" "}
                    {user.userMail}
                  </p>
                </div>
                <table className="table table-bordered shadow-sm info-orders-manag">
                  <thead className="table-titles">
                    <tr className="tr-table">
                      <th>Producto</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Unidades</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {userOrders.map((order, orderId) => (
                      <React.Fragment key={orderId}>
                        {JSON.parse(order.buyCarContent).products.map(
                          (product, productId) => {
                            if (product.productShopOwner === globalShopId) {
                              const total =
                                product.productPrize * product.quantity;
                              return (
                                <tr className="tr-table" key={productId}>
                                  <td>{product.productName}</td>
                                  <td>{product.productId}</td>
                                  <td>{product.productDescription}</td>
                                  <td>{product.productPrize}</td>
                                  <td>{product.quantity}</td>
                                  <td>{total}</td>
                                  <td className="flex flex-col items-center justify-center gap-1">
                                    <button
                                      className=" w-28 flex justify-center rounded-md px-3 py-0 text-white leading-6 shadow-sm despachar"
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
                                      className="flex w-28 justify-center rounded-md px-3 py-0 text-white leading-6 shadow-sm cancelar"
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
