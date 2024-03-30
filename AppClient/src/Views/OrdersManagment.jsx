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
          "http://localhost:3000/ordersManagmentUsers"
        );
        const ordersResponse = await axios.get(
          "http://localhost:3000/ordersManagmentBuyCarList"
        );
  
        setUsers(usersResponse.data);
        setOrders(ordersResponse.data); // Almacena los datos de los carritos de compras
        console.log("soy orders")
        console.log(orders)
        console.log("soy users")
        console.log(users)
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
      <h1 className="subtitles"> Orders Managment </h1>
      <div className="">
        <h1>Usuarios</h1>
        <ul>
          {users.map((user, userId) => {
            // Filtrar los pedidos del usuario actual
            const userOrders = orders.filter(order => order.buyCarUser === user.userId);
            // Verificar si el usuario tiene pedidos
            if (userOrders.length > 0) {
              return (
                <li key={userId}>
                  <p>{user.userId}</p>
                  <p>{user.userName}</p>
                  <p>{user.userAddress}</p>
                  <p>Órdenes:</p>
                  <ul>
                    {userOrders.map((order, orderId) => (
                      <li key={orderId}>
                        <p>Id Pedido: {order.buyCarId}</p>
                        <p>Contenido del Pedido:</p>
                        <ul>
                          {JSON.parse(order.buyCarContent).products.map((product, productId) => {
                            // Calcular el total para cada producto
                            const total = product.productPrize * product.quantity;
                            return (
                              <li key={productId}>
                                <p>Nombre del Producto: {product.productName}</p>
                                <p>Id Tienda: {product.productShopOwner}</p>
                                <p>Descripción del Producto: {product.productDescription}</p>
                                <p>Precio del Producto: {product.productPrize}</p>
                                <p>Cantidad: {product.quantity}</p>
                                <p>Total: {total}</p>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            } else {
              // No renderizar si el usuario no tiene pedidos
              return null;
            }
          })}
        </ul>
      </div>
      <Footer />
    </>
  );
  
  
  
}

export default OrdersManagment;
