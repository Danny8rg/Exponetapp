import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateShop.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Cookies from "js-cookie";
import { useContext } from "react";
import { ShopContextValues } from "../Components/Context/ShopContext";
import Swal from "sweetalert2";

function CreateShop() {
  const [shopName, setShopName] = useState("");
  const [shopTell, setShopTell] = useState("");
  const [shopMail, setShopMail] = useState("");
  const [shopAdress, setShopAdress] = useState("");
  const [shopComments, setShopComments] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const { globalShopId, setGlobalShopId } = useContext(ShopContextValues);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateShopName = (name) => {
    return /^[A-Z].*/.test(name);
  };

  const validatePhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
  };

  const addShop = () => {
    // Aquí se puede agregar la lógica para validar los campos antes de enviar la solicitud
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("shopName", shopName);
    formData.append("shopTell", shopTell);
    formData.append("shopMail", shopMail);
    formData.append("shopAdress", shopAdress);
    formData.append("shopComments", shopComments);

    Axios.post("http://localhost:3000/createShop", formData)
      .then(() => {
        alert("Tienda registrada");
        limpiarCampos();
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
      });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const limpiarCampos = () => {
    setSelectedFile("");
    setShopName("");
    setShopTell("");
    setShopMail("");
    setShopAdress("");
    setShopComments("");
  };

  useEffect(() => {
    // Aquí se pueden agregar las operaciones de inicialización necesarias
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2 className="title-create-store">Creación De Tiendas</h2>
          </div>
          <div className="card-body">
            <div className="label-store">
              <span id="basic-addon1">Nombre de la tienda:</span>
              <input
                type="text"
                value={shopName}
                onChange={(event) => {
                  setShopName(event.target.value);
                }}
                className="input-store"
                placeholder="Nombre la tienda"
              />
              {!validateShopName(shopName) && (
                <p className="error-message">El nombre debe comenzar con mayúscula</p>
              )}
            </div>

            <div className="label-store">
              <span id="basic-addon1">Teléfono:</span>
              <input
                type="tel"
                value={shopTell}
                onChange={(event) => {
                  setShopTell(event.target.value);
                }}
                className="input-store"
                placeholder="315 000 0000"
              />
              {!validatePhoneNumber(shopTell) && (
                <p className="error-message">El teléfono debe tener 10 dígitos</p>
              )}
            </div>

            <div className="label-store">
              <span id="basic-addon1">Correo electrónico:</span>
              <input
                type="email"
                value={shopMail}
                onChange={(event) => {
                  setShopMail(event.target.value);
                }}
                className="input-store"
                placeholder="correo@gmail.com"
              />
              {!validateEmail(shopMail) && (
                <p className="error-message">Correo electrónico inválido</p>
              )}
            </div>

            <div className="label-store">
              <span id="basic-addon1">Dirección:</span>
              <input
                type="text"
                value={shopAdress}
                onChange={(event) => {
                  setShopAdress(event.target.value);
                }}
                className="input-store"
                placeholder="Dirección de la tienda"
              />
            </div>

            <div className="label-store">
              <span id="basic-addon1">Descripción:</span>
              <textarea
                type="text"
                value={shopComments}
                onChange={(event) => {
                  setShopComments(event.target.value);
                }}
                className="input-store"
                placeholder="Descripción de la tienda"
              />
            </div>

            <div className="input-group mt-3">
              <label className="select-img-store" htmlFor="file">
                Seleccionar imagen de la tienda
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {selectedFile && (
                <div className="file-info">
                  <p className="result-select-img">{selectedFile.name}</p>
                </div>
              )}
            </div>
          </div>
          <div className="card-footer text-body-secondary d-flex justify-content-center">
            <button onClick={addShop} className="btn-new-store">
              Registrar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CreateShop;
