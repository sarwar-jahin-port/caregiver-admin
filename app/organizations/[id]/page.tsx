'use client'

import React from 'react'
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
import { useOrganizations, useCaregivers, useBookings } from '@/lib/hooks/use-data'
import { ArrowLeft, Phone, Mail, MapPin, Users, BookOpen, Award, Calendar } from 'lucide-react'

export default function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { getOrganizationById } = useOrganizations()
  const { caregivers } = useCaregivers()
  const { bookings } = useBookings()
  const [activeTab, setActiveTab] = useState<'overview' | 'caregivers' | 'applications' | 'bookings' | 'certifications'>('overview')

  const org = getOrganizationById(id)
  const orgCaregivers = caregivers.filter((c) => c.organizationId === org?.id)
  const orgBookings = bookings.filter((b) => b.organizationId === org?.id)

  if (!org) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Organization not found</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'caregivers', label: `Caregivers (${orgCaregivers.length})` },
    { id: 'applications', label: 'Applications' },
    { id: 'bookings', label: `Bookings (${orgBookings.length})` },
    { id: 'certifications', label: 'Certifications' },
  ] as const

  return (
    <div className="space-y-6">
      <Link href="/organizations">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
      </Link>

      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{org.name}</h1>
          </div>
          <Badge variant={org.status === 'Active' ? 'default' : 'secondary'}>
            {org.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm font-medium text-gray-600">Contact</p>
            <p className="mt-1 font-medium">Contact Name</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Phone</p>
            <div className="flex items-center mt-1">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <p>{org.contactInfo.phone}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <div className="flex items-center mt-1">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm">{org.contactInfo.email}</p>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-medium text-gray-600">Location</p>
            <div className="flex items-start mt-1">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{org.contactInfo.address}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Caregivers</p>
              <p className="text-3xl font-bold mt-2">{org.activeCaregivers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Caregivers</p>
              <p className="text-3xl font-bold mt-2">{org.totalCaregivers}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issued Certs</p>
              <p className="text-3xl font-bold mt-2">{org.certificationsIssued}</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">About Organization</h3>
                <p className="text-gray-600">{org.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Contact Person</h3>
                  <p className="text-gray-600">{org.contactInfo.name}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Founded Date</h3>
                  <p className="text-gray-600">{new Date(org.foundedDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <h4 className="font-medium text-blue-900 mb-2">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>Total Bookings: {org.totalBookings}</div>
                  <div>Certs Issued: {org.certificationsIssued}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'caregivers' && (
            <div className="space-y-4">
              {orgCaregivers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No caregivers affiliated with this organization</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Service Types</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Strikes</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgCaregivers.map((cg) => (
                        <TableRow key={cg.id}>
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
                            <Badge variant={cg.status === 'Active' ? 'default' : 'secondary'}>
                              {cg.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < cg.strikeCount ? 'bg-red-600' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{cg.rating.toFixed(1)} ★</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/caregivers/${cg.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <p>No pending applications</p>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {orgBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No bookings for this organization</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-sm">{booking.id.slice(0, 8)}</TableCell>
                          <TableCell className="font-medium">{booking.clientName}</TableCell>
                          <TableCell>
                            <Badge variant={booking.serviceType === 'CNA' ? 'default' : 'secondary'}>
                              {booking.serviceType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={booking.status === 'Active' ? 'bg-green-50' : 'bg-blue-50'}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/bookings/${booking.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-4">
              {org.certifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No certifications issued</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {org.certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 border rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cert.type}</p>
                          <p className="text-sm text-gray-600 mt-1">{cert.count} caregivers certified</p>
                        </div>
                        <Badge variant={cert.type === 'CNA' ? 'default' : 'secondary'}>
                          {cert.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
