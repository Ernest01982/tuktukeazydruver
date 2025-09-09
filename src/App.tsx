import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoginPage } from './components/LoginPage'
import { HomePage } from './components/HomePage'
import { RidePage } from './components/RidePage'
import { EarningsPage } from './components/EarningsPage'
import { AuthGuard } from './components/AuthGuard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <AuthGuard>
                <HomePage />
              </AuthGuard>
            }
          />
          <Route
            path="/ride/:id"
            element={
              <AuthGuard>
                <RidePage />
              </AuthGuard>
            }
          />
          <Route
            path="/earnings"
            element={
              <AuthGuard>
                <EarningsPage />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App