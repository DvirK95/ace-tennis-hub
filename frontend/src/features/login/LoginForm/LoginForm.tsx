import { useLoginForm } from './useLoginForm';
import { composeButtonClasses } from '@/components/ui/Button/buttonClasses';
import { cn } from '@/lib/utils';
import FormField from '@/components/forms/FormField';

function LoginForm() {
  const { form, handleSubmit } = useLoginForm();
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <FormField
        form={form}
        name="email"
        label="Email"
        field="input"
        isRequired={true}
        type="email"
        placeholder="you@example.com"
      />
      <FormField
        form={form}
        name="password"
        label="Password"
        field="input"
        isRequired={true}
        type="password"
        placeholder="Your password"
      />

      <button type="submit" className={cn(composeButtonClasses({ className: 'w-full' }))}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;
