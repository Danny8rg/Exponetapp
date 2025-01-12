import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Cookies from "js-cookie";
import { useContext } from "react";
import { ShopContextValues } from "../Components/Context/ShopContext";
import Swal from "sweetalert2";
import "./ShopsManagment.css";

function ShopsManagment() {
  const [shopName, setShopName] = useState("");
  const [shopTell, setShopTell] = useState("");
  const [shopMail, setShopMail] = useState("");
  const [shopAdress, setShopAdress] = useState("");
  const [shopComments, setShopComments] = useState("");
  const [editar, setEditar] = useState(false);
  const [shopsList, setShopsList] = useState([]);
  const [shopId, setShopId] = useState("");
  const [shopOwner, setShopOwner] = useState("");
  const [shopImgUrl, setShopImgUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const { globalShopId, setGlobalShopId } = useContext(ShopContextValues);

  const addShop = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("shopName", shopName);
    formData.append("shopTell", shopTell);
    formData.append("shopMail", shopMail);
    formData.append("shopAdress", shopAdress);
    formData.append("shopOwner", shopOwner);
    formData.append("shopComments", shopComments);

    Axios.post("https://exponetapp-8fxj.onrender.com/createShop", formData)
      .then(() => {
        getShops();
        limpiarCampos();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tienda Registrada",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
      });
  };

  const updateShop = () => {
    setShowForm(false);
    // Almacena los valores originales antes de la actualización
    const originalShopName =
      shopsList.find((val) => val.shopId === shopId)?.shopName || "";
    const originalShopTell =
      shopsList.find((val) => val.shopId === shopId)?.shopTell || "";
    const originalShopMail =
      shopsList.find((val) => val.shopId === shopId)?.shopMail || "";
    const originalShopAdress =
      shopsList.find((val) => val.shopId === shopId)?.shopAdress || "";
    const originalShopComments =
      shopsList.find((val) => val.shopId === shopId)?.shopComments || "";

    const confirmationMessage = [
      `Nombre: ${originalShopName} -> ${shopName}`,
      `Teléfono: ${originalShopTell} -> ${shopTell}`,
      `Correo Electrónico: ${originalShopMail} -> ${shopMail}`,
      `Dirección: ${originalShopAdress} -> ${shopAdress}`,
      `Descripción: ${originalShopComments} -> ${shopComments}`,
    ]
      .filter((message) => message.includes("->"))
      .join("\n");

    const confirmation = window.confirm(
      `¿Seguro que desea actualizar la tienda?\n\n${confirmationMessage}`
    );

    if (confirmation) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("shopName", shopName);
      formData.append("shopTell", shopTell);
      formData.append("shopMail", shopMail);
      formData.append("shopAdress", shopAdress);
      formData.append("shopOwner", shopOwner);
      formData.append("shopComments", shopComments);
      formData.append("shopId", shopId);

      Axios.put(
        "https://exponetapp-8fxj.onrender.com/updateShop",
        formData,
        {}
      ).then(() => {
        getShops();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tienda actializada",
          showConfirmButton: false,
          timer: 1500,
        });
        limpiarCampos();
        getShops();
      });
    } else {
      // El usuario ha hecho clic en "Cancelar"
      Swal.fire({
        icon: "error",
        title: "Actualizacion cancelada",
      });
    }
  };

  const deleteShop = (ShopId) => {
    console.log(ShopId);
    const confirmation = window.confirm(
      "¿Seguro que desea eliminar la tienda?"
    );

    if (confirmation) {
      Axios.put(
        `https://exponetapp-8fxj.onrender.com/deleteShop/${ShopId}`
      ).then(() => {
        alert("Tienda eliminada");
        limpiarCampos();
        getShops();
      });
    } else {
      // El usuario ha hecho clic en "Cancelar"
      alert("Eliminación cancelada");
    }
  };

  const deleteProducts = (ShopId) => {
    Axios.put(
      `https://exponetapp-8fxj.onrender.com/deleteProducts/${ShopId}`
    ).then(() => {
      limpiarCampos();
      getShops();
    });
  };

  const limpiarCampos = () => {
    setSelectedFile("");
    setShopName("");
    setShopTell("");
    setShopMail("");
    setShopAdress("");
    setShopComments("");
    setShopId("");
    setEditar(false);
  };

  const CancelarUpdate = () => {
    limpiarCampos();
    setEditar(false);
  };

  const editarTienda = (val) => {
    setShowForm(true);
    setEditar(true);
    console.log("soy valshop id de la funcion", val.shopId);
    setShopId(val.shopId);
    setShopName(val.shopName);
    setShopTell(val.shopTell);
    setShopMail(val.shopMail);
    setShopAdress(val.shopAdress);
    setShopComments(val.shopComments);
  };

  const getShops = (shopOwner) => {
    console.log("SOY EL GETSHOPS", shopOwner);
    Axios.get(
      `https://exponetapp-8fxj.onrender.com/shopsListCreateShops/${shopOwner}`
    ).then((response) => {
      setShopsList(response.data);
      console.dir(response.data);
    });
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Cambiado de file a selectedFile
  };

  const GoToOrdersManagment = (shopId) => {
    setGlobalShopId(shopId);
  };

  useEffect(() => {
    setShopOwner(Cookies.get("userId"));
    console.log("soy el shop owner", shopOwner);
    console.log("soy el global shop id", globalShopId);
    getShops(shopOwner); // Pasar shopOwner como argumento
  }, [shopOwner]);

  return (
    <>
      <Header />
      <div className="container-shops-manag">
        {showForm ? (
          <div className="card shadow-sm">
            <div className="card-header flex justify-center">
              <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-gray-900 title-edit-store">
                Gestión de tienda
              </h2>
            </div>
            <div className="card-body flex flex-col">
              <div className="info-store-edit mb-2">
                <span
                  className="block font-medium leading-6 text-gray-900"
                  id="basic-addon1"
                >
                  Nombre de la tienda:
                </span>
                <input
                  type="text"
                  value={shopName}
                  onChange={(event) => {
                    setShopName(event.target.value);
                  }}
                  className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-edit-store"
                  placeholder="Nombre la tienda"
                />
              </div>

              <div className="info-store-edit mb-2">
                <span
                  className="block font-medium leading-6 text-gray-900"
                  id="basic-addon1"
                >
                  Teléfono:
                </span>
                <input
                  type="tel"
                  value={shopTell}
                  onChange={(event) => {
                    setShopTell(event.target.value);
                  }}
                  className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-edit-store"
                  placeholder="315 000 0000"
                />
              </div>

              <div className="info-store-edit mb-2">
                <span
                  className="block font-medium leading-6 text-gray-900"
                  id="basic-addon1"
                >
                  Correo electrónico:
                </span>
                <input
                  type="email"
                  value={shopMail}
                  onChange={(event) => {
                    setShopMail(event.target.value);
                  }}
                  className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-edit-store"
                  placeholder="correo@gmail.com"
                />
              </div>

              <div className="info-store-edit mb-2">
                <span
                  className="block font-medium leading-6 text-gray-900"
                  id="basic-addon1"
                >
                  Dirección:
                </span>
                <input
                  type="text"
                  value={shopAdress}
                  onChange={(event) => {
                    setShopAdress(event.target.value);
                  }}
                  className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-edit-store"
                  placeholder="Dirección de la tienda"
                />
              </div>

              <div className="info-store-edit mb-2">
                <span
                  className="block font-medium leading-6 text-gray-900"
                  id="basic-addon1"
                >
                  Descripción:
                </span>
                <textarea
                  type="text"
                  value={shopComments}
                  onChange={(event) => {
                    setShopComments(event.target.value);
                  }}
                  className="resize-none block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-edit-store"
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
                  style={{ display: "none" }} // Oculta el input de tipo archivo
                />
                {selectedFile && (
                  <div className="file-info">
                    <p className="result-select-img">{selectedFile.name}</p>
                    {/* Puedes agregar más información sobre el archivo si lo deseas */}
                  </div>
                )}
              </div>
            </div>
            <div className="card-footer d-flex justify-content-center">
              {editar ? (
                <div className="w-52 d-flex justify-content-between">
                  <button
                    onClick={updateShop}
                    className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-update-store"
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={CancelarUpdate}
                    className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-cancel-store"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={addShop}
                  className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-new-store"
                >
                  Registrar
                </button>
              )}
            </div>
          </div>
        ) : null}

        <table className="table table-bordered shadow-sm info-shops-manag">
          <thead className="table-titles">
            <tr className="table-light tr-table">
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
              <tr className="tr-table" key={val.shopId}>
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
                      className="flex justify-center rounded-md px-2 py-0 font-semibold leading-6 text-white shadow-sm btn-edit-store"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGlobalShopId(val.shopId);
                        navigate("/UpdateShop");
                      }}
                      className="flex justify-center rounded-md px-2 py-0 font-semibold leading-6 text-white shadow-sm btn-link-store"
                    >
                      Productos
                    </button>
                    <button
                      onClick={() => {
                        GoToOrdersManagment(val.shopId);
                        navigate("/OrdersManagment");
                      }}
                      className="flex justify-center rounded-md px-2 py-0 font-semibold leading-6 text-white shadow-sm btn-delivery-store"
                    >
                      Entregas
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteProducts(shopOwner), deleteShop(val.shopId);
                      }}
                      className="flex justify-center rounded-md px-2 py-0 font-semibold leading-6 text-white shadow-sm btn-delete-store"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default ShopsManagment;
