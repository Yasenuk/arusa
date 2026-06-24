import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./Shop.module.scss";

import { CascadeDropdown, Dropdown, ProductCard } from "@org/ui";
import { CatalogProductVariant, Category } from "@org/shared-types";
import { buildCategoryTree } from "@org/utils/index";

import Pagination from "../../common/Pagination";

interface ProductsResponse {
  data: CatalogProductVariant[];
  total: number;
  page: number;
  totalPages: number;
}

const SORT_OPTIONS = [
  { value: "a_z",        label: "А — Я" },
  { value: "z_a",        label: "Я — А" },
  { value: "price_asc",  label: "Ціна: за зростанням" },
  { value: "price_desc", label: "Ціна: за спаданням" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [response, setResponse] = useState<ProductsResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState({
    category: "all",
    sort: "a_z",
    search: "",
    price_min: "",
    price_max: "",
  });

  const searchRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setCategories)
      .catch(console.error);
  }, []);

  const categoryTree = buildCategoryTree(categories);

  useEffect(() => {
    if (!categories.length || !urlCategory) return;

    const match = categories.find((c) => c.name.toLowerCase() === urlCategory.toLowerCase());
    const newCategory = match ? String(match.name) : "all";

    setFilters((f) => (f.category === newCategory ? f : { ...f, category: newCategory }));
    setSearchParams({}, { replace: true });
  }, [urlCategory, categories]);

  const fetchProducts = useCallback(async (page: number) => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "12");

    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.search) params.set("search", filters.search);
    if (filters.price_min) params.set("price_min", filters.price_min);
    if (filters.price_max) params.set("price_max", filters.price_max);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((f) => (f.search === searchInput ? f : { ...f, search: searchInput }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (searchInput.trim().length < 2) { setSuggestions([]); return; }
    const timeout = setTimeout(() => {
      fetch(`/api/products/suggest?q=${encodeURIComponent(searchInput)}`)
        .then(r => r.json())
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 200);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [fetchProducts]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
    fetchProducts(page);
  }

  function handleFilterChange(key: keyof typeof filters) {
    return (value: string) => setFilters((f) => ({ ...f, [key]: value }));
  }

  function openSearch() {
    clearTimeout(closeTimer.current);
    setIsSearchOpen(true);
    searchRef.current?.focus();
  }

  function handleSearchFocus() {
    clearTimeout(closeTimer.current);
    setIsSearchOpen(true);
    if (suggestions.length) setShowSuggestions(true);
  }

  function handleSearchBlur() {
    closeTimer.current = setTimeout(() => {
      if (!searchInput) setIsSearchOpen(false);
      setShowSuggestions(false);
    }, 200);
  }

  function handleSuggestionClick(suggestion: string) {
    setSearchInput(suggestion);
    setFilters((f) => ({ ...f, search: suggestion }));
    setShowSuggestions(false);
  }

  return (
    <div className={styles.shop}>
      <h1 className={`${styles.shop__title} h h_xxl upper`}>Всі товари</h1>

      <div className={styles["shop__topbar-wrap"]}>
        <div className={styles.shop__topbar}>
          <div className={styles.shop__filters}>
            <div className={styles["shop__filter-group"]}>
              <CascadeDropdown
                label="Категорія"
                tree={categoryTree}
                value={filters.category}
                onChange={handleFilterChange("category")}
              />
            </div>
            <div className={styles["shop__filter-group"]}>
              <Dropdown
                label="Сортування"
                options={SORT_OPTIONS}
                value={filters.sort}
                onChange={handleFilterChange("sort")}
              />
            </div>
          </div>
          <div className={styles.shop__container}>
            <span className={styles["shop__count-title"]}>
              <span>{response.total}</span>
              Товарів
            </span>
            <div className={`${styles.shop__search} ${isSearchOpen ? styles["shop__search_open"] : ""}`} style={{ position: "relative" }}>
              <input
                ref={searchRef}
                type="search"
                name="products-search"
                id="products-search"
                placeholder="Назва, артикул, колір…"
                className={styles["shop__search-input"]}
                autoComplete="off"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              <button
                type="button"
                className={styles["shop__search-icon"]}
                onClick={openSearch}
                aria-label="Відкрити пошук"
              >
                <i className="icon-search regular"></i>
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <ul style={{
                  position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
                  background: "#fff", border: "1px solid #e0e0e0", borderRadius: "4px",
                  listStyle: "none", margin: 0, padding: "4px 0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                  {suggestions.map((s) => (
                    <li
                      key={s}
                      onMouseDown={() => handleSuggestionClick(s)}
                      style={{ padding: "8px 16px", cursor: "pointer", fontSize: "14px", color: "#333" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className={styles["shop__price-row"]}>
          <span className={`${styles["shop__price-label"]} regular`}>Ціна:</span>
          <input
            type="number"
            min={0}
            placeholder="Від"
            className={`${styles["shop__price-input"]} regular`}
            value={filters.price_min}
            onChange={(e) => setFilters((f) => ({ ...f, price_min: e.target.value }))}
          />
          <span className={styles["shop__price-sep"]}>—</span>
          <input
            type="number"
            min={0}
            placeholder="До"
            className={`${styles["shop__price-input"]} regular`}
            value={filters.price_max}
            onChange={(e) => setFilters((f) => ({ ...f, price_max: e.target.value }))}
          />
          {(filters.price_min || filters.price_max) && (
            <button
              type="button"
              className={`${styles["shop__price-clear"]} small`}
              onClick={() => setFilters((f) => ({ ...f, price_min: "", price_max: "" }))}
            >
              ✕
            </button>
          )}
        </div>
      </div>

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

        <Pagination
          current={currentPage}
          total={response.totalPages}
          onChange={handlePageChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
