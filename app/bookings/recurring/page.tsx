'use client'

import { useState } from 'react'
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
import { useBookings } from '@/lib/hooks/use-data'
import { Repeat2, ChevronDown, Pause, Clock, CheckCircle } from 'lucide-react'

const STATUS_COLORS = {
  'Active': 'bg-green-50 text-green-800',
  'Paused': 'bg-yellow-50 text-yellow-800',
  'Ended': 'bg-gray-50 text-gray-800',
  'Cancelled': 'bg-red-50 text-red-800',
}

export default function RecurringSeriesPage() {
  const { bookings } = useBookings()
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set())

  // Group bookings by recurring series
  const seriesMap = new Map<string, typeof bookings>()
  bookings.forEach(b => {
    if (b.recurringSeriesId) {
      if (!seriesMap.has(b.recurringSeriesId)) {
        seriesMap.set(b.recurringSeriesId, [])
      }
      seriesMap.get(b.recurringSeriesId)!.push(b)
    }
  })

  const toggleSeries = (seriesId: string) => {
    const newExpanded = new Set(expandedSeries)
    if (newExpanded.has(seriesId)) {
      newExpanded.delete(seriesId)
    } else {
      newExpanded.add(seriesId)
    }
    setExpandedSeries(newExpanded)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recurring Booking Series</h1>
          <p className="text-gray-600 mt-1">Manage recurring and repeating bookings</p>
        </div>
        <Button>
          <Repeat2 className="h-4 w-4 mr-2" />
          Create Series
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-gray-600 text-sm">Total Series</p>
          <p className="text-3xl font-bold mt-2">{seriesMap.size}</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {Array.from(seriesMap.values()).filter(bs => bs[0]?.status === 'Active').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm">Total Occurrences</p>
          <p className="text-3xl font-bold mt-2">
            {Array.from(seriesMap.values()).reduce((acc, bs) => acc + bs.length, 0)}
          </p>
        </Card>
      </div>

      {/* Series List */}
      <div className="space-y-4">
        {Array.from(seriesMap.entries()).map(([seriesId, seriesBookings]) => {
          const firstBooking = seriesBookings[0]
          const isExpanded = expandedSeries.has(seriesId)
          
          return (
            <Card key={seriesId} className="overflow-hidden">
              <button
                onClick={() => toggleSeries(seriesId)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors border-b"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <Repeat2 className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{firstBooking?.clientName} - {firstBooking?.serviceType}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {firstBooking?.scheduleFrequency} • {seriesBookings.length} occurrences
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={STATUS_COLORS[firstBooking?.status as 'Active' | 'Paused' | 'Ended' | 'Cancelled'] || ''}>
                      {firstBooking?.status}
                    </Badge>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {/* Expanded Series Details */}
              {isExpanded && (
                <div className="p-6 bg-gray-50">
                  <div className="space-y-4">
                    {/* Series Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-600">Start Date</p>
                        <p className="font-mono font-bold text-sm mt-1">{firstBooking?.startDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">End Date</p>
                        <p className="font-mono font-bold text-sm mt-1">{firstBooking?.endDate || 'Ongoing'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Completed</p>
                        <p className="font-bold text-sm mt-1">{seriesBookings.filter(b => b.status === 'Completed').length}/{seriesBookings.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Caregiver</p>
                        <p className="font-medium text-sm mt-1">{firstBooking?.caregiverName}</p>
                      </div>
                    </div>

                    {/* Series Bookings Table */}
                    <div className="bg-white rounded border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {seriesBookings.map((b) => (
                            <TableRow key={b.id}>
                              <TableCell className="text-sm">{b.startDate}</TableCell>
                              <TableCell className="text-sm">{b.startTime} - {b.endTime}</TableCell>
                              <TableCell className="text-sm font-medium">{b.clientName}</TableCell>
                              <TableCell>
                                <Badge variant={b.status === 'Completed' ? 'default' : b.status === 'Active' ? 'secondary' : 'outline'}>
                                  {b.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-mono">${b.finalRate}</TableCell>
                              <TableCell className="text-right">
                                <Link href={`/bookings/${b.id}`}>
                                  <Button variant="ghost" size="sm">View</Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Series Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      {firstBooking?.status === 'Active' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Series
                          </Button>
                          <Button variant="outline" size="sm">Edit Series</Button>
                        </>
                      )}
                      {firstBooking?.status === 'Paused' && (
                        <Button variant="outline" size="sm">Resume Series</Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-600">End Series</Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
