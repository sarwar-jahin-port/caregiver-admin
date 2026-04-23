'use client'

import React, { use } from 'react'
import BookingDetailPage from './detail-page'
import { useBookings } from '@/lib/hooks/use-data'

export default function BookingPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { getBookingById } = useBookings()

  const booking = getBookingById(params.id)

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
        <p className="text-gray-500 mt-2">The booking ID #{params.id} does not exist in our records.</p>
      </div>
    )
  }

  return <BookingDetailPage booking={booking} />
}