import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProducts, type ProductItem } from '@/features/products/api/getProducts';
import styles from './ProductsPage.module.css';

type SortField = 'title' | 'brand' | 'sku' | 'rating' | 'price' | 'stock';
type SortOrder = 'asc' | 'desc';

interface NewProductDraft {
  title: string;
  price: string;
  brand: string;
  sku: string;
}

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const initialSortBy = (searchParams.get('sortBy') as SortField | null) ?? 'price';
  const initialSortOrder = (searchParams.get('sortOrder') as SortOrder | null) ?? 'desc';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortField>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [localProducts, setLocalProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedRows, setCheckedRows] = useState<Record<number, boolean>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] = useState<NewProductDraft>({
    title: '',
    price: '',
    brand: '',
    sku: '',
  });
  const [draftError, setDraftError] = useState<string | null>(null);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (debouncedQuery) {
        next.set('q', debouncedQuery);
      } else {
        next.delete('q');
      }

      next.set('sortBy', sortBy);
      next.set('sortOrder', sortOrder);
      return next;
    }, { replace: true });
  }, [debouncedQuery, sortBy, sortOrder, setSearchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProducts({ query: debouncedQuery, limit: 100 });
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
  }, [debouncedQuery]);

  const displayedProducts = useMemo(() => {
    const loweredQuery = debouncedQuery.toLowerCase();
    const filteredLocal = localProducts.filter((item) => {
      if (!loweredQuery) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(loweredQuery)
        || item.brand.toLowerCase().includes(loweredQuery)
        || (item.sku ?? '').toLowerCase().includes(loweredQuery)
      );
    });

    const merged = [...filteredLocal, ...products];
    const sorted = [...merged].sort((a, b) => {
      const direction = sortOrder === 'asc' ? 1 : -1;

      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title) * direction;
        case 'brand':
          return a.brand.localeCompare(b.brand) * direction;
        case 'sku':
          return (a.sku ?? '').localeCompare(b.sku ?? '') * direction;
        case 'rating':
          return (a.rating - b.rating) * direction;
        case 'price':
          return (a.price - b.price) * direction;
        case 'stock':
          return (a.stock - b.stock) * direction;
        default:
          return 0;
      }
    });

    return sorted;
  }, [debouncedQuery, localProducts, products, sortBy, sortOrder]);

  const allChecked = displayedProducts.length > 0
    && displayedProducts.every((item) => checkedRows[item.id]);

  const toggleRowCheck = (rowId: number) => {
    setCheckedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const toggleAllRows = () => {
    setCheckedRows((prev) => {
      const next = { ...prev };
      if (allChecked) {
        displayedProducts.forEach((item) => {
          delete next[item.id];
        });
      } else {
        displayedProducts.forEach((item) => {
          next[item.id] = true;
        });
      }

      return next;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(field);
    setSortOrder('asc');
  };

  const formatPrice = (price: number) => priceFormatter.format(price).replace(',', ', ');

  const renderPrice = (priceText: string) => {
    const match = priceText.match(/^(.*?,)\s*(.*)$/);
    if (!match) {
      return priceText;
    }

    return (
      <>
        {match[1]}{' '}
        <span className={styles.priceFraction}>{match[2]}</span>
      </>
    );
  };

  const submitNewProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDraftError(null);

    const parsedPrice = Number(draft.price.replace(',', '.'));
    if (!draft.title.trim() || !draft.brand.trim() || !draft.sku.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setDraftError('Заполните все поля корректно');
      return;
    }

    const newItem: ProductItem = {
      id: Date.now(),
      title: draft.title.trim(),
      price: parsedPrice,
      rating: 0,
      brand: draft.brand.trim(),
      sku: draft.sku.trim(),
      category: 'Новая позиция',
      stock: 60,
    };

    setLocalProducts((prev) => [newItem, ...prev]);
    setDraft({
      title: '',
      price: '',
      brand: '',
      sku: '',
    });
    setIsCreateOpen(false);
    toast.success('Товар добавлен');
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
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </header>

        <div className={styles.sectionGap} aria-hidden="true" />

        <div className={styles.card}>
          <div className={styles.positionsBand}>
            <p className={styles.positionsLabel}>Все позиции</p>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setIsCreateOpen(true)}
            >
              <span className={styles.addIcon} aria-hidden="true">+</span>
              Добавить
            </button>
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
                  <th>
                    <div className={styles.headerNameCell}>
                      <input
                        type="checkbox"
                        className={styles.headerCheckbox}
                        aria-label="Выбрать все позиции"
                        checked={allChecked}
                        onChange={toggleAllRows}
                      />
                      <button type="button" className={styles.sortButton} onClick={() => handleSort('title')}>
                        Наименование
                      </button>
                    </div>
                  </th>
                  <th>
                    <button type="button" className={styles.sortButton} onClick={() => handleSort('brand')}>
                      Вендор
                    </button>
                  </th>
                  <th>
                    <button type="button" className={styles.sortButton} onClick={() => handleSort('sku')}>
                      Артикул
                    </button>
                  </th>
                  <th>
                    <button type="button" className={styles.sortButton} onClick={() => handleSort('rating')}>
                      Оценка
                    </button>
                  </th>
                  <th>
                    <button type="button" className={styles.sortButton} onClick={() => handleSort('price')}>
                      Цена, Р
                    </button>
                  </th>
                  <th>
                    <button type="button" className={styles.sortButton} onClick={() => handleSort('stock')}>
                      Количество
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && displayedProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.empty}>Список товаров пуст</td>
                  </tr>
                )}

                {displayedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={checkedRows[product.id] ? styles.checkedRow : undefined}
                  >
                    <td className={styles.nameCell} title={product.title}>
                      <div className={styles.nameCellInner}>
                        <input
                          type="checkbox"
                          className={styles.rowCheckbox}
                          checked={!!checkedRows[product.id]}
                          onChange={() => toggleRowCheck(product.id)}
                          aria-label={`Отметить товар ${product.title}`}
                        />
                        <span className={styles.rowCheckboxLarge} aria-hidden="true" />
                        <span className={styles.nameText}>
                          <span className={styles.nameTitle}>{product.title}</span>
                          <span className={styles.nameSubtitle}>{product.category}</span>
                        </span>
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.sku ?? '—'}</td>
                    <td>
                      {`${product.rating.toFixed(1)}/5`.includes('/') ? (
                        <>
                          <span className={product.rating < 3 ? styles.dangerRating : undefined}>
                            {product.rating.toFixed(1)}
                          </span>
                          /5
                        </>
                      ) : (
                        product.rating.toFixed(1)
                      )}
                    </td>
                    <td>{renderPrice(formatPrice(product.price))}</td>
                    <td className={styles.stockCell}>
                      {product.stock > 0 ? (
                        <span className={styles.stockSticks} aria-label={`${product.stock} в наличии`}>
                          {Array.from({ length: Math.max(1, Math.min(5, Math.round(product.stock / 20))) }).map((_, stickIndex) => (
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

      {isCreateOpen && (
        <div className={styles.modalOverlay} role="presentation" onClick={() => setIsCreateOpen(false)}>
          <div className={styles.modalCard} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h2 className={styles.modalTitle}>Добавить товар</h2>
            <form className={styles.modalForm} onSubmit={submitNewProduct}>
              <input
                className={styles.modalInput}
                placeholder="Наименование"
                value={draft.title}
                onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              />
              <input
                className={styles.modalInput}
                placeholder="Цена"
                value={draft.price}
                onChange={(event) => setDraft((prev) => ({ ...prev, price: event.target.value }))}
              />
              <input
                className={styles.modalInput}
                placeholder="Вендор"
                value={draft.brand}
                onChange={(event) => setDraft((prev) => ({ ...prev, brand: event.target.value }))}
              />
              <input
                className={styles.modalInput}
                placeholder="Артикул"
                value={draft.sku}
                onChange={(event) => setDraft((prev) => ({ ...prev, sku: event.target.value }))}
              />
              {draftError && <p className={styles.modalError}>{draftError}</p>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsCreateOpen(false)}>
                  Отмена
                </button>
                <button type="submit" className={styles.saveButton}>
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
