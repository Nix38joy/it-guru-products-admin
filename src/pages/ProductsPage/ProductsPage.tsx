import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getProducts, type ProductItem } from '@/features/products/api/getProducts';
import styles from './ProductsPage.module.css';

export const ProductsPage = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }),
    [],
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProducts();
        setProducts(data);
      } catch {
        const message = 'Не удалось загрузить список товаров';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Товары</h1>
          <button type="button" className={styles.addButton}>Добавить</button>
        </header>

        <div className={styles.card}>
          {isLoading && (
            <>
              <div className={styles.progressWrap}>
                <div className={styles.progressBar} />
              </div>
              <p className={styles.loadingText}>Загружаем товары...</p>
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Цена</th>
                  <th>Рейтинг</th>
                  <th>Вендор</th>
                  <th>Артикул</th>
                  <th>Категория</th>
                  <th>Остаток</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && products.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.empty}>Список товаров пуст</td>
                  </tr>
                )}

                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>{priceFormatter.format(product.price)}</td>
                    <td className={product.rating < 3 ? styles.dangerRating : undefined}>
                      {product.rating.toFixed(1)}
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.sku ?? '—'}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};
