import ProductSamplerHome from "../Components/ProductSamplerHome/ProductSamplerHome";
import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";
import ContactUs from "../Components/ContactUs/ContactUs";
import About from "../Components/About/About";
import { useState, useEffect, useContext } from "react";
import { ShopContextValues } from "../Components/Context/ShopContext";
import axios from "axios";
import "./Home.css";
import Comments from "../Components/Comments/Comments";
import AboutInfo from "../Components/AboutInfo/AboutInfo";

function Home() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});
  const globalShopId = useContext(ShopContextValues);
  const { searchText } = useContext(ShopContextValues);
  useContext(ShopContextValues);
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

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <>
      <section>
        <Header />
        <About />
        <ProductSamplerHome
          products={filteredProducts}
          stock={stock}
          quantityCards={quantityCards}
          Route="/PrincipalShop"
        />
        <AboutInfo />
        <Footer />
      </section>
    </>
  );
}

export default Home;
