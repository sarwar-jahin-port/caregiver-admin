'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCaregiverApplications } from '@/lib/hooks/use-data'
import { ArrowLeft, Mail, Phone, Calendar, FileCheck, AlertCircle, CheckCircle } from 'lucide-react'

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { getApplicationById } = useCaregiverApplications()
  const application = getApplicationById(id)

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Application not found</p>
      </div>
    )
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
              <Badge className={application.currentStage === 'Approved' ? 'bg-green-100 text-green-800' : application.currentStage === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
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
                      stage.status === 'Completed' ? 'bg-green-100' : stage.status === 'Rejected' ? 'bg-red-100' : stage.status === 'In Progress' ? 'bg-blue-100' : 'bg-gray-100'
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
                        {new Date(stage.completedAt).toLocaleDateString()}
                      </p>
                    )}
                    {stage.notes && (
                      <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded mt-2">
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

          {/* Interview Notes */}
          {application.interviewNotes && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Interview Notes</h2>
              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <p className="text-gray-700">{application.interviewNotes}</p>
                {application.interviewedBy && (
                  <p className="text-xs text-gray-600 mt-3">Interviewed by: {application.interviewedBy}</p>
                )}
              </div>
            </Card>
          )}

          {/* Rejection Reason */}
          {application.rejectionReason && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Rejection Reason</h2>
              <div className="p-4 bg-red-50 rounded border border-red-200">
                <p className="text-gray-700">{application.rejectionReason}</p>
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
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${application.onboardingProgress}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">{completedStages} of {totalStages} stages completed</p>
              </div>
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

          {/* References */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">References</h3>
            <p className="text-2xl font-bold text-blue-600">{application.referencesProvided}</p>
            <p className="text-sm text-gray-600 mt-1">References provided</p>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {application.currentStage !== 'Approved' && application.currentStage !== 'Rejected' && (
                <>
                  <Button variant="default" className="w-full">
                    Move to Next Stage
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request More Info
                  </Button>
                </>
              )}
              {application.currentStage === 'Final Review' && (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Approve Application
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-200">
                    Reject Application
                  </Button>
                </>
              )}
              <Button variant="outline" className="w-full">
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full">
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
