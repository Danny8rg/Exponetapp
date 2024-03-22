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
  const [showModal, setShowModal] = useState(false); // Estado para controlar si se muestra la modal
  const [comment, setComment] = useState(""); // Estado para almacenar el comentario
  const [momentId, setMomentId] = useState(0)
  

  useEffect(() => {
    setBuyCarUser(Cookies.get("userId"));
    const fetchBuyCars = async () => {
      try {
        const response = await axios.get(
          "https://exponetapp-8fxj.onrender.com/buyCarsList"
        );
        console.dir(response.data);
        setBuyCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener historial de compras:", error);
        setLoading(false);
      }
    };

    fetchBuyCars();
  }, []);

  // Función para manejar la eliminación del producto
  const handleDelete = (buyCarId) => {
    console.dir("soy el buyCarId del boton deletear", buyCarId);
    axios.put(`https://exponetapp-8fxj.onrender.com/deleteBuyCar/${buyCarId}`)
      .then(response => {
        console.log("Carrito eliminado exitosamente:", response.data);
        alert("se elimino el carrito del historial")
        // Aquí puedes realizar cualquier acción adicional después de eliminar el carrito
      })
      .catch(error => {
        console.error("Error al eliminar el carrito:", error);
        // Aquí puedes manejar el error de alguna manera si lo deseas
      });
  };


  // Función para manejar la acción de comentario del producto
  const handleComment = (productId) => {
    setShowModal(true); // Abrir la modal cuando se hace clic en el botón de comentario
    setMomentId(productId)
  };

  const createComment = (appComment, userComment, productId) => {
    console.log("soyAppComment en createComment", appComment)
    console.log("soyuserComment en createComment", userComment)
    console.log("soyProductId en createComment", productId)
  
    axios.post("https://exponetapp-8fxj.onrender.com/createComment", {
        appComment: appComment,
        userComment: userComment,
        productComment: productId
      })
      .then(() => { 
        alert("Comentario Agregado");
        setComment("");
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error al enviar el comentario:", error);
      });
  }
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
          <table>
            <thead>
              <tr>
                <th>Nombre del Producto</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buyCars
                .filter(
                  (buyCar) => buyCar.buyCarUser === parseInt(buyCarUser)
                )
                .map((filteredBuyCar) =>
                  JSON.parse(filteredBuyCar.buyCarContent).products.map(
                    (product, index) => (
                      <tr key={product.productId}>
                        <td>{product.productName}</td>
                        <td>{product.productDescription}</td>
                        <td>{product.productPrize}</td>
                        <td>{product.productState}</td>
                        <td>
                          {Array.isArray(
                            JSON.parse(filteredBuyCar.buyCarContent)
                              .quantities
                          ) &&
                            JSON.parse(
                              filteredBuyCar.buyCarContent
                            ).quantities[index].quantity}
                        </td>
                        <td>
                          {product.productState === "Entregado" && (
                            <>
                              <button
                                onClick={() => {
                                  handleDelete(
                                   filteredBuyCar.buyCarId // Pasar buyCarId como argumento
                                  );
                                }}
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => handleComment(product.productId)}
                              >
                                Comentario
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>Hola usuario</h1>
            <textarea
              placeholder="Escribe tu comentario aquí"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={() => {
              createComment(comment, buyCarUser, momentId)
            }}>Enviar</button>
            <button onClick={()=>{
              setShowModal(false)
            }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default UserHistory;
