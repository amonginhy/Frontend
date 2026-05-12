import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { StorefrontLayout } from '@app/layouts/StorefrontLayout';
import { DashboardLayout } from '@app/layouts/DashboardLayout';
import { PageFallback } from '@app/router/PageFallback';
import { ProtectedRoute } from '@app/router/ProtectedRoute';

const LandingPage = lazy(() => import('@pages/LandingPage'));
const MarketplacePage = lazy(() => import('@pages/MarketplacePage'));
const ProductCustomizerPage = lazy(() => import('@pages/ProductCustomizerPage'));
const CartPage = lazy(() => import('@pages/CartPage'));
const CheckoutPage = lazy(() => import('@pages/CheckoutPage'));
const OrderTrackingPage = lazy(() => import('@pages/OrderTrackingPage'));
const FavoritesPage = lazy(() => import('@pages/FavoritesPage'));
const OrdersPage = lazy(() => import('@pages/OrdersPage'));
const ProfilePage = lazy(() => import('@pages/ProfilePage'));
const ShopPage = lazy(() => import('@pages/ShopPage'));
const AboutPage = lazy(() => import('@pages/AboutPage'));
const ContactPage = lazy(() => import('@pages/ContactPage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const SignupPage = lazy(() => import('@pages/SignupPage'));
const VendorDashboardPage = lazy(() => import('@pages/VendorDashboardPage'));
const VendorOrdersPage = lazy(() => import('@pages/VendorOrdersPage'));
const VendorProductsPage = lazy(() => import('@pages/VendorProductsPage'));
const VendorCustomersPage = lazy(() => import('@pages/VendorCustomersPage'));
const VendorAnalyticsPage = lazy(() => import('@pages/VendorAnalyticsPage'));
const VendorSettingsPage = lazy(() => import('@pages/VendorSettingsPage'));
const AdminDashboardPage = lazy(() => import('@pages/AdminDashboardPage'));
const AdminVendorsPage = lazy(() => import('@pages/AdminVendorsPage'));
const AdminUsersPage = lazy(() => import('@pages/AdminUsersPage'));
const AdminOrdersPage = lazy(() => import('@pages/AdminOrdersPage'));
const AdminApprovalsPage = lazy(() => import('@pages/AdminApprovalsPage'));
const AdminDisputesPage = lazy(() => import('@pages/AdminDisputesPage'));
const AdminReportsPage = lazy(() => import('@pages/AdminReportsPage'));
const DashboardHelpPage = lazy(() => import('@pages/DashboardHelpPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@pages/UnauthorizedPage'));

const customerOnly = (el: JSX.Element) => (
  <ProtectedRoute roles={['customer']}>{el}</ProtectedRoute>
);
const vendorOnly = (el: JSX.Element) => (
  <ProtectedRoute roles={['vendor']}>{el}</ProtectedRoute>
);
const adminOnly = (el: JSX.Element) => (
  <ProtectedRoute roles={['admin']}>{el}</ProtectedRoute>
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route element={<StorefrontLayout />}>
              {/* Public */}
              <Route index element={<LandingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/shop/:id" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductCustomizerPage />} />
              <Route path="/customize" element={<ProductCustomizerPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Customer protected */}
              <Route path="/cart" element={customerOnly(<CartPage />)} />
              <Route path="/checkout" element={customerOnly(<CheckoutPage />)} />
              <Route path="/orders" element={customerOnly(<OrdersPage />)} />
              <Route
                path="/tracking/:reference"
                element={customerOnly(<OrderTrackingPage />)}
              />
              {/* Backwards compat for legacy /track */}
              <Route
                path="/track/:reference"
                element={customerOnly(<OrderTrackingPage />)}
              />
              <Route path="/favorites" element={customerOnly(<FavoritesPage />)} />
              <Route path="/profile" element={customerOnly(<ProfilePage />)} />
            </Route>

            {/* Vendor protected */}
            <Route
              path="/vendor"
              element={vendorOnly(<DashboardLayout variant="vendor" />)}
            >
              <Route index element={<Navigate to="/vendor/dashboard" replace />} />
              <Route path="dashboard" element={<VendorDashboardPage />} />
              <Route path="orders" element={<VendorOrdersPage />} />
              <Route path="products" element={<VendorProductsPage />} />
              <Route path="customers" element={<VendorCustomersPage />} />
              <Route path="analytics" element={<VendorAnalyticsPage />} />
              <Route path="settings" element={<VendorSettingsPage />} />
              <Route path="help" element={<DashboardHelpPage />} />
            </Route>

            {/* Admin protected */}
            <Route
              path="/admin"
              element={adminOnly(<DashboardLayout variant="admin" />)}
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="vendors" element={<AdminVendorsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="approvals" element={<AdminApprovalsPage />} />
              <Route path="disputes" element={<AdminDisputesPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="help" element={<DashboardHelpPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </BrowserRouter>
  );
}
