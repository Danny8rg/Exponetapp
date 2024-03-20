import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./OrdersManagment.css";
import { ShopContextValues } from "../Components/Context/ShopContext";
import Swal from "sweetalert2";

function OrdersManagment() {
  const [orders, setOrders] = useState();
  const [productsId, setProductsId] = useState([]);
  const [productsQuantity, setProductQuantity] = useState([]);
  const { globalShopId, setGlobalShopId } = useContext(ShopContextValues);

  useEffect(() => {
    const fetchBuyCars = async () => {
      try {
        const response = await axios.get(
          "https://exponetapp-8fxj.onrender.com/buyCarOrdersManagment"
        );
        console.log("soy response.data", response.data);
        setOrders(response.data);
        console.log("soy orders ya seteado", response.data);

        // Realiza cualquier operación necesaria con los datos actualizados de orders aquí
      } catch (error) {
        console.error("Error al obtener la lista de Ordenes:", error);
      }
    };
    fetchBuyCars();
  }, []);

  function orderDelivered(buyCarContent) {
    console.log("soy funcion");
    console.dir(buyCarContent);

    const newBuyCarContent = ChangeState(buyCarContent, globalShopId);

    const parsedContent = JSON.parse(buyCarContent);
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

    axios
      .post("https://exponetapp-8fxj.onrender.com/ProductStockUpdate", {
        productsIds,
        productsQuantities,
        productsShopOwners,
        newBuyCarContent,
      })
      .then((response) => {
        // Maneja la respuesta si es necesario
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
        product.productState = "Despachado";
      } else if (product.productState.trim() === "pendiente") {
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
      <Footer />
    </>
  );
}

export default OrdersManagment;
