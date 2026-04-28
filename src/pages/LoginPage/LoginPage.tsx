import { LoginForm } from '@/widgets/auth/ui/LoginForm';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logoCircle} aria-hidden="true">
            <svg viewBox="0 0 64 64" className={styles.logoIcon}>
              <circle cx="32" cy="32" r="27" fill="#ffffff" />
              <path d="M17 32L43 27M17 38L47 44" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M19 37V31M23 38V30M27 39V29M31 40V28M35 41V27M39 42V26M43 43V25" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className={styles.title}>Добро пожаловать!</h1>
          <p className={styles.subtitle}>Пожалуйста, авторизуйтесь</p>
        </header>
        
        <LoginForm />
      </section>
    </main>
  );
};
