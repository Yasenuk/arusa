import { Link } from "react-router-dom";

import { CatalogProductVariant } from "@org/shared-types";
import { useCartStore, useGuestCartStore } from "@org/utils/index";
import { useAuth } from "../auth/AuthProvider";

import styles from "../../styles/components/product-card.module.scss";

export function ProductCard({ product, variantId }: { product?: CatalogProductVariant; variantId?: number }) {
  const { isAuth } = useAuth();
  const addToCart = useCartStore(s => s.addItem);
  const addToGuestCart = useGuestCartStore(s => s.addItem);

  if (!product) return null;

  const handleAdd = () => {
    if (isAuth) {
      addToCart(product.id);
    } else {
      addToGuestCart(product.id);
    }
  };

  return (
    <div className={styles["product-card"]} data-variant={product?.id}>
      <Link to={`/products/${product.product_id}?variant=${product.id}`}>
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
        onClick={handleAdd}
        className={`${styles["product-card__buy-button"]} _button _button_main _button_border _button_fill regular upper`}
      >
        До кошика
      </button>
    </div>
  );
}

export default ProductCard;