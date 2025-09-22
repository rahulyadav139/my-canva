'use client';

import { toast, Toaster as Sonner } from 'sonner';

import type { ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner theme={'system'} className='toaster group' {...props} />;
};

export { toast, Toaster };
