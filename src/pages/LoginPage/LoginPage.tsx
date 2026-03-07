import { LoginForm } from '@/widgets/auth/ui/LoginForm';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Добро пожаловать!</h1>
          <p className={styles.subtitle}>пожалуйста, авторизуйтесь</p>
        </header>
        
        <LoginForm />
      </section>
    </main>
  );
};
