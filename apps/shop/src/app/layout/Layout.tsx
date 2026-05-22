import { useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";

import Header from "./header";
import Footer from "./footer";

type Handle = {
  title?: string;
  description?: string;
  isDark?: boolean;
};

export default function Layout() {
  const matches = useMatches();

  const current = matches[matches.length - 1];
  const handle = current?.handle as Handle;

  useEffect(() => {
    if (handle?.title) {
      document.title = handle.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && handle?.description) {
      metaDesc.setAttribute("content", handle.description);
    }
  }, [handle]);

  return (
    <>
      <a href="#main-content" className="skip-link">Перейти до основного вмісту</a>
      <Header isDark={handle?.isDark} />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}