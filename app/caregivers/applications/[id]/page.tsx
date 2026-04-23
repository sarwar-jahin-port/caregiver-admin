'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCaregiverApplications } from '@/lib/hooks/use-data'
import { ArrowLeft, Mail, Phone, Calendar, FileCheck, AlertCircle, CheckCircle, MessageSquare, Clock, UserCheck, UserX } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { getApplicationById, updateStage, updateApplication } = useCaregiverApplications()
  const application = getApplicationById(id)

  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false)
  const [isScheduleInterviewOpen, setIsScheduleInterviewOpen] = useState(false)
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false)
  const [isActionConfirmOpen, setIsActionConfirmOpen] = useState(false)
  
  const [isInterviewResultOpen, setIsInterviewResultOpen] = useState(false)
  
  const [requestNotes, setRequestNotes] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [interviewNotes, setInterviewNotes] = useState('')
  const [messageText, setMessageText] = useState('')
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null)
  const [actionNotes, setActionNotes] = useState('')

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Application not found</p>
      </div>
    )
  }

  const handleRequestInfo = () => {
    updateStage(id, application.currentStage, 'In Progress', `Requested info: ${requestNotes}`)
    toast.success("Requests for information sent to applicant")
    setIsRequestInfoOpen(false)
    setRequestNotes('')
  }

  const handleScheduleInterview = () => {
    const scheduledAt = `${interviewDate}T${interviewTime}`
    updateApplication(id, { interviewScheduledAt: scheduledAt })
    updateStage(id, 'Interview Scheduled', 'In Progress', `Interview scheduled for ${new Date(scheduledAt).toLocaleString()}`)
    toast.success("Interview scheduled successfully")
    setIsScheduleInterviewOpen(false)
  }

  const handleRecordInterview = () => {
    updateApplication(id, { interviewNotes, interviewedBy: 'Admin' })
    updateStage(id, 'Interview Completed', 'Completed', interviewNotes)
    toast.success("Interview results recorded")
    setIsInterviewResultOpen(false)
    setInterviewNotes('')
  }

  const handleSendMessage = () => {
    toast.success("Message sent to " + application.applicantName)
    setIsSendMessageOpen(false)
    setMessageText('')
  }

  const handleFinalAction = () => {
    if (actionType === 'Approve') {
      updateStage(id, 'Approved', 'Completed', actionNotes)
      toast.success("Caregiver has been enrolled successfully!")
    } else if (actionType === 'Reject') {
      updateStage(id, 'Rejected', 'Rejected', actionNotes)
      updateApplication(id, { rejectionReason: actionNotes })
      toast.error("Application has been rejected")
    }
    setIsActionConfirmOpen(false)
    setActionNotes('')
  }

  const getStageColor = (status: 'Completed' | 'In Progress' | 'Pending' | 'Rejected') => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300'
    }
  }

  const completedStages = application.stageHistory.filter(s => s.status === 'Completed').length
  const totalStages = application.stageHistory.length

  return (
    <div className="space-y-6">
      <Link href="/caregivers/applications">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{application.applicantName}</h1>
                <p className="text-gray-600 mt-1">Application ID: {application.id}</p>
              </div>
              <Badge className={application.currentStage === 'Approved' ? 'bg-green-100 text-green-800' : application.currentStage === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-rose-100 text-[#B91C4E]'}>
                {application.currentStage}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <div className="flex items-center mt-2">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm">{application.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <div className="flex items-center mt-2">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm">{application.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Applied</p>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm">{new Date(application.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Requested Services */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Requested Services</h2>
            <div className="flex gap-2">
              {application.requestedServiceTypes.map((type) => (
                <Badge key={type} variant={type === 'CNA' ? 'default' : 'secondary'} className="text-sm">
                  {type}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Application Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Application Timeline</h2>
            <div className="space-y-4">
              {application.stageHistory.map((stage, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.status === 'Completed' ? 'bg-green-100' : stage.status === 'Rejected' ? 'bg-red-100' : stage.status === 'In Progress' ? 'bg-rose-50' : 'bg-gray-100'
                    }`}>
                      {stage.status === 'Completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : stage.status === 'Rejected' ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    {index < application.stageHistory.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{stage.stage}</p>
                      <Badge className={getStageColor(stage.status)} variant="outline">{stage.status}</Badge>
                    </div>
                    {stage.completedAt && (
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(stage.completedAt).toLocaleString()}
                      </p>
                    )}
                    {stage.notes && (
                      <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                        {stage.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          {application.documents.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileCheck className="h-5 w-5 mr-2" />
                Documents
              </h2>
              <div className="space-y-2">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-600">{doc.type}</p>
                    </div>
                    <Badge variant={doc.status === 'Verified' ? 'default' : doc.status === 'Rejected' ? 'destructive' : 'secondary'}>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Interview Details */}
          {(application.interviewScheduledAt || application.interviewNotes) && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#B91C4E]" />
                Interview Details
              </h2>
              <div className="space-y-4">
                {application.interviewScheduledAt && (
                  <div className="p-4 bg-rose-50/50 rounded border border-rose-100">
                    <p className="text-sm font-semibold text-rose-900">Scheduled for:</p>
                    <p className="text-lg text-[#B91C4E]">{new Date(application.interviewScheduledAt).toLocaleString()}</p>
                  </div>
                )}
                {application.interviewNotes && (
                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Interview Notes:</p>
                    <p className="text-gray-700">{application.interviewNotes}</p>
                    {application.interviewedBy && (
                      <p className="text-xs text-gray-500 mt-3 italic">Interviewed by: {application.interviewedBy}</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Rejection Reason */}
          {application.rejectionReason && (
            <Card className="p-6 border-red-200 bg-red-50/30">
              <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Rejection Reason
              </h2>
              <div className="p-4 bg-white rounded border border-red-200 text-red-800">
                <p>{application.rejectionReason}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Overall Completion</p>
                  <span className="text-sm font-bold">{application.onboardingProgress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B91C4E] transition-all"
                    style={{ width: `${application.onboardingProgress}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">{completedStages} of {totalStages} stages completed</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Application Actions</h3>
            <div className="space-y-3">
              {application.currentStage !== 'Approved' && application.currentStage !== 'Rejected' && (
                <>
                  {/* Primary Decisions (Enroll/Reject) - Show more prominently after interview */}
                  {(application.currentStage === 'Interview Completed' || application.currentStage === 'Final Review') && (
                    <div className="space-y-2 pb-2 border-b">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 h-11 text-lg"
                        onClick={() => {
                          setActionType('Approve')
                          setIsActionConfirmOpen(true)
                        }}
                      >
                        <UserCheck className="w-5 h-5 mr-2" />
                        Enroll Caregiver
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setActionType('Reject')
                          setIsActionConfirmOpen(true)
                        }}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Reject Application
                      </Button>
                    </div>
                  )}

                  {/* Interview Actions */}
                  {application.currentStage === 'Interview Scheduled' && (
                    <Button 
                      className="w-full bg-[#B91C4E] hover:bg-[#A01844]"
                      onClick={() => setIsInterviewResultOpen(true)}
                    >
                      <FileCheck className="w-4 h-4 mr-2" />
                      Record Interview Result
                    </Button>
                  )}

                  {(application.currentStage !== 'Interview Scheduled' && 
                    application.currentStage !== 'Interview Completed' && 
                    application.currentStage !== 'Final Review') && (
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsScheduleInterviewOpen(true)}>
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsRequestInfoOpen(true)}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Request More Info
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full justify-start" onClick={() => setIsSendMessageOpen(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>

              {application.currentStage === 'Approved' && (
                <div className="p-4 bg-green-50 rounded border border-green-200 flex flex-col items-center text-center text-green-800">
                  <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
                  <span className="font-bold text-lg">Applicant Enrolled</span>
                  <p className="text-sm mt-1">This caregiver is now active in the system.</p>
                </div>
              )}
              
              {application.currentStage === 'Rejected' && (
                <div className="p-4 bg-red-50 rounded border border-red-200 flex flex-col items-center text-center text-red-800">
                  <AlertCircle className="w-8 h-8 mb-2 text-red-600" />
                  <span className="font-bold text-lg">Application Rejected</span>
                  <p className="text-sm mt-1">Status has been updated to Rejected.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Background Check */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Background Check</h3>
            <Badge className={
              application.backgroundCheckStatus === 'Passed' ? 'bg-green-100 text-green-800' :
              application.backgroundCheckStatus === 'Failed' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }>
              {application.backgroundCheckStatus}
            </Badge>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      
      {/* Interview Result Dialog */}
      <Dialog open={isInterviewResultOpen} onOpenChange={setIsInterviewResultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Interview Result</DialogTitle>
            <DialogDescription>
              Enter the notes from the interview with {application.applicantName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="interview-notes">Interview Notes</Label>
              <Textarea 
                id="interview-notes" 
                placeholder="Ex: Candidate has great experience with elderly care. Very professional..." 
                className="min-h-[150px]"
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInterviewResultOpen(false)}>Cancel</Button>
            <Button onClick={handleRecordInterview} disabled={!interviewNotes.trim()} className="bg-[#B91C4E] hover:bg-[#A01844] text-white">Complete Interview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Request Info Dialog */}
      <Dialog open={isRequestInfoOpen} onOpenChange={setIsRequestInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>
              Send a request to the applicant to provide additional details or documents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">What information is needed?</Label>
              <Textarea 
                id="notes" 
                placeholder="Ex: Please upload your HHA certification or provide a third reference." 
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestInfoOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestInfo} disabled={!requestNotes.trim()} className="bg-[#B91C4E] hover:bg-[#A01844] text-white">Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={isScheduleInterviewOpen} onOpenChange={setIsScheduleInterviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set a date and time for the caregiver interview.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input type="date" id="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input type="time" id="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleInterviewOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleInterview} disabled={!interviewDate || !interviewTime} className="bg-[#B91C4E] hover:bg-[#A01844] text-white">Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={isSendMessageOpen} onOpenChange={setIsSendMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to Applicant</DialogTitle>
            <DialogDescription>
              The message will be sent to {application.email} and appearing in their portal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Type your message here..." 
                className="min-h-[150px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendMessageOpen(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="bg-[#B91C4E] hover:bg-[#A01844] text-white">Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Confirmation Dialog */}
      <Dialog open={isActionConfirmOpen} onOpenChange={setIsActionConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={actionType === 'Approve' ? 'text-green-700' : 'text-red-700'}>
              {actionType === 'Approve' ? 'Confirm Enrollment' : 'Confirm Rejection'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType?.toLowerCase()} this application? This action will notify the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="action-notes">Notes / Reason</Label>
              <Textarea 
                id="action-notes" 
                placeholder={actionType === 'Approve' ? "Add any onboarding notes..." : "Reason for rejection..."} 
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionConfirmOpen(false)}>Cancel</Button>
            <Button 
              className={actionType === 'Approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={handleFinalAction}
              disabled={actionType === 'Reject' && !actionNotes.trim()}
            >
              Confirm {actionType === 'Approve' ? 'Enrollment' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
