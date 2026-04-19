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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useClients } from '@/lib/hooks/use-data'
import { 
  Search, 
  Plus, 
  Download, 
  Flag, 
  Users, 
  UserPlus, 
  AlertTriangle, 
  DollarSign,
  MoreHorizontal,
  Eye,
  Pencil,
  Ban,
  Clock
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800',
  'Suspended': 'bg-amber-100 text-amber-800',
  'Blocked': 'bg-red-100 text-red-800',
}

export default function ClientsPage() {
  const { clients, stats } = useClients()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Suspended' | 'Blocked'>('all')
  const [hasActiveBookingFilter, setHasActiveBookingFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [hasCarePlanFilter, setHasCarePlanFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [hasDisputeFilter, setHasDisputeFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [flaggedFilter, setFlaggedFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'totalSpent' | 'lastActive' | 'bookings'>('name')
  const [addClientOpen, setAddClientOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = clients.filter((client) => {
      const matchesSearch = 
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || client.status === statusFilter
      
      const matchesActiveBooking = hasActiveBookingFilter === 'all' ||
        (hasActiveBookingFilter === 'yes' ? client.activeBookingCount > 0 : client.activeBookingCount === 0)
      
      const matchesCarePlan = hasCarePlanFilter === 'all' ||
        (hasCarePlanFilter === 'yes' ? client.carePlanIds.length > 0 : client.carePlanIds.length === 0)
      
      const matchesDispute = hasDisputeFilter === 'all' ||
        (hasDisputeFilter === 'yes' ? client.disputedBookings > 0 : client.disputedBookings === 0)
      
      const matchesFlagged = flaggedFilter === 'all' ||
        (flaggedFilter === 'yes' ? client.flagged : !client.flagged)

      return matchesSearch && matchesStatus && matchesActiveBooking && matchesCarePlan && matchesDispute && matchesFlagged
    })

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName)
        case 'joinDate':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        case 'totalSpent':
          return b.totalSpent - a.totalSpent
        case 'lastActive':
          return new Date(b.lastActiveDate).getTime() - new Date(a.lastActiveDate).getTime()
        case 'bookings':
          return b.totalBookings - a.totalBookings
        default:
          return 0
      }
    })

    return result
  }, [clients, searchTerm, statusFilter, hasActiveBookingFilter, hasCarePlanFilter, hasDisputeFilter, flaggedFilter, sortBy])

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600">Manage all clients and their care recipients</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#B91C4E] hover:bg-[#9E1842]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Create a new client account. You can add care recipients after creation.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter primary address" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <select id="accountType" className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="Self">Self (care recipient is themselves)</option>
                      <option value="Family Manager">Family Manager (managing care for others)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="sendWelcome" defaultChecked className="rounded" />
                    <Label htmlFor="sendWelcome" className="font-normal">Send welcome notification</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddClientOpen(false)}>Cancel</Button>
                  <Button className="bg-[#B91C4E] hover:bg-[#9E1842]" onClick={() => setAddClientOpen(false)}>Create Client</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600">Total Clients</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-xs text-gray-600">Active (30 days)</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserPlus className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
                <p className="text-xs text-gray-600">New This Month</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.withDisputes}</p>
                <p className="text-xs text-gray-600">With Disputes</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Flag className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.flagged}</p>
                <p className="text-xs text-gray-600">Flagged</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Revenue</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, phone, or client ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Blocked">Blocked</option>
              </select>
              <select
                value={hasActiveBookingFilter}
                onChange={(e) => setHasActiveBookingFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Active Booking</option>
                <option value="yes">Has Active Booking</option>
                <option value="no">No Active Booking</option>
              </select>
              <select
                value={hasCarePlanFilter}
                onChange={(e) => setHasCarePlanFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Care Plan</option>
                <option value="yes">Has Care Plan</option>
                <option value="no">No Care Plan</option>
              </select>
              <select
                value={hasDisputeFilter}
                onChange={(e) => setHasDisputeFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Disputes</option>
                <option value="yes">Has Disputes</option>
                <option value="no">No Disputes</option>
              </select>
              <select
                value={flaggedFilter}
                onChange={(e) => setFlaggedFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Flags</option>
                <option value="yes">Flagged Only</option>
                <option value="no">Not Flagged</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="name">Sort: Name</option>
                <option value="joinDate">Sort: Join Date</option>
                <option value="totalSpent">Sort: Total Spent</option>
                <option value="lastActive">Sort: Last Active</option>
                <option value="bookings">Sort: Bookings</option>
              </select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setHasActiveBookingFilter('all')
                  setHasCarePlanFilter('all')
                  setHasDisputeFilter('all')
                  setFlaggedFilter('all')
                  setSortBy('name')
                }}
              >
                Clear Filters
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filtered.length} of {clients.length} clients
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Care Recipients</TableHead>
                <TableHead>Active Bookings</TableHead>
                <TableHead>Care Plan</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flag</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {client.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.fullName}</p>
                          <p className="text-xs text-gray-500">{client.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{client.email}</p>
                        <p className="text-gray-500">{client.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                        {client.careRecipients.length} recipient{client.careRecipients.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={client.activeBookingCount > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                        {client.activeBookingCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      {client.carePlanIds.length > 0 ? (
                        <Badge className="bg-blue-100 text-blue-800 border-0">Yes</Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">${client.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[client.status]}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {client.flagged ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Flag className="h-4 w-4 text-red-500 fill-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{client.flags[0]?.reason || 'Flagged'}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {getRelativeTime(client.lastActiveDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/clients/${client.id}`} className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {client.status === 'Active' && (
                              <DropdownMenuItem className="text-amber-600">
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            {client.status !== 'Blocked' && (
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="h-4 w-4 mr-2" />
                                Block
                              </DropdownMenuItem>
                            )}
                            {!client.flagged && (
                              <DropdownMenuItem className="text-red-600">
                                <Flag className="h-4 w-4 mr-2" />
                                Flag Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  )
}
