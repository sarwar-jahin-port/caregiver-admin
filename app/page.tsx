'use client'

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
import { useCaregivers, useBookings, useOrganizations, useCarePlans } from '@/lib/hooks/use-data'
import { TrendingUp, Users, Calendar, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { caregivers, getActiveCaregivers, getAtRiskCaregivers } = useCaregivers()
  const { bookings, getActiveBookings, getDisruptedBookings } = useBookings()
  const { organizations } = useOrganizations()
  const { carePlans } = useCarePlans()

  const activeCaregivers = getActiveCaregivers()
  const atRiskCaregivers = getAtRiskCaregivers()
  const activeBookings = getActiveBookings()
  const disruptedBookings = getDisruptedBookings()
  const completedBookings = bookings.filter(b => b.status === 'Completed')
  const activeCarePlans = carePlans.filter(cp => cp.activeServices.length > 0)
  
  // CNA vs HHA chart data
  const cnaCount = bookings.filter(b => b.serviceType === 'CNA').length
  const hhaCount = bookings.filter(b => b.serviceType === 'HHA').length
  const chartData = [{ name: 'Bookings', CNA: cnaCount, HHA: hhaCount }]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Key Metrics - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Caregivers</p>
              <p className="text-4xl font-bold mt-2">{activeCaregivers.length}</p>
              <p className="text-xs text-gray-500 mt-2">
                {caregivers.length > 0 ? ((activeCaregivers.length / caregivers.length) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-4xl font-bold mt-2">{activeBookings.length}</p>
              <p className="text-xs text-gray-500 mt-2">
                {bookings.length > 0 ? ((activeBookings.length / bookings.length) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
            <Calendar className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Bookings</p>
              <p className="text-4xl font-bold mt-2">{completedBookings.length}</p>
              <p className="text-xs text-gray-500 mt-2">
                {bookings.length > 0 ? ((completedBookings.length / bookings.length) * 100).toFixed(0) : 0}% success rate
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">At-Risk Caregivers</p>
              <p className="text-4xl font-bold mt-2 text-red-600">{atRiskCaregivers.length}</p>
              <p className="text-xs text-gray-500 mt-2">2+ strikes</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Second Row of Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Care Plans</p>
              <p className="text-4xl font-bold mt-2 text-green-600">{activeCarePlans.length}</p>
              <p className="text-xs text-gray-500 mt-2">Multi-service clients</p>
            </div>
            <Users className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disrupted Bookings</p>
              <p className="text-4xl font-bold mt-2 text-orange-600">{disruptedBookings.length}</p>
              <p className="text-xs text-gray-500 mt-2">Need attention</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Organizations</p>
              <p className="text-4xl font-bold mt-2">{organizations.length}</p>
              <p className="text-xs text-gray-500 mt-2">Active partners</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Disruptions Banner */}
      {disruptedBookings.length > 0 && (
        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-orange-600 mr-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900">Live Disruptions</h3>
              <p className="text-sm text-orange-700 mt-1">
                {disruptedBookings.length} booking{disruptedBookings.length !== 1 ? 's' : ''} currently disrupted and need immediate attention
              </p>
              <Link href="/bookings">
                <Button variant="outline" className="mt-3 text-orange-600 border-orange-600 hover:bg-orange-50">
                  View Disruptions <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* At-Risk Caregivers */}
      {atRiskCaregivers.length > 0 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900">At-Risk Caregivers</h3>
              <p className="text-sm text-red-700 mt-1">
                {atRiskCaregivers.length} caregiver{atRiskCaregivers.length !== 1 ? 's' : ''} have 2+ strikes and may face termination
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {atRiskCaregivers.slice(0, 3).map((cg) => (
                  <Link key={cg.id} href={`/caregivers/${cg.id}`}>
                    <Badge variant="destructive" className="cursor-pointer">
                      {cg.name} ({cg.strikeCount}/3)
                    </Badge>
                  </Link>
                ))}
                {atRiskCaregivers.length > 3 && (
                  <Badge variant="outline">+{atRiskCaregivers.length - 3} more</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Service Type Breakdown Chart */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Service Type Breakdown</h2>
          <p className="text-sm text-gray-600 mt-1">CNA vs HHA booking distribution</p>
        </div>
        <div className="p-6 flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="CNA" fill="#2563eb" />
              <Bar dataKey="HHA" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Active Bookings */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Active Bookings</h2>
          <Link href="/bookings">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeBookings.slice(0, 5).map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-sm">{booking.id.slice(0, 8)}</TableCell>
                <TableCell className="font-medium">{booking.clientName}</TableCell>
                <TableCell>
                  <Badge variant={booking.serviceType === 'CNA' ? 'default' : 'secondary'}>
                    {booking.serviceType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={booking.status === 'In Progress' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Top Caregivers */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Top Performing Caregivers</h2>
          <Link href="/caregivers">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        <div className="divide-y">
          {caregivers.sort((a, b) => b.rating - a.rating).slice(0, 5).map((caregiver) => (
            <div key={caregiver.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium">{caregiver.name}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm text-gray-600 ml-1">{caregiver.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600">{caregiver.totalBookings} bookings</span>
                  <Badge variant="secondary">{caregiver.status}</Badge>
                </div>
              </div>
              <Link href={`/caregivers/${caregiver.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
