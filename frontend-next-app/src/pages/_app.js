import React from 'react';
import { LayoutProvider, useLayout } from '@/common/context/LayoutContext';
import { SessionProvider, useSession } from '@/common/context/SessionContext';
import { HeroUIProvider } from '@heroui/react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';
import LayoutDashboard from '@/common/components/layouts/LayoutDashboard';
import LayoutDefault from '@/common/components/layouts/LayoutDefault';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const ProgressBar = dynamic(
  () => import('@/common/components/elements/ProgressBar'),
  { ssr: false },
);

function AppLayout({ children }) {
  const { layout, setLayout, loading } = useLayout();
  const router = useRouter();
  // const { user } = useSession();

  // React.useEffect(() => {
  //   if (user && user.level_id === 3 && router.pathname.includes('/dashboard')) {
  //     // Jika level_id adalah 3, arahkan pengguna ke halaman lain
  //     router.push('/');
  //   } else {
  //     if (router.pathname.includes('/dashboard')) {
  //       setLayout('dashboard');
  //       // } else if (router.pathname.includes('/auth')) {
  //       //   setLayout('auth');
  //     } else {
  //       setLayout('default');
  //     }
  //   }
  // }, [router.pathname, setLayout, user]);
  React.useEffect(() => {
    if (router.pathname.includes('/dashboard')) {
      setLayout('dashboard');
    // } else if (router.pathname.includes('/auth')) {
    //   setLayout('auth');
    } else {
      setLayout('default');
    }
  }, [router.pathname, setLayout]);

  if (loading) {
    return null;
  }

  // if (router.pathname === '/404') {
  //   return <LayoutAuth>{children}</LayoutAuth>;
  // }

  return layout === 'dashboard' ? (
    <SessionProvider>
      <LayoutDashboard>{children}</LayoutDashboard>
    </SessionProvider>
  ) : (
    <LayoutDefault>{children}</LayoutDefault>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <HeroUIProvider>
        <NextThemesProvider attribute='class' defaultTheme='dark'>
          <LayoutProvider>
            <AppLayout>
              <ProgressBar />
              <Component {...pageProps} />
            </AppLayout>
          </LayoutProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </>
  );
}
