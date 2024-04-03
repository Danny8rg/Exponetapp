import "./index.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Views/Home";
import Register from "./Views/Register";
import Login from "./Views/Login";
import CreateShop from "./Views/CreateShop";
import UpdateShop from "./Views/UpdateShop";
import BuyCar from "./Views/BuyCar";
import PrincipalShop from "./Views/PrincipalShop";
import Shops from "./Views/Shops";
import UserHistory from "./Views/UserHistory";
import OrdersManagment from "./Views/OrdersManagment";
import ShopsManagment from "./Views/ShopsManagment";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/CreateShop" element={<CreateShop />}></Route>
        <Route path="/UpdateShop" element={<UpdateShop />} />
        <Route path="/BuyCar" element={<BuyCar />}></Route>
        <Route path="/PrincipalShop" element={<PrincipalShop />}></Route>
        <Route path="/Shops" element={<Shops />}></Route>
        <Route path="/UserHistory" element={<UserHistory />}></Route>    
        <Route path="/OrdersManagment" element={<OrdersManagment />}> </Route> 
        <Route path="/ShopsManagment" element={<ShopsManagment />}> </Route>
      </Routes>
    </>
  );
}

export default App;
