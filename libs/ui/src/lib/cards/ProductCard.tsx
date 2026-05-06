import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { CatalogProductVariant } from "@org/shared-types";
import { useCartStore } from "@org/utils/index";

import styles from "../../styles/components/product-card.module.scss";

export function ProductCard({ product, variantId }: { product?: CatalogProductVariant; variantId?: number }) {
  const { addItem } = useCartStore();

  if (!product) return null;

  return (
    <div className={styles["product-card"]}>
      <Link to={`/products/${product.id}`}>
        <picture>
          <source srcSet={`${product.image}.avif`} type="image/avif" />
          <source srcSet={`${product.image}.webp`} type="image/webp" />
          <img
            className={styles["product-card__picture"]}
            loading="lazy"
            src={`${product.image}.png`}
            alt={product.title}
            width={320}
            height={320}
          />
        </picture>
      </Link>

      <div className={styles["product-card__info"]}>
        <h3 className={`${styles["product-card__title"]} small upper`}>
          {product.title} {product.color}
        </h3>

        <span className={`${styles["product-card__price"]} small`}>
          {(product.price / 1000).toFixed(3)} ₴
        </span>
      </div>

      <button
        onClick={() => addItem(product.id)}
        className={`${styles["product-card__buy-button"]} _button _button_main _button_border _button_fill regular upper`}
      >
        До кошика
      </button>
    </div>
  );
}

export default ProductCard;