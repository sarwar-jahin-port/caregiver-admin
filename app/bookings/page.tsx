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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useBookings, useCaregivers, useClients } from '@/lib/hooks/use-data'
import { Search, Plus, Calendar, ArrowRight, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const STATUS_COLORS: Record<string, string> = {
  'Scheduled': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-green-100 text-green-800',
  'Completed': 'bg-gray-100 text-gray-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Disrupted': 'bg-orange-100 text-orange-800',
}

export default function BookingsPage() {
  const router = useRouter()
  const { bookings } = useBookings()
  const { caregivers } = useCaregivers()
  const { clients } = useClients()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<'all' | 'CNA' | 'HHA'>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'independent' | 'org'>('all')
  const [surgeFilter, setSurgeFilter] = useState<'all' | 'surge'>('all')
  
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false)
  const [clientSearch, setClientSearch] = useState('')

  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients.slice(0, 5)
    return clients.filter(c => 
      c.fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(clientSearch.toLowerCase())
    ).slice(0, 5)
  }, [clients, clientSearch])

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
        
        <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#B91C4E] hover:bg-[#A01844] text-white font-bold shadow-lg shadow-rose-100">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>
                Select a client to start the booking process.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clients..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="pl-10 h-11 border-gray-100"
                />
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {filteredClients.map((client) => (
                  <div 
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-rose-50/50 cursor-pointer transition-all group border-gray-100"
                    onClick={() => {
                      setIsNewBookingOpen(false)
                      router.push(`/bookings/recurring/create?clientId=${client.id}`)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#B91C4E] font-bold">
                        {client.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-[#B91C4E] transition-colors">{client.fullName}</p>
                        <p className="text-xs text-gray-500 font-mono italic">{client.id}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#B91C4E] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed text-gray-400 text-sm">
                    No clients found.
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="sm:justify-between pt-4 border-t">
              <Button variant="ghost" onClick={() => setIsNewBookingOpen(false)} className="text-gray-500">Cancel</Button>
              <Link href="/clients">
                <Button variant="outline" className="border-[#B91C4E] text-[#B91C4E] hover:bg-rose-50 font-bold">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New Client
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
