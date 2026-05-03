import { useEffect, useState, useCallback } from "react";

import styles from "./Shop.module.scss";

import ProductCard from "../../common/ProductCard";
import { CatalogProductVariant } from "@org/shared-types";

interface ProductsResponse {
  data: CatalogProductVariant[];
  total: number;
  page: number;
  totalPages: number;
}

export default function Shop() {
  const [response, setResponse] = useState<ProductsResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    category: "all",
    sort: "a_z",
    search: "",
    color: "",
    material: "",
    availability: "all",
  });

  // Запит з урахуванням фільтрів та поточної сторінки
  const fetchProducts = useCallback(async (page: number) => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "12");

    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.search) params.set("search", filters.search);
    if (filters.color) params.set("color", filters.color);
    if (filters.material) params.set("material", filters.material);
    if (filters.availability !== "all") params.set("availability", filters.availability);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProductsResponse = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Помилка завантаження продуктів:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Дебаунс пошуку
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // При зміні фільтрів — повертаємося на 1 сторінку
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [filters]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
    fetchProducts(page);
  }

  return (
    <div className={styles.shop}>
      <h1 className={`${styles.shop__title} h h_xxl upper`}>Всі товари</h1>
      <div className={styles["shop__topbar-wrap"]}>
        <div className={styles.shop__topbar}>
          <div className={styles.shop__container}>
            <span className={styles["shop__count-title"]}>
              <span>{response.total}</span>
              Товарів
            </span>
            <div className={styles.shop__search}>
              <input type="search"
                name="products-search"
                id="products-search"
                placeholder="Знайти товар"
                className={`${styles["shop__search-input"]} _input _input_article`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <label htmlFor="products-search">
                <i className="icon-search regular"></i>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.shop__content}>
        <aside className={styles.shop__filters}>
          {/* Фільтри */}
        </aside>
        <div className={styles.shop__products}>
          <div className={styles.shop__items}>
            {isLoading ? (
              <p>Завантаження...</p>
            ) : (
              response.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          <div className={styles.shop__pagination}>
            {Array.from({ length: response.totalPages }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  className={`${styles["shop__pagination-button"]} ${
                    currentPage === page ? styles["shop__pagination-button_active"] : ""
                  } _button _button_main _button_border regular upper`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}