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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useClients } from '@/lib/hooks/use-data'
import { 
  Search, 
  ArrowLeft,
  Eye,
  Flag,
  AlertTriangle,
  Shield
} from 'lucide-react'

const FLAG_TYPE_COLORS: Record<string, string> = {
  'Payment Default': 'bg-amber-100 text-amber-800',
  'Abusive Behavior': 'bg-red-100 text-red-800',
  'Fraudulent Activity': 'bg-red-100 text-red-800',
  'High Dispute Rate': 'bg-orange-100 text-orange-800',
  'Identity Concern': 'bg-purple-100 text-purple-800',
  'Other': 'bg-gray-100 text-gray-800',
}

const RISK_COLORS: Record<string, string> = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-amber-100 text-amber-800',
  'High': 'bg-red-100 text-red-800',
}

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800',
  'Suspended': 'bg-amber-100 text-amber-800',
  'Blocked': 'bg-red-100 text-red-800',
}

export default function FlaggedClientsPage() {
  const { clients, getFlaggedClients, stats } = useClients()
  const flaggedClients = getFlaggedClients()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [flagTypeFilter, setFlagTypeFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')

  // Get unique flag types
  const uniqueFlagTypes = useMemo(() => {
    const types = new Set<string>()
    flaggedClients.forEach(c => c.flags.forEach(f => types.add(f.type)))
    return Array.from(types)
  }, [flaggedClients])

  const filtered = useMemo(() => {
    return flaggedClients.filter((client) => {
      const matchesSearch = 
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFlagType = flagTypeFilter === 'all' || 
        client.flags.some(f => f.type === flagTypeFilter)
      
      const matchesRisk = riskFilter === 'all' || client.riskScore === riskFilter

      return matchesSearch && matchesFlagType && matchesRisk
    })
  }, [flaggedClients, searchTerm, flagTypeFilter, riskFilter])

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Flag className="h-8 w-8 text-red-500 fill-red-500" />
              Flagged Clients
            </h1>
            <p className="text-gray-600">Review and manage clients with active flags</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">
              {stats.flagged} Flagged
            </Badge>
          </div>
        </div>

        {/* Alert Banner */}
        {stats.flagged > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-900">
              There are <span className="font-bold">{stats.flagged}</span> clients requiring immediate attention.
              Review flags and take appropriate action.
            </p>
          </div>
        )}

        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or client ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <select
                value={flagTypeFilter}
                onChange={(e) => setFlagTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Flag Types</option>
                {uniqueFlagTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
              <div></div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setFlagTypeFilter('all')
                  setRiskFilter('all')
                }}
              >
                Clear Filters
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filtered.length} of {flaggedClients.length} flagged clients
            </div>
          </div>
        </Card>

        {/* Table */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Flagged Clients</h3>
            <p className="text-gray-600">All clients are in good standing.</p>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Flag Type</TableHead>
                  <TableHead>Flag Reason</TableHead>
                  <TableHead>Flagged Date</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => {
                  const activeFlag = client.flags.find(f => f.status === 'Active') || client.flags[0]
                  return (
                    <TableRow key={client.id} className="bg-red-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              {client.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <Flag className="h-4 w-4 text-red-500 fill-red-500 absolute -top-1 -right-1" />
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
                        <Badge className={FLAG_TYPE_COLORS[activeFlag?.type || 'Other']}>
                          {activeFlag?.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <p className="text-sm text-gray-600 truncate max-w-[200px]">
                              {activeFlag?.reason}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{activeFlag?.reason}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {activeFlag ? new Date(activeFlag.flaggedAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={RISK_COLORS[client.riskScore]}>
                          {client.riskScore} Risk
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[client.status]}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/clients/${client.id}?tab=flags`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
