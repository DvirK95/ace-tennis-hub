import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Landmark } from 'lucide-react';
import LoginForm from '@/features/login/LoginForm/LoginForm';
import LoginGoogleAuth from '@/features/login/LoginGoogleAuth/LoginGoogleAuth';
import { tokenStorage } from '@/lib/tokenStorage';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const isAuthenticated = tokenStorage.get();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[-160px] right-[-120px] h-[380px] w-[380px] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border bg-card/70 shadow-card backdrop-blur transition-shadow hover:shadow-card-hover">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ace Tennis Hub</CardTitle>
                  <CardDescription>Sign in to continue.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <LoginForm />

              <div className="my-5">
                <Separator />
                <div className="relative -top-3 flex justify-center">
                  <span className="bg-background px-2 text-xs text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              <LoginGoogleAuth />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                This is a UI placeholder. Auth logic will be wired in next.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
