import { CanvasArt } from '@/modules/canvas/art';
import { notFound } from 'next/navigation';

interface ArtPageProps {
  params: Promise<{ artId: string }>;
}

export default async function ArtPage({ params }: ArtPageProps) {
  const { artId } = await params;

  if (!artId) {
    return notFound();
  }

  return <CanvasArt canvasId={artId} />;
}
