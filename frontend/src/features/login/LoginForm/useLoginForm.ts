import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValuesInfer } from './schema';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/schemas/api';
import { tokenStorage } from '@/lib/tokenStorage';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export function useLoginForm() {
  const navigate = useNavigate();

  const form = useForm<LoginFormValuesInfer>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: api.auth.login,
  });

  async function handleSubmit(values: LoginFormValuesInfer) {
    try {
      const response = await mutateAsync({
        email: values.email,
        password: values.password,
      });
      tokenStorage.set(response.token);
      navigate('/');
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          form.setError('email', { message: 'Invalid email or password' });
        }
      }
      console.error(e);
    }
  }

  return {
    form,
    handleSubmit,
  };
}
