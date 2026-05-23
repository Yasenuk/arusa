import styles from './pagination.module.scss';

interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

function buildPages(current: number, total: number): (number | '…')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '…')[] = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  pages.push(1);
  if (left > 2) pages.push('…');
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push('…');
  pages.push(total);

  return pages;
}

export default function Pagination({ current, total, onChange, disabled }: Props) {
  if (total <= 1) return null;

  const pages = buildPages(current, total);

  return (
    <nav className={styles.pagination} aria-label="Навігація по сторінках">
      <button
        className={styles.pagination__arrow}
        onClick={() => onChange(current - 1)}
        disabled={current <= 1 || disabled}
        aria-label="Попередня сторінка"
      >
        ‹
      </button>

      {pages.map((page, i) =>
        page === '…' ? (
          <span key={`e${i}`} className={styles.pagination__ellipsis}>…</span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            disabled={disabled}
            aria-current={current === page ? 'page' : undefined}
            className={`${styles.pagination__page} ${current === page ? styles['pagination__page_active'] : ''}`}
          >
            {page}
          </button>
        )
      )}

      <button
        className={styles.pagination__arrow}
        onClick={() => onChange(current + 1)}
        disabled={current >= total || disabled}
        aria-label="Наступна сторінка"
      >
        ›
      </button>
    </nav>
  );
}
