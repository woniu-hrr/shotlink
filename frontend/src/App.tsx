import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import PhotographerListPage from './pages/photographers/PhotographerListPage'
import PortfolioListPage from './pages/portfolios/PortfolioListPage'
import PortfolioDetailPage from './pages/portfolios/PortfolioDetailPage'
import BookingListPage from './pages/dashboard/BookingListPage'
import BookingCreatePage from './pages/dashboard/BookingCreatePage'

function App() {
  return (
    <Routes>
      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/photographers" element={<PhotographerListPage />} />
        <Route path="/portfolios" element={<PortfolioListPage />} />
        <Route path="/portfolios/:id" element={<PortfolioDetailPage />} />
        <Route path="/photographers/:id" element={<PortfolioDetailPage />} />
        <Route path="/community" element={<div style={{ padding: 48 }}>摄影社区 (Phase 6)</div>} />
        <Route path="/dashboard" element={<BookingListPage />} />
        <Route path="/dashboard/bookings" element={<BookingListPage />} />
        <Route path="/dashboard/bookings/new" element={<BookingCreatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
