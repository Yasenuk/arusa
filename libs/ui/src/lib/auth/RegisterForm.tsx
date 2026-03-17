import { useEffect, useRef, useState } from "react";
import { useNotification } from "@org/ui";
import { emailPattern, passwordPattern, validateEmail, validatePassword, validatePasswordConfirm } from "@org/utils/index";

import styles from "../../styles/common/form.module.scss";

export default function RegisterForm({ goLogin, onSuccess }: {
  goLogin: () => void; 
  onSuccess: () => void;
}) {
  const { notify } = useNotification();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");

  const confirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!confirmRef.current) return;

    if (password_confirm && password !== password_confirm) {
      confirmRef.current.setCustomValidity("Паролі не співпадають");
    } else {
      confirmRef.current.setCustomValidity("");
    }
  }, [password, password_confirm]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!first_name.trim() || !last_name.trim() || !middle_name.trim()) {
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name,
          last_name,
          middle_name,
          email,
          password,
          password_confirm
        })
      });

      if (!res.ok) {
        const data = await res.text();
        const errorData = JSON.parse(data);
        
        notify(errorData["error"], "error");
        
        throw new Error("Помилка входу");
      }

      notify("Реєстрація успішна!", "success");

      onSuccess();

      setFirstName("");
      setLastName("");
      setMiddleName("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className={styles["auth-form"]} onSubmit={submit}>
      <input className={`${styles["auth-form__input"]} _button _button_no-center _button_border small`}
        name="first_name"
        placeholder="Ім'я"
        required
        value={first_name}
        onChange={(e) => setFirstName(e.target.value)} />

      <input className={`${styles["auth-form__input"]} _button _button_no-center _button_border small`}
        name="last_name"
        placeholder="Прізвище"
        required
        value={last_name}
        onChange={(e) => setLastName(e.target.value)} />

      <input className={`${styles["auth-form__input"]} _button _button_no-center _button_border small`}
        name="middle_name"
        placeholder="По батькові"
        required
        value={middle_name}
        onChange={(e) => setMiddleName(e.target.value)} />

      <input className={`${styles["auth-form__input"]} _button _button_no-center _button_border small`}
        type="email" name="email"
        placeholder="Email"
        pattern={emailPattern}
        required value={email}
        onChange={(e) => setEmail(validateEmail(e))} />

      <input className={`${styles["auth-form__input"]} _button _button_no-center _button_border small`}
        type="password" name="password"
        placeholder="Пароль"
        pattern={passwordPattern}
        required
        value={password}
        onChange={(e) => setPassword(validatePassword(e))} />

      <input className={`${styles["auth-form__input"]} _button _button_no-center _button_border small`}
        ref={confirmRef}
        type="password" name="password_confirm"
        placeholder="Підтвердіть пароль"
        pattern={passwordPattern}
        required
        value={password_confirm}
        onChange={(e) => setPasswordConfirm(validatePasswordConfirm(password, e))} />

      <button className={`${styles["auth-form__button"]} _button _button_main _button_border small`} type="submit">
        Зареєструватися
      </button>

      <p className={`${styles["auth-form__paragraph"]} small`}>
        Вже є акаунт?{" "}
        <button className={`${styles["auth-form__link"]} _button _button_article no-inline small upper`} type="button" onClick={goLogin}>
          Увійти
        </button>
      </p>
    </form>
  );
}