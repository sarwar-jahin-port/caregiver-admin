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
import { useOrganizations } from '@/lib/hooks/use-data'
import { Search, Plus, Building2 } from 'lucide-react'

export default function OrganizationsPage() {
  const { organizations } = useOrganizations()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all')

  const filtered = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? org.status === 'Active' : org.status === 'Suspended')

      return matchesSearch && matchesStatus
    })
  }, [organizations, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage healthcare organizations and partners</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filtered.length} of {organizations.length} organizations
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Caregivers</TableHead>
              <TableHead>Issued Certs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                      <p className="font-medium">{org.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{org.contactInfo.address}</TableCell>
                  <TableCell className="text-sm">{org.contactInfo.email}</TableCell>
                  <TableCell className="font-medium">{org.totalCaregivers}</TableCell>
                  <TableCell className="font-medium">{org.certificationsIssued}</TableCell>
                  <TableCell>
                    <Badge variant={org.status === 'Active' ? 'default' : 'secondary'}>
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/organizations/${org.id}`}>
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
    </div>
  )
}
