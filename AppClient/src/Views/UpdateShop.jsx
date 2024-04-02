import { useState, useEffect } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { ShopContextValues } from "../Components/Context/ShopContext";
import { useContext } from "react";
import "./UpdateShop.css";
import Swal from "sweetalert2";

function UpdateProduct() {
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [productPrize, setProductPrize] = useState(0);
  const [editar, setEditar] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [productShopOwner, setProductShopOwner] = useState("");
  const [file, setFile] = useState(null);
  const { globalShopId, searchText, setSearchText } =
    useContext(ShopContextValues);
  const [selectedFile, setSelectedFile] = useState(null);

  const add = () => {
    if (!productName || !productName[0].match(/[A-Z]/)) {
      Swal.fire({
        icon: "warning",
        title: "El nombre del producto debe comenzar con mayúscula",
      });
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productStock", productStock);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);
    formData.append("productPrize", productPrize);
    formData.append("productShopOwner", productShopOwner);
    formData.append("file", selectedFile);

    Axios.post("https://exponetapp-8fxj.onrender.com/createProduct", formData)
      .then(() => {
        getProductsList();
        limpiarCampos();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto registrado",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error al registrar el producto:", error);
      });
  };

  const update = () => {
    const confirmation = window.confirm(
      `¿Seguro que desea actualizar el producto?\n\nCambios propuestos:\n` +
        `Nombre: ${productName}\n` +
        `Stock: ${productStock}\n` +
        `Categoría: ${productCategory}\n` +
        `Descripción: ${productDescription}\n` +
        `Precio: ${productPrize}`
    );

    if (!confirmation) {
      // El usuario hizo clic en "Cancelar"
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("productName", productName);
    formData.append("productStock", productStock);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);
    formData.append("productPrize", productPrize);
    formData.append("file", selectedFile);

    Axios.put("https://exponetapp-8fxj.onrender.com/updateProduct", formData)
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto actualizado",
          showConfirmButton: false,
          timer: 1500,
        });
        getProductsList();
        limpiarCampos();
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
      });
  };

  const deleteProducto = (productId) => {
    const confirmation = window.confirm(
      "¿Seguro que desea eliminar el producto?"
    );

    if (!confirmation) {
      // El usuario hizo clic en "Cancelar"
      return;
    }

    Axios.put(
      `https://exponetapp-8fxj.onrender.com/deleteProduct/${productId}`
    ).then(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
      limpiarCampos();
      getProductsList();
    });
  };

  const limpiarCampos = () => {
    setProductName("");
    setProductStock(0);
    setProductCategory("");
    setProductDescription("");
    setProductPrize(0);
    setEditar(false);
  };

  const CancelarUpdate = () => {
    limpiarCampos();
    setEditar(false);
  };

  const editarProducto = (val) => {
    setEditar(true);
    setProductId(val.productId);

    setProductName(val.productName);
    console.log(val.productName);
    setProductStock(val.productStock);
    console.log(val.productStock);
    setProductCategory(val.productCategory);
    console.log(val.productCategory);
    setProductDescription(val.productDescription);
    console.log(val.productDescription);
    setProductPrize(val.productPrize);
    console.log(val.productPrize);
  };

  const getProductsList = () => {
    Axios.get(
      `https://exponetapp-8fxj.onrender.com/productsListUpdateProducts/${productShopOwner}`
    )
      .then((response) => {
        // Filtrar productos por nombre usando el searchText
        const filteredProducts = response.data.filter((product) =>
          product.productName.toLowerCase().includes(searchText.toLowerCase())
        );
        setProductsList(filteredProducts);
        console.dir(filteredProducts);
      })
      .catch((error) => {
        console.error("Error al obtener la lista de productos:", error);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    setProductShopOwner(globalShopId);
    console.log("soy global shop id", globalShopId);

    console.log("soy product shop owner", productShopOwner);
    getProductsList();
  }, [productShopOwner]);

  useEffect(() => {
    getProductsList(); // Ejecutar la función cada vez que searchText cambie
  }, [searchText]);

  useEffect(() => {
    setProductShopOwner(globalShopId);
    getProductsList();
  }, [globalShopId]);

  return (
    <>
      <Header />
      <div className="container-update-shop">
        <div className="card shadow-sm">
          <div className="card-header flex justify-center">
            <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-gray-900 title-create-prod">Creación de productos</h2>
          </div>
          <div className="card-body flex flex-col">
            <div className="info-product mb-2">
              <span className="block font-medium leading-6 text-gray-900" id="basic-addon1">Producto:</span>
              <input
                type="text"
                value={productName}
                onChange={(Event) => {
                  setProductName(Event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-product"
                placeholder="Ingrese un producto"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>

            <div className="info-product mb-2">
              <span className="block font-medium leading-6 text-gray-900" id="basic-addon1">Cantidad:</span>
              <input
                type="number"
                value={productStock}
                onChange={(Event) => {
                  setProductStock(Event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-product"
                placeholder="Ingrese la cantidad"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>

            <div className="info-product mb-2">
              <span className="block font-medium leading-6 text-gray-900" id="basic-addon1">Categoría:</span>
              <input
                type="text"
                value={productCategory}
                onChange={(Event) => {
                  setProductCategory(Event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-product"
                placeholder="Ingrese la categoría"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>

            <div className="info-product mb-2">
              <span className="block font-medium leading-6 text-gray-900" id="basic-addon1">Descripción:</span>
              <textarea
                type="text"
                value={productDescription}
                onChange={(Event) => {
                  setProductDescription(Event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  resize-none placeholder:text-gray-400  sm:text-sm sm:leading-6 input-product"
                placeholder="Ingrese la descripción"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>

            <div className="info-product mb-2">
              <span className="block font-medium leading-6 text-gray-900" id="basic-addon1">Precio:</span>
              <input
                type="number"
                value={productPrize}
                onChange={(Event) => {
                  setProductPrize(Event.target.value);
                }}
                className="block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-product"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>
            <div className="mt-3 flex">
              <label className="block shadow-sm leading-6 text-gray-900 select-img-store" htmlFor="file">
                Seleccionar imagen del producto
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
          <div className="card-footer text-body-secondary d-flex justify-content-center">
            {editar ? (
              <div className="w-52 d-flex justify-content-between">
                <button
                  onClick={() => {
                    update();
                  }}
                  className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-update-prod"
                >
                  Actualizar
                </button>
                <button onClick={CancelarUpdate} className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-cancel-prod">
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={add} className="flex justify-center rounded-md px-3 py-1 font-semibold leading-6 text-white shadow-sm btn-new-prod">
                Registrar
              </button>
            )}
          </div>
        </div>

        <table className="table table-bordered shadow-sm info-prod-shops">
          <thead className="table-titles">
            <tr className="table-light tr-table">
              <th scope="col">Productos</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Categoria</th>
              <th scope="col">Descripcion</th>
              <th scope="col">Precio</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {productsList.map((val, key) => {
              return (
                <tr className="tr-table" key={val.productId}>
                  <td>{val.productName}</td>
                  <td>{val.productStock}</td>
                  <td>{val.productCategory}</td>
                  <td>{val.productDescription}</td>
                  <td>{val.productPrize}</td>
                  <td>
                    <div
                      className="flex items-center justify-center gap-1"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          editarProducto(val);
                          console.log("soy val en el boton", val);
                        }}
                        className="flex justify-center rounded-md px-3 py-0 leading-6 text-white shadow-sm btn-edit-prod"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteProducto(val.productId);
                        }}
                        className="flex justify-center rounded-md px-3 py-0 text-white leading-6 shadow-sm btn-delete-prod"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default UpdateProduct;
