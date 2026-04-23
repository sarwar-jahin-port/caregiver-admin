'use client'

import { useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useBookings, useCaregivers } from '@/lib/hooks/use-data'
import { toast } from 'sonner'
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  CreditCard,
  MessageSquare,
  FileText,
  History,
  Star,
  Phone,
  Mail,
  ArrowRight,
  X,
  Check,
  Edit2,
  RefreshCw,
} from 'lucide-react'

const STATUS_COLORS = {
  'Pending': 'bg-amber-50 text-amber-800',
  'Confirmed': 'bg-blue-50 text-blue-800',
  'Active': 'bg-green-50 text-green-800',
  'Completed': 'bg-gray-50 text-gray-800',
  'Cancelled': 'bg-red-50 text-red-800',
  'Disputed': 'bg-orange-50 text-orange-800',
  'Replacement In Progress': 'bg-purple-50 text-purple-800',
  'No-Show': 'bg-red-50 text-red-800',
  'Client No-Show': 'bg-red-50 text-red-800',
}

const DISPUTE_SEVERITY_COLORS = {
  'Low': 'bg-blue-50 text-blue-800',
  'Medium': 'bg-yellow-50 text-yellow-800',
  'High': 'bg-orange-50 text-orange-800',
  'Critical': 'bg-red-50 text-red-800',
}

export default function BookingDetailPage({ booking }: { booking: any }) {
  const { requestReplacement } = useBookings()
  const { caregivers } = useCaregivers()
  const [activeSection, setActiveSection] = useState<'overview' | 'payment' | 'checkin' | 'replacement' | 'dispute' | 'activity' | 'review'>('overview')
  
  const [isReplacementOpen, setIsReplacementOpen] = useState(false)
  const [replacementReason, setReplacementReason] = useState('')
  const [selectedCaregiverId, setSelectedCaregiverId] = useState('')

  const eligibleReplacementCaregivers = caregivers.filter(c => 
    c.id !== booking.caregiverId && 
    c.status === 'Active' && 
    c.serviceTypes.includes(booking.serviceType)
  )

  const handleReplacement = () => {
    const cg = caregivers.find(c => c.id === selectedCaregiverId)
    if (!cg) return
    
    requestReplacement(booking.id, selectedCaregiverId, cg.name, replacementReason)
    setIsReplacementOpen(false)
    toast.success(`Replacement requested: ${cg.name}`)
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="col-span-2 space-y-6">
        {/* Header with Status */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{booking.clientName}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={STATUS_COLORS[booking.status as keyof typeof STATUS_COLORS]}>
                {booking.status}
              </Badge>
              {booking.isPartOfSeries && (
                <Badge variant="outline">Recurring</Badge>
              )}
              {booking.surgePricing && (
                <Badge variant="secondary">Surge Pricing</Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Booking ID</div>
            <div className="font-mono font-bold">{booking.id}</div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {['overview', 'payment', 'checkin', 'replacement', 'dispute', 'activity', 'review'].map(section => {
            const show = section === 'dispute' ? !!booking.dispute : section === 'replacement' ? booking.replacementHistory.length > 0 : section === 'review' ? booking.review : true
            if (!show) return null
            
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section as any)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeSection === section
                    ? 'border-[#B91C4E] text-[#B91C4E]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {section === 'overview' && 'Booking Details'}
                {section === 'payment' && 'Pricing & Payment'}
                {section === 'checkin' && 'Check-in/Out'}
                {section === 'replacement' && 'Replacement Events'}
                {section === 'dispute' && 'Dispute'}
                {section === 'activity' && 'Activity Log'}
                {section === 'review' && 'Review'}
              </button>
            )
          })}
        </div>

        {/* Section: Booking Details */}
        {activeSection === 'overview' && (
          <div className="space-y-4">
            {/* Client & Caregiver */}
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Parties Involved</h2>
              <div className="grid grid-cols-3 gap-6">
                {/* Client */}
                <div className="border-r pr-6">
                  <h3 className="font-bold text-gray-900 mb-3">Client</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Name:</span> <span className="font-medium">{booking.clientName}</span></p>
                    <p><span className="text-gray-600">Email:</span></p>
                    <p className="flex items-center gap-2 ml-4">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-blue-600">{booking.clientEmail}</span>
                    </p>
                    <p><span className="text-gray-600">Phone:</span></p>
                    <p className="flex items-center gap-2 ml-4">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-blue-600">{booking.clientPhone}</span>
                    </p>
                  </div>
                </div>

                {/* Caregiver */}
                <div className="border-r pr-6">
                  <h3 className="font-bold text-gray-900 mb-3">Caregiver</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Name:</span> <span className="font-medium">{booking.caregiverName}</span></p>
                    <p><span className="text-gray-600">Service:</span> <Badge className="ml-1">{booking.serviceType}</Badge></p>
                    <p><span className="text-gray-600">Task:</span> <span className="font-medium">{booking.taskType}</span></p>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Schedule</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Date:</span> <span className="font-mono font-bold">{booking.startDate}</span></p>
                    <p><span className="text-gray-600">Time:</span> <span className="font-mono font-bold">{booking.startTime} - {booking.endTime}</span></p>
                    <p><span className="text-gray-600">Duration:</span> <span className="font-medium">{booking.totalHours} hours</span></p>
                    <p><span className="text-gray-600">Type:</span> <Badge variant="outline">{booking.scheduleType}</Badge></p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Details */}
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Booking Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Source</p>
                  <p className="font-medium mt-1">{booking.source}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Created</p>
                  <p className="font-medium mt-1">{booking.createdAt}</p>
                </div>
                {booking.carePlanId && (
                  <>
                    <div>
                      <p className="text-gray-600 text-sm">Care Plan</p>
                      <p className="font-medium mt-1">{booking.carePlanId}</p>
                    </div>
                  </>
                )}
                {booking.confirmedAt && (
                  <div>
                    <p className="text-gray-600 text-sm">Confirmed</p>
                    <p className="font-medium mt-1">{booking.confirmedAt}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Section: Payment */}
        {activeSection === 'payment' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Pricing & Payment</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <span className="text-gray-600">Base Rate</span>
                  <span className="font-mono font-bold">${booking.baseRate}/hr</span>
                </div>
                {booking.surgePricing && (
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded border-l-4 border-orange-500">
                    <div>
                      <p className="font-medium text-orange-900">Surge Pricing</p>
                      <p className="text-sm text-orange-700">{booking.surgePricing.reason}</p>
                    </div>
                    <span className="font-mono font-bold text-orange-700">{booking.surgePricing.multiplier}x ({(booking.surgePricing.multiplier - 1) * 100}%)</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded border-l-4 border-green-500 text-lg">
                  <span className="font-bold text-green-900">Total Amount</span>
                  <span className="font-mono font-bold text-green-700">${booking.finalRate * booking.totalHours}</span>
                </div>

                {/* Payment History */}
                {booking.payment.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold mb-3">Payment History</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left text-gray-600 py-2">Amount</th>
                          <th className="text-left text-gray-600 py-2">Status</th>
                          <th className="text-left text-gray-600 py-2">Method</th>
                          <th className="text-left text-gray-600 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {booking.payment.map((p: any) => (
                          <tr key={p.id} className="border-b">
                            <td className="py-2 font-mono font-bold">${p.amount}</td>
                            <td><Badge className={p.status === 'Processed' ? 'bg-green-100 text-green-800' : p.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>{p.status}</Badge></td>
                            <td>{p.method}</td>
                            <td>{p.processedAt || 'Pending'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Section: Check-in/Check-out */}
        {activeSection === 'checkin' && (
          <Card className="p-6">
            <h2 className="font-bold text-lg mb-6">Check-in / Check-out Verification</h2>
            <div className="space-y-4">
              {/* Check-in */}
              <div className="p-4 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Check-in</h3>
                  {booking.checkInOut.checkInVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : booking.checkInOut.checkInTime ? (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-mono font-bold mt-1">{booking.checkInOut.checkInTime || 'Not checked in'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Verified By</p>
                    <p className="font-medium mt-1">{booking.checkInOut.checkInVerifiedBy || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={booking.checkInOut.checkInVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} variant="outline">
                      {booking.checkInOut.checkInVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Check-out */}
              <div className="p-4 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Check-out</h3>
                  {booking.checkInOut.checkOutVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : booking.checkInOut.checkOutTime ? (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-mono font-bold mt-1">{booking.checkInOut.checkOutTime || 'In Progress'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Verified By</p>
                    <p className="font-medium mt-1">{booking.checkInOut.checkOutVerifiedBy || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={booking.checkInOut.checkOutVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} variant="outline">
                      {booking.checkInOut.checkOutVerified ? 'Verified' : booking.status === 'Active' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Section: Replacement Events */}
        {activeSection === 'replacement' && booking.replacementHistory.length > 0 && (
          <Card className="p-6">
            <h2 className="font-bold text-lg mb-4">Replacement Event Log</h2>
            <div className="space-y-4">
              {booking.replacementHistory.map((event: any, idx: number) => (
                <div key={event.id} className="border-l-4 border-purple-500 pl-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{event.originalCaregiverName} → {event.replacementCaregiverName}</h3>
                    <Badge className="bg-purple-100 text-purple-800">Replacement {idx + 1}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Reason: {event.reason}</p>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-mono font-bold mt-1">{event.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Strike Applied</p>
                      <p className="font-bold mt-1">{event.strikeApplied}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Surge Multiplier</p>
                      <p className="font-bold text-orange-600 mt-1">{event.surgeMultiplier}x</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Surge Rate</p>
                      <p className="font-mono font-bold mt-1">${event.surgeRate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Section: Dispute */}
        {activeSection === 'dispute' && booking.dispute && (
          <Card className="p-6 border-l-4 border-red-500">
            <h2 className="font-bold text-lg mb-4">Dispute Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Reported By</p>
                  <p className="font-medium mt-1">{booking.dispute.reportedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Severity</p>
                  <Badge className={DISPUTE_SEVERITY_COLORS[booking.dispute.severity as keyof typeof DISPUTE_SEVERITY_COLORS]}>
                    {booking.dispute.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={booking.dispute.status === 'Open' ? 'bg-red-100 text-red-800' : booking.dispute.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                    {booking.dispute.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Reason</p>
                <p className="font-medium">{booking.dispute.reason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-sm text-gray-700">{booking.dispute.description}</p>
              </div>
              {booking.dispute.resolution && (
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-sm text-green-800 font-medium mb-1">Resolution</p>
                  <p className="text-sm text-green-700">{booking.dispute.resolution}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Section: Activity Log */}
        {activeSection === 'activity' && (
          <Card className="p-6">
            <h2 className="font-bold text-lg mb-4">Activity & Audit Log</h2>
            <div className="space-y-3">
              {booking.activityLog.map((log: any, idx: number) => (
                <div key={idx} className="flex gap-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 rounded-full bg-[#B91C4E] mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">By {log.performedBy}</p>
                    {log.details && (
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Section: Review */}
        {activeSection === 'review' && booking.review && (
          <Card className="p-6 border-l-4 border-yellow-500">
            <h2 className="font-bold text-lg mb-4">Post-Booking Review</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Rating:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < booking.review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-bold text-lg ml-2">{booking.review.rating}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Review Comment</p>
                <p className="text-gray-700">{booking.review.comment}</p>
              </div>
              <div className="text-sm text-gray-600">
                Submitted by {booking.review.submittedBy} on {booking.review.submittedAt}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">Actions</h3>
          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Booking
            </Button>
            {booking.status === 'Confirmed' && (
              <Button className="w-full" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Start Booking
              </Button>
            )}
            {booking.status === 'Active' && (
              <Button className="w-full" variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Complete Booking
              </Button>
            )}
            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
              <Button className="w-full" variant="outline" className="text-red-600">
                <X className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            )}
            {booking.status === 'Active' && (
              <Dialog open={isReplacementOpen} onOpenChange={setIsReplacementOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full text-purple-600 border-purple-200 hover:bg-purple-50" variant="outline">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Request Replacement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Emergency Replacement</DialogTitle>
                    <DialogDescription>
                      This will swap the current caregiver and apply a strike to their profile.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reason for Replacement</label>
                      <Select value={replacementReason} onValueChange={setReplacementReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No-show">No-show / Abandonment</SelectItem>
                          <SelectItem value="Late">Excessive tardiness</SelectItem>
                          <SelectItem value="Professionalism">Professionalism issue</SelectItem>
                          <SelectItem value="Competency">Competency concern</SelectItem>
                          <SelectItem value="Emergency">Caregiver emergency</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {replacementReason === 'Other' && (
                      <Input placeholder="Specify reason..." />
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Available Replacement ({booking.serviceType})</label>
                      <Select value={selectedCaregiverId} onValueChange={setSelectedCaregiverId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select replacement" />
                        </SelectTrigger>
                        <SelectContent>
                          {eligibleReplacementCaregivers.map(cg => (
                            <SelectItem key={cg.id} value={cg.id}>
                              {cg.name} ({cg.rating}★)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {eligibleReplacementCaregivers.length === 0 && (
                        <p className="text-xs text-red-500">No active {booking.serviceType}s available right now.</p>
                      )}
                    </div>
                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0" />
                      <p className="text-xs text-rose-700">
                        Applying a replacement triggers a 1.5x surge rate for the new caregiver (Emergency Surcharge).
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsReplacementOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={handleReplacement}
                      disabled={!selectedCaregiverId || !replacementReason}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Confirm Replacement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </Card>

        {/* Status Timeline */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">Status Timeline</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-[#B91C4E] mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-gray-600">{booking.createdAt}</p>
              </div>
            </div>
            {booking.confirmedAt && (
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#B91C4E] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Confirmed</p>
                  <p className="text-gray-600">{booking.confirmedAt}</p>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <div className={`w-2 h-2 rounded-full ${booking.status === 'Completed' ? 'bg-[#B91C4E]' : 'bg-gray-300'} mt-1.5 flex-shrink-0`} />
              <div>
                <p className="font-medium">Scheduled</p>
                <p className="text-gray-600">{booking.startDate}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-gray-50">
          <h3 className="font-bold mb-3 text-sm">Quick Info</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Organization</p>
              <p className="font-medium mt-1">{booking.organizationId ? 'Affiliated' : 'Independent'}</p>
            </div>
            <div>
              <p className="text-gray-600">Service Duration</p>
              <p className="font-medium mt-1">{booking.totalHours} hours</p>
            </div>
            <div>
              <p className="text-gray-600">Total Cost</p>
              <p className="font-mono font-bold mt-1">${booking.finalRate * booking.totalHours}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
