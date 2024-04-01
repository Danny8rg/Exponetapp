import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ShopContextValues } from "../Context/ShopContext";
import Axios from "axios";
import { MdShoppingCart } from "react-icons/md";
// import { FaSearch } from "react-icons/fa";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa"; // Importa los íconos de hamburguesa y de cerrar
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(Cookies.get("userId"));
  const [userRoll, setUserRoll] = useState(Cookies.get("userRoll"));
  const { buyCarProducts, setBuyCarProducts, searchText, setSearchText } =
    useContext(ShopContextValues);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState();

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
      `https://exponetapp-8fxj.onrender.com/readOneUser/${userId}`
    ).then((response) => {
      setUserInfo(response.data);
      console.log("soy el userInfo");
      console.log(response.data);
      console.log(userInfo);
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
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
            <img className="logo-header" src="./exponet-logo.webp" alt="" />
          </Link>
          <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
            <ul className="filter-nav">
              <li className="box-input-search">
                <FaSearch className="icon-search" />
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Buscar producto"
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
              </li>
            </ul>
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
            <div className="profile-info shadow-sm">
              <img src={userInfo[0].imgurl} alt="" className="profile-image" />
              <div className="flex items-center gap-1 profile-dates">
                <p className="profile-user">{userInfo[0].userName}</p>
                <p className="profile-rol">{userInfo[0].userRoll}</p>
              </div>
            </div>
          )}
          <div className="menu-toggle shadow-sm" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
