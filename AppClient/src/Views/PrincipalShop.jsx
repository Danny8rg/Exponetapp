// En el componente PrincipalShop
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import ProductSampler from "../Components/ProductsSampler/ProductSampler";
import { ShopContextValues } from "../Components/Context/ShopContext";

function PrincipalShop() {
  const { globalShopName, setGlobalShopName } = useContext(ShopContextValues);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://exponetapp-8fxj.onrender.com/productsList"
        );
        setProducts(response.data);
        console.log(globalShopName);
        const stockData = response.data.reduce((acc, product) => {
          acc[product.productId] = product.productStock;
          return acc;
        }, {});
        setStock(stockData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <ProductSampler
        products={products}
        stock={stock}
        quantityCards={products.length}
        Route="/BuyCar"
      />
      <Footer />
    </>
  );
}

export default PrincipalShop;
