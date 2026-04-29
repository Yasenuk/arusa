import { useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";

import Header from "./header";
import Footer from "./footer";

type Handle = {
  title?: string;
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
  }, [handle]);

  return (
    <>
      <Header isDark={handle?.isDark} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}