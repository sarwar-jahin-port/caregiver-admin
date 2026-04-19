'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBookings, useCaregivers } from '@/lib/hooks/use-data'
import { Search, Plus, Calendar } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  'Scheduled': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-green-100 text-green-800',
  'Completed': 'bg-gray-100 text-gray-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Disrupted': 'bg-orange-100 text-orange-800',
}

export default function BookingsPage() {
  const { bookings } = useBookings()
  const { caregivers } = useCaregivers()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<'all' | 'CNA' | 'HHA'>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'independent' | 'org'>('all')
  const [surgeFilter, setSurgeFilter] = useState<'all' | 'surge'>('all')

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const matchesService = serviceFilter === 'all' || booking.serviceType === serviceFilter
      
      const matchesSource = sourceFilter === 'all' ||
        (sourceFilter === 'independent' && booking.source === 'Independent') ||
        (sourceFilter === 'org' && booking.source !== 'Independent')
      
      const matchesSurge = surgeFilter === 'all' ||
        (surgeFilter === 'surge' && booking.surgePricing)

      return matchesSearch && matchesStatus && matchesService && matchesSource && matchesSurge
    })
  }, [bookings, searchTerm, statusFilter, serviceFilter, sourceFilter, surgeFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">View and manage all service bookings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by client, caregiver, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Disrupted">Disrupted</option>
            </select>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              <option value="all">All Services</option>
              <option value="CNA">CNA</option>
              <option value="HHA">HHA</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              <option value="all">All Sources</option>
              <option value="independent">Independent</option>
              <option value="org">Organization</option>
            </select>
            <select
              value={surgeFilter}
              onChange={(e) => setSurgeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              <option value="all">All Bookings</option>
              <option value="surge">Surge Only</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Care Plan</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Final Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((booking) => {
                const caregiver = caregivers.find((c) => c.id === booking.caregiverId)
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">{booking.id.slice(0, 8)}</TableCell>
                    <TableCell className="font-medium">{booking.clientName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={booking.serviceType === 'CNA' ? 'default' : 'secondary'}>
                          {booking.serviceType}
                        </Badge>
                        {booking.surgePricing && (
                          <Badge className="bg-amber-100 text-amber-800 border-0">🚀 Surge</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline" className={booking.source === 'Independent' ? 'bg-gray-50' : 'bg-purple-50 text-purple-700 border-purple-200'}>
                        {booking.source === 'Independent' ? 'Independent' : 'Org'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {booking.carePlanId ? (
                        <Link href={`/care-plans/${booking.carePlanId}`}>
                          <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                            {booking.carePlanId}
                          </Badge>
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{booking.totalHours}h</TableCell>
                    <TableCell className="font-medium">${booking.finalRate}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/bookings/${booking.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
