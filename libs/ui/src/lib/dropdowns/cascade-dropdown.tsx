import { useEffect, useRef, useState } from "react";

import { Category } from "@org/shared-types";
import styles from "../../styles/components/dropdown.module.scss";

interface CascadeDropdownProps {
  label: string;
  tree: Category[];
  value: string;
  onChange: (value: string) => void;
}

export function CascadeDropdown({ label, tree, value, onChange }: CascadeDropdownProps) {
  const [stack, setStack] = useState<Category[][]>([tree]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function findLabel(nodes: Category[], val: string): string | null {
    for (const node of nodes) {
      if (node.name === val) return node.name;
      if (node.children?.length) {
        const found = findLabel(node.children, val);
        if (found) return found;
      }
    }
    return null;
  }

  const selectedLabel = value === "all" ? null : findLabel(tree, value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setStack([tree]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tree]);

  function handleSelect(node: Category) {
    if (node.children?.length) {
      setStack((prev) => [...prev, node.children!]);
    } else {
      onChange(node.name);
      setIsOpen(false);
      setStack([tree]);
    }
  }

  function handleBack() {
    setStack((prev) => prev.slice(0, -1));
  }

  function handleSelectAll() {
    onChange("all");
    setIsOpen(false);
    setStack([tree]);
  }

  const currentLevel = stack[stack.length - 1];
  const isNested = stack.length > 1;

  return (
    <div ref={ref} className={`${styles.dropdown} ${isOpen ? styles.dropdown_open : ""}`}>
      <button
        type="button"
        className={`${styles.dropdown__trigger} _button _button_article small upper`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span>{selectedLabel ?? label}</span>
        <i className={`${styles.dropdown__arrow} icon-arrow-down`} />
      </button>

      <ul className={styles.dropdown__list}>
        {isNested && (
          <li>
            <button
              type="button"
              onClick={handleBack}
              className={`${styles.dropdown__item} small upper`}
            >
              ← Назад
            </button>
          </li>
        )}

        {!isNested && (
          <li>
            <button
              type="button"
              onClick={handleSelectAll}
              className={`${styles.dropdown__item} ${
                value === "all" ? styles["dropdown__item_active"] : ""
              } small upper`}
            >
              Всі категорії
            </button>
          </li>
        )}

        {currentLevel.map((node) => (
          <li key={node.id}>
            <button
              type="button"
              onClick={() => handleSelect(node)}
              className={`${styles.dropdown__item} ${
                value === node.name ? styles["dropdown__item_active"] : ""
              } small upper`}
            >
              {node.name}
              {node.children?.length ? (
                <i className="icon-arrow-right" style={{ marginLeft: "auto" }} />
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CascadeDropdown;
