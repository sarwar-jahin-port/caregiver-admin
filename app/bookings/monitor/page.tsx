'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useBookings } from '@/lib/hooks/use-data'
import { AlertTriangle, Clock, ArrowRight, RefreshCw, Activity } from 'lucide-react'

const STATUS_PULSE = {
  'Active': 'bg-green-500',
  'Replacement In Progress': 'bg-purple-500',
}

const STATUS_COLORS = {
  'Active': 'bg-green-50 text-green-800',
  'Replacement In Progress': 'bg-purple-50 text-purple-800',
}

export default function LiveMonitorPage() {
  const { bookings } = useBookings()
  const [refreshInterval, setRefreshInterval] = useState(60)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date())
    }, refreshInterval * 1000)
    return () => clearInterval(timer)
  }, [refreshInterval])

  const activeBookings = bookings.filter(b => b.status === 'Active' || b.status === 'Replacement In Progress')
  const alertBookings = activeBookings.filter(b => !b.checkInOut.checkInTime || (b.totalHours > 4 && !b.checkInOut.checkOutTime))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Booking Monitor</h1>
          <p className="text-gray-600 mt-1">Real-time tracking of active bookings</p>
        </div>
        <div className="flex gap-2">
          <div className="text-sm text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button size="sm" variant="outline" onClick={() => setLastUpdate(new Date())}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Panel */}
      {alertBookings.length > 0 && (
        <Card className="p-6 border-l-4 border-orange-500 bg-orange-50">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900">{alertBookings.length} Alerts</h3>
              <div className="space-y-2 mt-2">
                {alertBookings.map((b) => (
                  <div key={b.id} className="text-sm text-orange-800">
                    <span className="font-medium">{b.clientName}</span> - {!b.checkInOut.checkInTime ? 'No check-in' : 'Overtime (4+ hours)'}
                    <Link href={`/bookings/${b.id}`} className="ml-2 text-orange-600 hover:underline">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Active Bookings Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Active Bookings ({activeBookings.length})</h2>
        {activeBookings.length === 0 ? (
          <Card className="p-12 text-center text-gray-500">
            <Activity className="h-12 w-12 mx-auto opacity-30 mb-4" />
            <p>No active bookings at this time</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeBookings.map((booking) => (
              <Card key={booking.id} className="p-5 border-l-4" style={{ borderColor: STATUS_PULSE[booking.status as keyof typeof STATUS_PULSE] || '#f3f4f6' }}>
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{booking.clientName}</h3>
                      <p className="text-xs text-gray-600">{booking.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${STATUS_PULSE[booking.status as keyof typeof STATUS_PULSE] || 'bg-gray-400'}`} />
                      <Badge className={STATUS_COLORS[booking.status as keyof typeof STATUS_COLORS]}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Caregiver & Service */}
                  <div className="text-sm">
                    <p className="text-gray-600">Caregiver: <span className="font-medium text-gray-900">{booking.caregiverName}</span></p>
                    <p className="text-gray-600">Service: <Badge variant="secondary" className="text-xs ml-1">{booking.serviceType}</Badge></p>
                  </div>

                  {/* Timing */}
                  <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-600">Started</p>
                      <p className="font-mono font-bold">{booking.startTime}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="text-sm text-right">
                      <p className="text-gray-600">Ends</p>
                      <p className="font-mono font-bold">{booking.endTime}</p>
                    </div>
                  </div>

                  {/* Check-in/Check-out Status */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${booking.checkInOut.checkInVerified ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-gray-600">Check-in: {booking.checkInOut.checkInTime ? <span className="font-medium">{booking.checkInOut.checkInTime}</span> : <span className="text-orange-600">Pending</span>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${booking.checkInOut.checkOutVerified ? 'bg-green-500' : booking.checkInOut.checkOutTime ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                      <span className="text-gray-600">Check-out: {booking.checkInOut.checkOutTime ? <span className="font-medium">{booking.checkInOut.checkOutTime}</span> : <span className="text-gray-400">In Progress</span>}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link href={`/bookings/${booking.id}`} className="block">
                    <Button variant="outline" className="w-full" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-4 gap-4 pt-6 border-t">
        <div>
          <p className="text-gray-600 text-sm">Active Now</p>
          <p className="text-2xl font-bold">{activeBookings.filter(b => b.status === 'Active').length}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Replacements</p>
          <p className="text-2xl font-bold">{activeBookings.filter(b => b.status === 'Replacement In Progress').length}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Alerts</p>
          <p className="text-2xl font-bold text-orange-600">{alertBookings.length}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Auto-refresh</p>
          <p className="text-2xl font-bold">{refreshInterval}s</p>
        </div>
      </div>
    </div>
  )
}
