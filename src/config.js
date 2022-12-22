import dotenv from "dotenv";
dotenv.config();

export const config = {
  client: "Conexion SQL",
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
  },
};
