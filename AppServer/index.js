const express = require("express");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");

// cludinary

async function uploadImage(filePath) {
  cloudinary.config({
    cloud_name: "dooxttior",
    api_key: "148272244235469",
    api_secret: "iGx6mGHsLBGrxiIdXrl60oOyX4s",
    secure: true,
  });
  cloudinary.api.usage((error, result) => {
    if (error) {
      console.error("Error al verificar la conexión con Cloudinary:", error);
    } else {
      console.log(
        "Conexión exitosa con Cloudinary. Información de uso de la cuenta:",
        result
      );
    }
  });
  return await cloudinary.uploader.upload(filePath, {
    equalize: true,
    quality: "auto",
  });
}

// cloudinary end

cloudinary.config({
  cloud_name: "dooxttior",
  api_key: "148272244235469",
  api_secret: "iGx6mGHsLBGrxiIdXrl60oOyX4s",
});

app.use(cors("*"));
app.use(express.json());
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));

const db = mysql.createPool({
  host: "be2akte2ntisg7onaynu-mysql.services.clever-cloud.com",
  user: "umitr9ccarbghg5i",
  password: "i1JW2NSotnKXIjkAkHTR",
  database: "be2akte2ntisg7onaynu",
  insecureAuth: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const db = mysql.createPool({
//   // connectionLimit: 10, // Establecer un límite de conexiones
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "exponetApp",
//   port: 3306,
// });

db.getConnection(function (connect) {
  if (connect) {
    console.log(connect.name);
  } else {
    console.log("esta conectado a mysql");
  }
  // console.log("esta conectado a mysql", connect);
});

app.post("/createUser", async (req, res) => {
  try {
    const { userName, userMail, userPassword, userAdress, userRole } = req.body;

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    db.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error de conexión a la base de datos");
        return;
      }

      connection.query(
        "INSERT INTO appUsers (userName, userMail, userPassword, userAdress, userRoll) VALUES (?, ?, ?, ?, ?)",
        [userName, userMail, hashedPassword, userAdress, userRole],
        async (error, result) => {
          connection.release();

          if (error) {
            console.log(error);
            res.status(500).send("Error al registrar el usuario");
          } else {
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              auth: {
                user: "exponetapppuntocom@gmail.com",
                pass: "krjkuexigsvcbgnk",
              },
              tls: {
                rejectUnauthorized: false,
              },
            });

            await transporter
              .sendMail({
                from: "exponetapppuntocom@gmail.com",
                to: userMail,
                subject: "Mensajeria de notificaciónes de Invensys",
                html: ` Mensaje Nuevo
                                        `,
              })
              .then((res) => {
                console.log("Se envio ok", res);
                return "registro exitoso";
              })
              .catch((err) => {
                console.log("Error", err);
                return "error al registrar el usuario";
              });
          }
          res.status(200).send("registro exitoso");
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error interno del servidor");
  }
});

app.post("/userRead", (req, res) => {
  const { userMail, userPassword } = req.body;

  console.log(userMail);
  console.log(userPassword);

  db.query(
    "SELECT * FROM appUsers WHERE userMail = ?",
    [userMail],
    async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error interno del servidor");
      } else {
        if (result.length > 0) {
          const match = await bcrypt.compare(
            userPassword,
            result[0].userPassword
          );
          if (match) {
            res.status(200).json(result[0]);
          } else {
            res.status(401).send("Contraseña incorrecta");
          }
        } else {
          res.status(404).send("Usuario no encontrado");
        }
      }
    }
  );
});

app.post(
  "/createShop",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  async (req, res) => {
    try {
      const {
        shopName,
        shopTell,
        shopMail,
        shopAdress,
        shopOwner,
        shopComments,
      } = req.body;

      let imgurl = null;
      let imgid = null;
      if (req.files?.file) {
        const result = await uploadImage(req.files.file.tempFilePath);
        imgurl = result.secure_url;
        imgid = result.public_id;
      }

      db.query(
        "INSERT INTO appShops (shopName, shopTell, shopMail, shopAdress, shopOwner, shopComments, shopImgUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          shopName,
          shopTell,
          shopMail,
          shopAdress,
          shopOwner,
          shopComments,
          imgurl,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error al crear la tienda");
          } else {
            res.status(200).send(result);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
);

app.put(
  "/updateShop",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  async (req, res) => {
    const { shopName, shopAdress, shopTell, shopMail, shopComments, shopId } =
      req.body;

    let imgurl = null;
    let imgid = null;
    if (req.files?.file) {
      const result = await uploadImage(req.files.file.tempFilePath);
      imgurl = result.secure_url;
      imgid = result.public_id;
    }

    db.query(
      "UPDATE appShops SET shopName=?, shopAdress=?, shopTell=?, shopMail=?, shopComments=?, shopImgUrl=? WHERE shopId=?",
      [shopName, shopAdress, shopTell, shopMail, shopComments, imgurl, shopId],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al actualizar la tienda");
        } else {
          res.status(200).send(result);
        }
      }
    );
  }
);

app.get("/shopsList", (req, res) => {
  db.query("SELECT * FROM appShops", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al obtener la lista de tiendas");
    } else {
      res.status(200).send(result);
      console.log(result);
    }
  });
});

app.get("/shopsListCreateShops/:shopOwner", (req, res) => {
  const shopOwner = req.params.shopOwner;
  console.log(shopOwner);
  db.query(
    "SELECT * FROM appShops WHERE shopOwner = ?",
    shopOwner,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al obtener la lista de tiendas");
      } else {
        res.status(200).send(result);
        console.log(result);
      }
    }
  );
});

app.put("/deleteShop/:shopId", (req, res) => {
  const ShopId = req.params.shopId;

  db.query("DELETE FROM appShops WHERE shopId=?", ShopId, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al eliminar la tienda ");
    } else {
      res.status(200).send(result);
    }
  });
});

app.put("/deleteProducts/:shopId"),
  (req, res) => {
    const ShopId = req.params.shopId;

    db.query(
      "DELETE FROM appProducts Where productShopOwner = ?",
      ShopId,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al eliminar los productos de la tienda");
        } else {
          res.status(200).send(result);
        }
      }
    );
  };

app.post(
  "/createProduct",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  async (req, res) => {
    const {
      productName,
      productStock,
      productCategory,
      productDescription,
      productPrize,
      productShopOwner,
    } = req.body;

    let imgurl = null;
    let imgid = null;
    if (req.files?.file) {
      const result = await uploadImage(req.files.file.tempFilePath);
      imgurl = result.secure_url;
      imgid = result.public_id;
    }
    console.log("soy la imagen del producto", imgurl);
    db.query(
      "INSERT INTO appProducts(productName, productDescription, productPrize, productStock, productCategory, productImgUrl, productShopOwner ) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        productName,
        productDescription,
        productPrize,
        productStock,
        productCategory,
        imgurl,
        productShopOwner,
      ],
      async (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al registrar el producto");
        } else {
          await fs.remove(req.files?.file.tempFilePath);
          res.status(200).send("Registro de producto exitoso");
        }
      }
    );
  }
);

app.get("/productsList", (req, res) => {
  db.query("SELECT * FROM appProducts", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al obtener la lista de productos");
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/productsListUpdateProducts/:productShopOwner", (req, res) => {
  const productShopOwner = req.params.productShopOwner;

  db.query(
    "SELECT * FROM appProducts WHERE productShopOwner = ?",
    productShopOwner,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al obtener la lista de productos");
      } else {
        res.status(200).send(result);
      }
    }
  );
});

app.put("/deleteProduct/:productId", (req, res) => {
  const productId = req.params.productId;

  db.query(
    "DELETE FROM appProducts WHERE productId=?",
    productId,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al eliminar el producto ");
      } else {
        res.status(200).send(result);
      }
    }
  );
});

app.put(
  "/updateProduct",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  async (req, res) => {
    const {
      productId,
      productName,
      productStock,
      productCategory,
      productDescription,
      productPrize,
    } = req.body;

    let imgurl = null;
    let imgid = null;
    if (req.files?.file) {
      const result = await uploadImage(req.files.file.tempFilePath);
      imgurl = result.secure_url;
      imgid = result.public_id;
    }

    db.query(
      "UPDATE appProducts SET productName=?, productDescription=?, productPrize=?, productStock=?, productCategory=?, productimgurl=? WHERE productId=?",
      [
        productName,
        productDescription,
        productPrize,
        productStock,
        productCategory,
        imgurl,
        productId,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al actualizar la tienda");
        } else {
          res.status(200).send(result);
        }
      }
    );
  }
);

app.get("/commentsList", (req, res) => {
  db.query("CALL GetCommentsWithUser()", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al obtener la lista de comentarios");
    } else {
      res.status(200).send(result[0]);
    }
  });
});

// carrito compras

app.post("/createBuyCar", (req, res) => {
  const { buyCarContent, buyCarUser, buyCarState } = req.body;

  console.log(buyCarContent);
  console.log(buyCarUser);
  console.log(buyCarState);

  db.query(
    "INSERT INTO appBuyCars (buyCarContent, buyCarUser, buyCarState) VALUES (?, ?, ?)",
    [buyCarContent, buyCarUser, buyCarState],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el carrito de compras ");
      } else {
        res.status(200).send(result);
      }
    }
  );
});

app.get("/buyCarsList", async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM appBuyCars ", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).send(result);
    console.log(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la lista de carritos de compras");
  }
});

app.get("/ordersManagmentUsers", (req, res) => {
  db.query("SELECT * FROM appUsers", (err, result) => {
    if (err) {
      res.status(400).send("Error al obtener la lista de usuarios");
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/ordersManagmentBuyCarList", (req, res) => {
  db.query("SELECT * FROM appBuyCars", (err, result) => {
    if (err) {
      res.status(400).send("Error al obtener la lista de Carritos De Compras");
    } else {
      res.status(200).send(result);
    }
  });
});

app.post("/ProductStockUpdate", (req, res) => {
  const productIds = req.body.productsIds;
  const productQuantities = req.body.productsQuantities;
  const productsShopOwners = req.body.productsShopOwners;
  const newBuyCarContent = req.body.newBuyCarContent;

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
            "UPDATE appProducts SET productStock = GREATEST(productStock - ?, 0), buyCarState = ? WHERE productId = ? AND productShopOwner = ?, buyCarContent = ?",
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
                res
                  .status(500)
                  .send("Error al actualizar el stock del producto");
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

          db.query("UPDATE buyCarContent FROM appBuyCar WHERE buyCarId = ?", [
            currentProductId,
          ]),
            (err, result) => {
              if (err) {
                console.log(err);
                // Si hay un error, puedes enviar una respuesta de error
                res
                  .status(500)
                  .send("Error al actualizar el estado del producto");
              } else {
                console.log(result);
                res
                  .status(500)
                  .send("actualisacion de estado del producto exitosa");
              }
            };
        } else {
          // Si productShopOwner no coincide, continúa con la siguiente iteración sin hacer cambios
          updatedProductsCount++;
          if (updatedProductsCount === productIds.length) {
            res.status(200).send("Actualización de stock exitosa");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send(error);
      });
  }
});

app.put("/deleteBuyCar/:buyCarId", (req, res) => {
  const buyCarId = req.params.buyCarId;
  db.query(
    "DELETE FROM appBuyCars WHERE buyCarId=?",
    buyCarId,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al eliminar el carrito ");
      } else {
        res.status(200).send(result);
      }
    }
  );
});

app.put("/deleteProductFromBuyCar"),
  (req, res) => {
    db.query("UPDATE ");
  };

app.listen(3000, () => {
  console.log(`Servidor escuchando en el puerto 3000`);
});
