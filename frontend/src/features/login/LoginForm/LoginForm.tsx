import { useLoginForm } from './useLoginForm';
import { composeButtonClasses } from '@/components/ui/Button/buttonClasses';
import { cn } from '@/lib/utils';
import FormField from '@/components/forms/FormField';
import { Loader2 } from 'lucide-react';

function LoginForm() {
  const { form, handleSubmit, isPending } = useLoginForm();

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

      <button
        type="submit"
        className={cn(composeButtonClasses({ className: 'w-full' }))}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
