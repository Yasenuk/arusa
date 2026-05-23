import { Link } from "react-router-dom";

import styles from "../privacy-policy/privacy-policy.module.scss";

export default function ReturnPolicy() {
  return (
    <div className={styles.policy}>
      <div className={styles.policy__container}>
        <h1 className={`${styles.policy__title} h h_xl center`}>Політика повернення коштів</h1>
        <p className={`${styles.policy__date} small`}>Останнє оновлення: 1 січня 2025 року</p>

        <div className={styles.policy__content}>
          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>1. Загальні умови повернення</h2>
            <p className={`${styles.policy__text} regular`}>
              Ми прагнемо, щоб ви були повністю задоволені покупкою в Arusa. Якщо з будь-якої причини товар вам не підійшов, ви маєте право повернути його протягом 14 календарних днів з моменту отримання, якщо він зберіг товарний вигляд та споживчі властивості.
            </p>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>2. Умови для повернення</h2>
            <p className={`${styles.policy__text} regular`} style={{ marginBottom: "1rem" }}>
              Товар приймається до повернення за таких умов:
            </p>
            <ul className={`${styles.policy__list} regular`}>
              <li>Збережено оригінальне пакування та всі комплектуючі</li>
              <li>Товар не був у використанні та не має слідів монтажу</li>
              <li>Збережено касовий чек або підтвердження замовлення</li>
              <li>З моменту отримання не минуло більше 14 днів</li>
            </ul>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>3. Товари, що не підлягають поверненню</h2>
            <p className={`${styles.policy__text} regular`} style={{ marginBottom: "1rem" }}>
              Відповідно до законодавства, поверненню не підлягають:
            </p>
            <ul className={`${styles.policy__list} regular`}>
              <li>Товари, виготовлені на індивідуальне замовлення (нестандартні розміри, колір тощо)</li>
              <li>Товари з порушеною цілісністю пакування (матраси, подушки, постільна білизна)</li>
              <li>Товари з механічними пошкодженнями, завданими покупцем</li>
            </ul>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>4. Порядок повернення</h2>
            <p className={`${styles.policy__text} regular`} style={{ marginBottom: "1rem" }}>
              Для ініціювання повернення:
            </p>
            <ul className={`${styles.policy__list} regular`}>
              <li>Зверніться до нас на <Link to="mailto:returns@arusa.com" className="_button_article _button_article_light">returns@arusa.com</Link> із номером замовлення та причиною повернення</li>
              <li>Ми підтвердимо запит і надішлемо інструкції щодо доставки протягом 1–2 робочих днів</li>
              <li>Доставте товар у зазначений пункт або скористайтесь послугами кур'єра</li>
              <li>Після отримання та перевірки товару ми повернемо кошти</li>
            </ul>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>5. Терміни повернення коштів</h2>
            <p className={`${styles.policy__text} regular`}>
              Після підтвердження повернення кошти зараховуються на ваш рахунок протягом 5–10 робочих днів залежно від вашого банку. Повернення здійснюється тим самим способом, яким була оплачена покупка.
            </p>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>6. Пошкоджений або неправильний товар</h2>
            <p className={`${styles.policy__text} regular`}>
              Якщо ви отримали пошкоджений або не той товар — зверніться до нас протягом 48 годин після отримання. Ми за власний рахунок організуємо заміну або повне відшкодування коштів. Для прискорення вирішення прикладіть фотографії товару до звернення.
            </p>
          </section>

          <section>
            <h2 className={`${styles["policy__section-title"]} h h_s`}>7. Контакти для повернення</h2>
            <p className={`${styles.policy__text} regular`}>
              З питань повернення та відшкодування звертайтеся:{" "}
              <Link to="mailto:returns@arusa.com" className="_button_article _button_article_light">
                returns@arusa.com
              </Link>
              {" "}або через{" "}
              <Link to="/contact" className="_button_article _button_article_light">
                сторінку контактів
              </Link>.
            </p>
          </section>
        </div>

        <h4 className={`${styles["policy__side-title"]} side-title h h_s`}>Повернення</h4>
      </div>
    </div>
  );
}
