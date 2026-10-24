import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireAuth } from '@/components/auth/RequireAuth';

// Pages
import { Home } from '@/pages/Home';
import { Explore } from '@/pages/Explore';
import { Marketplace } from '@/pages/Marketplace';
import { ListingDetail } from '@/pages/ListingDetail';
import { CreateListing } from '@/pages/CreateListing';
import { Jobs } from '@/pages/Jobs';
import { JobDetail } from '@/pages/JobDetail';
import { Tutors } from '@/pages/Tutors';
import { TutorDetail } from '@/pages/TutorDetail';
import { Housing } from '@/pages/Housing';
import { HousingDetail } from '@/pages/HousingDetail';
import { Services } from '@/pages/Services';
import { ServiceDetail } from '@/pages/ServiceDetail';
import { Events } from '@/pages/Events';
import { EventDetail } from '@/pages/EventDetail';
import { About } from '@/pages/About';
import { Help } from '@/pages/Help';
import { Terms } from '@/pages/Terms';
import { Privacy } from '@/pages/Privacy';

// Auth
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';

// User
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { Favorites } from '@/pages/Favorites';
import { MyListings } from '@/pages/MyListings';
import { Messages } from '@/pages/Messages';
import { Subscription } from '@/pages/Subscription';

// Admin
import { Admin } from '@/pages/Admin';

// Misc
import { NotFound } from '@/pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  const { authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Vérification de votre session...
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes — no layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* App routes — with layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ListingDetail />} />
        <Route path="/create-listing" element={<RequireAuth><CreateListing /></RequireAuth>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutors/:id" element={<TutorDetail />} />
        <Route path="/housing" element={<Housing />} />
        <Route path="/housing/:id" element={<HousingDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* User */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
        <Route path="/my-listings" element={<RequireAuth><MyListings /></RequireAuth>} />
        <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
        <Route path="/subscription" element={<RequireAuth><Subscription /></RequireAuth>} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
