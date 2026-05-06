import { useEffect, useRef, useState } from "react";
import styles from "../../styles/components/dropdown.module.scss";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Закриваємо при кліку поза дропдауном
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`${styles.dropdown} ${isOpen ? styles.dropdown_open : ""}`}>
      <button
        type="button"
        className={`${styles.dropdown__trigger} _button _button_article small upper`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span>{selected ? selected.label : label}</span>
        <i className={`${styles.dropdown__arrow} icon-arrow-down`} />
      </button>

      <ul className={styles.dropdown__list}>
        {options.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`${styles.dropdown__item} ${
                value === option.value ? styles["dropdown__item_active"] : ""
              } small upper`}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;