import { composeButtonClasses } from '@/components/ui/Button/buttonClasses';
import useLoginGoogleAuth from './useLoginGoogleAuth';
import { cn } from '@/lib/utils';

function LoginGoogleAuth() {
  const { handleGoogleLogin } = useLoginGoogleAuth();
  return (
    <button
      type="button"
      className={cn(composeButtonClasses({ variant: 'outline', className: 'w-full' }))}
      onClick={handleGoogleLogin}
    >
      Continue with Google
    </button>
  );
}

export default LoginGoogleAuth;
