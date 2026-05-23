import { useEffect } from "react";
import { Outlet, useMatches, useSearchParams } from "react-router-dom";
import { useNotification } from "@org/ui";

import Header from "./header";
import Footer from "./footer";

type Handle = {
  title?: string;
  description?: string;
  isDark?: boolean;
};

export default function Layout() {
  const matches = useMatches();
  const [searchParams, setSearchParams] = useSearchParams();
  const { notify } = useNotification();

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

  useEffect(() => {
    const guestOrderId = searchParams.get("guest_paid");
    const authOrderId = searchParams.get("paid");

    if (guestOrderId) {
      notify(`Замовлення #${guestOrderId} успішно оплачено! Очікуйте підтвердження на email.`, "success");
      setSearchParams(p => { p.delete("guest_paid"); return p; }, { replace: true });
    } else if (authOrderId) {
      notify(`Замовлення #${authOrderId} успішно оплачено!`, "success");
      setSearchParams(p => { p.delete("paid"); return p; }, { replace: true });
    }
  }, []);

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