'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCarePlans } from '@/lib/hooks/use-data'
import { ArrowLeft, Calendar, DollarSign, MapPin, Phone, Clock } from 'lucide-react'

export default function CarePlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { getCarePlanById } = useCarePlans()
  const carePlan = getCarePlanById(id)

  if (!carePlan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Care plan not found</p>
      </div>
    )
  }

  // Collect all replacements from services
  const allReplacements = carePlan.activeServices
    .flatMap(booking => booking.replacementHistory)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <Link href="/care-plans">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Care Plans
        </Button>
      </Link>

      {/* Client Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{carePlan.clientName}</h1>
            <p className="text-gray-600 mt-1">Age {carePlan.clientAge} • Client ID: {carePlan.clientId}</p>
          </div>
          <Badge variant="default" className="bg-green-100 text-green-800">Active Plan</Badge>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-4 pt-6 border-t">
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm">{carePlan.clientLocation}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <div className="flex items-center mt-1">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm">{carePlan.clientPhone}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Plan Created</p>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm">{new Date(carePlan.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Cost</p>
            <div className="flex items-center mt-1">
              <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm font-bold">${carePlan.totalActiveCost.toFixed(0)}/mo</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Services */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Active Services ({carePlan.activeServices.length})</h2>
              <Button size="sm">Add Service</Button>
            </div>
            {carePlan.activeServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active services</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carePlan.activeServices.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg hover:bg-gray-50 relative overflow-hidden">
                    {/* Left accent border for care plan grouping */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    <div className="ml-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={booking.serviceType === 'CNA' ? 'default' : 'secondary'}>
                          {booking.serviceType}
                        </Badge>
                        {booking.taskType && (
                          <Badge variant="outline" className="text-xs">{booking.taskType}</Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 mt-2">{booking.id}</h3>
                      <p className="text-xs text-gray-600 mt-1">Caregiver: TBD</p>
                      <div className="flex items-center text-xs text-gray-600 mt-2 gap-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.totalHours}h
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${booking.finalRate}/hr
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <Link href={`/bookings/${booking.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Booking
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Replacement History Timeline */}
          {allReplacements.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Replacement History</h2>
              <div className="space-y-4">
                {allReplacements.map((event, index) => (
                  <div key={event.id} className="relative pb-4 last:pb-0">
                    {index !== allReplacements.length - 1 && (
                      <div className="absolute left-5 top-10 w-0.5 h-8 bg-gray-200"></div>
                    )}
                    <div className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.reason}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.originalCaregiverName} → {event.replacementCaregiverName}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">Strike {event.strikeApplied}</Badge>
                          <Badge className="bg-amber-100 text-amber-800 text-xs">+{(event.surgeMultiplier - 1) * 100}% surge</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{new Date(event.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Plan Summary</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{carePlan.activeServices.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="text-2xl font-bold text-green-600 mt-1">${carePlan.totalActiveCost.toFixed(2)}</p>
              </div>
              <div className="text-xs text-gray-500 pt-3 border-t">
                Last modified: {new Date(carePlan.lastModified).toLocaleDateString()}
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Replacements</span>
                <span className="font-medium">{allReplacements.length}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-gray-600">CNA Services</span>
                <span className="font-medium">{carePlan.activeServices.filter(s => s.serviceType === 'CNA').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HHA Services</span>
                <span className="font-medium">{carePlan.activeServices.filter(s => s.serviceType === 'HHA').length}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Edit Plan
              </Button>
              <Button variant="outline" className="w-full">
                View Client Profile
              </Button>
              <Button variant="outline" className="w-full text-red-600">
                Cancel Plan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
