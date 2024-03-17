import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ShopContextValues } from "../Context/ShopContext";
import { MdShoppingCart } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(Cookies.get("userId"));
  const [userRoll, setUserRoll] = useState(Cookies.get("userRoll"));
  const { buyCarProducts, setBuyCarProducts } = useContext(ShopContextValues);

  const handleLogout = () => {
    Cookies.remove("userId");
    setBuyCarProducts([]);
    setUserId("");
    navigate("/");
  };

  return (
    <>
      <header className="header-home">
        <ul className="filter-nav">
          <li className="box-input-search">
            <FaSearch className="icon-search" />
            <input type="text" name="" id="" placeholder="Buscar producto" />
          </li>
          {/* AQUÍ CAMBIÉ PASÉ EL COMPONENTE 'ICON-BOX' A UNA ETIQUETA 'Link' PARA QUE REDIRIJA AL INICIO YA QUE ANTERIORMENTE ERA UN 'BUTTON' SIN FUNCIÓN */}
          <Link to="/" className="icon-box">
            <h1 className="icon-txt">EXPONET</h1>
            <img
              className="logo-header"
              src="https://media.discordapp.net/attachments/1088828343731900429/1215287895284518912/Captura_de_pantalla_2024-03-07_080922-removebg-preview.png?ex=65fc340d&is=65e9bf0d&hm=bd96221de684f02eb50594f4791686e8ada3664468ab3100ad71003a35943a34&=&format=webp&quality=lossless&width=622&height=482"
              alt=""
            />
          </Link>
          {/* <li className="box-select-category">
            <select name="" id="" placeholder="Categorías">
              <option value="" disabled selected>
                Categorías
              </option>
              <option value="">Ensayo1</option>
              <option value="">Ensayo2</option>
            </select>
          </li> */}
        </ul>
        <nav>
          <ul className="links-nav">
            <li>
              <Link to="/" className="link-header-b">
                Inicio
              </Link>
            </li>
            {userId ? (
              <>
                {userRoll === "vendedor" && (
                  <>
                    <li>
                      <Link to="/CreateShop" className="link-header-b">
                        Crear tienda
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
                      <Link to="/Shops" className="link-header-b">
                        Tiendas
                      </Link>
                    </li>
                    <li>
                      <Link to="/UserHistory" className="link-header-b">
                        Historial
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="link-header-b">
                        Cerrar sesión
                      </button>
                    </li>
                    <li>
                      <Link to="/BuyCar">
                        <MdShoppingCart className="link-header-cart" />
                      </Link>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link to="/Login" className="link-header-b">
                    Iniciar sesión
                  </Link>
                </li>
                {/* Agrega la condición para mostrar el botón de Tiendas cuando el usuario no está autenticado */}
                <li>
                  <Link to="/Shops" className="link-header-b">
                    Tiendas
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
