import axios from 'axios';
import type { LoginFormValues } from '@/features/auth/model/loginSchema';

type LoginCredentials = Pick<LoginFormValues, 'username' | 'password'>;

interface LoginResponse {
  accessToken?: string;
  token?: string;
  message?: string;
}

export const loginByCredentials = async (credentials: LoginCredentials): Promise<string> => {
  try {
    const { data } = await axios.post<LoginResponse>('https://dummyjson.com/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 60,
    });

    const token = data.accessToken ?? data.token;
    if (!token) {
      throw new Error('Токен не получен от сервера');
    }

    return token;
  } catch (error) {
    if (axios.isAxiosError<LoginResponse>(error)) {
      const status = error.response?.status;
      if (status === 400 || status === 401) {
        throw new Error('Неверный логин или пароль');
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error('Сервис авторизации недоступен');
    }

    throw new Error('Не удалось выполнить вход');
  }
};
