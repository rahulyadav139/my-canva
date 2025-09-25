import { Button } from '@repo/ui/components/base/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid place-items-center p-10">
      <div className="flex gap-4 items-center">
        <Button asChild>
          <Link href="/signup">Signup</Link>
        </Button>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
