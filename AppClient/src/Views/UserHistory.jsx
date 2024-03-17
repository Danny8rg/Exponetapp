import axios from "axios";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UserHistory.css";

function UserHistory() {
  const [buyCars, setBuyCars] = useState([]);
  const [buyCarUser, setBuyCarUser] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBuyCarUser(Cookies.get("userId"));
    const fetchShops = async () => {
      try {
        const response = await axios.get("http://localhost:3000/buyCarsList");
        console.dir(response.data);
        setBuyCars(response.data);
        setBuyCarUser(Cookies.get("userId"));
        setLoading(false); // Cambia el estado de carga a falso cuando se completa la solicitud
      } catch (error) {
        if (error.response) {
          console.error(
            "Error de respuesta del servidor:",
            error.response.data
          );
        } else if (error.request) {
          console.error("No se recibió respuesta del servidor");
        } else {
          console.error(
            "Error de configuración de la solicitud:",
            error.message
          );
        }
        setLoading(false); // Cambia el estado de carga a falso si hay un error
      }
    };

    fetchShops();
  }, []);

  return (
    <>
      <Header />
      <div className="box-title-historial">
        <h2 className="product-title-historial">Historial De Compra</h2>
      </div>
      {loading ? (
        <p>Cargando historial de compras...</p>
      ) : (
        <div className="shops-container-historial">
          {buyCars
            .filter((buyCar) => buyCar.buyCarUser === parseInt(buyCarUser))
            .map((filteredBuyCar) => (
              <div
                key={filteredBuyCar.buyCarId}
                className="shop-card-historial"
              >
                <div className="shops-info">
                  <h4 className="shops-title m-0">Detalle de Compra</h4>
                  {Array.isArray(
                    JSON.parse(filteredBuyCar.buyCarContent).products
                  ) &&
                    JSON.parse(filteredBuyCar.buyCarContent).products.map(
                      (product, index) => (
                        <div key={product.productId}>
                          <p className="invoice-item">nombre del producto</p>
                          <h5>{product.productName}</h5>
                          <p className="invoice-item">Descripcion</p>
                          <p>{product.productDescription}</p>
                          <p className="invoice-item">precio: </p>
                          <p>{product.productPrize}</p>
                          <p className="invoice-item">Estado</p>
                          <p>{product.productState}</p>
                          <p className="invoice-item">Cantidad</p>
                          <p>
                            {Array.isArray(
                              JSON.parse(filteredBuyCar.buyCarContent)
                                .quantities
                            ) &&
                              JSON.parse(filteredBuyCar.buyCarContent)
                                .quantities[index].quantity}
                          </p>
                        </div>
                      )
                    )}
                </div>
              </div>
            ))}
        </div>
      )}
      <Footer />
    </>
  );
}

export default UserHistory;
