import { knex } from "../../db.js";

const productos = [
  {
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    title: "Titulo 1",
    price: 100,
    description: "Descripcion 1",
    code: "XY-1",
    image: "Url1.com",
    stock: 150,
  },
  {
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    title: "Titulo 2",
    price: 200,
    description: "Descripcion 2",
    code: "XY-2",
    image: "Url2.com",
    stock: 250,
  },
  {
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    title: "Titulo 3",
    price: 300,
    description: "Descripcion 3",
    code: "XY-3",
    image: "Url3.com",
    stock: 350,
  },
  {
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    title: "Titulo 4",
    price: 400,
    description: "Descripcion 4",
    code: "XY-4",
    image: "Url4.com",
    stock: 450,
  },
];

const carritos = [
  {
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
  },
  {
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
  },
  {
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
  },
];

const productoCarritoRelations = [
  {
    carritoId: 2,
    productoId: 1,
  },
  {
    carritoId: 2,
    productoId: 2,
  },
  {
    carritoId: 2,
    productoId: 3,
  },
];

export async function populateProducts() {
  try {
    await knex.insert(productos).from("producto");
    console.log("Se agregaron Productos a la tabla");
  } catch (error) {
    console.log(error);
  }
}

export async function populateCarts() {
  try {
    await knex.insert(carritos).from("carrito");
    console.log("Se agregaron Carritos a la tabla");
  } catch (error) {
    console.log(error);
  }
}

export async function populateProductoCarrito() {
  try {
    await knex.insert(productoCarritoRelations).from("productoCarrito");
    console.log("Se agregaron relaciones a la tabla");
    return;
  } catch (error) {
    console.log(error);
  }
}
