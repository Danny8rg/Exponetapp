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
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [momentId, setMomentId] = useState(0);
  const [selectedProductName, setSelectedProductName] = useState(""); // Estado para almacenar el nombre del producto seleccionado

  useEffect(() => {
    setBuyCarUser(Cookies.get("userId"));
    const fetchBuyCars = async () => {
      try {
        const response = await axios.get(
          "https://exponetapp-8fxj.onrender.com/buyCarsList"
        );
        setBuyCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener historial de compras:", error);
        setLoading(false);
      }
    };

    fetchBuyCars();
  }, []);

  const handleDelete = (buyCarId) => {
    axios
      .put(`https://exponetapp-8fxj.onrender.com/deleteBuyCar/${buyCarId}`)
      .then((response) => {
        alert("se elimino el carrito del historial");
      })
      .catch((error) => {
        console.error("Error al eliminar el carrito:", error);
      });
  };

  const handleComment = (productName, productId) => {
    // Modificar handleComment para pasar productName
    setShowModal(true);
    setSelectedProductName(productName); // Almacenar el nombre del producto seleccionado
    setMomentId(productId);
  };

  const createComment = (appComment, userComment, productId, productName) => {
    axios
      .post("https://exponetapp-8fxj.onrender.com/createComment", {
        appComment: appComment,
        userComment: userComment,
        productComment: productId,
        productName: productName,
      })
      .then(() => {
        alert("Comentario Agregado");
        setComment("");
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error al enviar el comentario:", error);
      });
  };

  return (
    <>
      <Header />
      <div className="box-title-historial">
        <h2 className="product-title-historial">Historial de compras</h2>
      </div>
      {loading ? (
        <p>Cargando historial de compras...</p>
      ) : (
        <div className="shops-container-historial">
          <table className="table table-bordered shadow-sm info-user-history">
            <thead className="table-titles">
              <tr className="table-light tr-table">
                <th scope="col" className="imgProduct">
                  Imagen
                </th>
                <th scope="col" className="productName">
                  Nombre del producto
                </th>
                <th scope="col" className="description">
                  Descripción
                </th>
                <th scope="col" className="prize">
                  Precio
                </th>
                <th scope="col" className="state">
                  Estado
                </th>
                <th scope="col" className="cant">
                  Cantidad
                </th>
                <th scope="col" className="action">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {buyCars
                .filter((buyCar) => buyCar.buyCarUser === parseInt(buyCarUser))
                .map((filteredBuyCar) =>
                  JSON.parse(filteredBuyCar.buyCarContent).products.map(
                    (product, index) => (
                      <tr className="tr-table" key={product.productId}>
                        <td className="thuserhistory">
                          <img src={product.productimgurl} alt="" />
                        </td>
                        <td className="tdUserHistory">{product.productName}</td>
                        <td className="tdUserHistory td-description">
                          {product.productDescription}
                        </td>
                        <td className="tdUserHistory">
                          {product.productPrize}
                        </td>
                        <td className="tdUserHistory">
                          {product.productState}
                        </td>
                        <td className="tdUserHistory">
                          {Array.isArray(
                            JSON.parse(filteredBuyCar.buyCarContent).quantities
                          ) &&
                            JSON.parse(filteredBuyCar.buyCarContent).quantities[
                              index
                            ].quantity}
                        </td>
                        <td className="h-full flex items-center gap-2 flex-col border-0">
                          {product.productState === "Entregado" && (
                            <>
                              <button
                                className="flex w-32 justify-center rounded-md px-3 py-1 text-sm font-semibold no-underline leading-6 eliminarButton"
                                onClick={() => {
                                  handleDelete(
                                    filteredBuyCar.buyCarId // Pasar buyCarId como argumento
                                  );
                                }}
                              >
                                Eliminar
                              </button>
                              <button
                                className="flex w-32 justify-center rounded-md px-3 py-1 text-sm font-semibold no-underline leading-6 commentButton"
                                onClick={() =>
                                  handleComment(
                                    product.productName,
                                    product.productId
                                  )
                                } // Pasar productName y productId como argumentos
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
            <h1>Comentario para {selectedProductName}</h1>{" "}
            {/* Mostrar el nombre del producto seleccionado */}
            <textarea
              className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 resize-none sm:text-sm sm:leading-6 textAreaComment"
              placeholder="Escribe tu comentario aquí"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="flex w-28 justify-center rounded-md px-3 py-1 text-sm font-semibold no-underline leading-6 text-white enviarButton"
                onClick={() => {
                  createComment(
                    comment,
                    buyCarUser,
                    momentId,
                    selectedProductName
                  );
                }}
              >
                Enviar
              </button>
              <button
                className="flex w-28 justify-center rounded-md px-3 py-1 text-sm font-semibold no-underline leading-6 text-white cerrarButton"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default UserHistory;
