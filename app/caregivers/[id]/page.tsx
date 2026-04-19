'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCaregivers } from '@/lib/hooks/use-data'
import { ArrowLeft, Mail, Phone, Calendar, Star, AlertCircle } from 'lucide-react'

export default function CaregiverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { getCaregiverById } = useCaregivers()
  const caregiver = getCaregiverById(id)

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
        <span key={i} className={`inline-block w-3 h-3 rounded-full mx-1 ${
          i < strikes ? 'bg-red-600' : 'bg-gray-300'
        }`} />
      )
    }
    return dots
  }

  const completionRate = caregiver.totalBookings > 0 ? 
    ((caregiver.totalBookings - caregiver.activeBookings) / caregiver.totalBookings * 100).toFixed(0) : 0

  return (
    <div className="space-y-6">
      <Link href="/caregivers">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Caregivers
        </Button>
      </Link>

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
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{caregiver.totalBookings}</p>
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
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full">
                View Bookings
              </Button>
              <Button variant="outline" className="w-full">
                Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
