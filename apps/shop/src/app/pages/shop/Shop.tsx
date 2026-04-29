import { useEffect, useState } from "react";

import styles from "./Shop.module.scss";

import ProductCard from "../../common/ProductCard";
import { CatalogProductVariant } from "@org/shared-types";

export default function Shop() {
  const [products, setProducts] = useState<CatalogProductVariant[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const [currentPage, setCurrentPage] = useState(localStorage.getItem("shop-current-page") ? Number(localStorage.getItem("shop-current-page")) : 1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    category: "all",
    sort: "a_z",
    search: "",
    color: "",
    material: "",
    availability: "all",
  });

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.category !== "all") params.append("category", filters.category);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.search) params.append("search", filters.search);
    if (filters.color) params.append("color", filters.color);
    if (filters.material) params.append("material", filters.material);
    if (filters.availability !== "all")
      params.append("availability", filters.availability);

    fetch(`/api/products/all?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [
    filters.category,
    filters.sort,
    filters.color,
    filters.material,
    filters.availability,
    filters.search,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((f) => ({
        ...f,
        search: searchInput,
      }));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  function renderProducts() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;

    return products.slice(start, end).map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  }

  function renderPagination() {
    const totalPages = Math.ceil(products.length / itemsPerPage);

    return Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;

      return (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${styles["shop__pagination-button"]} ${currentPage === page ? styles["shop__pagination-button_active"] : ""
            } _button _button_main _button_border regular upper`}
        >
          {page}
        </button>
      );
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    localStorage.setItem("shop-current-page", page.toString());
  }

  return (
    <div className={styles.shop}>
      <h1 className={`${styles.shop__title} h h_xxl upper`}>Всі товари</h1>
      <div className={styles["shop__topbar-wrap"]}>
        <div className={styles.shop__topbar}>
          <div className={styles.shop__container}>
            <span className={styles["shop__count-title"]}>
              <span>{products.length}</span>
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
          {/* <div className="shop__filter-group" data-dropdown>
              <h2 className="shop__filter-lable regular upper" data-dropdown-button>Фільтри</h2>
              <ul className="shop__filters-list" data-dropdown-body>
                <li className="shop__filters-item _button regular upper">
                  <input checked type="radio" name="products-category" id="products-category-all" data-filter-category="" />
                  <label htmlFor="products-category-all">Всі</label>
                </li>
                <li className="shop__filters-item _button regular upper">
                  <input type="radio" name="products-category" id="products-category-decors" data-filter-category="decors" />
                  <label htmlFor="products-category-decors">Декор</label>
                </li>
                <li className="shop__filters-item _button regular upper">
                  <input type="radio" name="products-category" id="products-category-chairs" data-filter-category="chairs" />
                  <label htmlFor="products-category-chairs">Стільці</label>
                </li>
                <li className="shop__filters-item _button regular upper">
                  <input type="radio" name="products-category" id="products-category-lamps" data-filter-category="lamps" />
                  <label htmlFor="products-category-lamps">Лампи</label>
                </li>
              </ul>
            </div>
            <div className="shop__filter-group" data-dropdown>
              <h2 className="shop__filter-lable regular upper" data-dropdown-button>Сортувати</h2>
              <ul className="shop__filters-list" data-dropdown-body>
                <li className="shop__filters-item _button regular upper">
                  <input type="radio" name="products-sort" id="products-sort-price-low-high" data-filter-sort="price-low-high" />
                  <label htmlFor="products-sort-price-low-high">За ціною: від низької до високої</label>
                </li>
                <li className="shop__filters-item _button regular upper">
                  <input type="radio" name="products-sort" id="products-sort-price-high-low" data-filter-sort="price-high-low" />
                  <label htmlFor="products-sort-price-high-low">За ціною: від високої до низької</label>
                </li>
                <li className="shop__filters-item _button regular upper">
                  <input type="radio" name="products-sort" id="products-sort-a-z" data-filter-sort="a-z" />
                  <label htmlFor="products-sort-a-z">А-я</label>
                </li>
                <li className="shop__filters-item _button regular upper">
                  <input type="radio" name="products-sort" id="products-sort-z-a" data-filter-sort="z-a" />
                  <label htmlFor="products-sort-z-a">Я-а</label>
                </li>
                <li className="shop__filters-item _button regular upper">
                  <input type="radio" name="products-sort" id="products-sort-best-selling" data-filter-sort="best-selling" />
                  <label htmlFor="products-sort-best-selling">Хіт продажів</label>
                </li>
              </ul>
            </div> */}
        </aside>
        <div className={styles.shop__products}>
          <div className={styles.shop__items}>{renderProducts()}</div>
          <div className={styles.shop__pagination}>{renderPagination()}</div>
        </div>
      </div>
    </div>
  );
}