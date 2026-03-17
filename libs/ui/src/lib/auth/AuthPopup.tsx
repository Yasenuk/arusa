import { Link } from "react-router-dom";
import { useState } from "react";
import { Popup, useAuth } from "@org/ui";

import styles from "../../styles/common/form.module.scss";

import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

export default function AuthPopup() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const { isAuth } = useAuth();

  return (
    <>
      {!isAuth ? (
        <button
          className={`${styles["auth-form__auth-button"]} _button _button_article _button_article_light no-inline regular upper`}
          onClick={() => {
            setPage(0);
            setOpen(true);
          }}
        >Увійти</button>
      ) : (
          <Link
            to="/profile"
            className={`${styles["auth-form__auth-button"]} _button _button_article _button_article_light no-inline regular upper`}
          >Профіль</Link>
      )}

      <Popup
        isOpen={open}
        page={page}
        onPageChange={setPage}
        onClose={() => setOpen(false)}
        title={page === 0 ? "Вхід" : "Реєстрація"}
        pages={[
          {
            content: (
              <LoginForm goRegister={() => setPage(1)} onSuccess={() => setOpen(false)} />
            ),
          },
          {
            content: (
              <RegisterForm goLogin={() => setPage(0)} onSuccess={() => setOpen(false)} />
            ),
          },
        ]}
      />
    </>
  );
}