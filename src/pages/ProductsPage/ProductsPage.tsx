import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getProducts, type ProductItem } from '@/features/products/api/getProducts';
import styles from './ProductsPage.module.css';

interface ProductTableRow {
  title: string;
  brand: string;
  sku: string;
  ratingText: string;
  ratingValue: number;
  highlightRatingNumber?: boolean;
  priceText: string;
  stockLevel: number;
}

const manualRows: ProductTableRow[] = [
  {
    title: 'USB Флэшкарта 16GB',
    brand: 'Samsung',
    sku: 'RCH45Q1A',
    ratingText: '4.3/5',
    ratingValue: 4.3,
    priceText: '48 652, 00',
    stockLevel: 3,
  },
  {
    title: 'Утюг Braun TexStyle 9',
    brand: 'TexStyle',
    sku: 'DFCHQ1A',
    ratingText: '4.9/5',
    ratingValue: 4.9,
    priceText: '4 233, 00',
    stockLevel: 1,
  },
  {
    title: 'Смартфон Apple Iphone 17',
    brand: 'Apple',
    sku: 'GUYHD2-X4',
    ratingText: '4.5/5',
    ratingValue: 4.5,
    priceText: '88 652, 00',
    stockLevel: 2,
  },
  {
    title: 'Игровая консоль PlayStation',
    brand: 'Sony',
    sku: 'HT45Q21',
    ratingText: '4.1/5',
    ratingValue: 4.1,
    priceText: '56 236, 00',
    stockLevel: 3,
  },
  {
    title: 'Фен Dyson Supersonic Nural',
    brand: 'Dyson',
    sku: 'FJHHGF - CR4',
    ratingText: '3.3/5',
    ratingValue: 3.3,
    highlightRatingNumber: true,
    priceText: '48 652, 00',
    stockLevel: 3,
  },
];

export const ProductsPage = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedRows, setCheckedRows] = useState<Record<number, boolean>>({});

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
      }),
    [],
  );
  const visibleProducts = products.slice(0, 5);
  const tableRows: ProductTableRow[] = manualRows.length
    ? manualRows
    : visibleProducts.map((product) => ({
      title: product.title,
      brand: product.brand,
      sku: product.sku ?? '—',
      ratingText: product.rating.toFixed(1),
      ratingValue: product.rating,
      priceText: priceFormatter.format(product.price),
      stockLevel: Math.max(1, Math.min(5, Math.round(product.stock / 20))),
    }));

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

  const toggleRowCheck = (rowIndex: number) => {
    setCheckedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Товары</h1>
          <div className={styles.searchInputWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Найти"
              className={styles.searchInput}
            />
          </div>
        </header>

        <div className={styles.sectionGap} aria-hidden="true" />

        <div className={styles.card}>
          <div className={styles.positionsBand}>
            <p className={styles.positionsLabel}>Все позиции</p>
          </div>

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
                  <th>Вендор</th>
                  <th>Артикул</th>
                  <th>Оценка</th>
                  <th>Цена, Р</th>
                  <th>Количество</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && tableRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.empty}>Список товаров пуст</td>
                  </tr>
                )}

                {tableRows.map((row, index) => (
                  <tr
                    key={`${row.sku}-${index}`}
                    className={checkedRows[index] ? styles.checkedRow : undefined}
                  >
                    <td className={styles.nameCell} title={row.title}>
                      <div className={styles.nameCellInner}>
                        <input
                          type="checkbox"
                          className={styles.rowCheckbox}
                          checked={!!checkedRows[index]}
                          onChange={() => toggleRowCheck(index)}
                          aria-label={`Отметить строку ${index + 1}`}
                        />
                        <span className={styles.rowCheckboxLarge} aria-hidden="true" />
                        <span className={styles.nameText}>{row.title}</span>
                      </div>
                    </td>
                    <td>{row.brand}</td>
                    <td>{row.sku}</td>
                    <td>
                      {row.ratingText.includes('/') ? (
                        <>
                          <span className={(row.ratingValue < 3 || row.highlightRatingNumber) ? styles.dangerRating : undefined}>
                            {row.ratingText.split('/')[0]}
                          </span>
                          /{row.ratingText.split('/')[1]}
                        </>
                      ) : (
                        row.ratingText
                      )}
                    </td>
                    <td>{row.priceText}</td>
                    <td className={styles.stockCell}>
                      {row.stockLevel > 0 ? (
                        <span className={styles.stockSticks} aria-label={`${row.stockLevel} палочки`}>
                          {Array.from({ length: row.stockLevel }).map((_, stickIndex) => (
                            <span key={stickIndex} className={styles.stockStick} />
                          ))}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
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
