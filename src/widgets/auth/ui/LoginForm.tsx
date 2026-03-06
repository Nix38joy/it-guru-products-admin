import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSessionStore } from '@/entities/session/store';
import { loginSchema, type LoginFormInput, type LoginFormValues } from '@/features/auth/model/loginSchema';

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
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
      <input {...register('username')} placeholder="Логин" style={{ padding: '10px' }} />
      {errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{errors.username.message}</span>}

      <input {...register('password')} type="password" placeholder="Пароль" style={{ padding: '10px' }} />
      {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>}

      <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" {...register('rememberMe')} /> Запомнить меня
      </label>

      <button type="submit" disabled={isSubmitting} style={{ padding: '10px', cursor: 'pointer' }}>
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};
