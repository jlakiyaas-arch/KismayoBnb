import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import HostDashboardPage from './pages/HostDashboardPage';
import GuestDashboardPage from './pages/GuestDashboardPage';
import HostPropertiesPage from './pages/HostPropertiesPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import WishlistPage from './pages/WishlistPage';
import HostReservationsPage from './pages/HostReservationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="bookings"
            element={
              <ProtectedRoute roles={['guest']}>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/guest"
            element={
              <ProtectedRoute roles={['guest']}>
                <GuestDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/host"
            element={
              <ProtectedRoute roles={['host']}>
                <HostDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="host/properties"
            element={
              <ProtectedRoute roles={['host']}>
                <HostPropertiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="host/properties/new"
            element={
              <ProtectedRoute roles={['host']}>
                <CreatePropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="host/properties/:id/edit"
            element={
              <ProtectedRoute roles={['host']}>
                <EditPropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="host/reservations"
            element={
              <ProtectedRoute roles={['host']}>
                <HostReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
