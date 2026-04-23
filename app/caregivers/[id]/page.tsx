'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCaregivers } from '@/lib/hooks/use-data'
import { ArrowLeft, Mail, Phone, Calendar, Star, AlertCircle, Send, MessageSquare, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CaregiverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { getCaregiverById } = useCaregivers()
  const caregiver = getCaregiverById(id)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, role: 'caregiver', text: 'Hello, I have a question about my booking tomorrow.', time: '09:30 AM' },
    { id: 2, role: 'admin', text: 'Hi! Sure, what do you need to know?', time: '09:35 AM' },
    { id: 3, role: 'caregiver', text: 'I wanted to confirm if I need to bring any specific medical supplies for CR001.', time: '09:40 AM' },
  ])
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  if (!caregiver) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Caregiver not found</p>
      </div>
    )
  }

  const getStrikeIndicator = (strikes: number) => {
    const dots = []
    for (let i = 0; i < 3; i++) {
      dots.push(
        <span key={i} className={`inline-block w-3 h-3 rounded-full mx-1 ${i < strikes ? 'bg-red-600' : 'bg-gray-300'
          }`} />
      )
    }
    return dots
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setIsSending(true)
    
    // Add admin message
    const newMsg = {
      id: messages.length + 1,
      role: 'admin',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMsg])
    setMessage('')
    
    // Simulate message sending and caregiver reply
    setTimeout(() => {
      setIsSending(false)
      
      // Simulated reply
      const reply = {
        id: messages.length + 2,
        role: 'caregiver',
        text: "Thanks for the info! I'll make sure to double check the care plan details before arriving.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, reply])
      
      toast.success("Message delivered", {
        description: `${caregiver.name} is typing a response...`,
      })
    }, 1500)
  }

  const completionRate = caregiver.totalBookings > 0 ?
    ((caregiver.totalBookings - caregiver.activeBookings) / caregiver.totalBookings * 100).toFixed(0) : 0

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <Link href="/caregivers">
            <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Caregivers
            </Button>
          </Link>
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-rose-50 data-[state=active]:text-[#B91C4E]">Overview</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-rose-50 data-[state=active]:text-[#B91C4E] flex gap-2">
              Messages
              <Badge className="h-4 px-1 bg-[#B91C4E] text-[10px]">1</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{caregiver.name}</h1>
                <p className="text-gray-600 mt-1">{caregiver.email}</p>
              </div>
              <Badge variant={caregiver.status === 'Active' ? 'default' : 'secondary'}>
                {caregiver.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Service Types</p>
                  <div className="mt-1 flex gap-1 flex-wrap">
                    {caregiver.serviceTypes.map((type) => (
                      <Badge key={type} variant={type === 'CNA' ? 'default' : 'secondary'}>
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p>{caregiver.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm">{caregiver.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p>{new Date(caregiver.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Organization Info */}
          {caregiver.organizationId && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Organization</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Organization Name</p>
                  <p className="font-medium mt-1">{caregiver.organizationName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-sm mt-1">{new Date(caregiver.joinedDate).toLocaleDateString()}</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Org-Affiliated</Badge>
              </div>
            </Card>
          )}

          {/* Service Capabilities */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Service Capabilities</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <input type="checkbox" checked={caregiver.serviceTypes.includes('CNA')} readOnly className="mr-3" />
                  <span className="font-medium">CNA (Certified Nursing Assistant)</span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <input type="checkbox" checked={caregiver.serviceTypes.includes('HHA')} readOnly className="mr-3" />
                  <span className="font-medium">HHA (Home Health Aide)</span>
                </div>
                <Badge variant={caregiver.serviceTypes.includes('HHA') ? 'default' : 'secondary'}>
                  {caregiver.serviceTypes.includes('HHA') ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Certifications */}
          {caregiver.certifications.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Certifications</h2>
              <div className="space-y-3">
                {caregiver.certifications.map((cert) => (
                  <div key={cert.id} className="p-3 border rounded">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{cert.type}</p>
                        <p className="text-sm text-gray-600">{cert.issuedBy}</p>
                        <p className="text-xs text-gray-500 mt-1">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={cert.isExpired ? 'destructive' : 'default'}>
                        {cert.isExpired ? 'Expired' : 'Valid'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-rose-50 rounded-lg border border-rose-100">
                <p className="text-2xl font-bold text-[#B91C4E]">{caregiver.totalBookings}</p>
                <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{caregiver.rating.toFixed(1)}</p>
                <p className="text-sm text-gray-600 mt-1">Average Rating</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Strikes */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              {caregiver.strikeCount >= 2 && <AlertCircle className="h-5 w-5 text-red-500 mr-2" />}
              Strike Status
            </h3>
            <div className="mb-4 flex gap-1">
              {getStrikeIndicator(caregiver.strikeCount)}
            </div>
            <p className="text-sm text-gray-600 mb-4">{caregiver.strikeCount} of 3 strikes</p>
            {caregiver.strikeCount >= 2 && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-700">
                  This caregiver is at risk of deactivation with one more strike.
                </p>
              </div>
            )}
            {caregiver.strikeCount === 3 && (
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                Caregiver Terminated
              </Button>
            )}
          </Card>

          {/* Strike History */}
          {caregiver.strikeHistory.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-3">Strike History</h3>
              <div className="space-y-2 text-sm">
                {caregiver.strikeHistory.map((strike) => (
                  <div key={strike.id} className="p-2 border-l-2 border-red-500 bg-red-50 rounded">
                    <p className="font-medium text-red-900">Strike {strike.strikeNumber}</p>
                    <p className="text-xs text-red-700">{strike.reason}</p>
                    <p className="text-xs text-red-600 mt-1">{new Date(strike.appliedAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full hover:bg-gray-100 text-gray-700">
                Edit Profile
              </Button>
              <Link href="/bookings" className="block w-full">
                <Button variant="outline" className="w-full hover:bg-gray-100 text-gray-700">
                  View Bookings
                </Button>
              </Link>
              <Button 
                onClick={() => setActiveTab('messages')}
                className="w-full bg-[#B91C4E] hover:bg-[#a01844] text-white shadow-sm transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Go to Message Center
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </TabsContent>

    <TabsContent value="messages" className="mt-0">
      <Card className="h-[calc(100vh-250px)] flex flex-col overflow-hidden border-none shadow-xl">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-rose-100">
              <AvatarFallback className="bg-rose-50 text-[#B91C4E] font-bold">
                {caregiver.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-gray-900">{caregiver.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-500">Active now</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon-sm" className="rounded-full">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon-sm" className="rounded-full">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Message Area */}
        <ScrollArea className="flex-1 bg-slate-50/50 p-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Badge variant="outline" className="bg-white text-gray-400 font-normal">
                Yesterday, 09:30 AM
              </Badge>
            </div>
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] space-y-1`}>
                  <div 
                    className={`p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'admin' 
                        ? 'bg-[#B91C4E] text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-gray-400 ${msg.role === 'admin' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            
            {isSending && (
              <div className="flex justify-end">
                <div className="bg-rose-50 border border-rose-100 p-2 rounded-lg flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#B91C4E] rounded-full animate-bounce" />
                  <span className="h-2 w-2 bg-[#B91C4E] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 bg-[#B91C4E] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:border-[#B91C4E] transition-colors">
              <Textarea 
                placeholder="Type your message..."
                className="min-h-[40px] max-h-[120px] border-none focus-visible:ring-0 shadow-none resize-none bg-transparent py-1 px-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as any);
                  }
                }}
              />
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-[#B91C4E] hover:bg-[#a01844] text-white flex-shrink-0 mb-1"
              disabled={isSending || !message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </Card>
    </TabsContent>
  </Tabs>
</div>
  )
}
