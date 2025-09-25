import { useState, useEffect } from 'react';
import { userApi } from '@/apis/user-api';
import { setUser } from '@/store/user-slice';
import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useRouter } from 'next/navigation';

interface AuthenticatorProps {
  children: React.ReactNode;
}

export const Authenticator = ({ children }: AuthenticatorProps) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthenticating(true);
        const user = await userApi.getUser();
        dispatch(setUser(user));
        setIsAuthenticating(false);
      } catch (error) {
        router.push('/login');
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticating) {
    return <div>Authenticating...</div>;
  }

  return children;
};
