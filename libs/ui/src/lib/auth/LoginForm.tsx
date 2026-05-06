import { useState } from "react";

import { useAuth, useNotification } from "@org/ui";
import { emailPattern, passwordPattern, validateEmail, validatePassword, tokenStore } from "@org/utils/index";

import styles from "../../styles/common/form.module.scss";

export default function LoginForm({ goRegister, onSuccess }: {
  goRegister: () => void; 
  onSuccess: () => void;
}) {
  const { notify } = useNotification();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        notify(errorData["error"], "error");
        return;
      }

      const data = await res.json();

      tokenStore.set(data.accessToken);
      login(data.accessToken);

      notify("Вхід успішний!", "success");
      onSuccess();

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className={styles["auth-form"]} onSubmit={submit}>
      <input className={`${styles["auth-form__input"]} _button _button_no-center _button_border small`}
        type="email" name="email"
        pattern={emailPattern}
        placeholder="Email"
        required value={email}
        onChange={(e) => setEmail(validateEmail(e))} />

      <input className={`${styles["auth-form__input"]} _button _button_no-center _button_border small`}
        type="password" name="password"
        pattern={passwordPattern}
        placeholder="Пароль"
        required value={password}
        onChange={(e) => setPassword(validatePassword(e))} />

      <button className={`${styles["auth-form__button"]} _button _button_no-center _button_main _button_border regular`} type="submit">Увійти</button>

      <p className={`${styles["auth-form__paragraph"]} small`}>
        Немає акаунта?{" "}
        <button className={`${styles["auth-form__link"]} _button _button_article no-inline small upper`} type="button" onClick={goRegister}>
          Зареєструватися
        </button>
      </p>
    </form>
  );
}