import React from 'react'
import { AlertCircle, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export function WrongAppPage() {
  const { signOut } = useAuth()

  const handleLogout = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Error signing out')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-6">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-text mb-4">Wrong App</h1>
        <p className="text-text/70 mb-8">
          This app is only for registered drivers. Please use the rider app or contact your administrator for driver access.
        </p>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-text text-white px-6 py-3 rounded-xl font-medium hover:bg-text/90 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}