import express from "express";
import dotenv from "dotenv";
import { ProductoDao } from "./dao/ProductoDao.js";
import { CarritoDao } from "./dao/CarritoDao.js";
import { ProductoCarritoDao } from "./dao/ProductoCarritoDao.js";
import knex from "knex";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authMiddleware = (req, res, next) => {
  req.header("autorizacion") == process.env.TOKEN
    ? next()
    : res.status(401).json({ error: "Sin Autorizacion" });
};

const routerProducts = express.Router();
const routerCart = express.Router();

app.use("/api/productos", routerProducts);
app.use("/api/carrito", routerCart);

const productoDao = new ProductoDao();
const carritoDao = new CarritoDao();
const productoCarritoDao = new ProductoCarritoDao();

routerProducts.get("/", async (req, res) => {
  const products = await productoDao.getAll();
  res.status(200).json(products);
});

routerProducts.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productoDao.getProductById(id);

  product
    ? res.status(200).json(product)
    : res.status(400).json({ error: "producto no encontrado" });
});

routerProducts.post("/", authMiddleware, async (req, res, next) => {
  const { body } = req;

  body.timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

  const newProductId = await productoDao.save(body);

  newProductId
    ? res
        .status(200)
        .json({ success: "producto añadido con el ID: " + newProductId })
    : res.status(400).json({
        error: "la clave puede estar mal. Verifique el contenido del cuerpo",
      });
});

routerProducts.put("/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const wasUpdated = await productoDao.updateProductById(body, id);

  wasUpdated
    ? res.status(200).json({ success: "producto actualizado" })
    : res.status(404).json({
        error: "producto no encontrado o contenido del cuerpo no válido.",
      });
});

routerProducts.delete("/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const wasDeleted = await productoDao.deleteById(id);

  wasDeleted
    ? res.status(200).json({ success: "producto removido exitosamente" })
    : res.status(404).json({ error: "producto no encontrado" });
});

routerCart.post("/", async (req, res) => {
  const newCartId = await carritoDao.save();

  newCartId
    ? res
        .status(200)
        .json({ success: "carrito añadido con el ID: " + newCartId })
    : res
        .status(400)
        .json({ error: "hubo un problema, inténtalo de nuevo más tarde" });
});

routerCart.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const wasDeleted = await carritoDao.deleteById(id);

  wasDeleted
    ? res.status(200).json({ success: "carrito eliminado con éxito" })
    : res.status(404).json({ error: "carrito no encontrado" });
});

routerCart.post("/:id/productos", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  if (Object.prototype.hasOwnProperty.call(body, "productId")) {
    const newProductoCarritoId = await productoCarritoDao.saveProductToCart(
      id,
      body.productId
    );

    newProductoCarritoId
      ? res
          .status(200)
          .json({ success: "producto añadido correctamente al carrito" })
      : res.status(400).json({
          error:
            "hubo algún problema. ¿Quizás la identificación del carrito o la identificación del producto no son válidas?",
        });
  } else {
    res
      .status(400)
      .json({ error: "la clave debe ser 'productId', verifíquela." });
  }
});

routerCart.delete("/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;

  const wasDeleted = productoCarritoDao.deleteProductFromCart(id, id_prod);

  wasDeleted
    ? res.status(200).json({ success: "el producto ha sido removido" })
    : res.status(400).json({ error: "ha habido un problema" });
});

routerCart.get("/:id/productos", async (req, res) => {
  const { id } = req.params;
  const cartProducts = await productoCarritoDao.getAllProductsFromCart(id);
  if (cartProducts.length) {
    res.status(200).json(cartProducts);
  } else {
    res.status(404).json({ error: "el producto no ha sido encontrado" });
  }
});

const PORT = 3306;
const server = app.listen(PORT, () => {
  console.log("Server listening on port 3306");
});

server.on("error", (err) => console.log(err));
