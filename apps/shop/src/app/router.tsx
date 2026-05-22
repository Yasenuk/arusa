import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";

const Home = lazy(() => import("./pages/home/Home"));
const Shop = lazy(() => import("./pages/shop/Shop"));
const AboutUs = lazy(() => import("./pages/about/AboutUs"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Product = lazy(() => import("./pages/product/Product"));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <Layout />
      </Suspense>
    ),
    children: [
      { path: "/", element: <Home />, handle: { title: "Arusa - Головна", isDark: false } },
      { path: "/shop", element: <Shop />, handle: { title: "Arusa - Магазин", isDark: true } },
      { path: "/about", element: <AboutUs />, handle: { title: "Arusa - Про нас", isDark: true } },
      { path: "/blog", element: <Blog />, handle: { title: "Arusa - Блог", isDark: true } },
      { path: "/contact", element: <Contact />, handle: { title: "Arusa - Контакти", isDark: true } },
      { path: "/profile", element: <Profile />, handle: { title: "Arusa - Профіль", isDark: true } },
      { path: "/products/:id", element: <Product />, handle: { title: "Arusa - Продукт", isDark: true } },
    ]
  }
]);

export default router;