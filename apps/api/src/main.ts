import express from "express";
import * as path from 'path';

import dotenv from "dotenv";
import morgan from "morgan";

import authRefresh from "./routes/auth";
import authRegister from "./routes/register";
import authLogin from "./routes/login";

import adminCategories from "./routes/categories";
import adminProducts from "./routes/products";

import shopArticles from "./routes/articles";
import shopCart from "./routes/cart";
import users from "./routes/users";

dotenv.config();

const app = express();

app.use(morgan("combined"));

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use("/api", authRefresh);

app.use("/api", authRegister);
app.use("/api", authLogin);
app.use("/api", users);

app.use("/api", adminCategories);
app.use("/api", adminProducts);

app.use("/api", shopArticles);
app.use("/api", shopCart);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
  