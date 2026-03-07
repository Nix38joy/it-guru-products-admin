import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSessionStore } from '@/entities/session/store';
import { loginSchema, type LoginFormInput, type LoginFormValues } from '@/features/auth/model/loginSchema';
import styles from './LoginForm.module.css';

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
    <path
      d="M2.5 12c1.6-3.2 4.9-6.5 9.5-6.5s7.9 3.3 9.5 6.5c-1.6 3.2-4.9 6.5-9.5 6.5S4.1 15.2 2.5 12Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
    <path
      d="M3 3l18 18M9.9 5.6A9.6 9.6 0 0 1 12 5.5c4.6 0 7.9 3.3 9.5 6.5-.7 1.4-1.7 2.7-2.9 3.8M14.1 18.4c-.7.1-1.4.1-2.1.1-4.6 0-7.9-3.3-9.5-6.5.9-1.7 2.2-3.3 3.8-4.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
    <path
      d="M4 7h16v10H4V7Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="m4.5 8 7.5 5 7.5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
    <path
      d="M7 10V8a5 5 0 1 1 10 0v2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="5"
      y="10"
      width="14"
      height="10"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

export const LoginForm = () => {
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput, unknown, LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });
  const usernameValue = watch('username');
  const passwordValue = watch('password');

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
        <label htmlFor="username" className={styles.fieldLabel}>Почта</label>
        <div className={styles.inputWrapper}>
          {usernameValue && (
            <span className={styles.leftAdornment} aria-hidden="true">
              <MailIcon />
            </span>
          )}
          <input
            id="username"
            type="email"
            autoComplete="email"
            {...register('username')}
            className={styles.input}
          />
          {usernameValue && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => {
                setValue('username', '', { shouldDirty: true, shouldValidate: true });
                setFocus('username');
              }}
              aria-label="Очистить поле почты"
            >
              <span className={styles.clearIcon}>×</span>
            </button>
          )}
        </div>
        {errors.username && <span className={styles.error}>{errors.username.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.fieldLabel}>Пароль</label>
        <div className={styles.inputWrapper}>
          {passwordValue && (
            <span className={styles.leftAdornment} aria-hidden="true">
              <LockIcon />
            </span>
          )}
          <input
            id="password"
            {...register('password')}
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            className={styles.input}
          />
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>

      <label className={styles.checkboxRow}>
        <input type="checkbox" {...register('rememberMe')} /> Запомнить данные
      </label>

      <button type="submit" disabled={isSubmitting} className={styles.button}>
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>

      <div className={styles.bottomBlock}>
        <div className={styles.divider} />
        <p className={styles.signupText}>
          Нет аккаунта? <a href="#" className={styles.signupLink}>Создать</a>
        </p>
      </div>
    </form>
  );
};
