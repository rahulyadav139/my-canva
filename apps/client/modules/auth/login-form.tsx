'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import type { LoginUserBody } from '@repo/shared/api';
import { loginUserBodySchema } from '@repo/shared/api';
import { Button } from '@repo/ui/components/base/button';
import { Input } from '@repo/ui/components/base/input';
import { toast } from '@repo/ui/components/base/toast';

import { authApi } from '@/apis/auth-api';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserBody>({
    resolver: zodResolver(loginUserBodySchema),
  });
  const router = useRouter();

  const onSubmit = async (credentials: LoginUserBody) => {
    try {
      console.log(credentials, 'credentials');
      await authApi.login(credentials);
      router.push('/dashboard');
    } catch (err) {
      toast.error('something went wrong');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-medium text-gray-900">
          Sign in to your account
        </h2>
      </div>

      {/* Email & Password Form */}
      <form
        id="login-form"
        name="login-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="h-12 w-full rounded-md border px-4"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            className="h-12 w-full rounded-md border px-4"
            required
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-400">
              Incorrect password. You modified your password 637 days ago.
            </p>
          )}
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-md font-medium transition-colors"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        {/* Sign Up Link */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-900">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
