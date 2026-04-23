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
import { Checkbox } from '@/components/ui/checkbox'
import { useClients, useCaregivers } from '@/lib/hooks/use-data'
import { 
  ArrowLeft, 
  User, 
  Clock, 
  CheckCircle, 
  Calendar as CalendarIcon, 
  Briefcase, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function CreateRecurringSeriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientId = searchParams.get('clientId')
  const { getClientById } = useClients()
  const { caregivers } = useCaregivers()
  
  const client = useMemo(() => clientId ? getClientById(clientId) : null, [clientId, getClientById])

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    recipientId: client?.careRecipients[0]?.id || '',
    serviceType: 'HHA' as 'CNA' | 'HHA',
    tasks: '',
    frequency: 'Weekly' as 'Daily' | 'Weekly',
    selectedDays: [] as string[],
    startTime: '09:00',
    endTime: '13:00',
    startDate: '',
    endDate: '',
    caregiverId: '',
  })

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 mb-4">No client selected to create a series.</p>
        <Link href="/bookings/recurring">
          <Button className="bg-[#B91C4E] text-white">Back to Recurring Series</Button>
        </Link>
      </div>
    )
  }

  const selectedRecipient = client.careRecipients.find(r => r.id === formData.recipientId) || client.careRecipients[0]
  const selectedCaregiver = caregivers.find(c => c.id === formData.caregiverId)

  const handleNext = () => setStep(s => Math.min(s + 1, 4))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const handleSaveSeries = () => {
    toast.success("Recurring series created successfully!")
    router.push('/bookings/recurring')
  }

  const filteredCaregivers = caregivers.filter(c => 
    c.status === 'Active' && 
    c.serviceTypes.includes(formData.serviceType)
  )

  const steps = [
    { id: 1, name: 'Service', icon: Briefcase },
    { id: 2, name: 'Schedule', icon: CalendarIcon },
    { id: 3, name: 'Caregiver', icon: User },
    { id: 4, name: 'Confirm', icon: CheckCircle },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Booking Series</h1>
            <p className="text-sm text-gray-500">Setting up a recurring schedule for {client.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= s.id ? 'bg-[#B91C4E] text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.id ? 'text-[#B91C4E]' : 'text-gray-400'}`}>
                  {s.name}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-px mb-4 ${step > s.id ? 'bg-[#B91C4E]' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Step 1: Service Details */}
        {step === 1 && (
          <Card className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#B91C4E]" />
                  Recipient & Type
                </h3>
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label>Care Recipient</Label>
                    <Select 
                      value={formData.recipientId} 
                      onValueChange={(val) => setFormData({...formData, recipientId: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {client.careRecipients.map(r => (
                          <SelectItem key={r.id} value={r.id}>{r.fullName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Service Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {['CNA', 'HHA'].map((t) => (
                        <button
                          key={t}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            formData.serviceType === t 
                              ? 'border-[#B91C4E] bg-rose-50 text-[#B91C4E] font-bold' 
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                          onClick={() => setFormData({...formData, serviceType: t as any})}
                        >
                          {t === 'CNA' ? 'CNA (Clinical)' : 'HHA (Standard)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#B91C4E]" />
                  Primary Tasks
                </h3>
                <Textarea 
                  placeholder="Describe the required assistance (e.g., meal prep, mobility help, bathing...)"
                  className="min-h-[180px]"
                  value={formData.tasks}
                  onChange={(e) => setFormData({...formData, tasks: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t">
              <Button 
                onClick={handleNext} 
                className="bg-[#B91C4E] hover:bg-[#A01844] text-white px-8"
                disabled={!formData.tasks.trim()}
              >
                Continue to Schedule
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <Card className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-base font-bold">Frequency</Label>
                  <div className="flex gap-4">
                    {['Daily', 'Weekly'].map((f) => (
                      <button
                        key={f}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          formData.frequency === f 
                            ? 'border-[#B91C4E] bg-rose-50 text-[#B91C4E] font-bold' 
                            : 'border-gray-100'
                        }`}
                        onClick={() => setFormData({...formData, frequency: f as any})}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-bold">Daily Time Window</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-500 mb-1 block">Start Time</Label>
                      <Input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-gray-500 mb-1 block">End Time</Label>
                      <Input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>

              {formData.frequency === 'Weekly' && (
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-base font-bold">Select Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => {
                      const isSelected = formData.selectedDays.includes(day)
                      return (
                        <button
                          key={day}
                          className={`px-4 py-2 rounded-full border-2 transition-all text-sm font-medium ${
                            isSelected 
                              ? 'bg-[#B91C4E] border-[#B91C4E] text-white' 
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                          onClick={() => {
                            const newDays = isSelected 
                              ? formData.selectedDays.filter(d => d !== day)
                              : [...formData.selectedDays, day]
                            setFormData({...formData, selectedDays: newDays})
                          }}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8 pt-4 border-t">
                <div className="grid gap-2">
                  <Label className="font-bold">Starts On</Label>
                  <Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Ends On (Optional)</Label>
                  <Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t font-medium">
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="bg-[#B91C4E] hover:bg-[#A01844] text-white px-8"
                disabled={!formData.startDate || (formData.frequency === 'Weekly' && formData.selectedDays.length === 0)}
              >
                Select Caregiver
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Caregiver Selection */}
        {step === 3 && (
          <Card className="p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Recommended Caregivers for {formData.serviceType}</h3>
              <p className="text-sm text-gray-500">We've filtered these based on qualifications and service type.</p>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredCaregivers.map((c) => (
                  <div 
                    key={c.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all cursor-pointer ${
                      formData.caregiverId === c.id 
                        ? 'border-[#B91C4E] bg-rose-50' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                    onClick={() => setFormData({...formData, caregiverId: c.id})}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{c.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs font-bold ml-1">{c.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">• {c.totalBookings} bookings</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${c.pricing.find(p => p.serviceType === formData.serviceType)?.baseRate || 30}/hr</p>
                      <p className="text-xs text-gray-500">Base Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="bg-[#B91C4E] hover:bg-[#A01844] text-white px-8"
                disabled={!formData.caregiverId}
              >
                Review Summary
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Final Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <Card className="p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8">
                 <CheckCircle className="h-16 w-16 text-rose-100" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-8">Series Review</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recipient</p>
                    <p className="text-lg font-medium text-gray-900">{selectedRecipient?.fullName}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Schedule</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formData.frequency} 
                      {formData.frequency === 'Weekly' && ` (${formData.selectedDays.join(', ')})`}
                    </p>
                    <p className="text-sm text-[#B91C4E] font-medium mt-1">
                      {formData.startTime} - {formData.endTime}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Period</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formData.startDate} {formData.endDate ? `to ${formData.endDate}` : 'Ongoing'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Service & Tasks</p>
                    <Badge className="bg-[#B91C4E] text-white mb-2">{formData.serviceType}</Badge>
                    <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-rose-100 pl-4">
                      "{formData.tasks}"
                    </p>
                  </div>

                  <div className="space-y-1 pt-4 border-t">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selected Caregiver</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-[#B91C4E] font-bold text-xs">
                        {selectedCaregiver?.name.charAt(0)}
                      </div>
                      <p className="font-bold text-gray-900">{selectedCaregiver?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-rose-50 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B91C4E] font-bold">Estimated Monthly Billing</p>
                  <p className="text-xs text-rose-400">Based on regular occurrences and current rates</p>
                </div>
                <p className="text-3xl font-bold text-[#B91C4E]">
                  ${(formData.frequency === 'Daily' ? 30 : formData.selectedDays.length * 4) * 40 * 1.5}
                </p>
              </div>

              <div className="flex justify-between pt-10 mt-6 border-t">
                <Button variant="ghost" onClick={handleBack}>
                  Change Details
                </Button>
                <Button 
                  onClick={handleSaveSeries} 
                  className="bg-[#B91C4E] hover:bg-[#A01844] text-white px-12 h-12 text-lg shadow-lg shadow-rose-200"
                >
                  Create & Active Series
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
