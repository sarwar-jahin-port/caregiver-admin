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
import { useClients } from '@/lib/hooks/use-data'
import { 
  Search, 
  ArrowLeft,
  Eye,
  Activity,
  Calendar
} from 'lucide-react'

const CONDITION_COLORS: Record<string, string> = {
  'Dementia': 'bg-purple-100 text-purple-800',
  'Post-surgery recovery': 'bg-blue-100 text-blue-800',
  'Diabetes': 'bg-amber-100 text-amber-800',
  "Parkinson's disease": 'bg-pink-100 text-pink-800',
  'Heart disease': 'bg-red-100 text-red-800',
  'Stroke recovery': 'bg-orange-100 text-orange-800',
}

const MOBILITY_BADGES: Record<string, string> = {
  'Fully mobile': 'bg-green-100 text-green-800',
  'Assisted mobility': 'bg-yellow-100 text-yellow-800',
  'Wheelchair': 'bg-orange-100 text-orange-800',
  'Bedridden': 'bg-red-100 text-red-800',
}

export default function CareRecipientsPage() {
  const { clients, getAllCareRecipients } = useClients()
  const allCareRecipients = getAllCareRecipients()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [conditionFilter, setConditionFilter] = useState<string>('all')
  const [activeServicesFilter, setActiveServicesFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [ageFilter, setAgeFilter] = useState<string>('all')

  // Get unique conditions for filter dropdown
  const uniqueConditions = useMemo(() => {
    const conditions = new Set(allCareRecipients.map(cr => cr.primaryCondition))
    return Array.from(conditions)
  }, [allCareRecipients])

  // Get client name for each care recipient
  const getClientForRecipient = (clientId: string) => {
    return clients.find(c => c.id === clientId)
  }

  const filtered = useMemo(() => {
    return allCareRecipients.filter((cr) => {
      const client = getClientForRecipient(cr.clientId)
      
      const matchesSearch = 
        cr.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cr.primaryCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || false)

      const matchesCondition = conditionFilter === 'all' || cr.primaryCondition === conditionFilter
      
      const matchesActiveServices = activeServicesFilter === 'all' ||
        (activeServicesFilter === 'yes' ? cr.hasActiveServices : !cr.hasActiveServices)
      
      const matchesAge = ageFilter === 'all' ||
        (ageFilter === 'under65' ? cr.age < 65 :
         ageFilter === '65-80' ? cr.age >= 65 && cr.age <= 80 :
         cr.age > 80)

      return matchesSearch && matchesCondition && matchesActiveServices && matchesAge
    })
  }, [allCareRecipients, searchTerm, conditionFilter, activeServicesFilter, ageFilter, clients])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Care Recipients</h1>
        <p className="text-gray-600">Search and manage care recipients across all client accounts</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, condition, or account holder..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Conditions</option>
              {uniqueConditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
            <select
              value={activeServicesFilter}
              onChange={(e) => setActiveServicesFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Services</option>
              <option value="yes">Has Active Services</option>
              <option value="no">No Active Services</option>
            </select>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Ages</option>
              <option value="under65">Under 65</option>
              <option value="65-80">65-80</option>
              <option value="over80">Over 80</option>
            </select>
            <div></div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setConditionFilter('all')
                setActiveServicesFilter('all')
                setAgeFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filtered.length} of {allCareRecipients.length} care recipients
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Care Recipient</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Primary Condition</TableHead>
              <TableHead>Mobility</TableHead>
              <TableHead>Account Holder</TableHead>
              <TableHead>Active Services</TableHead>
              <TableHead>Last Service</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No care recipients found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cr) => {
                const client = getClientForRecipient(cr.clientId)
                return (
                  <TableRow key={cr.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                          {cr.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{cr.fullName}</p>
                          <p className="text-xs text-teal-600">Care Recipient</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{cr.age}</span>
                      <span className="text-gray-500 text-sm"> yrs</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={CONDITION_COLORS[cr.primaryCondition] || 'bg-gray-100 text-gray-800'}>
                        {cr.primaryCondition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={MOBILITY_BADGES[cr.mobilityLevel]}>
                        {cr.mobilityLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="text-[#B91C4E] hover:underline">
                          {client.fullName}
                        </Link>
                      ) : (
                        <span className="text-gray-400">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {cr.hasActiveServices ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Activity className="h-4 w-4" />
                          <span className="text-sm font-medium">Yes</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {cr.lastServiceDate ? (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{new Date(cr.lastServiceDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/clients/${cr.clientId}?tab=recipients`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
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
