import { useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { IoStorefrontSharp } from "react-icons/io5";
import { ShopContextValues } from "../Components/Context/ShopContext";
import Swal from "sweetalert2";

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
        "https://exponetapp-8fxj.onrender.com/UserRead",
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
      <section className="flex min-h-full flex-1 flex-col justify-center  items-center px-6 py-12 lg:px-8 general">
        <div className="w-1/4 py-8 px-4 flex flex-col items-center justify-center rounded-md shadow-sm bg-gray-50 general-2">
          <img
            className="mx-auto h-20 w-auto image"
            src="/exponet-logo.webp"
            alt=""
          />
          <h1 className="mt-2 mb-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 title">
            Accede a tu cuenta
          </h1>
          <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6 formulary">
              <div>
                <label
                  htmlFor="userMail"
                  className="block text-sm font-medium leading-6 text-gray-900 gmail"
                >
                  Correo electrónico
                </label>
                <div className="mt-2 input-gmail">
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 input-login"
                    type="email"
                    placeholder="example@mail.com"
                    id="userMail"
                    name="userMail"
                    value={formData.userMail}
                    required
                    autoComplete="email"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between general-password">
                  <label
                    htmlFor="userPassword"
                    className="block text-sm font-medium leading-6 text-gray-900 password"
                  >
                    Contraseña
                  </label>
                  {/* <div className="text-sm">
                    <a href="#" className="font-semibold no-underline link-new-password forgot">
                      Forgot password?
                    </a>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 input-login"
                    type="password"
                    id="userPassword"
                    name="userPassword"
                    autoComplete="current-password"
                    required
                    value={formData.userPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div id="buttonbox">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm btn-login"
                >
                  Iniciar sesión
                </button>
                <hr />
                <div className="flex items-center justify-center inicio">
                  <Link
                    className="flex w-22 justify-center rounded-md px-3 py-1 text-sm font-semibold no-underline leading-6 text-white shadow-sm btn-home-login"
                    to={"/"}
                  >
                    Inicio{" "}
                    <IoStorefrontSharp className="mx-1 w-auto self-center" />
                  </Link>
                </div>
              </div>
            </form>
            <p className="mt-4 mb-0 text-center text-sm text-gray-500 question">
              ¿No se ha registrado?{""}
              <a
                type="submit"
                className="ml-1 font-semibold no-underline leading-6 link-new-account"
                onClick={navigateToRegister}
              >
                Cree una nueva cuenta
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;

// <>
//       <section className="first-section">
//         <section className="second-section">
//           <section className="left-section">
//             <h1 className="left-title">EXPONET</h1>
//             <img
//               className="left-logo"
//               src="./exponet-logo-webp"
//               alt=""
//             />
//             <Link className="left-link" to={"/"}>
//               <IoStorefrontSharp className="left-link-icon" /> Inicio
//             </Link>
//           </section>
//           <form onSubmit={handleSubmit} className="form-login">
//             <h4 className="form-title">Acceso</h4>
//             <div className="info">
//               <label htmlFor="userMail" className="login-label">
//                 Correo electrónico
//               </label>
//               <input
//                 className="date-input"
//                 type="email"
//                 placeholder="Ej: correo@mail.com"
//                 id="userMail"
//                 name="userMail"
//                 value={formData.userMail}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="info mb-3">
//               <label htmlFor="userPassword" className="login-label">
//                 Contraseña
//               </label>
//               <input
//                 className="date-input"
//                 type="password"
//                 id="userPassword"
//                 name="userPassword"
//                 value={formData.userPassword}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="info" id="buttonbox">
//               <button type="submit" className="btn-login">
//                 Iniciar sesión
//               </button>
//               <hr />
//               <button
//                 type="submit"
//                 className="btn-new-account"
//                 onClick={navigateToRegister}
//               >
//                 Cree una nueva cuenta
//               </button>
//             </div>
//           </form>
//         </section>
//       </section>
//     </>
