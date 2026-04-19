'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBookings, useCaregivers } from '@/lib/hooks/use-data'
import { ArrowLeft, Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  'Scheduled': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-green-100 text-green-800',
  'Completed': 'bg-gray-100 text-gray-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Disputed': 'bg-orange-100 text-orange-800',
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { getBookingById } = useBookings()
  const { getCaregiverById } = useCaregivers()
  const booking = getBookingById(id)

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Booking not found</p>
      </div>
    )
  }

  const caregiver = getCaregiverById(booking.caregiverId)
  const surgePricing = booking.surgePricing ? booking.surgePricing.multiplier : 1
  const surgeDifference = booking.finalRate - booking.baseRate

  return (
    <div className="space-y-6">
      <Link href="/bookings">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Booking {booking.id.slice(0, 8)}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Created on {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className={STATUS_COLORS[booking.status]}>
                {booking.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-gray-600">Service Type</p>
                <p className="mt-2 font-medium">{booking.serviceType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Schedule</p>
                <p className="mt-2 font-medium">{booking.scheduleType}</p>
              </div>
            </div>
          </Card>

          {/* Client Info */}
          <Card className="p-6">
            <h2 className="font-bold text-gray-900 mb-4">Client Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="mt-1 font-medium">{booking.clientName}</p>
              </div>
            </div>
          </Card>

          {/* Caregiver Info */}
          <Card className="p-6">
            <h2 className="font-bold text-gray-900 mb-4">Assigned Caregiver</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{caregiver?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-600">{caregiver?.email}</p>
              </div>
              <Link href={`/caregivers/${booking.caregiverId}`}>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>
            {booking.replacementHistory.length > 0 && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded flex items-start">
                <AlertCircle className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Caregiver was replaced</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Reason: {booking.replacementHistory[0].reason}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Service Details */}
          <Card className="p-6">
            <h2 className="font-bold text-gray-900 mb-4">Service Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="flex items-center text-blue-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <p className="text-sm font-medium">Start Date</p>
                </div>
                <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="flex items-center text-blue-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <p className="text-sm font-medium">Duration</p>
                </div>
                <p className="font-medium">{booking.totalHours} hours</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="flex items-center text-blue-600 mb-2">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <p className="text-sm font-medium">Base Rate</p>
                </div>
                <p className="font-medium">${booking.baseRate}/hour</p>
              </div>
            </div>
            {booking.taskType && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium text-gray-600 mb-1">Task Type</p>
                <Badge variant="secondary">{booking.taskType}</Badge>
              </div>
            )}
          </Card>

          {/* Organization Info (if applicable) */}
          {booking.organizationId && (
            <Card className="p-6">
              <h2 className="font-bold text-gray-900 mb-4">Organization</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">This booking is managed by an organization</p>
                <Badge className="bg-purple-100 text-purple-800">{booking.source}</Badge>
              </div>
            </Card>
          )}

          {/* Replacement Event Log */}
          {booking.replacementHistory.length > 0 && (
            <Card className="p-6">
              <h2 className="font-bold text-gray-900 mb-4">Replacement Event Log</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original Caregiver</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Strike Applied</TableHead>
                      <TableHead>Replacement Caregiver</TableHead>
                      <TableHead>Surge Rate</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {booking.replacementHistory.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.originalCaregiverName}</TableCell>
                        <TableCell className="text-sm">{event.reason}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Strike {event.strikeApplied}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{event.replacementCaregiverName}</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-800">{event.surgeMultiplier}x (${event.surgeRate}/hr)</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(event.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Pricing Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{booking.totalHours}h × ${booking.baseRate}</span>
                <span className="font-medium">${(booking.baseRate * (booking.totalHours || 1)).toFixed(2)}</span>
              </div>
              {surgeDifference > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Surge Pricing ({((surgePricing - 1) * 100).toFixed(0)}%)</span>
                  <span className="font-medium">+${surgeDifference.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">${booking.finalRate * (booking.totalHours || 1)}</span>
              </div>
            </div>
            {surgeDifference > 0 && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                Surge pricing applied
              </div>
            )}
          </Card>

          {/* Source */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-2">Booking Source</h3>
            <Badge variant="outline" className={booking.source === 'Independent' ? '' : 'bg-purple-50 text-purple-700 border-purple-200'}>
              {booking.source}
            </Badge>
          </Card>

          {/* Care Plan */}
          {booking.carePlanId && (
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-3">Part of Care Plan</h3>
              <Link href={`/care-plans/${booking.carePlanId}`}>
                <Button variant="outline" className="w-full">
                  View Care Plan {booking.carePlanId}
                </Button>
              </Link>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {booking.status === 'Confirmed' && (
                <>
                  <Button variant="outline" className="w-full">
                    Start Service
                  </Button>
                  <Button variant="outline" className="w-full text-red-600">
                    Cancel Booking
                  </Button>
                </>
              )}
              {booking.status === 'Active' && (
                <>
                  <Button variant="outline" className="w-full">
                    Mark Complete
                  </Button>
                  <Button variant="outline" className="w-full text-red-600">
                    Request Replacement
                  </Button>
                </>
              )}
              <Button variant="outline" className="w-full">
                Contact Client
              </Button>
              <Button variant="outline" className="w-full">
                Contact Caregiver
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
