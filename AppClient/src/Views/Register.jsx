import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoStorefrontSharp } from "react-icons/io5";
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
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.userPassword !== formData.confirmPassword) {
      console.error("Las contraseñas no coinciden");
      Swal.fire({
        icon: "error",
        text: "Contraseñas no coinciden!",
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userMail)) {
      console.error("Formato de correo electrónico inválido");
      Swal.fire({
        icon: "warning",
        title: "Formato de correo electronico invalido",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/createUser", {
        userName: formData.userName,
        userMail: formData.userMail,
        userPassword: formData.userPassword,
        userAdress: formData.userAdress,
        userRole: formData.userRole,
      });

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

  return (
    <>
      <section className="one-section">
        <section className="two-section">
          <form onSubmit={handleSubmit} className="form-register">
            <h4 className="form-title-b">Registro</h4>
            <div className="info-b">
              <label
                htmlFor="userName"
                className="register-label"
                placeholder=""
              >
                Nombre De Usuario
              </label>
              <input
                className="date-input-b"
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div className="info-b">
              <label htmlFor="userMail" className="register-label">
                Correo Electrónico
              </label>
              <input
                className="date-input-b"
                type="email"
                id="userMail"
                name="userMail"
                value={formData.userMail}
                onChange={handleChange}
              />
            </div>
            <div className="info-b">
              <label htmlFor="userAdress" className="register-label">
                Direccion de residencia
              </label>
              <input
                className="date-input-b"
                type="text"
                id="userAdress"
                name="userAdress"
                value={formData.userAdress}
                onChange={handleChange}
              />
            </div>
            <div className="info-b">
              <label htmlFor="userPassword" className="register-label">
                Contraseña
              </label>
              <input
                className="date-input-b"
                type="password"
                id="userPassword"
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
              />
            </div>
            <div className="info-b">
              <label htmlFor="confirmPassword" className="register-label">
                Confirmar Contraseña
              </label>
              <input
                className="date-input-b"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="info-b">
              <label htmlFor="userRole" className="register-label">
                Rol
              </label>
              <select
                className="role-input"
                id="userRole"
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
              >
                <option value="vendedor">Vendedor</option>
                <option value="comprador">Comprador</option>
              </select>
            </div>
            <button type="submit" className="btn-register">
              Registrarse
            </button>
          </form>
          <section className="right-section">
            <h1 className="right-title">EXPONET</h1>
            <img
              className="right-logo"
              src="https://media.discordapp.net/attachments/1088828343731900429/1215287895284518912/Captura_de_pantalla_2024-03-07_080922-removebg-preview.png?ex=65fc340d&is=65e9bf0d&hm=bd96221de684f02eb50594f4791686e8ada3664468ab3100ad71003a35943a34&=&format=webp&quality=lossless&width=622&height=482"
              alt=""
            />
            <div className="info-b-right">
              <Link className="right-link" to={"/"}>
                <IoStorefrontSharp /> Inicio
              </Link>
              <hr />
            </div>
          </section>
        </section>
      </section>
    </>
  );
}

export default RegisterForm;
