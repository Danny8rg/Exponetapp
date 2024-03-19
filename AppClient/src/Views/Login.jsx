import { useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { IoStorefrontSharp } from "react-icons/io5";
import { ShopContextValues } from "../Components/Context/ShopContext";
import Swal from "sweetalert2";
// import Header from '../Components/Header/Header';
// import Footer from '../Components/Footer/Footer';

function Login() {
  const [formData, setFormData] = useState({
    userMail: "",
    userPassword: "",
  });

  const { buyCarProducts, setBuyCarProducts } = useContext(ShopContextValues);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigateToRegister = () => {
    navigate("/Register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://exponet-app-pjv8.vercel.app/UserRead",
        {
          userMail: formData.userMail,
          userPassword: formData.userPassword,
          userRoll: formData.userRoll,
        }
      );

      console.log(response.data);

      if (response.data.userId) {
        Cookies.set("userId", response.data.userId);
        Cookies.set("userRoll", response.data.userRoll);
        console.log("Cookie userId establecida:", response.data.userId);
        setBuyCarProducts([]);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Bienvenido",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <>
      <section className="first-section">
        <section className="second-section">
          <section className="left-section">
            <h1 className="left-title">EXPONET</h1>
            <img
              className="left-logo"
              src="https://media.discordapp.net/attachments/1088828343731900429/1215287895284518912/Captura_de_pantalla_2024-03-07_080922-removebg-preview.png?ex=65fc340d&is=65e9bf0d&hm=bd96221de684f02eb50594f4791686e8ada3664468ab3100ad71003a35943a34&=&format=webp&quality=lossless&width=622&height=482"
              alt=""
            />
            <Link className="left-link" to={"/"}>
              <IoStorefrontSharp className="left-link-icon" /> Inicio
            </Link>
          </section>
          <form onSubmit={handleSubmit} className="form-login">
            <h4 className="form-title">Acceso</h4>
            <div className="info">
              <label htmlFor="userMail" className="login-label">
                Correo electrónico
              </label>
              <input
                className="date-input"
                type="email"
                placeholder="Ej: correo@mail.com"
                id="userMail"
                name="userMail"
                value={formData.userMail}
                onChange={handleChange}
              />
            </div>
            <div className="info mb-3">
              <label htmlFor="userPassword" className="login-label">
                Contraseña
              </label>
              <input
                className="date-input"
                type="password"
                id="userPassword"
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
              />
            </div>
            <div className="info" id="buttonbox">
              <button type="submit" className="btn-login">
                Iniciar sesión
              </button>
              <hr />
              <button
                type="submit"
                className="btn-new-account"
                onClick={navigateToRegister}
              >
                Cree una nueva cuenta
              </button>
            </div>
          </form>
        </section>
      </section>
    </>
  );
}

export default Login;
