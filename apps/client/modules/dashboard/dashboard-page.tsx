'use client';

import { Button } from '@repo/ui/components/base/button';
import { canvasApi } from '@/apis/canvas-api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateCanvas = async () => {
    try {
      setIsLoading(true);
      const canvasId = await canvasApi.createCanvas();
      router.push(`/arts/${canvasId}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid place-items-center p-10">
      <Button disabled={isLoading} onClick={handleCreateCanvas}>
        {isLoading ? 'Creating...' : 'Create'}
      </Button>
    </div>
  );
};
