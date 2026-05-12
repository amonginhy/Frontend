import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { Toaster } from '@shared/ui';
import { AuthRequiredModal } from '@features/auth/AuthRequiredModal';

export function StorefrontLayout() {
  const location = useLocation();
  // Auth pages render their own layout — hide the top nav + footer for them
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAuthPage && <TopNav />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <Toaster />
      <AuthRequiredModal />
    </div>
  );
}
