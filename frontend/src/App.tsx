import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import PortfolioListPage from './pages/portfolios/PortfolioListPage'
import PortfolioDetailPage from './pages/portfolios/PortfolioDetailPage'

function App() {
  return (
    <Routes>
      {/* Auth pages — no layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main pages — with layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/photographers" element={<PortfolioListPage />} />
        <Route path="/portfolios/:id" element={<PortfolioDetailPage />} />
        <Route path="/community" element={<div style={{ padding: 48 }}>摄影社区 (Phase 6)</div>} />
        <Route path="/dashboard" element={<div style={{ padding: 48 }}>工作台 (即将开放)</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
