'use client'

import { useState, useMemo } from 'react'
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
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react'

const SEVERITY_COLORS = {
  'Low': 'bg-blue-50 text-blue-800',
  'Medium': 'bg-yellow-50 text-yellow-800',
  'High': 'bg-orange-50 text-orange-800',
  'Critical': 'bg-red-50 text-red-800',
}

const STATUS_COLORS = {
  'Open': 'bg-red-50 text-red-800',
  'Under Review': 'bg-yellow-50 text-yellow-800',
  'Resolved': 'bg-green-50 text-green-800',
  'Dismissed': 'bg-gray-50 text-gray-800',
}

function getDaysOld(date: string) {
  const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  return days
}

export default function DisputesPage() {
  const { bookings } = useBookings()
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'under-review' | 'resolved'>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')

  const disputes = useMemo(() => {
    return bookings
      .filter(b => b.dispute)
      .map(b => ({
        ...b.dispute!,
        bookingId: b.id,
        clientName: b.clientName,
        caregiverName: b.caregiverName,
        serviceType: b.serviceType,
      }))
  }, [bookings])

  const filtered = useMemo(() => {
    return disputes.filter(d => {
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'open' && d.status === 'Open') ||
        (statusFilter === 'under-review' && d.status === 'Under Review') ||
        (statusFilter === 'resolved' && d.status === 'Resolved')
      
      const matchesSeverity = severityFilter === 'all' ||
        (severityFilter === 'critical' && d.severity === 'Critical') ||
        (severityFilter === 'high' && d.severity === 'High') ||
        (severityFilter === 'medium' && d.severity === 'Medium') ||
        (severityFilter === 'low' && d.severity === 'Low')

      return matchesStatus && matchesSeverity
    })
  }, [disputes, statusFilter, severityFilter])

  const stats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'Open').length,
    critical: disputes.filter(d => d.severity === 'Critical').length,
    avgResolutionTime: Math.round(disputes.filter(d => d.resolvedAt).reduce((acc, d) => {
      if (!d.resolvedAt) return acc
      return acc + getDaysOld(d.reportedAt)
    }, 0) / Math.max(disputes.filter(d => d.resolvedAt).length, 1))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Disputes</h1>
        <p className="text-gray-600 mt-1">Manage and resolve booking disputes</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-gray-600 text-sm">Total Disputes</p>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Open Issues</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.open}</p>
        </Card>
        <Card className="p-4 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Critical</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.critical}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 text-sm">Avg. Resolution</p>
          <p className="text-3xl font-bold mt-2">{stats.avgResolutionTime} days</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'open', 'under-review', 'resolved'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-[#B91C4E] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'under-review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Severity</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
                <button
                  key={severity}
                  onClick={() => setSeverityFilter(severity as any)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    severityFilter === severity
                      ? 'bg-[#B91C4E] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Disputes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Client / Caregiver</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No disputes found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((dispute) => (
                <TableRow key={dispute.id} className={getDaysOld(dispute.reportedAt) > 7 ? 'bg-orange-50' : ''}>
                  <TableCell className="font-mono text-sm">{dispute.bookingId.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{dispute.clientName}</p>
                      <p className="text-gray-600 text-xs">{dispute.caregiverName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{dispute.reason}</TableCell>
                  <TableCell>
                    <Badge className={SEVERITY_COLORS[dispute.severity]}>
                      {dispute.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[dispute.status]}>
                      {dispute.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {getDaysOld(dispute.reportedAt)} days ago
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/bookings/${dispute.bookingId}`}>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
