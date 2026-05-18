import express from "express";
import * as path from 'path';
import cookieParser from "cookie-parser";

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

import npRequest from "./routes/novaposhta";

import shopOrders from "./routes/orders";
import shopAddresses from "./routes/addresses";

import payment from "./routes/payments";

import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();

app.use(morgan("combined"));
app.use(cookieParser());

app.use('/api/payments/stripe/callback', express.raw({ type: 'application/json' }));
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

app.use("/api", shopOrders);
app.use("/api", shopAddresses);

app.use("/api", npRequest);
app.use("/api", payment);

app.use("/api", adminRoutes);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);

  if (process.env.NODE_ENV !== 'production') {
    import('@ngrok/ngrok').then(async (ngrok) => {
      const url = await ngrok.default.connect({
        addr: port,
        authtoken: process.env.NGROK_AUTHTOKEN,
        domain: 'carry-unburned-payback.ngrok-free.dev',
      });
      process.env.API_URL = url.url() ?? '';
      console.log(`ngrok tunnel: ${url.url()}`);
    });
  }
});
server.on('error', console.error);
