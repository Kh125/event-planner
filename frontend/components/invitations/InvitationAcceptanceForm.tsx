'use client' // 🎯 LEARNING: This makes it a Client Component (can use hooks, events)

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation' // 🎯 LEARNING: Next.js hook for URL params

// 🎯 LEARNING: TypeScript interfaces for type safety
interface InvitationData {
  event_name: string
  event_date: string
  event_time: string
  venue_name: string
  venue_address: string
  inviter_name: string
  can_accept: boolean
  is_expired: boolean
}

interface AttendeeFormData {
  full_name: string
  phone: string
}

export default function InvitationAcceptanceForm() {
  // 🎯 LEARNING: React state management
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [formData, setFormData] = useState<AttendeeFormData>({
    full_name: '',
    phone: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // 🎯 LEARNING: Next.js hook to get URL search parameters
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  // 🎯 LEARNING: useEffect for side effects (API calls)
  useEffect(() => {
    if (!token) {
      setError('No invitation token provided')
      setLoading(false)
      return
    }

    // Verify invitation
    verifyInvitation(token)
  }, [token])

  // 🎯 LEARNING: Async function to call our Django API
  const verifyInvitation = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/attendee-invitations/verify/${token}/`)
      
      if (!response.ok) {
        throw new Error('Invalid or expired invitation')
      }

      const data = await response.json()
      setInvitation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify invitation')
    } finally {
      setLoading(false)
    }
  }

  // 🎯 LEARNING: Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/attendee-invitations/accept/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          attendee_data: formData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to accept invitation')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation')
    } finally {
      setSubmitting(false)
    }
  }

  // 🎯 LEARNING: Conditional rendering based on state
  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Verifying invitation...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Success!</h3>
            <p className="mt-1 text-sm text-green-700">
              Your invitation has been accepted. Welcome to {invitation?.event_name}!
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!invitation?.can_accept) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">This invitation cannot be accepted at this time.</p>
      </div>
    )
  }

  // 🎯 LEARNING: Main form JSX with Tailwind CSS
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Event Details */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">{invitation.event_name}</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Date:</strong> {invitation.event_date}</p>
          <p><strong>Time:</strong> {invitation.event_time}</p>
          <p><strong>Venue:</strong> {invitation.venue_name}</p>
          <p><strong>Address:</strong> {invitation.venue_address}</p>
          <p><strong>Invited by:</strong> {invitation.inviter_name}</p>
        </div>
      </div>

      {/* Attendee Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Accepting...' : 'Accept Invitation'}
        </button>
      </form>
    </div>
  )
}
