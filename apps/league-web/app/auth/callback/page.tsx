'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@simpleteams/database'
import { Button } from '@/components/ui/button'
import { CheckCircle, X } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [showCloseMessage, setShowCloseMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth-callback-failed')
          return
        }

        if (data.session) {
          // Check if they came from registration flow
          const urlParams = new URLSearchParams(window.location.search);
          const returnTo = urlParams.get('returnTo') || '/dashboard';

          // Check if this is a registration callback
          const isRegistrationFlow = returnTo.includes('/register/checkout')

          if (isRegistrationFlow) {
            // Check if there's already a registration tab open
            const registrationTabId = localStorage.getItem('registration-tab-id')
            const currentTabId = `tab-${Date.now()}-${Math.random()}`

            if (registrationTabId) {
              // There's already a registration tab, try to communicate with it
              localStorage.setItem('auth-success', JSON.stringify({
                timestamp: Date.now(),
                userId: data.session.user.id,
                email: data.session.user.email
              }))

              // Show close message instead of redirecting
              setShowCloseMessage(true)
              setIsLoading(false)
              return
            } else {
              // No existing tab, mark this as the registration tab
              localStorage.setItem('registration-tab-id', currentTabId)

              // Clean up when tab closes
              window.addEventListener('beforeunload', () => {
                const currentStoredId = localStorage.getItem('registration-tab-id')
                if (currentStoredId === currentTabId) {
                  localStorage.removeItem('registration-tab-id')
                }
              })
            }
          }

          // Successfully authenticated, redirect to appropriate location
          router.push(returnTo);
        } else {
          // No session, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=auth-callback-failed')
      }
    }

    handleAuthCallback()
  }, [router])

  if (showCloseMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Successfully Signed In!
          </h1>
          <p className="text-gray-600 mb-6">
            You can close this window and return to your registration form. Your authentication has been applied to the original tab.
          </p>
          <Button
            onClick={() => window.close()}
            className="w-full mb-3"
          >
            <X className="h-4 w-4 mr-2" />
            Close This Window
          </Button>
          <p className="text-xs text-gray-500">
            If the window doesn't close automatically, you can close it manually.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {isLoading ? 'Signing you in...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  )
}