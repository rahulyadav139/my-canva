'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  type RegisterUserBody,
  registerUserBodySchema,
} from '@repo/shared/api';
import { Input } from '@repo/ui/base/input';
import { Button } from '@repo/ui/components/base/button';
import { toast } from '@repo/ui/components/base/toast';
import { cn } from '@repo/ui/lib/utils';

import { authApi } from '@/apis/auth-api';

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserBody>({
    resolver: zodResolver(registerUserBodySchema),
  });
  const router = useRouter();

  const onSubmit = async (userData: RegisterUserBody) => {
    try {
      await authApi.register(userData);

      router.push('/dashboard');
    } catch (err) {
      toast.error('something went wrong');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-medium text-gray-900">
          Create Account
        </h2>
      </div>

      {/* Email & Password Form */}
      <form
        id="signup-form"
        name="signup-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <Input
            type="text"
            placeholder="Full Name"
            {...register('name')}
            className={cn(
              'h-12 w-full rounded-md border px-4',
              errors.name && 'border-destructive'
            )}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            className={cn(
              'h-12 w-full rounded-md border px-4',
              errors.email && 'border-destructive'
            )}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password (minimum 8 characters)"
            {...register('password')}
            className={cn(
              'h-12 w-full rounded-md border px-4',
              errors.password && 'border-destructive'
            )}
            required
            disabled={isSubmitting}
            minLength={8}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Sign Up Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-md font-medium text-white transition-colors"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>

        {/* Sign In Link */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
