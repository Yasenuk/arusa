import express from "express";
import * as path from 'path';

import dotenv from "dotenv";

import authRegister from "./routes/register";
import authLogin from "./routes/login";

import adminCategories from "./routes/admin/categories";
import adminProducts from "./routes/admin/products";
import shopArticles from "./routes/shop/articles";

dotenv.config();

const app = express();

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use("/api", authRegister);
app.use("/api", authLogin);

app.use("/api", adminCategories);
app.use("/api", adminProducts);
app.use("/api", shopArticles);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
  