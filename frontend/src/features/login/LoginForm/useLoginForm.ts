import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValuesInfer } from './schema';

export function useLoginForm() {
  const form = useForm<LoginFormValuesInfer>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function handleSubmit(_values: LoginFormValuesInfer) {
    // Preparation only: implement auth request + navigation later.
    // For now we intentionally do nothing.
  }

  return {
    form,
    handleSubmit,
  };
}
