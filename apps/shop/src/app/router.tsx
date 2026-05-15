import { createBrowserRouter } from "react-router-dom";

import Layout from "./layout/Layout";

import Home from "./pages/home/Home";
import Shop from "./pages/shop/Shop";
import AboutUs from "./pages/about/AboutUs";
import Blog from "./pages/blog/Blog";
import Contact from "./pages/contact/Contact";
import Profile from "./pages/user/Profile";
import Product from "./pages/product/Product";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        handle: { title: "Arusa - Головна", isDark: false }
      },
      {
        path: "/shop",
        element: <Shop />,
        handle: { title: "Arusa - Магазин", isDark: true }
      },
      {
        path: "/about",
        element: <AboutUs />,
        handle: { title: "Arusa - Про нас", isDark: true }
      },
      {
        path: "/blog",
        element: <Blog />,
        handle: { title: "Arusa - Блог", isDark: true }
      },
      {
        path: "/contact",
        element: <Contact />,
        handle: { title: "Arusa - Контакти", isDark: true }
      },
      {
        path: "/profile",
        element: <Profile />,
        handle: { title: "Arusa - Профіль", isDark: true }
      },
      {
        path: "/products/:id",
        element: <Product />,
        handle: { title: "Arusa - Сторінка продукту", isDark: true }
      }
    ]
  }
]);

export default router;