import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { useContext } from "react";
import { ShopContextValues } from "../Components/Context/ShopContext";
import "./Shops.css";

function Shops() {
  const [shops, setShops] = useState([]);
  const { globalShopId, setGlobalShopId, globalShopName, setGlobalShopName } =
    useContext(ShopContextValues);
  const navigate = useNavigate();

  function SettingShopId(shopId, shopName) {
    setGlobalShopId(shopId), setGlobalShopName(shopName);
    console.log(shopId, shopName);
  }

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get("https://exponetapp-8fxj.onrender.com/shopsList");
        setShops(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de tiendas:", error);
      }
    };

    fetchShops();
  }, []);

  const handleEnterShop = (shopId, shopName) => {
    SettingShopId(shopId, shopName);
    navigate("/PrincipalShop");
  };

  return (
    <>
      <Header />
      <div className="shops-container">
        <div className="box-title-shop">
          <h1 className="product-title-shop">Tiendas Disponibles</h1>
        </div>
        {shops.map((shop) => (
          <div key={shop.shopId} className="shop-card shadow-sm bg-gray-50">
            <div className="box-img-shops">
              <img
                src={shop.shopimgurl}
                alt={shop.shopName}
                className="shops-img"
              />
            </div>
            <div className="shops-info p-0">
              <h4 className="shops-title m-0">{shop.shopName}</h4>
              <p className="shops-descrip m-0">{shop.shopComments}</p>
              <button
                className="flex justify-center rounded-md px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm shops-btn"
                onClick={() => handleEnterShop(shop.shopId, shop.shopName)}
              >
                Entrar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}

export default Shops;