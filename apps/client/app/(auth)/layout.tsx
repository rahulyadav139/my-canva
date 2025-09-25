import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const cookieStore = await cookies();

  const isLoggedIn = !!cookieStore.get('token')?.value;

  if (isLoggedIn) {
    redirect('/dashboard');
  }

  return (
    <div className="md:bg-background flex h-dvh items-center justify-center bg-white md:p-4">
      {/* Auth Form Container */}
      <div className="md:border-border w-full max-w-[500px] bg-white p-4 shadow-xs md:rounded-lg md:border md:p-8">
        {children}
      </div>
    </div>
  );
}
