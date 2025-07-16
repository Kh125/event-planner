import { Suspense } from 'react'
import InvitationAcceptanceForm from '@/components/invitations/InvitationAcceptanceForm'

// 🎯 LEARNING: This is a Next.js page component
// The file structure app/invitations/attendee/accept/page.tsx creates the route /invitations/attendee/accept

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Accept Your Invitation
          </h1>
          <p className="mt-2 text-gray-600">
            Please provide your details to confirm your attendance
          </p>
        </div>

        {/* 🎯 LEARNING: Suspense boundary for loading states */}
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading invitation...</p>
          </div>
        }>
          <InvitationAcceptanceForm />
        </Suspense>
      </div>
    </div>
  )
}

// 🎯 LEARNING: This is page metadata - Next.js uses this for SEO
export const metadata = {
  title: 'Accept Invitation - Event Planner',
  description: 'Accept your event invitation and provide your details',
}
