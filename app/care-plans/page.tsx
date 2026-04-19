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
import { useCarePlans } from '@/lib/hooks/use-data'
import { Search, Plus } from 'lucide-react'

export default function CarePlansPage() {
  const { carePlans } = useCarePlans()
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    return carePlans.filter((plan) => {
      return plan.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.clientId.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [carePlans, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Care Plans</h1>
          <p className="text-gray-600">Manage client care plans and services</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Care Plan
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filtered.length} of {carePlans.length} care plans
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Active Services</TableHead>
              <TableHead>Total Monthly Cost</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No care plans found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.clientName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{plan.activeServices.length} services</Badge>
                  </TableCell>
                  <TableCell className="font-medium">${plan.totalActiveCost.toFixed(2)}</TableCell>
                  <TableCell className="text-sm">{new Date(plan.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/care-plans/${plan.id}`}>
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
