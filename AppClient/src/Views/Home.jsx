import ProductSamplerHome from "../Components/ProductSamplerHome/ProductSamplerHome";
import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";
import ContactUs from "../Components/ContactUs/ContactUs" 
import About from "../Components/About/About";
import { useState, useEffect, useContext } from "react";
import { ShopContextValues } from "../Components/Context/ShopContext";
import axios from "axios";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});
  const globalShopId = useContext(ShopContextValues);
  const quantityCards = 4;

  useEffect(() => {
    globalShopId.setGlobalShopId(0);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://exponetapp-8fxj.onrender.com/productsList"
        );
        setProducts(response.data);

        const stockData = response.data.reduce((acc, product) => {
          acc[product.productId] = product.productStock;
          return acc;
        }, {});
        setStock(stockData);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <section>
        <Header />
        <About />
        <ProductSamplerHome
          products={products}
          stock={stock}
          quantityCards={quantityCards}
          Route="/PrincipalShop"
        />
        <ContactUs />
        <Footer />
      </section>
    </>
  );
}

export default Home;
