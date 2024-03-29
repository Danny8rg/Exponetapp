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
    const fetchBuyCarsUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/ordersManagmentUsers"
        );
        console.log("soy response.data", response.data);
        setUsers(response.data);
        console.log("soy orders ya seteado", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener la lista de Usuarios:", error);
      }
    };
    fetchBuyCarsUsers();

    const fetchBuyCars = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/ordersManagmentBuyCarList"
        );
        console.log("soy response.data", response.data);
        setOrders(response.data);
        console.log("soy orders ya seteado", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener la lista de Carritos :", error);
      }
    };
    fetchBuyCars();
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
      } else if (product.productState.trim() === "pendiente") { // Aquí se cambió la comparación
        product.productState = "pendiente";
      }
    });
    console.dir("soy el buycarcontent con el estado cambiado", parsedContent);
    return JSON.stringify(parsedContent);
  }

  function orderDelivered(buyCarContent, globalShopId, buyCarId) {
    console.log("soy funcion");
    console.dir("soy el buy car original que llega ",buyCarContent);

    const newBuyCarContent = ChangeState(buyCarContent, globalShopId);

    const parsedContent = JSON.parse(buyCarContent);
    console.dir(parsedContent);

    const productsIds = parsedContent.products.map(
      (product) => product.productId
    );
    console.dir("soy lista de ids",productsIds);

    const productsQuantities = parsedContent.products.map(
      (product) => product.quantity
    );

    console.dir("soy product quantities",productsQuantities);

    const productsShopOwners = parsedContent.products.map(
      (product) => product.productShopOwner
    );

    console.log("soy el product shop owner", productsShopOwners);
    console.log("soy el newbuycarcontent del final",newBuyCarContent);

    axios
      .post("http://localhost:3000/ProductStockUpdate", {
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

      console.log("soy el buyCarId Entre Los Axios", buyCarId)
      console.log("soy el nuevo buycarcontent entre los axios", newBuyCarContent)

      axios.put("http://localhost:3000/updateBuyCar", {
        buyCarId,
        newBuyCarContent,
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) =>{
        console.error("error al actualizar el carro de compras", error);
      })

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
      } else if (product.productState.trim() === "pendiente") { // Aquí se cambió la comparación
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
    } else if (product.productState.trim() === "pendiente") { // Aquí se cambió la comparación
      product.productState = "pendiente";
    }
  });

  console.log("soy el parsedCOntent de changestatecanceled", parsedContentCanceled)
  
  axios.put("http://localhost:3000/updateBuyCar", {
    buyCarId,
    parsedContentCanceled,
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) =>{
    console.error("error al actualizar el carro de compras", error);
  })
}

  const DeleteBuyCar = (buyCarId) => {
    const confirmation = window.confirm(
      "¿Seguro que desea eliminar el Carrito?"
    );

    if (!confirmation) {
      return;
    }

    axios
      .put(`http://localhost:3000/deleteBuyCar/${buyCarId}`)
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
        {!loading && orders.length > 0 ? (
          orders.map((order) => (
            <React.Fragment key={order.buyCarId}>
              {order &&
                order.buyCarContent &&
                // Mueve la condición de renderizado de la tabla completa aquí
                JSON.parse(order.buyCarContent).products.some(
                  (product) => product.productShopOwner === globalShopId
                ) && (
                  <table key={order.buyCarId}>
                    <thead>
                      <tr>
                        <th className="subtitles nameProductOrders">Nombre del Producto</th>
                        <th className="subtitles descriptionOrders">Descripción</th>
                        <th className="subtitles prizeOrders">Precio</th>
                        <th className="subtitles cantOrders">Cantidad</th>
                        <th className="subtitles stateOrders">Estado</th>
                        <th className="subtitles actionOrders">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="product-container">
                      {JSON.parse(order.buyCarContent).products.map(
                        (product, index) => {
                          // Solo renderiza el producto si el productShopOwner coincide con globalShopId
                          if (product.productShopOwner === globalShopId) {
                            return (
                              <tr key={index}>
                                <td>{product.productName}</td>
                                <td>{product.productDescription}</td>
                                <td>{product.productPrize}</td>
                                <td>{product.quantity}</td>
                                <td>{product.productState}</td>
                                <td>
                                {product.productState !== "Entregado" && (
                        <button onClick={() => {
                            orderDelivered(order.buyCarContent, globalShopId, order.buyCarId);
                        }}>
                            Despachar
                        </button>
                    )}
                                    {product.productState !== "Entregado" && (
                        <button onClick={() => {
                            ChangeStateCanceled(order.buyCarContent, globalShopId, order.buyCarId);
                        }}>
                            Cancelar
                        </button>
                    )}
                 
                 
                 
                                </td>
                              </tr>
                            );
                          } else {
                            return null; // Si no coincide, devuelve null para no renderizar este producto
                          }
                        }
                      )}
                    </tbody>
                  </table>
                )}
            </React.Fragment>
          ))
        ) : (
          <p>No hay órdenes disponibles</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OrdersManagment;
