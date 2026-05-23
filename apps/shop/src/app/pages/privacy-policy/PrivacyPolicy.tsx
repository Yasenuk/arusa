import { Link } from "react-router-dom";
import styles from "./privacy-policy.module.scss";

export default function PrivacyPolicy() {
  return (
    <div className={styles.policy}>
      <div className={styles.policy__container}>
        <h1 className={`${styles.policy__title} h h_xl`}>Політика конфіденційності</h1>
        <p className={`${styles.policy__date} small`}>Останнє оновлення: 1 січня 2025 року</p>

        <div className={styles.policy__content}>
          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>1. Загальні положення</h2>
            <p className={`${styles.policy__text} regular`}>
              Ця Політика конфіденційності описує, як Arusa збирає, використовує та захищає персональні дані користувачів під час використання нашого веб-сайту та сервісів. Використовуючи наш сайт, ви погоджуєтеся з умовами цієї політики.
            </p>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>2. Які дані ми збираємо</h2>
            <p className={`${styles.policy__text} regular`} style={{ marginBottom: "1rem" }}>
              Ми можемо збирати такі категорії персональних даних:
            </p>
            <ul className={`${styles.policy__list} regular`}>
              <li>Ім'я та прізвище</li>
              <li>Контактна інформація: email-адреса, номер телефону</li>
              <li>Адреса доставки</li>
              <li>Інформація про замовлення та транзакції</li>
              <li>Технічні дані: IP-адреса, тип браузера, дані про відвідування сторінок</li>
            </ul>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>3. Мета обробки даних</h2>
            <p className={`${styles.policy__text} regular`} style={{ marginBottom: "1rem" }}>
              Зібрані дані використовуються виключно для:
            </p>
            <ul className={`${styles.policy__list} regular`}>
              <li>Обробки та доставки ваших замовлень</li>
              <li>Надання клієнтської підтримки</li>
              <li>Покращення функціональності сайту</li>
              <li>Інформування про статус замовлення</li>
              <li>Дотримання вимог законодавства</li>
            </ul>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>4. Зберігання та захист даних</h2>
            <p className={`${styles.policy__text} regular`}>
              Ми зберігаємо ваші персональні дані на захищених серверах. Усі платіжні транзакції обробляються через сертифікований платіжний сервіс Stripe і не зберігаються на наших серверах. Ми застосовуємо технічні та організаційні заходи для захисту ваших даних від несанкціонованого доступу, зміни або знищення.
            </p>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>5. Передача даних третім особам</h2>
            <p className={`${styles.policy__text} regular`}>
              Ми не продаємо та не передаємо ваші персональні дані третім особам, за винятком випадків, необхідних для виконання замовлення (служби доставки), або якщо це вимагається законодавством України.
            </p>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>6. Ваші права</h2>
            <p className={`${styles.policy__text} regular`} style={{ marginBottom: "1rem" }}>
              Відповідно до законодавства про захист персональних даних, ви маєте право:
            </p>
            <ul className={`${styles.policy__list} regular`}>
              <li>Отримати доступ до своїх персональних даних</li>
              <li>Виправити неточні або застарілі дані</li>
              <li>Вимагати видалення ваших даних</li>
              <li>Відкликати згоду на обробку даних у будь-який момент</li>
            </ul>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>7. Файли cookie</h2>
            <p className={`${styles.policy__text} regular`}>
              Наш сайт використовує файли cookie для покращення роботи сервісу та аналізу трафіку. Ви можете керувати налаштуваннями cookie у свому браузері. Відмова від cookie може обмежити деякі функції сайту.
            </p>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>8. Контакти</h2>
            <p className={`${styles.policy__text} regular`}>
              З питань щодо обробки персональних даних звертайтеся до нас:{" "}
              <Link to="mailto:support@arusa.com" className="_button_article _button_article_light">
                support@arusa.com
              </Link>
              {" "}або через{" "}
              <Link to="/contact" className="_button_article _button_article_light">
                сторінку контактів
              </Link>.
            </p>
          </section>
        </div>

        <h4 className={`${styles["policy__side-title"]} side-title h h_s`}>Конфіденційність</h4>
      </div>
    </div>
  );
}
