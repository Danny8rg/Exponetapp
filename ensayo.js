app.post("/ProductStockUpdate", (req, res) => {
    const productIds = req.body.productsIds;
    const productQuantities = req.body.productsQuantities;
    const productsShopOwners = req.body.productsShopOwners;
    const newBuyCarContent = req.body.newBuyCarContent;
  
    console.log(productIds);
    console.log(productQuantities);
    console.log(productsShopOwners);
    console.log(newBuyCarContent);
  
    // Variable para llevar el registro de cuántas actualizaciones se han completado
    let updatedProductsCount = 0;
  
    // Itera sobre los IDs y cantidades para actualizar el stock de cada producto
    for (let i = 0; i < productIds.length; i++) {
      const currentProductId = productIds[i];
      const currentProductQuantity = productQuantities[i];
      const currentProductShopOwner = productsShopOwners[i];
      let originalProductShopOwner;
  
      // Utiliza una función que espera la respuesta antes de continuar con la lógica
      const getProductShopOwner = () => {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT productShopOwner FROM appProducts WHERE productId = ?",
            [currentProductId],
            (err, result) => {
              if (err) {
                console.log(err);
                reject("Error al obtener el ProductShopOwner Original");
              } else {
                console.log(result);
                resolve(result[0].productShopOwner);
              }
            }
          );
        });
      };
  
      // Realiza la actualización del stock y buyCarState solo si productShopOwner coincide
      getProductShopOwner()
        .then((result) => {
          originalProductShopOwner = result;
  
          if (currentProductShopOwner === originalProductShopOwner) {
            db.query(
              "UPDATE appProducts SET productStock = GREATEST(productStock - ?, 0), buyCarState = ? WHERE productId = ? AND productShopOwner = ?",
              [
                currentProductQuantity,
                currentProductId,
                currentProductShopOwner,
                newBuyCarContent,
              ],
              (err, result) => {
                if (err) {
                  console.log(err);
                  // Si hay un error, puedes enviar una respuesta de error
                  res.status(500).send("Error al actualizar el stock del producto");
                } else {
                  console.log(result);
                  // Actualización exitosa para el producto actual
                  updatedProductsCount++;
  
                  // Verifica si todas las actualizaciones han sido completadas
                  if (updatedProductsCount === productIds.length) {
                    // Todas las actualizaciones han sido completadas, envía una respuesta de éxito
                    res.status(200).send("Actualización de stock exitosa");
                  }
                }
              }
            );
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send(error);
        });
    }
  });
  