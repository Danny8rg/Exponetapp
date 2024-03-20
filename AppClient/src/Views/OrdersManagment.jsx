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
          "https://exponetapp-8fxj.onrender.com/ordersManagmentUsers"
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
          "https://exponetapp-8fxj.onrender.com/ordersManagmentBuyCarList"
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

  function orderDelivered(buyCarContent) {
    console.log("soy funcion");
    console.dir(buyCarContent);

    const newBuyCarContent = ChangeState(buyCarContent, globalShopId);

    const parsedContent = JSON.parse(newBuyCarContent);
    console.dir(parsedContent);

    const productsIds = parsedContent.products.map(
      (product) => product.productId
    );
    console.dir(productsIds);

    const productsQuantities = parsedContent.products.map(
      (product) => product.quantity
    );

    console.dir(productsQuantities);

    const productsShopOwners = parsedContent.products.map(
      (product) => product.productShopOwner
    );

    console.dir(productsShopOwners);
    console.dir(newBuyCarContent);

  //  axios
  //    .post("https://exponetapp-8fxj.onrender.com/ProductStockUpdate", {
  //      productsIds,
  //      productsQuantities,
  //      productsShopOwners,
  //      newBuyCarContent,
  //    })
  //    .then((response) => {
  //      // Maneja la respuesta si es necesario
  //      console.log(response.data);
  //      Swal.fire({
  //        position: "center",
  //        icon: "success",
  //        title: "Pedido despachado",
  //        showConfirmButton: false,
  //        timer: 1500,
  //      });
  //    })
  //    .catch((error) => {
  //      console.error("Error al actualizar el stock del producto:", error);
  //    });
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
                        <th className="subtitles">Nombre del Producto</th>
                        <th className="subtitles">Descripción</th>
                        <th className="subtitles">Precio</th>
                        <th className="subtitles">Cantidad</th>
                        <th className="subtitles">Estado</th>
                        <th className="subtitles">Acciones</th>
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
                                  <button>
                                    Cancelar
                                  </button>
                                  <button onClick={()=>{
                                    orderDelivered(order.buyCarContent)
                                  }}>
                                    Despachar
                                  </button>
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
