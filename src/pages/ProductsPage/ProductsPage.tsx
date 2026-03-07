import styles from './ProductsPage.module.css';

export const ProductsPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Товары</h1>
          <button type="button" className={styles.addButton}>Добавить</button>
        </header>

        <div className={styles.card}>
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
              <tbody />
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};
