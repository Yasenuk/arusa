import { Link } from 'react-router-dom';

import styles from './product-card.module.scss';

type product = {
  id: number,
  title: string,
  price: string,
  image: string
};

export function ProductCard(product_data: product) {
  return (
    <article className={styles['product-card']}>
      <Link to='/product'>
        <picture>
          <source srcSet={`${product_data.image}.webp`} type='image/webp' />
          <source srcSet={`${product_data.image}.avif`} type='image/avif' />
          <img className={styles['product-card__picture']}
            width={330} height={331} src={`${product_data.image}.png`} alt={product_data.title}
            loading='lazy'
          />
        </picture>
      </Link>
      <h3 className={`${styles['product-card__title']} small upper`}>{product_data.title}</h3>
      <span className={`${styles['product-card__price']} small`}>{product_data.price} ₴</span>
    </article>
  );
}

export default ProductCard;
