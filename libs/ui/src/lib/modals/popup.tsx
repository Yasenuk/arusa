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

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.classList.add("_locked");
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
        document.body.classList.remove("_locked");
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isVisible) {
      document.addEventListener("keydown", handleEsc);
      document.body.classList.add("_locked");
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.classList.remove("_locked");
    };
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