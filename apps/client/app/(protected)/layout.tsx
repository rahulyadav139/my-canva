'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Authenticator } from '@/modules/auth/authenticator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Provider store={store}>
      <Authenticator>{children}</Authenticator>
    </Provider>
  );
}
