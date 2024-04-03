import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Cookies from "js-cookie";
import { useContext } from "react";
import { ShopContextValues } from "../Components/Context/ShopContext";
import Swal from "sweetalert2";
import "./CreateShop.css";

function CreateShop() {
  const [shopName, setShopName] = useState("");
  const [shopTell, setShopTell] = useState("");
  const [shopMail, setShopMail] = useState("");
  const [shopAdress, setShopAdress] = useState("");
  const [shopComments, setShopComments] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const shopOwner = Cookies.get("userId");

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
    formData.append("shopOwner", shopOwner);

    Axios.post("https://exponetapp-8fxj.onrender.com/createShop", formData)
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tienda Registrada",
          showConfirmButton: false,
          timer: 1500,
        });
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
      <div className="container-create-shop">
        <div className="card shadow-sm">
          <div className="card-header flex justify-center">
            <h2 className="mt-1 mb-0 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900 title-create-store">
              Registro de tiendas
            </h2>
          </div>
          <div className="card-body flex flex-col">
            <div className="info-store mb-2">
              <span
                id="basic-addon1"
                className="block font-medium leading-6 text-gray-900"
              >
                Nombre de la tienda:
              </span>
              <input
                type="text"
                value={shopName}
                onChange={(event) => {
                  setShopName(event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-store"
                placeholder="Nombre la tienda"
              />
              {!validateShopName(shopName) && (
                <p className="error-message">
                  El nombre debe comenzar con mayúscula
                </p>
              )}
            </div>

            <div className="info-store mb-2">
              <span
                id="basic-addon1"
                className="block font-medium leading-6 text-gray-900"
              >
                Teléfono:
              </span>
              <input
                type="tel"
                value={shopTell}
                onChange={(event) => {
                  setShopTell(event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6 input-store"
                placeholder="315 000 0000"
              />
              {!validatePhoneNumber(shopTell) && (
                <p className="error-message">
                  El teléfono debe tener 10 dígitos
                </p>
              )}
            </div>

            <div className="info-store mb-2">
              <span
                id="basic-addon1"
                className="block font-medium leading-6 text-gray-900"
              >
                Correo electrónico:
              </span>
              <input
                type="email"
                value={shopMail}
                onChange={(event) => {
                  setShopMail(event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-store"
                placeholder="correo@gmail.com"
              />
              {!validateEmail(shopMail) && (
                <p className="error-message">Correo electrónico inválido</p>
              )}
            </div>

            <div className="info-store mb-2">
              <span
                id="basic-addon1"
                className="block font-medium leading-6 text-gray-900"
              >
                Dirección:
              </span>
              <input
                type="text"
                value={shopAdress}
                onChange={(event) => {
                  setShopAdress(event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-store"
                placeholder="Dirección de la tienda"
              />
            </div>

            <div className="info-store">
              <span
                id="basic-addon1"
                className="block font-medium leading-6 text-gray-900"
              >
                Descripción:
              </span>
              <textarea
                type="text"
                value={shopComments}
                onChange={(event) => {
                  setShopComments(event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 focus:ring-2 resize-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 input-store"
                placeholder="Descripción de la tienda"
              />
            </div>

            <div className="mt-3 flex">
              <label
                className="block shadow-sm leading-6 text-gray-900 select-img-store"
                htmlFor="file"
              >
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
          <div className="card-footer d-flex justify-content-center">
            <button
              onClick={addShop}
              className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-new-store"
            >
              Registrar tienda
            </button>
          </div>
        </div>

        {/*  <table className="table table-hover mt-12">
          <thead className="table-titles">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Correo Electrónico</th>
              <th scope="col">Dirección</th>
              <th scope="col">Descripcion</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {shopsList.map((val, key) => (
              <tr key={val.shopId} className="">
                <td>{val.shopName}</td>
                <td>{val.shopTell}</td>
                <td>{val.shopMail}</td>
                <td>{val.shopAdress}</td>
                <td>{val.shopComments}</td>
                <td>
                  <div
                    className="flex items-center justify-center gap-1"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        console.log("soy val shop id", val.shopId);
                        editarTienda(val);
                      }}
                      className="btn-edit-store"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGlobalShopId(val.shopId);
                        navigate("/UpdateShop");
                      }}
                      className="btn-link-store"
                    >
                      Productos
                    </button>
                    <button
                      onClick={() => {
                        GoToOrdersManagment(val.shopId);
                        navigate("/OrdersManagment");
                      }}
                      className="btn-delivery-store"
                    >
                      Entregas
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteProducts(shopOwner), deleteShop(val.shopId);
                      }}
                      className="btn-delete-store"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
                    </table> */}
      </div>
      <Footer />
    </>
  );
}

export default CreateShop;
