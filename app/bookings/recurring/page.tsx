'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
} from "@/components/ui/dialog"
import { useBookings, useClients } from '@/lib/hooks/use-data'
import { Repeat2, ChevronDown, Pause, Play, Archive, Search, ArrowRight, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS = {
  'Active': 'bg-green-50 text-green-800 border-green-200',
  'Paused': 'bg-rose-50 text-[#B91C4E] border-rose-100',
  'Ended': 'bg-gray-50 text-gray-800 border-gray-200',
  'Cancelled': 'bg-red-50 text-red-800 border-red-200',
}

export default function RecurringSeriesPage() {
  const router = useRouter()
  const { bookings, updateSeries } = useBookings()
  const { clients } = useClients()
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set())
  const [isNewSeriesOpen, setIsNewSeriesOpen] = useState(false)
  const [clientSearch, setClientSearch] = useState('')

  // Group bookings by recurring series
  const seriesMap = useMemo(() => {
    const map = new Map<string, typeof bookings>()
    bookings.forEach(b => {
      if (b.recurringSeriesId) {
        if (!map.has(b.recurringSeriesId)) {
          map.set(b.recurringSeriesId, [])
        }
        map.get(b.recurringSeriesId)!.push(b)
      }
    })
    return map
  }, [bookings])

  const toggleSeries = (seriesId: string) => {
    const newExpanded = new Set(expandedSeries)
    if (newExpanded.has(seriesId)) {
      newExpanded.delete(seriesId)
    } else {
      newExpanded.add(seriesId)
    }
    setExpandedSeries(newExpanded)
  }

  const handleUpdateStatus = (seriesId: string, status: string) => {
    updateSeries(seriesId, { status: status as any })
    toast.success(`Series ${seriesId} is now ${status}`)
  }

  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients.slice(0, 5)
    return clients.filter(c => 
      c.fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(clientSearch.toLowerCase())
    ).slice(0, 5)
  }, [clients, clientSearch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recurring Booking Series</h1>
          <p className="text-gray-600 mt-1">Manage recurring and repeating bookings</p>
        </div>
        <Button className="bg-[#B91C4E] hover:bg-[#A01844] text-white" onClick={() => setIsNewSeriesOpen(true)}>
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
        <Card className="p-4 border-l-4 border-[#B91C4E]">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl font-bold text-[#B91C4E] mt-2">
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
            <Card key={seriesId} className="overflow-hidden border hover:border-[#B91C4E]/30 transition-all">
              <button
                onClick={() => toggleSeries(seriesId)}
                className={`w-full p-6 flex items-center justify-between transition-colors border-b ${isExpanded ? 'bg-rose-50/30' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isExpanded ? 'bg-[#B91C4E] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Repeat2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{firstBooking?.clientName} - {firstBooking?.serviceType}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {firstBooking?.scheduleFrequency} • {seriesBookings.length} occurrences
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={STATUS_COLORS[firstBooking?.status as 'Active' | 'Paused' | 'Ended' | 'Cancelled'] || ''}>
                      {firstBooking?.status}
                    </Badge>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {/* Expanded Series Details */}
              {isExpanded && (
                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    {/* Series Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Start Date</p>
                        <p className="font-mono font-bold text-sm mt-1">{firstBooking?.startDate}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">End Date</p>
                        <p className="font-mono font-bold text-sm mt-1">{firstBooking?.endDate || 'Ongoing'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Completed</p>
                        <p className="font-bold text-sm mt-1 text-[#B91C4E]">{seriesBookings.filter(b => b.status === 'Completed').length}/{seriesBookings.length}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Caregiver</p>
                        <p className="font-medium text-sm mt-1">{firstBooking?.caregiverName || 'Not Assigned'}</p>
                      </div>
                    </div>

                    {/* Series Bookings Table */}
                    <div className="bg-white rounded border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
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
                            <TableRow key={b.id} className="hover:bg-rose-50/20 transition-colors">
                              <TableCell className="text-sm">{b.startDate}</TableCell>
                              <TableCell className="text-sm">{b.startTime} - {b.endTime}</TableCell>
                              <TableCell className="text-sm font-medium">{b.clientName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={STATUS_COLORS[b.status as keyof typeof STATUS_COLORS] || ''}>
                                  {b.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-mono text-[#B91C4E] font-bold">${b.finalRate}</TableCell>
                              <TableCell className="text-right">
                                <Link href={`/bookings/${b.id}`}>
                                  <Button variant="outline" size="sm">View</Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Series Actions */}
                    <div className="flex gap-2 pt-4 border-t items-center justify-between">
                      <div className="flex gap-2">
                        {firstBooking?.status === 'Active' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[#B91C4E] border-[#B91C4E] hover:bg-rose-50"
                              onClick={() => handleUpdateStatus(seriesId, 'Paused')}
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Series
                            </Button>
                            <Button variant="outline" size="sm">Edit Schedule</Button>
                          </>
                        )}
                        {firstBooking?.status === 'Paused' && (
                          <Button 
                            className="bg-[#B91C4E] hover:bg-[#A01844] text-white" 
                            size="sm"
                            onClick={() => handleUpdateStatus(seriesId, 'Active')}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume Series
                          </Button>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleUpdateStatus(seriesId, 'Ended')}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        End Series
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* New Series Dialog */}
      <Dialog open={isNewSeriesOpen} onOpenChange={setIsNewSeriesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Recurring Series</DialogTitle>
            <DialogDescription>
              Select a client to start a recurring booking series.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredClients.map((client) => (
                <div 
                  key={client.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                  onClick={() => {
                    toast.success(`Starting series creation for ${client.fullName}`)
                    setIsNewSeriesOpen(false)
                    router.push(`/bookings/recurring/create?clientId=${client.id}`)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-[#B91C4E] font-bold text-xs">
                      {client.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 group-hover:text-[#B91C4E] transition-colors">{client.fullName}</p>
                      <p className="text-xs text-gray-500">{client.id}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#B91C4E] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
              {filteredClients.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No clients found.
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setIsNewSeriesOpen(false)}>Cancel</Button>
            <Link href="/clients">
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                New Client
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
