'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useClients, useBookings } from '@/lib/hooks/use-data'
import { use } from 'react'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Flag,
  Edit,
  Ban,
  ChevronDown,
  Users,
  Plus,
  FileText,
  CreditCard,
  Star,
  MessageSquare,
  AlertTriangle,
  Shield,
  Download,
  Send,
  Trash2,
  Lock,
  Check,
  X,
  Activity,
  Heart,
  Pill,
  AlertCircle,
  Utensils
} from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800',
  'Suspended': 'bg-amber-100 text-amber-800',
  'Blocked': 'bg-red-100 text-red-800',
}

const BOOKING_STATUS_COLORS: Record<string, string> = {
  'Scheduled': 'bg-blue-100 text-blue-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Active': 'bg-green-100 text-green-800',
  'Completed': 'bg-gray-100 text-gray-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Disputed': 'bg-orange-100 text-orange-800',
}

const MOBILITY_ICONS: Record<string, string> = {
  'Fully mobile': '🚶',
  'Assisted mobility': '🦯',
  'Wheelchair': '♿',
  'Bedridden': '🛏️',
}

const COGNITIVE_COLORS: Record<string, string> = {
  'Alert': 'bg-green-100 text-green-800',
  'Mild impairment': 'bg-yellow-100 text-yellow-800',
  'Moderate impairment': 'bg-orange-100 text-orange-800',
  'Severe impairment': 'bg-red-100 text-red-800',
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getClientById } = useClients()
  const { bookings } = useBookings()
  const client = getClientById(id)
  const [activeTab, setActiveTab] = useState('overview')
  const [noteContent, setNoteContent] = useState('')

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Client not found</p>
        <Link href="/clients">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </Link>
      </div>
    )
  }

  const clientBookings = bookings.filter(b => b.clientId === client.id)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Link href="/clients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Summary Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold mx-auto mb-3">
                  {client.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{client.fullName}</h2>
                <p className="text-sm text-gray-500">{client.id}</p>
                
                {/* Status Dropdown */}
                <div className="mt-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Badge className={STATUS_COLORS[client.status]}>{client.status}</Badge>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Active</DropdownMenuItem>
                      <DropdownMenuItem>Suspended</DropdownMenuItem>
                      <DropdownMenuItem>Blocked</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Flag Indicator */}
                {client.flagged && (
                  <div className="mt-3">
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="bg-red-100 text-red-800 gap-1">
                          <Flag className="h-3 w-3 fill-red-500" />
                          Flagged
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{client.flags[0]?.reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Member since {new Date(client.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${client.phone}`} className="text-[#B91C4E] hover:underline">{client.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${client.email}`} className="text-[#B91C4E] hover:underline truncate">{client.email}</a>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{client.primaryAddress}</span>
                </div>
              </div>

              {/* Account Type */}
              <div className="mt-4 pt-4 border-t">
                <Badge variant="outline" className="bg-gray-50">
                  {client.accountType === 'Self' ? 'Self (Care recipient)' : 'Account Holder'}
                </Badge>
              </div>

              {/* Linked Care Recipients */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-900 mb-2">Care Recipients</p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {client.careRecipients.slice(0, 3).map((cr) => (
                      <div key={cr.id} className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-medium text-teal-700">
                        {cr.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    Managing care for {client.careRecipients.length} {client.careRecipients.length === 1 ? 'person' : 'people'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lifetime value</span>
                  <span className="font-medium">${client.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total bookings</span>
                  <span className="font-medium">{client.totalBookings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active care plan</span>
                  {client.carePlanIds.length > 0 ? (
                    <Link href={`/care-plans/${client.carePlanIds[0]}`} className="text-[#B91C4E] hover:underline font-medium">
                      {client.carePlanIds[0]}
                    </Link>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                {client.status === 'Active' && (
                  <Button variant="outline" className="w-full text-amber-600 border-amber-200 hover:bg-amber-50">
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Account
                  </Button>
                )}
                {client.status !== 'Blocked' && (
                  <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                    <Ban className="h-4 w-4 mr-2" />
                    Block Account
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-9 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recipients">Recipients</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="careplans">Care Plans</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="disputes">Disputes</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="comms">Comms</TabsTrigger>
                <TabsTrigger value="flags">Flags</TabsTrigger>
              </TabsList>

              {/* TAB 1: OVERVIEW */}
              <TabsContent value="overview" className="space-y-6">
                {/* Personal Details */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="mt-1">{client.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                      <p className="mt-1">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="mt-1">{client.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Preferred Language</p>
                      <p className="mt-1">{client.preferredLanguage}</p>
                    </div>
                  </div>
                </Card>

                {/* Contact */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1">{client.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{client.email}</p>
                    </div>
                    {client.alternatePhone && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Alternate Phone</p>
                        <p className="mt-1">{client.alternatePhone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Preferred Contact Method</p>
                      <p className="mt-1">{client.preferredContactMethod}</p>
                    </div>
                  </div>
                </Card>

                {/* Address */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Addresses</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Primary Address</p>
                      <p className="mt-1">{client.primaryAddress}</p>
                    </div>
                    {client.alternateAddresses.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Alternate Addresses</p>
                        {client.alternateAddresses.map((addr, i) => (
                          <p key={i} className="mt-1">{addr}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Account Info */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Type</p>
                      <p className="mt-1">{client.accountType === 'Self' ? 'Self (care recipient is themselves)' : 'Family Manager (managing care for others)'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">How They Found Us</p>
                      <p className="mt-1">{client.howFoundPlatform}</p>
                    </div>
                  </div>
                </Card>

                {/* Emergency Contact */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1">{client.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Relationship</p>
                      <p className="mt-1">{client.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1">{client.emergencyContact.phone}</p>
                    </div>
                  </div>
                </Card>

                {/* Care Recipients Preview */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Care Recipients</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Care Recipient
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {client.careRecipients.map((cr) => (
                      <div key={cr.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                            {cr.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cr.fullName}</p>
                            <p className="text-sm text-gray-500">{cr.age} years old • {cr.primaryCondition}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('recipients')}>
                          View Full Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Admin Notes */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Internal Admin Notes</h3>
                  <p className="text-xs text-gray-500 mb-4">These notes are private and not visible to the client</p>
                  
                  <div className="space-y-4">
                    {client.adminNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          By {note.author} on {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {client.adminNotes.length === 0 && (
                      <p className="text-sm text-gray-500">No admin notes yet.</p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Textarea 
                      placeholder="Add a note..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="mb-2"
                    />
                    <Button size="sm" disabled={!noteContent.trim()}>Add Note</Button>
                  </div>
                </Card>
              </TabsContent>

              {/* TAB 2: CARE RECIPIENTS */}
              <TabsContent value="recipients" className="space-y-6">
                {client.careRecipients.map((cr) => (
                  <Card key={cr.id} className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold">
                          {cr.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{cr.fullName}</h3>
                          <p className="text-sm text-teal-600">Care Recipient</p>
                          <p className="text-sm text-gray-500">{cr.relationshipToClient} of {client.fullName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Care Summary PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500">Date of Birth</p>
                          <p className="text-sm font-medium">{new Date(cr.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Age</p>
                          <p className="text-sm font-medium">{cr.age} years old</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Gender</p>
                          <p className="text-sm font-medium">{cr.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Primary Address</p>
                          <p className="text-sm font-medium">{cr.primaryAddress}</p>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                        <p className="text-xs text-amber-700 font-medium mb-1">Emergency Contact</p>
                        <p className="text-sm">{cr.emergencyContact.name} ({cr.emergencyContact.relationship}) - {cr.emergencyContact.phone}</p>
                      </div>
                    </div>

                    {/* Health Profile */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Health & Care Profile
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Primary Condition</p>
                          <p className="font-medium text-red-700">{cr.primaryCondition}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Secondary Conditions</p>
                          <div className="flex gap-1 flex-wrap">
                            {cr.secondaryConditions.length > 0 ? cr.secondaryConditions.map((c, i) => (
                              <Badge key={i} variant="outline">{c}</Badge>
                            )) : <span className="text-gray-400 text-sm">None</span>}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-2xl mb-1">{MOBILITY_ICONS[cr.mobilityLevel]}</p>
                          <p className="text-xs text-gray-500">Mobility</p>
                          <p className="text-sm font-medium">{cr.mobilityLevel}</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <Badge className={`${COGNITIVE_COLORS[cr.cognitiveStatus]} mb-2`}>{cr.cognitiveStatus}</Badge>
                          <p className="text-xs text-gray-500">Cognitive Status</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-2xl mb-1">{cr.communication === 'Normal' ? '🗣️' : cr.communication === 'Hearing impaired' ? '👂' : '🤫'}</p>
                          <p className="text-xs text-gray-500">Communication</p>
                          <p className="text-sm font-medium">{cr.communication}</p>
                        </div>
                      </div>

                      {/* Allergies */}
                      {cr.allergies.length > 0 && (
                        <div className="p-4 border border-red-200 bg-red-50 rounded-lg mb-4">
                          <p className="text-xs text-red-700 font-medium mb-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            ALLERGIES
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {cr.allergies.map((a, i) => (
                              <Badge key={i} className="bg-red-100 text-red-800">{a}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Medications */}
                      {cr.currentMedications.length > 0 && (
                        <div className="p-4 border rounded-lg mb-4">
                          <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                            <Pill className="h-3 w-3" />
                            Current Medications
                          </p>
                          <div className="space-y-2">
                            {cr.currentMedications.map((med, i) => (
                              <div key={i} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                <span className="font-medium">{med.name}</span>
                                <span className="text-gray-600">{med.dosage} - {med.frequency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Behavioral Notes */}
                      {cr.behavioralNotes.length > 0 && (
                        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg mb-4">
                          <p className="text-xs text-amber-700 font-medium mb-2">Behavioral Notes</p>
                          <ul className="text-sm space-y-1">
                            {cr.behavioralNotes.map((note, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Dietary */}
                      {cr.dietaryRestrictions.length > 0 && (
                        <div className="p-4 border rounded-lg mb-4">
                          <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                            <Utensils className="h-3 w-3" />
                            Dietary Restrictions
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {cr.dietaryRestrictions.map((d, i) => (
                              <Badge key={i} variant="outline">{d}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Routine */}
                      {cr.preferredRoutine && (
                        <div className="p-4 border rounded-lg mb-4">
                          <p className="text-xs text-gray-500 font-medium mb-2">Preferred Routine</p>
                          <p className="text-sm">{cr.preferredRoutine}</p>
                        </div>
                      )}

                      {/* Do Not Do */}
                      {cr.doNotDoList.length > 0 && (
                        <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
                          <p className="text-xs text-red-700 font-bold mb-2 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            DO NOT DO LIST
                          </p>
                          <ul className="text-sm space-y-1">
                            {cr.doNotDoList.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-red-800">
                                <X className="h-3 w-3" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Care Preferences */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Care Preferences
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Preferred Caregiver Gender</p>
                          <p className="text-sm font-medium">{cr.preferredCaregiverGender}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Preferred Languages</p>
                          <p className="text-sm font-medium">{cr.preferredLanguages.join(', ')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-gray-500 mb-2">Service Types Needed</p>
                          <div className="flex gap-2">
                            {cr.serviceTypesNeeded.map((s) => (
                              <Badge key={s} variant={s === 'CNA' ? 'default' : 'secondary'}>{s}</Badge>
                            ))}
                          </div>
                        </div>
                        {cr.hhaTasks.length > 0 && (
                          <div className="p-4 border rounded-lg">
                            <p className="text-xs text-gray-500 mb-2">HHA Tasks Needed</p>
                            <div className="flex gap-1 flex-wrap">
                              {cr.hhaTasks.map((t) => (
                                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Preferred Caregivers */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-green-200 rounded-lg">
                          <p className="text-xs text-green-700 font-medium mb-2">Preferred Caregivers</p>
                          {cr.preferredCaregivers.length > 0 ? (
                            <div className="flex gap-2 flex-wrap">
                              {cr.preferredCaregivers.map((cg) => (
                                <div key={cg.id} className="flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-200 rounded-full">
                                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-xs font-medium text-green-700">
                                    {cg.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="text-sm text-green-800">{cg.name}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400">None specified</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">System will prioritize these caregivers during assignment</p>
                        </div>
                        <div className="p-4 border border-red-200 rounded-lg">
                          <p className="text-xs text-red-700 font-medium mb-2">Blocked Caregivers</p>
                          {cr.blockedCaregivers.length > 0 ? (
                            <div className="space-y-2">
                              {cr.blockedCaregivers.map((cg) => (
                                <div key={cg.id} className="flex items-center gap-2">
                                  <div className="flex items-center gap-2 px-2 py-1 bg-red-50 border border-red-200 rounded-full">
                                    <Lock className="h-3 w-3 text-red-500" />
                                    <span className="text-sm text-red-800">{cg.name}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">({cg.reason})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400">None blocked</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">System will exclude these caregivers from assignment</p>
                        </div>
                      </div>
                    </div>

                    {/* Active Services */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Active Services</h4>
                      {cr.hasActiveServices ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">This care recipient has active services. Last service: {cr.lastServiceDate}</p>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 border rounded-lg flex items-center justify-between">
                          <p className="text-sm text-gray-600">No active services</p>
                          <Button size="sm" className="bg-[#B91C4E] hover:bg-[#9E1842]">
                            <Plus className="h-4 w-4 mr-2" />
                            Book a Service for {cr.fullName.split(' ')[0]}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* TAB 3: BOOKINGS */}
              <TabsContent value="bookings" className="space-y-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-5 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{client.totalBookings}</p>
                    <p className="text-xs text-gray-600">Total Bookings</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{client.completedBookings}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{client.cancelledBookings}</p>
                    <p className="text-xs text-gray-600">Cancelled</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">{client.disputedBookings}</p>
                    <p className="text-xs text-gray-600">Disputed</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">${client.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Total Spent</p>
                  </Card>
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Care Recipient</TableHead>
                        <TableHead>Caregiver</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        clientBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <Link href={`/bookings/${booking.id}`} className="text-[#B91C4E] hover:underline font-mono text-sm">
                                {booking.id}
                              </Link>
                            </TableCell>
                            <TableCell>{booking.clientName}</TableCell>
                            <TableCell>{booking.caregiverName || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={booking.serviceType === 'CNA' ? 'default' : 'secondary'}>
                                {booking.serviceType}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                            <TableCell>{booking.totalHours}h</TableCell>
                            <TableCell className="font-medium">${booking.finalRate}</TableCell>
                            <TableCell>
                              <Badge className={BOOKING_STATUS_COLORS[booking.status] || 'bg-gray-100'}>
                                {booking.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* TAB 4: CARE PLANS */}
              <TabsContent value="careplans" className="space-y-6">
                {client.carePlanIds.length === 0 ? (
                  <Card className="p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Care Plans</h3>
                    <p className="text-gray-600 mb-4">This client does not have any care plans yet.</p>
                    <Button className="bg-[#B91C4E] hover:bg-[#9E1842]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Care Plan
                    </Button>
                  </Card>
                ) : (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Care Plan ID</TableHead>
                          <TableHead>Care Recipient</TableHead>
                          <TableHead>Active Services</TableHead>
                          <TableHead>Total Cost/hr</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {client.carePlanIds.map((planId) => (
                          <TableRow key={planId}>
                            <TableCell>
                              <Link href={`/care-plans/${planId}`} className="text-[#B91C4E] hover:underline font-mono">
                                {planId}
                              </Link>
                            </TableCell>
                            <TableCell>Robert Doe</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>$112/hr</TableCell>
                            <TableCell>Mar 20, 2024</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </TabsContent>

              {/* TAB 5: BILLING */}
              <TabsContent value="billing" className="space-y-6">
                {/* Outstanding Balance Alert */}
                {client.outstandingBalance > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-900">Outstanding Balance: ${client.outstandingBalance}</p>
                        <p className="text-sm text-red-700">Client has unpaid amounts</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                        <Send className="h-4 w-4 mr-2" />
                        Request Payment
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                        Write Off Balance
                      </Button>
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Payment Methods</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {client.paymentMethods.map((pm) => (
                      <div key={pm.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <CreditCard className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{pm.type} ****{pm.last4}</p>
                            {pm.expiryDate && <p className="text-sm text-gray-500">Expires {pm.expiryDate}</p>}
                          </div>
                          {pm.isDefault && <Badge className="bg-blue-100 text-blue-800">Default</Badge>}
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Billing History */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Billing History</h3>
                    <div className="flex gap-2">
                      <p className="text-sm text-gray-600">
                        Total Paid: <span className="font-medium">${client.totalSpent.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.billingHistory.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>{new Date(bill.processedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Link href={`/bookings/${bill.bookingId}`} className="text-[#B91C4E] hover:underline font-mono text-sm">
                              {bill.bookingId}
                            </Link>
                          </TableCell>
                          <TableCell>{bill.description}</TableCell>
                          <TableCell className="font-medium">${bill.amount}</TableCell>
                          <TableCell>{bill.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge className={
                              bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              bill.status === 'Refunded' ? 'bg-blue-100 text-blue-800' :
                              bill.status === 'Failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {bill.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                {/* Issue Manual Refund */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Refund History</h3>
                  <p className="text-sm text-gray-600 mb-4">No refunds issued for this client.</p>
                  <Button variant="outline">Issue Manual Refund</Button>
                </Card>
              </TabsContent>

              {/* TAB 6: DISPUTES */}
              <TabsContent value="disputes" className="space-y-6">
                {client.disputedBookings > 0 && client.disputedBookings >= 3 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <p className="text-amber-900">High dispute frequency — review this client&apos;s history</p>
                  </div>
                )}

                {client.disputedBookings === 0 ? (
                  <Card className="p-12 text-center">
                    <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Disputes</h3>
                    <p className="text-gray-600">This client has not opened any disputes.</p>
                  </Card>
                ) : (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dispute ID</TableHead>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Caregiver</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date Opened</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Resolution</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-mono">DISP001</TableCell>
                          <TableCell>
                            <Link href="/bookings/BK008" className="text-[#B91C4E] hover:underline">BK008</Link>
                          </TableCell>
                          <TableCell>Emily Chen</TableCell>
                          <TableCell>Quality of Service</TableCell>
                          <TableCell>Apr 15, 2024</TableCell>
                          <TableCell>
                            <Badge className="bg-amber-100 text-amber-800">Under Review</Badge>
                          </TableCell>
                          <TableCell>—</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </TabsContent>

              {/* TAB 7: REVIEWS */}
              <TabsContent value="reviews" className="space-y-6">
                {/* Reviews Given */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Reviews Given by Client</h3>
                  {client.reviewsGiven.length === 0 ? (
                    <p className="text-gray-500">No reviews given yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {client.reviewsGiven.map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.caregiverName}</span>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-4 w-4 fill-yellow-500" />
                                <span className="text-sm font-medium">{review.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{new Date(review.submittedAt).toLocaleDateString()}</span>
                              {review.flagged && <Badge className="bg-red-100 text-red-800">Flagged</Badge>}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{review.reviewText}</p>
                          <div className="mt-2 flex gap-2">
                            <Button variant="ghost" size="sm" className="text-amber-600">Flag Review</Button>
                            <Button variant="ghost" size="sm" className="text-red-600">Remove Review</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-4">Average rating given: <span className="font-medium">{client.avgRatingGiven > 0 ? client.avgRatingGiven.toFixed(1) : 'N/A'}</span></p>
                </Card>

                {/* Reviews Received from Caregivers */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Reviews from Caregivers</h3>
                  <p className="text-xs text-gray-500 mb-4">These notes are visible to admin only</p>
                  {client.reviewsReceived.length === 0 ? (
                    <p className="text-gray-500">No reviews received yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {client.reviewsReceived.map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.caregiverName}</span>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-4 w-4 fill-yellow-500" />
                                <span className="text-sm font-medium">{review.rating}</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{new Date(review.submittedAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700">{review.notes}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-4">Average rating received: <span className="font-medium">{client.avgRatingReceived > 0 ? client.avgRatingReceived.toFixed(1) : 'N/A'}</span></p>
                  {client.avgRatingReceived > 0 && client.avgRatingReceived < 3.5 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        Low client rating from caregivers - consider flagging for admin review
                      </p>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* TAB 8: COMMUNICATIONS */}
              <TabsContent value="comms" className="space-y-6">
                {/* Notification Preferences */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(client.notificationPreferences).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Communication History */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Communication History</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Send Manual Notification
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Notification</DialogTitle>
                          <DialogDescription>Send a custom message to this client</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Channel</Label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                              <option>App</option>
                              <option>SMS</option>
                              <option>Email</option>
                            </select>
                          </div>
                          <div>
                            <Label>Subject</Label>
                            <Input placeholder="Enter subject" className="mt-1" />
                          </div>
                          <div>
                            <Label>Message</Label>
                            <Textarea placeholder="Enter message" className="mt-1" rows={4} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button className="bg-[#B91C4E] hover:bg-[#9E1842]">Send</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Subject / Preview</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.communications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No communications yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        client.communications.map((comm) => (
                          <TableRow key={comm.id}>
                            <TableCell>{new Date(comm.sentAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{comm.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                comm.channel === 'App' ? 'bg-purple-50 text-purple-700' :
                                comm.channel === 'SMS' ? 'bg-blue-50 text-blue-700' :
                                'bg-green-50 text-green-700'
                              }>
                                {comm.channel}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{comm.subject}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{comm.preview}</p>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                comm.status === 'Read' ? 'bg-green-100 text-green-800' :
                                comm.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {comm.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* TAB 9: FLAGS & RISK */}
              <TabsContent value="flags" className="space-y-6">
                {/* Current Flags */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Current Flags</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Flag className="h-4 w-4 mr-2" />
                          Add Flag
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Flag</DialogTitle>
                          <DialogDescription>Flag this client account for review</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Flag Type</Label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                              <option>Payment Default</option>
                              <option>Abusive Behavior</option>
                              <option>Fraudulent Activity</option>
                              <option>High Dispute Rate</option>
                              <option>Identity Concern</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div>
                            <Label>Reason</Label>
                            <Textarea placeholder="Describe the reason for flagging" className="mt-1" rows={3} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button className="bg-red-600 hover:bg-red-700">Add Flag</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {client.flags.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p>No flags on this account</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {client.flags.map((flag) => (
                        <div key={flag.id} className={`p-4 border rounded-lg ${flag.status === 'Active' ? 'border-red-200 bg-red-50' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Flag className={`h-5 w-5 ${flag.status === 'Active' ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                              <div>
                                <p className="font-medium">{flag.type}</p>
                                <p className="text-sm text-gray-600">{flag.reason}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Flagged by {flag.flaggedBy} on {new Date(flag.flaggedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={flag.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                                {flag.status}
                              </Badge>
                              {flag.status === 'Active' && (
                                <Button variant="outline" size="sm">Resolve Flag</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Risk Score */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Score</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={
                      client.riskScore === 'Low' ? 'bg-green-100 text-green-800 text-lg px-4 py-2' :
                      client.riskScore === 'Medium' ? 'bg-amber-100 text-amber-800 text-lg px-4 py-2' :
                      'bg-red-100 text-red-800 text-lg px-4 py-2'
                    }>
                      {client.riskScore} Risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-sm text-gray-500">Dispute Rate</p>
                      <p className="text-lg font-medium">{client.totalBookings > 0 ? ((client.disputedBookings / client.totalBookings) * 100).toFixed(0) : 0}%</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-sm text-gray-500">Cancellation Rate</p>
                      <p className="text-lg font-medium">{client.totalBookings > 0 ? ((client.cancelledBookings / client.totalBookings) * 100).toFixed(0) : 0}%</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-sm text-gray-500">Payment Failures</p>
                      <p className="text-lg font-medium">{client.billingHistory.filter(b => b.status === 'Failed').length}</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-sm text-gray-500">Active Flags</p>
                      <p className="text-lg font-medium">{client.flags.filter(f => f.status === 'Active').length}</p>
                    </div>
                  </div>
                </Card>

                {/* Account Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
                  <p className="text-sm text-gray-500 mb-4">All actions are audit-logged with admin name and timestamp</p>
                  <div className="flex gap-3">
                    {client.status === 'Suspended' && (
                      <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                        <Check className="h-4 w-4 mr-2" />
                        Reactivate Account
                      </Button>
                    )}
                    {client.status === 'Active' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Suspend Account</DialogTitle>
                            <DialogDescription>
                              Client will not be able to place new bookings. Existing bookings remain active.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Reason</Label>
                              <Textarea placeholder="Enter reason for suspension" className="mt-1" rows={3} />
                            </div>
                            <div>
                              <Label>Duration</Label>
                              <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                                <option>7 days</option>
                                <option>14 days</option>
                                <option>30 days</option>
                                <option>Indefinite</option>
                              </select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button className="bg-amber-600 hover:bg-amber-700">Suspend Account</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    {client.status !== 'Blocked' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <Ban className="h-4 w-4 mr-2" />
                            Block Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Block Account</DialogTitle>
                            <DialogDescription>
                              Full access will be revoked. All pending bookings will be cancelled with refund processing.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Reason (required)</Label>
                              <Textarea placeholder="Enter reason for blocking" className="mt-1" rows={3} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button className="bg-red-600 hover:bg-red-700">Block Account</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
