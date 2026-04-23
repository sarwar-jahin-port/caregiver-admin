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
import { Search, Plus, LayoutGrid, LayoutList, ChevronDown, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

import { Checkbox } from "@/components/ui/checkbox"

export default function CaregiversPage() {
  const { caregivers } = useCaregivers()
  const [searchTerm, setSearchTerm] = useState('')
  const [serviceFilter, setServiceFilter] = useState<'all' | 'CNA' | 'HHA'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [organizationFilter, setOrganizationFilter] = useState<'all' | 'affiliated' | 'independent'>('all')
  const [strikeFilter, setStrikeFilter] = useState<'all' | 'nostrikes' | 'atrisk'>('all')
  const [backgroundFilter, setBackgroundFilter] = useState<'all' | 'passed' | 'pending' | 'failed'>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedCaregivers, setSelectedCaregivers] = useState<Set<string>>(new Set())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = useMemo(() => {
    return caregivers.filter((cg) => {
      const matchesSearch = cg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cg.phone.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesService = serviceFilter === 'all' || cg.serviceTypes.includes(serviceFilter as any)
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? cg.status === 'Active' : cg.status !== 'Active')
      
      const matchesOrganization = organizationFilter === 'all' ||
        (organizationFilter === 'affiliated' ? cg.organizationId : !cg.organizationId)
      
      const matchesStrikes = strikeFilter === 'all' ||
        (strikeFilter === 'nostrikes' ? cg.strikeCount === 0 : cg.strikeCount >= 2)
      
      const matchesBackground = backgroundFilter === 'all' ||
        cg.backgroundCheckStatus === (backgroundFilter === 'passed' ? 'Passed' : backgroundFilter === 'pending' ? 'Pending' : 'Failed')
      
      const matchesAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' ? cg.availability.some(a => a.available) : !cg.availability.some(a => a.available))

      return matchesSearch && matchesService && matchesStatus && matchesOrganization && matchesStrikes && matchesBackground && matchesAvailability
    })
  }, [caregivers, searchTerm, serviceFilter, statusFilter, organizationFilter, strikeFilter, backgroundFilter, availabilityFilter])

  const getStrikeIndicator = (strikes: number) => {
    const dots = []
    for (let i = 0; i < 3; i++) {
      dots.push(
        <span key={i} className={`inline-block w-2 h-2 rounded-full mx-0.5 ${
          i < strikes ? 'bg-red-600' : 'bg-gray-300'
        }`} />
      )
    }
    return dots
  }
  const handleAddCaregiver = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsAddDialogOpen(false)
      toast.success("Caregiver has been added successfully", {
        description: "They will receive an invitation email to complete their profile.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Caregivers</h1>
          <p className="text-gray-500">Manage all caregivers and their profiles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#B91C4E] hover:bg-[#a01844] text-white shadow-lg shadow-rose-100 transition-all active:scale-95">
              <Plus className="h-4 w-4 mr-2" />
              Add Caregiver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Caregiver</DialogTitle>
              <DialogDescription>
                Enter the details for the new caregiver. They will be notified via email.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCaregiver} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="e.g. Sarah" required className="border-gray-200 focus:ring-[#B91C4E]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="e.g. Johnson" required className="border-gray-200 focus:ring-[#B91C4E]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="sarah.j@example.com" required className="border-gray-200 focus:ring-[#B91C4E]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="(555) 000-0000" className="border-gray-200 focus:ring-[#B91C4E]" />
                </div>
                <div className="space-y-4">
                  <Label>Service Types</Label>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cna" defaultChecked />
                      <Label htmlFor="cna" className="text-sm font-normal cursor-pointer">CNA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hha" />
                      <Label htmlFor="hha" className="text-sm font-normal cursor-pointer">HHA</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages</Label>
                  <Select defaultValue="english">
                    <SelectTrigger id="languages" className="border-gray-200 focus:ring-[#B91C4E]">
                      <SelectValue placeholder="Select languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="both">English & Spanish</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org">Organization</Label>
                  <Select defaultValue="independent">
                    <SelectTrigger id="org" className="border-gray-200 focus:ring-[#B91C4E]">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">Independent</SelectItem>
                      <SelectItem value="1">City Health Care</SelectItem>
                      <SelectItem value="2">Wellness Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Verification Requirements</Label>
                <div className="grid grid-cols-2 gap-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="req1" />
                    <Label htmlFor="req1" className="text-xs font-normal cursor-pointer">Background Check</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="req2" />
                    <Label htmlFor="req2" className="text-xs font-normal cursor-pointer">Certifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="req3" />
                    <Label htmlFor="req3" className="text-xs font-normal cursor-pointer">Drug Test</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="req4" />
                    <Label htmlFor="req4" className="text-xs font-normal cursor-pointer">Reference Check</Label>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#B91C4E] hover:bg-[#a01844] text-white min-w-[120px]" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Adding...
                    </span>
                  ) : "Create Profile"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 border-l pl-4">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Services</option>
              <option value="CNA">CNA Only</option>
              <option value="HHA">HHA Only</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={organizationFilter}
              onChange={(e) => setOrganizationFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Organizations</option>
              <option value="affiliated">Affiliated</option>
              <option value="independent">Independent</option>
            </select>
            <select
              value={strikeFilter}
              onChange={(e) => setStrikeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Strikes</option>
              <option value="nostrikes">No Strikes</option>
              <option value="atrisk">At Risk (2+)</option>
            </select>
            <select
              value={backgroundFilter}
              onChange={(e) => setBackgroundFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Backgrounds</option>
              <option value="passed">Passed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>Showing {filtered.length} of {caregivers.length} caregivers</div>
            {selectedCaregivers.size > 0 && (
              <div className="flex gap-2">
                <span className="text-sm">{selectedCaregivers.size} selected</span>
                <Button size="sm" variant="outline">Bulk Action</Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {viewMode === 'table' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCaregivers(new Set(filtered.map(c => c.id)))
                      } else {
                        setSelectedCaregivers(new Set())
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Service Types</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Strikes</TableHead>
                <TableHead>Background</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No caregivers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cg) => (
                  <TableRow key={cg.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCaregivers.has(cg.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedCaregivers)
                          if (e.target.checked) {
                            newSelected.add(cg.id)
                          } else {
                            newSelected.delete(cg.id)
                          }
                          setSelectedCaregivers(newSelected)
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{cg.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {cg.serviceTypes.map((type) => (
                          <Badge key={type} variant={type === 'CNA' ? 'default' : 'secondary'}>
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cg.organizationId ? 'outline' : 'secondary'} className={cg.organizationId ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}>
                        {cg.organizationName || 'Independent'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cg.status === 'Active' ? 'default' : cg.status === 'Terminated' ? 'destructive' : 'secondary'}>
                        {cg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 items-center">
                        {getStrikeIndicator(cg.strikeCount)}
                        <span className="text-xs text-gray-500 ml-2">{cg.strikeCount}/3</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cg.backgroundCheckStatus === 'Passed' ? 'bg-green-50 text-green-700 border-green-200' : cg.backgroundCheckStatus === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' : ''}>
                        {cg.backgroundCheckStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{cg.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/caregivers/${cg.id}`}>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No caregivers found
            </div>
          ) : (
            filtered.map((cg) => (
              <Card key={cg.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{cg.name}</h3>
                      <p className="text-xs text-gray-600">{cg.email}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCaregivers.has(cg.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedCaregivers)
                        if (e.target.checked) {
                          newSelected.add(cg.id)
                        } else {
                          newSelected.delete(cg.id)
                        }
                        setSelectedCaregivers(newSelected)
                      }}
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {cg.serviceTypes.map((type) => (
                      <Badge key={type} variant={type === 'CNA' ? 'default' : 'secondary'} className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600">Status: <Badge variant={cg.status === 'Active' ? 'default' : 'secondary'} className="text-xs ml-1">{cg.status}</Badge></p>
                    <p className="text-gray-600">Strikes: <span className="font-medium">{cg.strikeCount}/3</span></p>
                    <p className="text-gray-600">Rating: <span className="font-medium">★ {cg.rating.toFixed(1)}</span></p>
                    <p className="text-gray-600">Bookings: <span className="font-medium">{cg.totalBookings}</span></p>
                  </div>
                  <Link href={`/caregivers/${cg.id}`} className="block">
                    <Button variant="outline" className="w-full" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
