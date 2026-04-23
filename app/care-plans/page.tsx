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
} from "@/components/ui/dialog"
import { useCarePlans, useClients } from '@/lib/hooks/use-data'
import { Search, Plus, UserPlus, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CarePlansPage() {
  const router = useRouter()
  const { carePlans } = useCarePlans()
  const { clients } = useClients()
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false)
  const [clientSearch, setClientSearch] = useState('')

  const filtered = useMemo(() => {
    return carePlans.filter((plan) => {
      return plan.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.clientId.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [carePlans, searchTerm])

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
          <h1 className="text-3xl font-bold text-gray-900">Care Plans</h1>
          <p className="text-gray-600">Manage client care plans and services</p>
        </div>
        <Button className="bg-[#B91C4E] hover:bg-[#A01844]" onClick={() => setIsNewPlanOpen(true)}>
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

      {/* New Care Plan Dialog */}
      <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Care Plan</DialogTitle>
            <DialogDescription>
              Select a client to create a new care plan for.
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
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    toast.success(`Creating plan for ${client.fullName}`)
                    setIsNewPlanOpen(false)
                    router.push(`/care-plans/create?clientId=${client.id}`)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-[#B91C4E] font-bold text-xs">
                      {client.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{client.fullName}</p>
                      <p className="text-xs text-gray-500">{client.id}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
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
            <Button variant="ghost" onClick={() => setIsNewPlanOpen(false)}>Cancel</Button>
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
