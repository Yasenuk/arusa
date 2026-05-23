import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";

const Shop = lazy(() => import("./pages/shop/Shop"));
const AboutUs = lazy(() => import("./pages/about/AboutUs"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Product = lazy(() => import("./pages/product/Product"));
const NotFound = lazy(() => import("./pages/not-found/NotFound"));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <Layout />
      </Suspense>
    ),
    children: [
      { path: "/", element: <Home />, handle: { title: "Arusa — інтернет-магазин якісних товарів", description: "Arusa — інтернет-магазин якісних товарів для дому: меблі, декор, кераміка, лампи. Унікальний дизайн та висока якість.", isDark: false } },
      { path: "/shop", element: <Shop />, handle: { title: "Магазин — Arusa", description: "Переглядайте весь асортимент товарів Arusa: меблі, декор, кераміка, освітлення та багато іншого.", isDark: true } },
      { path: "/about", element: <AboutUs />, handle: { title: "Про нас — Arusa", description: "Дізнайтеся більше про Arusa — нашу місію, цінності та команду, яка стоїть за якісними товарами для дому.", isDark: true } },
      { path: "/blog", element: <Blog />, handle: { title: "Блог — Arusa", description: "Ідеї для дизайну інтер'єру, поради зі стилю та натхнення для вашого дому від команди Arusa.", isDark: true } },
      { path: "/contact", element: <Contact />, handle: { title: "Контакти — Arusa", description: "Зв'яжіться з командою Arusa. Ми готові відповісти на ваші запитання та допомогти з вибором товарів.", isDark: true } },
      { path: "/profile", element: <Profile />, handle: { title: "Профіль — Arusa", description: "Ваш особистий кабінет в Arusa: замовлення, налаштування акаунту та персональні дані.", isDark: true } },
      { path: "/products/:id", element: <Product />, handle: { title: "Товар — Arusa", description: "Детальна інформація про товар в інтернет-магазині Arusa.", isDark: true } },
      { path: "*", element: <NotFound />, handle: { title: "404 — Arusa", description: "", isDark: true } },
    ]
  }
]);

export default router;