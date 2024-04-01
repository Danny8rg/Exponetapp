import React, { createContext, useState } from "react";

export const ShopContextValues = createContext();

function ShopContext({ children }) {
  const [globalShopId, setGlobalShopId] = useState("");
  const [globalShopName, setGlobalShopName] = useState("");
  const [buyCarProducts, setBuyCarProducts] = useState([]);
  const [searchText, setSearchText] = useState("");

  return (
    <ShopContextValues.Provider
      value={{
        globalShopId,
        setGlobalShopId,
        globalShopName,
        setGlobalShopName,
        buyCarProducts,
        setBuyCarProducts,
        searchText,
        setSearchText
      }}
    >
      {children}
    </ShopContextValues.Provider>
  );
}

export default ShopContext;
