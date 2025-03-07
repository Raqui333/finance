import type { Metadata } from 'next';
import '@/shared/styles/globals.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const metadata: Metadata = {
  title: 'Finance Dashboard',
  description: 'Finance Dashboard',
};

import ReduxProvider from '@/shared/store/reduxProvider';
import MaterialThemeProvider from '@/shared/mui/MaterialThemeProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <MaterialThemeProvider>{children}</MaterialThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
