import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./OrdersManagment.css";
import { ShopContextValues } from "../Components/Context/ShopContext";
import Swal from "sweetalert2";

function OrdersManagment() {
  const [orders, setOrders] = useState([]);
  const [productsId, setProductsId] = useState([]);
  const [productsQuantity, setProductQuantity] = useState([]);
  const { globalShopId, setGlobalShopId } = useContext(ShopContextValues);

  useEffect(() => {
    const fetchBuyCars = async () => {
      try {
        const response = await axios.get(
          "https://exponet-app-pjv8.vercel.app/buyCarOrdersManagment"
        );
        setOrders(response.data);
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
      .post("https://exponet-app-pjv8.vercel.app/ProductStockUpdate", {
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
    console.dir(parsedContent);

    parsedContent.products.forEach((product) => {
      if (
        product.productShopOwner === globalShopId &&
        product.productState === "pendiente"
      ) {
        product.productState = "Despachado";
      } else if (product.productState === "pendiente") {
        product.productState = "pendiente";
      }
    });

    return JSON.stringify(parsedContent);
  }

  const DeleteBuyCar = (buyCarId) => {
    const confirmation = window.confirm(
      "¿Seguro que desea eliminar el Carrito?"
    );

    if (!confirmation) {
      // El usuario hizo clic en "Cancelar"
      return;
    }

    axios
      .put(`https://exponet-app-pjv8.vercel.app/deleteBuyCar/${buyCarId}`)
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

      <div>
        <div className="box-title-historial">
          <h2 className="product-title-historial">
            Lista De Ordenes De Compra
          </h2>
        </div>
        <ul className="orders-container">
          {orders.map((order, index) => (
            <li key={index}>
              <h3 className="subtitles">Usuario: {order.userName}</h3>
              <p className="subtitles">Correo Electrónico: {order.userMail}</p>
              <p className="subtitles">Dirección: {order.userAdress}</p>

              <h4 className="subtitles">Productos:</h4>
              <ul className="product-container">
                {JSON.parse(order.buyCarContent).products.map(
                  (product, productIndex) => (
                    <li key={productIndex}>
                      <p className="invoice-item">Producto:</p>
                      <p>{product.productName}</p>

                      <p className="invoice-item">Cantidad: </p>
                      <p>{product.quantity}</p>

                      <p className="invoice-item">Descripción:</p>
                      <p>{product.productDescription}</p>

                      <p className="invoice-item">Precio:</p>
                      <p>{product.productPrize}</p>

                      <p className="invoice-item">Categoría:</p>
                      <p>{product.productCategory}</p>

                      <p className="invoice-item">
                        Estado: {product.productState}
                      </p>
                    </li>
                  )
                )}
              </ul>
              <button
                className="form-control"
                onClick={() => {
                  console.log("soy botton");
                  console.dir(order.buyCarContent);
                  orderDelivered(order.buyCarContent);
                }}
              >
                Enviar Entrega
              </button>
              <button
                className="form-control"
                onClick={() => {
                  DeleteBuyCar(order.buyCarId, globalShopId);
                }}
              >
                Borrar Carrito
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </>
  );
}

export default OrdersManagment;
