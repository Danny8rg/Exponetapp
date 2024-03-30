import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ShopContextValues } from "../Context/ShopContext";
import Axios from "axios"; 
import { MdShoppingCart } from "react-icons/md";
// import { FaSearch } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(Cookies.get("userId"));
  const [userRoll, setUserRoll] = useState(Cookies.get("userRoll"));
  const { buyCarProducts, setBuyCarProducts } = useContext(ShopContextValues);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    Cookies.remove("userId");
    setBuyCarProducts([]);
    setUserId("");
    navigate("/");
  };

  const location = useLocation();

  const getUserInfo = (userId) => {
    Axios.get(
      `http://localhost:3000/readOneUser/${userId}`
    ).then((response) => {
      setUserInfo(response.data);
      console.log("soy el userInfo")
      console.log(response.data)
      console.log(userInfo);
    });
  };

  useEffect(() => {
    if (userId) {
      getUserInfo(userId);
      console.log(userInfo);
    }
  }, [userId]); // Este efecto se ejecutará solo cuando userId cambie
  

  return (
    <>
      <header className="header-home">
        <div className="h-full flex items-center justify-center header-home-box">
          <Link to="/" className="icon-box">
            <h1 className="icon-txt">EXPONET</h1>
            <img
              className="logo-header"
              src="https://media.discordapp.net/attachments/1088828343731900429/1215287895284518912/Captura_de_pantalla_2024-03-07_080922-removebg-preview.png?ex=65fc340d&is=65e9bf0d&hm=bd96221de684f02eb50594f4791686e8ada3664468ab3100ad71003a35943a34&=&format=webp&quality=lossless&width=622&height=482"
              alt=""
            />
          </Link>
          <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
            {/*   <ul className="filter-nav">
              <li className="box-input-search">
                <FaSearch className="icon-search" />
                <input type="text" name="" id="" placeholder="Buscar producto" />
              </li>
            </ul> **/}
            <ul className="links-nav">
              <li>
                <Link
                  to="/"
                  className={`link-header ${
                    location.pathname === "/" ? "link-header-b" : ""
                  }`}
                >
                  Inicio
                </Link>
              </li>
              {userId ? (
                <>
                  {userRoll === "vendedor" && (
                    <>
                      <li>
                        <Link
                          to="/CreateShop"
                          className={`link-header ${
                            location.pathname === "/CreateShop"
                              ? "link-header-b"
                              : ""
                          }`}
                        >
                          Crear tienda
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/ShopsManagment"
                          className={`link-header ${
                            location.pathname === "/ShopsManagment"
                              ? "link-header-b"
                              : ""
                          }`}
                        >
                          Gestión tiendas
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="logout">
                          Cerrar sesión
                        </button>
                      </li>
                    </>
                  )}
                  {userRoll === "comprador" && (
                    <>
                      <li>
                        <Link
                          to="/Shops"
                          className={`link-header ${
                            location.pathname === "/Shops"
                              ? "link-header-b"
                              : ""
                          }`}
                        >
                          Tiendas
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/UserHistory"
                          className={`link-header ${
                            location.pathname === "/UserHistory"
                              ? "link-header-b"
                              : ""
                          }`}
                        >
                          Historial
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className={`link-header`}
                        >
                          Cerrar sesión
                        </button>
                      </li>
                      <li>
                        <Link
                          to="/BuyCar"
                          className={`link-header-cart ${
                            location.pathname === "/BuyCar"
                              ? "link-header-cart-b"
                              : ""
                          }`}
                        >
                          <MdShoppingCart />
                        </Link>
                      </li>
                    </>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <Link to="/Login" className={`link-header`}>
                      Iniciar sesión
                    </Link>
                  </li>
                  {/* Agrega la condición para mostrar el botón de Tiendas cuando el usuario no está autenticado */}
                  <li>
                    <Link
                      to="/Shops"
                      className={`link-header ${
                        location.pathname === "/Shops" ? "link-header-b" : ""
                      }`}
                    >
                      Tiendas
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          {userInfo && userInfo.length > 0 && (
  <div className="profile-info">
    <p>{userInfo[0].userName}</p>
    <p>{userInfo[0].userRoll}</p>
    <img src={userInfo[0].imgurl} alt="" className="profile-image"/>
  </div>
)}
        </div>
      </header>
    </>
  );
};

export default Header;
