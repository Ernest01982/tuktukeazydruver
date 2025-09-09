import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

export function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <Outlet />
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'text-sm',
          duration: 3000,
          style: {
            background: '#0E172A',
            color: '#F8FAFC',
          },
        }}
      />
    </div>
  )
}