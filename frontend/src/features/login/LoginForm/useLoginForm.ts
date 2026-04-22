import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValuesInfer } from './schema';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/schemas/api';

export function useLoginForm() {
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
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    form,
    handleSubmit,
  };
}
