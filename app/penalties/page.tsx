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
import { useCaregivers } from '@/lib/hooks/use-data'
import { Search, Plus, AlertTriangle } from 'lucide-react'

export default function PenaltiesPage() {
  const { caregivers } = useCaregivers()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'at-risk' | 'terminated' | 'cleared'>('all')

  // Calculate caregiver penalty info
  const penaltyData = caregivers
    .filter(c => c.strikeCount > 0 || c.strikeHistory.length > 0)
    .map(c => ({
      caregiver: c,
      totalStrikes: c.strikeCount,
      totalPenalties: c.strikeHistory.reduce((sum, sh) => sum + (sh.penaltyAmount || 0), 0),
      lastStrikeDate: c.strikeHistory.length > 0 ? new Date(c.strikeHistory[c.strikeHistory.length - 1].appliedAt) : null,
      status: c.strikeCount === 0 ? 'Cleared' : c.strikeCount === 3 ? 'Terminated' : c.strikeCount >= 2 ? 'At Risk' : 'Caution',
    }))

  const filtered = useMemo(() => {
    return penaltyData.filter(pd => {
      const matchesSearch = pd.caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pd.caregiver.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'at-risk' && pd.totalStrikes >= 2 && pd.totalStrikes < 3) ||
        (statusFilter === 'terminated' && pd.totalStrikes === 3) ||
        (statusFilter === 'cleared' && pd.totalStrikes === 0)

      return matchesSearch && matchesStatus
    })
  }, [penaltyData, searchTerm, statusFilter])

  const atRiskCount = penaltyData.filter(pd => pd.totalStrikes >= 2 && pd.totalStrikes < 3).length
  const terminatedCount = penaltyData.filter(pd => pd.totalStrikes === 3).length
  const totalPenaltiesWithdrawn = penaltyData.reduce((sum, pd) => sum + pd.totalPenalties, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Penalties & Strikes</h1>
          <p className="text-gray-600">Manage caregiver strikes and penalties</p>
        </div>
      </div>

      {/* Alert Banner */}
      {atRiskCount > 0 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900">At-Risk Caregivers</h3>
              <p className="text-sm text-red-700 mt-1">
                {atRiskCount} caregiver{atRiskCount !== 1 ? 's' : ''} with 2+ strikes requiring immediate review
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Total Caregiver Penalties</p>
          <p className="text-4xl font-bold mt-2">{penaltyData.length}</p>
          <p className="text-xs text-gray-500 mt-2">Caregivers with strikes</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">At Risk (2 Strikes)</p>
          <p className="text-4xl font-bold mt-2 text-orange-600">{atRiskCount}</p>
          <p className="text-xs text-gray-500 mt-2">One strike from termination</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Terminated (3 Strikes)</p>
          <p className="text-4xl font-bold mt-2 text-red-600">{terminatedCount}</p>
          <p className="text-xs text-gray-500 mt-2">Removed from platform</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
          <p className="text-4xl font-bold mt-2">${totalPenaltiesWithdrawn.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-2">In penalties</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by caregiver name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All ({penaltyData.length})
            </Button>
            <Button
              variant={statusFilter === 'at-risk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('at-risk')}
              className={statusFilter === 'at-risk' ? 'bg-orange-600' : ''}
            >
              At Risk ({atRiskCount})
            </Button>
            <Button
              variant={statusFilter === 'terminated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('terminated')}
              className={statusFilter === 'terminated' ? 'bg-red-600' : ''}
            >
              Terminated ({terminatedCount})
            </Button>
            <Button
              variant={statusFilter === 'cleared' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('cleared')}
            >
              Cleared
            </Button>
          </div>
        </div>
      </Card>

      {/* Penalties Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caregiver Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Total Strikes</TableHead>
              <TableHead>Last Strike Date</TableHead>
              <TableHead>Penalties Withheld</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No penalties found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((pd) => (
                <TableRow key={pd.caregiver.id}>
                  <TableCell className="font-medium">{pd.caregiver.name}</TableCell>
                  <TableCell>
                    {pd.caregiver.organizationName ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {pd.caregiver.organizationName}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Independent</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < pd.totalStrikes ? 'bg-red-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{pd.totalStrikes}/3</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {pd.lastStrikeDate ? pd.lastStrikeDate.toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell className="font-medium">${pd.totalPenalties.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pd.status === 'Terminated' ? 'destructive' :
                        pd.status === 'At Risk' ? 'secondary' :
                        pd.status === 'Cleared' ? 'default' :
                        'outline'
                      }
                      className={
                        pd.status === 'At Risk' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        pd.status === 'Cleared' ? 'bg-green-100 text-green-800 border-green-200' :
                        ''
                      }
                    >
                      {pd.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/caregivers/${pd.caregiver.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Audit Log Section */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Admin Overrides & Audit Trail</h2>
          <p className="text-sm text-gray-600 mt-1">Recent administrative actions on strikes and penalties</p>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <p>No overrides recorded yet</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
