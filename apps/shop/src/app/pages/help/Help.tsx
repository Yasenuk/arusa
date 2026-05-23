import { Link } from "react-router-dom";
import styles from "./help.module.scss";

const HELP_SECTIONS = [
  {
    title: "Реєстрація та вхід",
    items: [
      {
        title: "Як створити акаунт?",
        text: "Натисніть кнопку «Увійти» у правому верхньому куті та оберіть «Реєстрація». Введіть ім'я, email-адресу та пароль. Після підтвердження email ваш акаунт буде активовано.",
      },
      {
        title: "Як увійти до акаунту?",
        text: "Натисніть на кнопку профілю та введіть email і пароль, вказані під час реєстрації. Якщо ви забули пароль — скористайтеся функцією відновлення.",
      },
      {
        title: "Я забув(ла) пароль. Що робити?",
        text: "На сторінці входу натисніть «Забули пароль?», введіть вашу email-адресу — ми надішлемо посилання для скидання пароля.",
      },
    ],
  },
  {
    title: "Управління акаунтом",
    items: [
      {
        title: "Як змінити особисті дані?",
        text: "Перейдіть до розділу «Профіль» після входу. Там ви можете редагувати ім'я, контактний номер та адресу доставки.",
      },
      {
        title: "Де переглянути історію замовлень?",
        text: "У вашому профілі є розділ «Мої замовлення», де відображаються всі поточні та минулі замовлення з можливістю перегляду деталей.",
      },
      {
        title: "Як видалити акаунт?",
        text: "Для видалення акаунту зверніться до нашої служби підтримки за адресою support@arusa.com із запитом на видалення. Ми обробимо запит протягом 5 робочих днів.",
      },
    ],
  },
  {
    title: "Безпека",
    items: [
      {
        title: "Як захистити свій акаунт?",
        text: "Використовуйте унікальний надійний пароль. Не передавайте дані для входу третім особам. Якщо ви підозрюєте несанкціонований доступ — негайно змініть пароль або зв'яжіться з нами.",
      },
      {
        title: "Чи зберігаються мої платіжні дані?",
        text: "Ми не зберігаємо повні дані платіжних карток. Всі транзакції обробляються через захищений платіжний сервіс Stripe відповідно до стандарту PCI DSS.",
      },
    ],
  },
];

export default function Help() {
  return (
    <div className={styles.help}>
      <div className={styles.help__container}>
        <h1 className={`${styles.help__title} h h_xl center`}>Вхід та акаунт</h1>
        <p className={`${styles.help__subtitle} regular`}>
          Відповіді на найпоширеніші запитання щодо реєстрації, входу та керування акаунтом.
        </p>

        <div className={styles.help__sections}>
          {HELP_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className={`${styles["help__section-title"]} h h_s`}>{section.title}</h2>
              <ul className={styles.help__list}>
                {section.items.map((item) => (
                  <li key={item.title} className={styles.help__item}>
                    <span className={`${styles["help__item-title"]} regular`}>{item.title}</span>
                    <p className={`${styles["help__item-text"]} regular`}>{item.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className={`${styles.help__contact} regular`}>
            Не знайшли відповідь?{" "}
            <Link to="/contact" className="_button_article _button_article_light">
              Зв'яжіться з нами
            </Link>
          </p>
        </div>

        <h4 className={`${styles["help__side-title"]} side-title h h_s`}>Допомога</h4>
      </div>
    </div>
  );
}
