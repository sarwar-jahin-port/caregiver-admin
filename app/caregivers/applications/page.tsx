'use client'

import { useState, useMemo } from 'react'
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
import { useCaregiverApplications } from '@/lib/hooks/use-data'
import { Search, Plus, Kanban, LayoutList, Mail, Phone, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function ApplicationsPage() {
  const { applications } = useCaregiverApplications()
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = 
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [applications, searchTerm])

  const stages = [
    'Application Submitted',
    'Initial Screening',
    'Document Review',
    'Background Check',
    'Interview Scheduled',
    'Interview Completed',
    'Final Review',
    'Approved',
    'Rejected'
  ]

  const getApplicationsByStage = (stage: string) => {
    return filtered.filter(app => app.currentStage === stage)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Approved':
        return 'bg-green-50 border-green-200'
      case 'Rejected':
        return 'bg-red-50 border-red-200'
      case 'Interview Scheduled':
      case 'Interview Completed':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Interview Scheduled':
      case 'Interview Completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-amber-100 text-amber-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Caregiver Applications</h1>
          <p className="text-gray-600">Review and manage caregiver applications</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 border-l pl-4">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <Kanban className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          {stages.map((stage) => {
            const stageApps = getApplicationsByStage(stage)
            return (
              <div key={stage} className="flex flex-col">
                <div className="mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">{stage}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stageApps.length} applications</p>
                </div>
                <div className="space-y-3 flex-1">
                  {stageApps.map((app) => (
                    <Link key={app.id} href={`/caregivers/applications/${app.id}`}>
                      <Card className={`p-4 cursor-pointer hover:shadow-md transition-shadow border ${getStageColor(stage)}`}>
                        <div className="space-y-2">
                          <div>
                            <p className="font-medium text-gray-900 truncate">{app.applicantName}</p>
                            <p className="text-xs text-gray-600 truncate">{app.email}</p>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {app.requestedServiceTypes.map((type) => (
                              <Badge key={type} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs font-medium text-gray-600">
                              {app.onboardingProgress}%
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                  {stageApps.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.applicantName}</TableCell>
                    <TableCell className="text-sm">{app.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {app.requestedServiceTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStageBadgeColor(app.currentStage)}>
                        {app.currentStage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${app.onboardingProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{app.onboardingProgress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/caregivers/applications/${app.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
