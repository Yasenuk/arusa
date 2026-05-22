import { useEffect, useRef, useState } from "react";

import styles from "../../styles/components/popup.module.scss";

type PopupPage = {
  content: React.ReactNode;
};

type PopupProps = {
  isOpen: boolean;
  page: number;
  pages: PopupPage[];
  title?: string;
  label?: string;
  onClose: () => void;
  onPageChange: (page: number) => void;
};

export default function Popup({
  isOpen,
  page,
  pages,
  title,
  label,
  onClose,
  onPageChange
}: PopupProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  // Один useEffect для body lock + visibility — без дублювання classList calls
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.classList.add("_locked");
      return;
    }

    const timeout = setTimeout(() => setIsVisible(false), 300);
    // Знімаємо lock одразу при закритті, не чекаємо анімацію
    document.body.classList.remove("_locked");
    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
    // classList вже керується вище — не дублюємо тут
  }, [isVisible, onClose]);

  function handleOutside(e: React.MouseEvent) {
    if (bodyRef.current && !bodyRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.popup} ${isOpen ? styles.popup_open : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      aria-label={label}
      onClick={handleOutside}
    >
      <div className={styles.popup__wrapper}>
        <div className={styles.popup__body} ref={bodyRef}>
          <header className={styles.popup__header}>
            <h2 id="popup-title" className={`${styles.popup__title} large upper`}>
              {title}
            </h2>

            <button
              type="button"
              className={styles.popup__close}
              aria-label="Закрити діалогове вікно"
              onClick={onClose}
            />
          </header>

          <div className={styles.popup__content}>
            {pages[page]?.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export { default as Popup } from "./popup";
