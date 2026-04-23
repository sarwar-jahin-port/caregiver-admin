'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClients } from '@/lib/hooks/use-data'
import { ArrowLeft, User, Phone, MapPin, Plus, Trash2, Save, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateCarePlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientId = searchParams.get('clientId')
  const { getClientById } = useClients()
  
  const client = useMemo(() => clientId ? getClientById(clientId) : null, [clientId, getClientById])

  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(
    client?.careRecipients[0]?.id || ''
  )
  const [services, setServices] = useState<Array<{ type: 'CNA' | 'HHA'; tasks: string; hours: number; rate: number }>>([])

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 mb-4">No client selected to create a care plan.</p>
        <Link href="/care-plans">
          <Button>Back to Care Plans</Button>
        </Link>
      </div>
    )
  }

  const selectedRecipient = client.careRecipients.find(r => r.id === selectedRecipientId) || client.careRecipients[0]

  const addService = () => {
    setServices([...services, { type: 'HHA', tasks: '', hours: 4, rate: 30 }])
  }

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index))
  }

  const handleSavePlan = () => {
    toast.success("Care plan created successfully for " + client.fullName)
    router.push('/care-plans')
  }

  const totalMonthlyCost = services.reduce((acc, s) => acc + (s.hours * s.rate * 30), 0) // rough estimate

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/care-plans">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSavePlan} className="bg-[#B91C4E] hover:bg-[#A01844] text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Care Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client & Recipient Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-[#B91C4E]" />
              Client Info
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#B91C4E] font-bold">
                  {client.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{client.fullName}</p>
                  <Badge variant="outline" className="text-xs">{client.id}</Badge>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {client.phone}
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                  {client.primaryAddress}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-[#B91C4E]" />
              Care Recipient
            </h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Select Recipient</Label>
                <Select value={selectedRecipientId} onValueChange={setSelectedRecipientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {client.careRecipients.map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRecipient && (
                <div className="pt-4 space-y-3">
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Primary Condition</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedRecipient.primaryCondition}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Mobility Level</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedRecipient.mobilityLevel}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cognitive Status</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedRecipient.cognitiveStatus}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Services & Cost */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Care Services</h2>
              <Button onClick={addService} size="sm" className="bg-[#B91C4E] text-white hover:bg-[#A01844]">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="space-y-4">
              {services.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50/50">
                  <Plus className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No services added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add details about the care needed for this plan.</p>
                </div>
              ) : (
                services.map((service, index) => (
                  <div key={index} className="p-4 border rounded-xl bg-white shadow-sm hover:border-rose-200 transition-colors relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-gray-300 hover:text-red-500"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label>Service Type</Label>
                        <Select 
                          value={service.type} 
                          onValueChange={(val: any) => {
                            const newServices = [...services]
                            newServices[index].type = val
                            setServices(newServices)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CNA">CNA (Certified Nursing Asst.)</SelectItem>
                            <SelectItem value="HHA">HHA (Home Health Aide)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Daily Hours</Label>
                        <Input 
                          type="number" 
                          value={service.hours} 
                          onChange={(e) => {
                            const newServices = [...services]
                            newServices[index].hours = parseInt(e.target.value)
                            setServices(newServices)
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Hourly Rate ($)</Label>
                        <Input 
                          type="number" 
                          value={service.rate} 
                          onChange={(e) => {
                            const newServices = [...services]
                            newServices[index].rate = parseInt(e.target.value)
                            setServices(newServices)
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2 mt-4">
                      <Label>Specific Tasks / Notes</Label>
                      <Textarea 
                        placeholder="Ex: Assistance with bathing, meal prep, medication reminders..." 
                        value={service.tasks}
                        onChange={(e) => {
                          const newServices = [...services]
                          newServices[index].tasks = e.target.value
                          setServices(newServices)
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {services.length > 0 && (
              <div className="mt-8 pt-6 border-t flex flex-col items-end gap-2">
                <div className="flex items-center gap-4 text-gray-600">
                  <span>Total Hourly Rate:</span>
                  <span className="font-medium text-gray-900">${services.reduce((acc, s) => acc + s.rate, 0)}/hr</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-900">Estimated Monthly Cost:</span>
                  <span className="text-2xl font-bold text-[#B91C4E]">${totalMonthlyCost.toLocaleString()}</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Initial Assessment Notes</h2>
            <Textarea 
              placeholder="Enter any additional assessment findings or plan-wide notes here..." 
              className="min-h-[120px]"
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
