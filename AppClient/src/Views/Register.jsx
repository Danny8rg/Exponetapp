import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import { IoStorefrontSharp } from "react-icons/io5";
import "./Register.css";
import Swal from "sweetalert2";

function RegisterForm() {
  const [formData, setFormData] = useState({
    userName: "",
    userMail: "",
    userPassword: "",
    confirmPassword: "",
    userAdress: "",
    userRole: "",
    file: null,
    passwordError: "", // Agregar estado para el error de contraseña
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validar las contraseñas en tiempo real
    if (name === "userPassword" || name === "confirmPassword") {
      const passwordRegex = /^(?=.*[A-Z]).{6,}$/; // Al menos 6 caracteres con al menos una mayúscula
      if (!passwordRegex.test(value)) {
        setFormData((prevState) => ({
          ...prevState,
          passwordError:
            "La contraseña debe tener al menos 6 caracteres y una mayúscula",
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          passwordError: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.userPassword !== formData.confirmPassword) {
      console.error("Las contraseñas no coinciden");
      Swal.fire({
        icon: "error",
        text: "Las contraseñas no coinciden!",
      });
      return;
    }

    if (formData.passwordError) {
      console.error("La contraseña no cumple con los requisitos");
      Swal.fire({
        icon: "warning",
        title: "La contraseña no cumple con los requisitos",
        text: formData.passwordError,
      });
      return;
    }

    if (
      !formData.userName ||
      !formData.userMail ||
      !formData.userPassword ||
      !formData.confirmPassword ||
      !formData.userRole
    ) {
      console.error("Por favor, complete todos los campos");
      Swal.fire({
        icon: "error",
        text: "Complete todos los campos requeridos en el formulario!",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userName", formData.userName);
    formDataToSend.append("userMail", formData.userMail);
    formDataToSend.append("userPassword", formData.userPassword);
    formDataToSend.append("confirmPassword", formData.confirmPassword);
    formDataToSend.append("userAdress", formData.userAdress);
    formDataToSend.append("userRole", formData.userRole);
    formDataToSend.append("file", formData.file);

    try {
      const response = await axios.post(
        "https://exponetapp-8fxj.onrender.com/createUser",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      Swal.fire({
        title: "¡Registro exitoso!",
        icon: "success",
      });
      navigate("/Login");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const handleFileChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      file: event.target.files[0],
    }));
  };

  return (
    <>
      <section className="flex min-h-full flex-1 flex-col justify-center  items-center px-6 py-12 bg-white lg:px-8">
        <div className="w-2/6 py-4 px-4 flex flex-col items-center justify-center rounded-md shadow-sm bg-gray-50 general-register">
          <img
            className="mx-auto h-20 w-auto image-register"
            src="https://res.cloudinary.com/dooxttior/image/upload/v1712008832/nohlp5rsuvaaacjolniw.webp"
            alt=""
          />
          <h1 className="mt-0 mb-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 title-register">
            Crea una cuenta
          </h1>
          <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm general2-register">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium leading-6 text-gray-900 label-register"
                >
                  Nombre de usuario
                </label>
                <div className="mt-0">
                  <input
                    className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-register"
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder="Nombre completo"
                    required
                    value={formData.userName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <label
                htmlFor="userMail"
                className="block text-sm font-medium leading-6 text-gray-900 label-register"
              >
                Correo electrónico
              </label>
              <div className="mt-0">
                <input
                  className={`block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-register ${
                    formData.emailError ? "border-red-500" : ""
                  }`}
                  type="email"
                  placeholder="example@mail.com"
                  id="userMail"
                  name="userMail"
                  required
                  value={formData.userMail}
                  onChange={handleChange}
                />
                {formData.emailError && (
                  <p className="text-red-500 text-xs mt-1">
                    {formData.emailError}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="userAdress"
                  className="block text-sm font-medium leading-6 text-gray-900 label-register"
                >
                  Direccion de residencia
                </label>
                <div className="mt-0">
                  <input
                    className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-register"
                    type="text"
                    id="userAdress"
                    name="userAdress"
                    placeholder="Dirección"
                    required
                    value={formData.userAdress}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="userPassword"
                  className="block text-sm font-medium leading-6 text-gray-900 label-register"
                >
                  Contraseña
                </label>
                <div className="mt-0">
                  <input
                    className={`block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-register ${
                      formData.passwordError ? "border-red-500" : ""
                    }`}
                    type="password"
                    id="userPassword"
                    name="userPassword"
                    required
                    value={formData.userPassword}
                    onChange={handleChange}
                  />
                  {formData.passwordError && (
                    <p className="text-red-500 text-xs mt-1">
                      {formData.passwordError}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900 label-register"
                >
                  Confirmar contraseña
                </label>
                <div className="mt-0">
                  <input
                    className={`block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-register ${
                      formData.passwordError ? "border-red-500" : ""
                    }`}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="userRole"
                  className="block text-sm font-medium leading-6 text-gray-900 label-register"
                >
                  Rol
                </label>
                <select
                  className="block w-36 rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6 input-register input-rol"
                  id="userRole"
                  name="userRole"
                  required
                  value={formData.userRole}
                  onChange={handleChange}
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="comprador">Comprador</option>
                </select>
              </div>
              <div>
                <div className="mt-3 flex">
                  <label
                    className="block text-sm shadow-sm font-medium leading-6 text-gray-900 select-img-store2"
                    htmlFor="file"
                  >
                    Seleccionar imagen de usuario
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {selectedFile && (
                    <div className="file-info2">
                      <p className="result-select-img2">{selectedFile.name}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex mt-3">
                <button
                  type="submit"
                  className="flex mr-2 w-full justify-center rounded-md px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm btn-register"
                >
                  Registrarse
                </button>
                <div className="flex items-center justify-center">
                  <Link
                    className="flex w-20 justify-center rounded-md px-3 py-1 text-sm font-semibold no-underline leading-6 text-white shadow-sm btn-home-register"
                    to={"/"}
                  >
                    {/* <IoStorefrontSharp className="mx-auto w-auto self-center" />  */}
                    Inicio
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default RegisterForm;
