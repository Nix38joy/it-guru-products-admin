import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSessionStore } from '@/entities/session/store';
import { loginSchema, type LoginFormInput, type LoginFormValues } from '@/features/auth/model/loginSchema';
import styles from './LoginForm.module.css';

export const LoginForm = () => {
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInput, unknown, LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Имитация запроса к DummyJSON (реальный запрос добавим в след. шаге)
      console.log('Данные формы:', data);
      
      // Пока просто "впускаем" пользователя для теста логики
      setSession('fake-token', data.rememberMe);
      toast.success('Успешный вход!');
      navigate('/products');
    } catch {
      toast.error('Ошибка авторизации');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="username" className={styles.fieldLabel}>Логин</label>
        <input id="username" {...register('username')} className={styles.input} />
        {errors.username && <span className={styles.error}>{errors.username.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.fieldLabel}>Пароль</label>
        <input id="password" {...register('password')} type="password" className={styles.input} />
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>

      <label className={styles.checkboxRow}>
        <input type="checkbox" {...register('rememberMe')} /> Запомнить меня
      </label>

      <button type="submit" disabled={isSubmitting} className={styles.button}>
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};
