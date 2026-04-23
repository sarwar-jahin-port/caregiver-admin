import { useState, useMemo } from 'react'

interface StrikeHistory {
  id: string
  strikeNumber: number
  reason: string
  appliedAt: string
  penaltyAmount?: number
  adminOverride?: boolean
  overrideReason?: string
}

interface Certification {
  id: string
  type: 'CNA' | 'HHA'
  issuedBy: string
  issuedAt: string
  expiryDate: string
  isExpired: boolean
}

interface CaregiverDocument {
  id: string
  name: string
  type: 'Government ID' | 'Background Check' | 'Reference' | 'Certification' | 'Insurance' | 'Medical Clearance' | 'Other'
  status: 'Verified' | 'Pending' | 'Rejected' | 'Expired'
  uploadedAt: string
  expiryDate?: string
  verifiedBy?: string
  verifiedAt?: string
  notes?: string
}

interface Earnings {
  id: string
  period: string
  totalEarnings: number
  totalHours: number
  paymentStatus: 'Paid' | 'Pending' | 'Failed'
  paidAt?: string
  transactionId?: string
}

interface Availability {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  startTime: string
  endTime: string
  available: boolean
}

interface PerformanceMetrics {
  completionRate: number
  clientSatisfaction: number
  noShowRate: number
  lateArrivalRate: number
  lastReviewDate: string
}

// ========== CLIENT & CARE RECIPIENT TYPES ==========

interface ClientFlag {
  id: string
  type: 'Payment Default' | 'Abusive Behavior' | 'Fraudulent Activity' | 'High Dispute Rate' | 'Identity Concern' | 'Other'
  reason: string
  flaggedBy: string
  flaggedAt: string
  status: 'Active' | 'Resolved'
  resolvedAt?: string
  resolvedBy?: string
  resolutionNotes?: string
}

interface ClientPaymentMethod {
  id: string
  type: 'Visa' | 'Mastercard' | 'Amex' | 'Bank Account'
  last4: string
  expiryDate?: string
  isDefault: boolean
}

interface ClientBillingRecord {
  id: string
  bookingId: string
  description: string
  amount: number
  paymentMethod: string
  status: 'Paid' | 'Refunded' | 'Failed' | 'Pending'
  processedAt: string
}

interface ClientReview {
  id: string
  bookingId: string
  caregiverId: string
  caregiverName: string
  rating: number
  reviewText: string
  submittedAt: string
  flagged: boolean
}

interface CaregiverReviewOfClient {
  id: string
  bookingId: string
  caregiverId: string
  caregiverName: string
  rating: number
  notes: string
  submittedAt: string
}

interface ClientCommunication {
  id: string
  type: 'Booking confirmation' | 'Replacement alert' | 'Payment receipt' | 'Dispute update' | 'General'
  channel: 'App' | 'SMS' | 'Email'
  subject: string
  preview: string
  status: 'Delivered' | 'Read' | 'Failed'
  sentAt: string
}

interface AdminNote {
  id: string
  content: string
  author: string
  createdAt: string
}

interface CareRecipient {
  id: string
  clientId: string
  fullName: string
  dateOfBirth: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  photo?: string
  relationshipToClient: 'Self' | 'Parent' | 'Spouse' | 'Child' | 'Other'
  primaryAddress: string
  emergencyContact: { name: string; relationship: string; phone: string }
  
  // Health & Care Profile
  primaryCondition: string
  secondaryConditions: string[]
  mobilityLevel: 'Fully mobile' | 'Assisted mobility' | 'Wheelchair' | 'Bedridden'
  cognitiveStatus: 'Alert' | 'Mild impairment' | 'Moderate impairment' | 'Severe impairment'
  communication: 'Normal' | 'Hearing impaired' | 'Speech impaired' | 'Non-verbal'
  allergies: string[]
  currentMedications: { name: string; dosage: string; frequency: string }[]
  behavioralNotes: string[]
  dietaryRestrictions: string[]
  preferredRoutine: string
  doNotDoList: string[]
  
  // Care Preferences
  preferredCaregiverGender: 'No preference' | 'Female' | 'Male'
  preferredLanguages: string[]
  preferredCaregivers: { id: string; name: string }[]
  blockedCaregivers: { id: string; name: string; reason: string }[]
  serviceTypesNeeded: ('CNA' | 'HHA')[]
  hhaTasks: ('Cooking' | 'Cleaning' | 'Companionship' | 'Mobility Assist' | 'Errands')[]
  
  // Status
  hasActiveServices: boolean
  lastServiceDate?: string
}

interface Client {
  id: string
  fullName: string
  email: string
  phone: string
  alternatePhone?: string
  dateOfBirth: string
  gender: 'Male' | 'Female' | 'Other'
  preferredLanguage: string
  photo?: string
  
  // Address
  primaryAddress: string
  alternateAddresses: string[]
  
  // Account Info
  accountType: 'Self' | 'Family Manager'
  howFoundPlatform: 'Referral' | 'Organic' | 'Org Referral' | 'Ad'
  preferredContactMethod: 'App notification' | 'SMS' | 'Email'
  emergencyContact: { name: string; relationship: string; phone: string }
  joinedDate: string
  lastActiveDate: string
  
  // Status & Risk
  status: 'Active' | 'Suspended' | 'Blocked'
  flagged: boolean
  flags: ClientFlag[]
  riskScore: 'Low' | 'Medium' | 'High'
  
  // Financial
  totalSpent: number
  outstandingBalance: number
  paymentMethods: ClientPaymentMethod[]
  billingHistory: ClientBillingRecord[]
  
  // Care Recipients
  careRecipients: CareRecipient[]
  
  // Bookings & Care Plans
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  disputedBookings: number
  activeBookingCount: number
  carePlanIds: string[]
  
  // Reviews
  reviewsGiven: ClientReview[]
  reviewsReceived: CaregiverReviewOfClient[]
  avgRatingGiven: number
  avgRatingReceived: number
  
  // Communications
  communications: ClientCommunication[]
  notificationPreferences: {
    bookingConfirmation: boolean
    replacementAlerts: boolean
    paymentReceipts: boolean
    disputeUpdates: boolean
    generalUpdates: boolean
  }
  
  // Admin
  adminNotes: AdminNote[]
}

interface Pricing {
  serviceType: 'CNA' | 'HHA'
  baseRate: number
  weekendRate?: number
  overtimeRate?: number
  specialServiceRate?: number
}

interface Caregiver {
  id: string
  name: string
  email: string
  phone: string
  rating: number
  totalBookings: number
  activeBookings: number
  status: 'Active' | 'Restricted' | 'On Probation' | 'Terminated'
  strikeCount: number
  serviceTypes: ('CNA' | 'HHA')[]
  organizationId?: string
  organizationName?: string
  joinedDate: string
  certifications: Certification[]
  strikeHistory: StrikeHistory[]
  documents: CaregiverDocument[]
  availability: Availability[]
  pricing: Pricing[]
  performance: PerformanceMetrics
  earnings: Earnings[]
  totalEarnings: number
  bankAccount?: { accountName: string; accountLast4: string }
  backgroundCheckStatus: 'Passed' | 'Pending' | 'Failed'
  backgroundCheckDate?: string
}

interface ApplicationStage {
  stage: 'Application Submitted' | 'Initial Screening' | 'Document Review' | 'Background Check' | 'Interview Scheduled' | 'Interview Completed' | 'Final Review' | 'Approved' | 'Rejected'
  status: 'Completed' | 'In Progress' | 'Pending' | 'Rejected'
  completedAt?: string
  notes?: string
}

interface CaregiverApplication {
  id: string
  applicantName: string
  email: string
  phone: string
  appliedDate: string
  requestedServiceTypes: ('CNA' | 'HHA')[]
  currentStage: 'Application Submitted' | 'Initial Screening' | 'Document Review' | 'Background Check' | 'Interview Scheduled' | 'Interview Completed' | 'Final Review' | 'Approved' | 'Rejected'
  stageHistory: ApplicationStage[]
  documents: CaregiverDocument[]
  backgroundCheckStatus: 'Passed' | 'Pending' | 'Failed' | 'Not Started'
  interviewScheduledAt?: string
  interviewedBy?: string
  interviewNotes?: string
  resume?: string
  coverLetter?: string
  referencesProvided: number
  onboardingProgress: number
  approvedBy?: string
  approvalNotes?: string
  rejectionReason?: string
}

interface ReplacementEvent {
  id: string
  originalCaregiverId: string
  originalCaregiverName: string
  reason: string
  strikeApplied: number
  replacementCaregiverId: string
  replacementCaregiverName: string
  surgeMultiplier: number
  surgeRate: number
  createdAt: string
}

interface PaymentRecord {
  id: string
  amount: number
  status: 'Pending' | 'Processed' | 'Failed' | 'Refunded'
  processedAt?: string
  method: 'Bank Transfer' | 'PayPal' | 'Check' | 'Card'
  notes?: string
}

interface CheckInOut {
  checkInTime?: string
  checkInVerified?: boolean
  checkInVerifiedBy?: string
  checkOutTime?: string
  checkOutVerified?: boolean
  checkOutVerifiedBy?: string
  notes?: string
}

interface BookingDispute {
  id: string
  reportedBy: 'Client' | 'Caregiver'
  reason: string
  description: string
  reportedAt: string
  resolvedAt?: string
  resolution?: string
  status: 'Open' | 'Under Review' | 'Resolved' | 'Dismissed'
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
}

interface RecurringSeries {
  id: string
  seriesName: string
  frequency: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly'
  dayOfWeek?: string
  startDate: string
  endDate?: string
  totalOccurrences?: number
  occurrencesCompleted: number
  status: 'Active' | 'Paused' | 'Ended' | 'Cancelled'
}

interface Booking {
  id: string
  clientId: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  carePlanId?: string
  serviceType: 'CNA' | 'HHA'
  taskType?: 'Cooking' | 'Cleaning' | 'Companionship' | 'Mobility Assist' | 'Errands' | 'Clinical Care' | 'Other'
  scheduleType: 'One-time' | 'Recurring'
  scheduleFrequency?: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly'
  endDate?: string
  status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled' | 'Disputed' | 'Replacement In Progress' | 'No-Show' | 'Client No-Show'
  caregiverId: string
  caregiverName?: string
  organizationId?: string
  source: 'Independent' | string
  startDate: string
  startTime?: string
  endTime?: string
  totalHours: number
  baseRate: number
  finalRate: number
  surgePricing?: { multiplier: number; reason: string }
  replacementHistory: ReplacementEvent[]
  createdAt: string
  confirmedAt?: string
  payment: PaymentRecord[]
  checkInOut: CheckInOut
  dispute?: BookingDispute
  recurringSeriesId?: string
  isPartOfSeries: boolean
  review?: { rating: number; comment: string; submittedAt: string; submittedBy: 'Client' | 'Caregiver' }
  cancellationReason?: string
  cancelledAt?: string
  cancelledBy?: string
  activityLog: Array<{ timestamp: string; action: string; performedBy: string; details?: string }>
}

interface CarePlan {
  id: string
  clientId: string
  clientName: string
  clientAge: number
  clientLocation: string
  clientPhone: string
  clientAvatar?: string
  activeServices: Booking[]
  totalActiveCost: number
  createdAt: string
  lastModified: string
}

interface Transaction {
  id: string
  bookingId: string
  clientName: string
  caregiverName: string
  totalAmount: number
  platformFee: number // 15%
  caregiverPayout: number // 85%
  status: 'Escrow' | 'Ready' | 'Paid' | 'Refunded' | 'Disputed'
  createdAt: string
  expectedPayoutDate: string // Completion + 24h
  actualPayoutDate?: string
  adjustments?: { type: 'Tip' | 'Overage' | 'Penalty' | 'Fee Adjustment'; amount: number; reason: string }[]
}

interface Organization {
  id: string
  name: string
  description: string
  status: 'Active' | 'Suspended'
  totalCaregivers: number
  activeCaregivers: number
  certificationsIssued: number
  totalBookings: number
  contactInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  foundedDate: string
  certifications: { type: 'CNA' | 'HHA'; count: number }[]
  caregivers: string[]
}

const mockCaregivers: Caregiver[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '555-0101',
    rating: 4.8,
    totalBookings: 45,
    activeBookings: 3,
    status: 'Active',
    strikeCount: 0,
    serviceTypes: ['CNA'],
    organizationId: '1',
    organizationName: 'City Health Care',
    joinedDate: '2023-01-15',
    certifications: [
      { id: 'c1', type: 'CNA', issuedBy: 'State Board', issuedAt: '2022-06-10', expiryDate: '2025-06-10', isExpired: false }
    ],
    strikeHistory: [],
    documents: [
      { id: 'd1', name: 'Government ID', type: 'Government ID', status: 'Verified', uploadedAt: '2023-01-10', verifiedBy: 'Admin', verifiedAt: '2023-01-12' },
      { id: 'd2', name: 'Background Check', type: 'Background Check', status: 'Verified', uploadedAt: '2023-01-10', expiryDate: '2026-01-10', verifiedBy: 'Admin', verifiedAt: '2023-01-15' }
    ],
    availability: [
      { dayOfWeek: 'Monday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Thursday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Friday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '16:00', available: false },
      { dayOfWeek: 'Sunday', startTime: '10:00', endTime: '16:00', available: false },
    ],
    pricing: [
      { serviceType: 'CNA', baseRate: 45, weekendRate: 52, overtimeRate: 60 }
    ],
    performance: {
      completionRate: 98.5,
      clientSatisfaction: 4.8,
      noShowRate: 0.5,
      lateArrivalRate: 1.2,
      lastReviewDate: '2024-04-10'
    },
    earnings: [
      { id: 'e1', period: 'April 2024', totalEarnings: 1620, totalHours: 36, paymentStatus: 'Paid', paidAt: '2024-05-05', transactionId: 'TXN001' },
      { id: 'e2', period: 'May 2024', totalEarnings: 1890, totalHours: 42, paymentStatus: 'Pending', transactionId: 'TXN002' }
    ],
    totalEarnings: 12450,
    bankAccount: { accountName: 'Sarah Johnson', accountLast4: '4829' },
    backgroundCheckStatus: 'Passed',
    backgroundCheckDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '555-0102',
    rating: 4.9,
    totalBookings: 52,
    activeBookings: 4,
    status: 'Active',
    strikeCount: 0,
    serviceTypes: ['CNA', 'HHA'],
    organizationId: '2',
    organizationName: 'Wellness Services Inc',
    joinedDate: '2023-03-20',
    certifications: [
      { id: 'c2', type: 'CNA', issuedBy: 'State Board', issuedAt: '2021-09-15', expiryDate: '2026-09-15', isExpired: false },
      { id: 'c3', type: 'HHA', issuedBy: 'Community Board', issuedAt: '2023-02-01', expiryDate: '2026-02-01', isExpired: false }
    ],
    strikeHistory: [],
    documents: [
      { id: 'd3', name: 'Government ID', type: 'Government ID', status: 'Verified', uploadedAt: '2023-03-10', verifiedBy: 'Admin', verifiedAt: '2023-03-12' },
      { id: 'd4', name: 'Background Check', type: 'Background Check', status: 'Verified', uploadedAt: '2023-03-10', expiryDate: '2026-03-10', verifiedBy: 'Admin', verifiedAt: '2023-03-15' }
    ],
    availability: [
      { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', available: true },
      { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', available: true },
      { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', available: true },
      { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', available: true },
      { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00', available: true },
      { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '13:00', available: true },
      { dayOfWeek: 'Sunday', startTime: '00:00', endTime: '00:00', available: false },
    ],
    pricing: [
      { serviceType: 'CNA', baseRate: 48, weekendRate: 55, overtimeRate: 65 },
      { serviceType: 'HHA', baseRate: 42, weekendRate: 48 }
    ],
    performance: {
      completionRate: 99.2,
      clientSatisfaction: 4.9,
      noShowRate: 0,
      lateArrivalRate: 0.8,
      lastReviewDate: '2024-04-15'
    },
    earnings: [
      { id: 'e3', period: 'April 2024', totalEarnings: 2340, totalHours: 52, paymentStatus: 'Paid', paidAt: '2024-05-05', transactionId: 'TXN003' },
      { id: 'e4', period: 'May 2024', totalEarnings: 2450, totalHours: 54, paymentStatus: 'Pending', transactionId: 'TXN004' }
    ],
    totalEarnings: 15280,
    bankAccount: { accountName: 'Maria Garcia', accountLast4: '5741' },
    backgroundCheckStatus: 'Passed',
    backgroundCheckDate: '2023-03-15',
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '555-0103',
    rating: 4.7,
    totalBookings: 38,
    activeBookings: 2,
    status: 'Active',
    strikeCount: 0,
    serviceTypes: ['HHA'],
    joinedDate: '2023-05-10',
    certifications: [
      { id: 'c4', type: 'HHA', issuedBy: 'Community Board', issuedAt: '2023-01-10', expiryDate: '2026-01-10', isExpired: false }
    ],
    strikeHistory: [],
    documents: [
      { id: 'd5', name: 'Government ID', type: 'Government ID', status: 'Verified', uploadedAt: '2023-05-05', verifiedBy: 'Admin', verifiedAt: '2023-05-07' }
    ],
    availability: [
      { dayOfWeek: 'Monday', startTime: '07:00', endTime: '15:00', available: true },
      { dayOfWeek: 'Tuesday', startTime: '07:00', endTime: '15:00', available: true },
      { dayOfWeek: 'Wednesday', startTime: '07:00', endTime: '15:00', available: true },
      { dayOfWeek: 'Thursday', startTime: '07:00', endTime: '15:00', available: true },
      { dayOfWeek: 'Friday', startTime: '07:00', endTime: '15:00', available: true },
      { dayOfWeek: 'Saturday', startTime: '00:00', endTime: '00:00', available: false },
      { dayOfWeek: 'Sunday', startTime: '00:00', endTime: '00:00', available: false },
    ],
    pricing: [
      { serviceType: 'HHA', baseRate: 38, weekendRate: 44 }
    ],
    performance: {
      completionRate: 97.8,
      clientSatisfaction: 4.7,
      noShowRate: 1.2,
      lateArrivalRate: 0.5,
      lastReviewDate: '2024-04-08'
    },
    earnings: [
      { id: 'e5', period: 'April 2024', totalEarnings: 1460, totalHours: 38, paymentStatus: 'Paid', paidAt: '2024-05-05', transactionId: 'TXN005' }
    ],
    totalEarnings: 9280,
    backgroundCheckStatus: 'Passed',
    backgroundCheckDate: '2023-05-10',
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '555-0104',
    rating: 4.6,
    totalBookings: 41,
    activeBookings: 2,
    status: 'Active',
    strikeCount: 1,
    serviceTypes: ['CNA'],
    organizationId: '1',
    organizationName: 'City Health Care',
    joinedDate: '2023-02-14',
    certifications: [
      { id: 'c5', type: 'CNA', issuedBy: 'State Board', issuedAt: '2022-11-20', expiryDate: '2025-11-20', isExpired: false }
    ],
    strikeHistory: [
      { id: 'sh1', strikeNumber: 1, reason: 'Late to appointment', appliedAt: '2024-04-01', penaltyAmount: 50 }
    ],
    documents: [
      { id: 'd6', name: 'Government ID', type: 'Government ID', status: 'Verified', uploadedAt: '2023-02-10', verifiedBy: 'Admin', verifiedAt: '2023-02-12' }
    ],
    availability: [
      { dayOfWeek: 'Monday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Thursday', startTime: '08:00', endTime: '18:00', available: false },
      { dayOfWeek: 'Friday', startTime: '08:00', endTime: '18:00', available: true },
      { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '16:00', available: true },
      { dayOfWeek: 'Sunday', startTime: '10:00', endTime: '16:00', available: false },
    ],
    pricing: [
      { serviceType: 'CNA', baseRate: 46, weekendRate: 53 }
    ],
    performance: {
      completionRate: 96.5,
      clientSatisfaction: 4.6,
      noShowRate: 2.0,
      lateArrivalRate: 2.1,
      lastReviewDate: '2024-04-10'
    },
    earnings: [
      { id: 'e6', period: 'April 2024', totalEarnings: 1550, totalHours: 41, paymentStatus: 'Paid', paidAt: '2024-05-05', transactionId: 'TXN006' }
    ],
    totalEarnings: 10920,
    backgroundCheckStatus: 'Passed',
    backgroundCheckDate: '2023-02-14',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '555-0105',
    rating: 4.5,
    totalBookings: 35,
    activeBookings: 1,
    status: 'On Probation',
    strikeCount: 2,
    serviceTypes: ['CNA', 'HHA'],
    organizationId: '3',
    organizationName: 'Community Care Partners',
    joinedDate: '2022-12-01',
    certifications: [
      { id: 'c6', type: 'CNA', issuedBy: 'State Board', issuedAt: '2022-05-15', expiryDate: '2025-05-15', isExpired: false },
      { id: 'c7', type: 'HHA', issuedBy: 'Community Board', issuedAt: '2023-03-20', expiryDate: '2026-03-20', isExpired: false }
    ],
    strikeHistory: [
      { id: 'sh2', strikeNumber: 1, reason: 'No-show', appliedAt: '2024-03-15', penaltyAmount: 100 },
      { id: 'sh3', strikeNumber: 2, reason: 'Client complaint', appliedAt: '2024-04-10', penaltyAmount: 150 }
    ],
    documents: [
      { id: 'd7', name: 'Government ID', type: 'Government ID', status: 'Verified', uploadedAt: '2022-12-05', verifiedBy: 'Admin', verifiedAt: '2022-12-07' }
    ],
    availability: [
      { dayOfWeek: 'Monday', startTime: '08:00', endTime: '16:00', available: false },
      { dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '16:00', available: true },
      { dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '16:00', available: true },
      { dayOfWeek: 'Thursday', startTime: '08:00', endTime: '16:00', available: true },
      { dayOfWeek: 'Friday', startTime: '08:00', endTime: '16:00', available: true },
      { dayOfWeek: 'Saturday', startTime: '00:00', endTime: '00:00', available: false },
      { dayOfWeek: 'Sunday', startTime: '00:00', endTime: '00:00', available: false },
    ],
    pricing: [
      { serviceType: 'CNA', baseRate: 42, weekendRate: 48 },
      { serviceType: 'HHA', baseRate: 38, weekendRate: 44 }
    ],
    performance: {
      completionRate: 92.0,
      clientSatisfaction: 4.2,
      noShowRate: 4.5,
      lateArrivalRate: 3.0,
      lastReviewDate: '2024-04-12'
    },
    earnings: [
      { id: 'e7', period: 'April 2024', totalEarnings: 1120, totalHours: 35, paymentStatus: 'Paid', paidAt: '2024-05-05', transactionId: 'TXN007' }
    ],
    totalEarnings: 8450,
    backgroundCheckStatus: 'Pending',
  },
  {
    id: '6',
    name: 'Robert Martinez',
    email: 'robert.martinez@email.com',
    phone: '555-0106',
    rating: 4.3,
    totalBookings: 28,
    activeBookings: 1,
    status: 'Restricted',
    strikeCount: 2,
    serviceTypes: ['HHA'],
    joinedDate: '2023-07-20',
    certifications: [
      { id: 'c8', type: 'HHA', issuedBy: 'Community Board', issuedAt: '2023-06-01', expiryDate: '2026-06-01', isExpired: false }
    ],
    strikeHistory: [
      { id: 'sh4', strikeNumber: 1, reason: 'Service quality issue', appliedAt: '2024-03-20', penaltyAmount: 75 },
      { id: 'sh5', strikeNumber: 2, reason: 'No-show', appliedAt: '2024-04-05', penaltyAmount: 125 }
    ],
    documents: [
      { id: 'd8', name: 'Government ID', type: 'Government ID', status: 'Verified', uploadedAt: '2023-07-15', verifiedBy: 'Admin', verifiedAt: '2023-07-17' }
    ],
    availability: [
      { dayOfWeek: 'Monday', startTime: '10:00', endTime: '14:00', available: true },
      { dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '14:00', available: true },
      { dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '14:00', available: false },
      { dayOfWeek: 'Thursday', startTime: '10:00', endTime: '14:00', available: true },
      { dayOfWeek: 'Friday', startTime: '10:00', endTime: '14:00', available: true },
      { dayOfWeek: 'Saturday', startTime: '00:00', endTime: '00:00', available: false },
      { dayOfWeek: 'Sunday', startTime: '00:00', endTime: '00:00', available: false },
    ],
    pricing: [
      { serviceType: 'HHA', baseRate: 35, weekendRate: 40 }
    ],
    performance: {
      completionRate: 88.5,
      clientSatisfaction: 4.0,
      noShowRate: 5.2,
      lateArrivalRate: 4.5,
      lastReviewDate: '2024-04-15'
    },
    earnings: [
      { id: 'e8', period: 'April 2024', totalEarnings: 840, totalHours: 28, paymentStatus: 'Paid', paidAt: '2024-05-05', transactionId: 'TXN008' }
    ],
    totalEarnings: 6280,
    backgroundCheckStatus: 'Failed',
    backgroundCheckDate: '2023-07-20',
  },
]

const mockBookings: Booking[] = [
  {
    id: 'BK001',
    clientId: 'CL001',
    clientName: 'John Doe',
    clientEmail: 'john.doe@email.com',
    clientPhone: '555-5001',
    serviceType: 'CNA',
    taskType: 'Clinical Care',
    scheduleType: 'Recurring',
    scheduleFrequency: 'Daily',
    status: 'Active',
    caregiverId: '1',
    caregiverName: 'Sarah Johnson',
    organizationId: '1',
    source: 'Via Org City Health Care',
    startDate: '2024-04-15',
    startTime: '08:00',
    endTime: '12:00',
    totalHours: 4,
    baseRate: 45,
    finalRate: 45,
    replacementHistory: [],
    createdAt: '2024-04-10',
    confirmedAt: '2024-04-10',
    payment: [{ id: 'p1', amount: 180, status: 'Processed', processedAt: '2024-04-20', method: 'Bank Transfer' }],
    checkInOut: { checkInTime: '08:02', checkInVerified: true, checkOutTime: '12:05', checkOutVerified: true },
    isPartOfSeries: true,
    recurringSeriesId: 'RS001',
    activityLog: [
      { timestamp: '2024-04-10', action: 'Booking Created', performedBy: 'System' },
      { timestamp: '2024-04-15', action: 'Booking Started', performedBy: 'System' }
    ]
  },
  {
    id: 'BK002',
    clientId: 'CL002',
    clientName: 'Jane Smith',
    clientEmail: 'jane.smith@email.com',
    clientPhone: '555-5002',
    serviceType: 'HHA',
    taskType: 'Cooking',
    scheduleType: 'Recurring',
    scheduleFrequency: 'Weekly',
    status: 'Confirmed',
    caregiverId: '3',
    caregiverName: 'Emily Chen',
    source: 'Independent',
    startDate: '2024-04-20',
    startTime: '10:00',
    endTime: '13:00',
    totalHours: 3,
    baseRate: 30,
    finalRate: 30,
    replacementHistory: [],
    createdAt: '2024-04-12',
    confirmedAt: '2024-04-13',
    payment: [{ id: 'p2', amount: 90, status: 'Pending', method: 'Bank Transfer' }],
    checkInOut: {},
    isPartOfSeries: false,
    activityLog: [
      { timestamp: '2024-04-12', action: 'Booking Created', performedBy: 'Client' },
      { timestamp: '2024-04-13', action: 'Booking Confirmed', performedBy: 'Caregiver' }
    ]
  },
  {
    id: 'BK003',
    clientId: 'CL001',
    clientName: 'John Doe',
    clientEmail: 'john.doe@email.com',
    clientPhone: '555-5001',
    carePlanId: 'CP001',
    serviceType: 'HHA',
    taskType: 'Mobility Assist',
    scheduleType: 'Recurring',
    scheduleFrequency: 'Daily',
    status: 'Active',
    caregiverId: '2',
    caregiverName: 'Maria Garcia',
    organizationId: '2',
    source: 'Via Org Wellness Services Inc',
    startDate: '2024-04-10',
    startTime: '14:00',
    endTime: '16:00',
    totalHours: 2,
    baseRate: 35,
    finalRate: 35,
    replacementHistory: [],
    createdAt: '2024-04-08',
    confirmedAt: '2024-04-09',
    payment: [{ id: 'p3', amount: 70, status: 'Processed', processedAt: '2024-04-20', method: 'Bank Transfer' }],
    checkInOut: { checkInTime: '14:01', checkInVerified: true, checkOutTime: '16:02', checkOutVerified: true },
    isPartOfSeries: true,
    recurringSeriesId: 'RS002',
    activityLog: [{ timestamp: '2024-04-10', action: 'Booking Started', performedBy: 'System' }]
  },
  {
    id: 'BK004',
    clientId: 'CL003',
    clientName: 'Patricia Davis',
    clientEmail: 'patricia.davis@email.com',
    clientPhone: '555-5003',
    serviceType: 'CNA',
    taskType: 'Clinical Care',
    scheduleType: 'One-time',
    status: 'Completed',
    caregiverId: '4',
    caregiverName: 'James Wilson',
    organizationId: '1',
    source: 'Via Org City Health Care',
    startDate: '2024-04-01',
    startTime: '09:00',
    endTime: '17:00',
    totalHours: 8,
    baseRate: 50,
    finalRate: 50,
    replacementHistory: [],
    createdAt: '2024-03-28',
    confirmedAt: '2024-03-29',
    payment: [{ id: 'p4', amount: 400, status: 'Processed', processedAt: '2024-04-05', method: 'Bank Transfer' }],
    checkInOut: { checkInTime: '09:00', checkInVerified: true, checkOutTime: '17:05', checkOutVerified: true },
    isPartOfSeries: false,
    review: { rating: 4.8, comment: 'Excellent care and professionalism', submittedAt: '2024-04-02', submittedBy: 'Client' },
    activityLog: [
      { timestamp: '2024-04-01', action: 'Booking Completed', performedBy: 'System' },
      { timestamp: '2024-04-02', action: 'Review Submitted', performedBy: 'Client' }
    ]
  },
  {
    id: 'BK005',
    clientId: 'CL004',
    clientName: 'Robert Wilson',
    clientEmail: 'robert.wilson@email.com',
    clientPhone: '555-5004',
    serviceType: 'HHA',
    taskType: 'Cleaning',
    scheduleType: 'Recurring',
    scheduleFrequency: 'Weekly',
    status: 'Replacement In Progress',
    caregiverId: '6',
    caregiverName: 'Robert Martinez',
    organizationId: '3',
    source: 'Via Org Community Care Partners',
    startDate: '2024-04-18',
    startTime: '10:00',
    endTime: '13:00',
    totalHours: 3,
    baseRate: 28,
    finalRate: 36.4,
    surgePricing: { multiplier: 1.3, reason: 'Emergency replacement' },
    replacementHistory: [
      {
        id: 'RE001',
        originalCaregiverId: '5',
        originalCaregiverName: 'Lisa Anderson',
        reason: 'Medical emergency',
        strikeApplied: 1,
        replacementCaregiverId: '6',
        replacementCaregiverName: 'Robert Martinez',
        surgeMultiplier: 1.3,
        surgeRate: 36.4,
        createdAt: '2024-04-18',
      }
    ],
    createdAt: '2024-04-16',
    confirmedAt: '2024-04-17',
    payment: [{ id: 'p5', amount: 109.2, status: 'Pending', method: 'Bank Transfer' }],
    checkInOut: { checkInTime: '10:05', checkInVerified: true },
    isPartOfSeries: true,
    recurringSeriesId: 'RS003',
    activityLog: [
      { timestamp: '2024-04-18 08:30', action: 'Caregiver Unavailable', performedBy: 'Lisa Anderson' },
      { timestamp: '2024-04-18 09:00', action: 'Replacement Initiated', performedBy: 'Admin' }
    ]
  },
  {
    id: 'BK006',
    clientId: 'CL001',
    clientName: 'John Doe',
    clientEmail: 'john.doe@email.com',
    clientPhone: '555-5001',
    carePlanId: 'CP001',
    serviceType: 'HHA',
    taskType: 'Companionship',
    scheduleType: 'Recurring',
    scheduleFrequency: 'Daily',
    status: 'Active',
    caregiverId: '2',
    caregiverName: 'Maria Garcia',
    organizationId: '2',
    source: 'Via Org Wellness Services Inc',
    startDate: '2024-04-12',
    startTime: '16:00',
    endTime: '18:00',
    totalHours: 2,
    baseRate: 32,
    finalRate: 32,
    replacementHistory: [],
    createdAt: '2024-04-09',
    confirmedAt: '2024-04-09',
    payment: [{ id: 'p6', amount: 64, status: 'Processed', processedAt: '2024-04-20', method: 'Bank Transfer' }],
    checkInOut: { checkInTime: '16:00', checkInVerified: true, checkOutTime: '18:01', checkOutVerified: true },
    isPartOfSeries: true,
    recurringSeriesId: 'RS002',
    activityLog: [{ timestamp: '2024-04-12', action: 'Booking Started', performedBy: 'System' }]
  },
  {
    id: 'BK007',
    clientId: 'CL005',
    clientName: 'Margaret Anderson',
    clientEmail: 'margaret.anderson@email.com',
    clientPhone: '555-5005',
    serviceType: 'CNA',
    taskType: 'Clinical Care',
    scheduleType: 'One-time',
    status: 'No-Show',
    caregiverId: '1',
    caregiverName: 'Sarah Johnson',
    organizationId: '1',
    source: 'Via Org City Health Care',
    startDate: '2024-04-19',
    startTime: '10:00',
    endTime: '14:00',
    totalHours: 4,
    baseRate: 45,
    finalRate: 45,
    replacementHistory: [],
    createdAt: '2024-04-17',
    confirmedAt: '2024-04-17',
    payment: [],
    checkInOut: {},
    isPartOfSeries: false,
    activityLog: [
      { timestamp: '2024-04-19 10:30', action: 'No-Show Recorded', performedBy: 'Caregiver' },
      { timestamp: '2024-04-19 11:00', action: 'Client contacted', performedBy: 'Admin', details: 'Client unavailable, rescheduling offered' }
    ]
  },
  {
    id: 'BK008',
    clientId: 'CL006',
    clientName: 'Thomas Lee',
    clientEmail: 'thomas.lee@email.com',
    clientPhone: '555-5006',
    serviceType: 'HHA',
    taskType: 'Errands',
    scheduleType: 'One-time',
    status: 'Disputed',
    caregiverId: '3',
    caregiverName: 'Emily Chen',
    source: 'Independent',
    startDate: '2024-04-14',
    startTime: '11:00',
    endTime: '13:00',
    totalHours: 2,
    baseRate: 28,
    finalRate: 28,
    replacementHistory: [],
    createdAt: '2024-04-12',
    confirmedAt: '2024-04-12',
    payment: [{ id: 'p7', amount: 28, status: 'Refunded', processedAt: '2024-04-18', method: 'Bank Transfer' }],
    checkInOut: { checkInTime: '11:10', checkInVerified: true, checkOutTime: '13:20', checkOutVerified: true },
    isPartOfSeries: false,
    dispute: {
      id: 'DISP001',
      reportedBy: 'Client',
      reason: 'Quality of Service',
      description: 'Tasks not completed to satisfaction',
      reportedAt: '2024-04-15',
      status: 'Under Review',
      severity: 'Medium',
      resolvedAt: undefined,
      resolution: undefined
    },
    activityLog: [
      { timestamp: '2024-04-14', action: 'Booking Completed', performedBy: 'System' },
      { timestamp: '2024-04-15', action: 'Dispute Filed', performedBy: 'Client' }
    ]
  },
]

const mockCarePlans: CarePlan[] = [
  {
    id: 'CP001',
    clientId: 'CL001',
    clientName: 'John Doe',
    clientAge: 78,
    clientLocation: 'New York, NY',
    clientPhone: '555-0001',
    activeServices: [
      mockBookings[0],
      mockBookings[2],
      mockBookings[5],
    ],
    totalActiveCost: 8 * 45 + 4 * 35 + 2 * 32,
    createdAt: '2024-03-20',
    lastModified: '2024-04-12',
  },
]

const mockClients: Client[] = [
  {
    id: 'CL001',
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '555-5001',
    alternatePhone: '555-5010',
    dateOfBirth: '1946-03-15',
    gender: 'Male',
    preferredLanguage: 'English',
    photo: undefined,
    primaryAddress: '123 Main Street, New York, NY 10001',
    alternateAddresses: ['456 Oak Ave, Brooklyn, NY 11201'],
    accountType: 'Family Manager',
    howFoundPlatform: 'Referral',
    preferredContactMethod: 'App notification',
    emergencyContact: { name: 'Mary Doe', relationship: 'Spouse', phone: '555-5011' },
    joinedDate: '2023-06-15',
    lastActiveDate: '2024-04-20',
    status: 'Active',
    flagged: false,
    flags: [],
    riskScore: 'Low',
    totalSpent: 4850,
    outstandingBalance: 0,
    paymentMethods: [
      { id: 'pm1', type: 'Visa', last4: '4242', expiryDate: '12/25', isDefault: true },
      { id: 'pm2', type: 'Bank Account', last4: '9876', isDefault: false },
    ],
    billingHistory: [
      { id: 'bl1', bookingId: 'BK001', description: 'CNA Care - Sarah Johnson', amount: 180, paymentMethod: 'Visa ****4242', status: 'Paid', processedAt: '2024-04-20' },
      { id: 'bl2', bookingId: 'BK003', description: 'HHA Care - Maria Garcia', amount: 70, paymentMethod: 'Visa ****4242', status: 'Paid', processedAt: '2024-04-20' },
    ],
    careRecipients: [
      {
        id: 'CR001',
        clientId: 'CL001',
        fullName: 'Robert Doe',
        dateOfBirth: '1942-08-20',
        age: 81,
        gender: 'Male',
        relationshipToClient: 'Parent',
        primaryAddress: '123 Main Street, New York, NY 10001',
        emergencyContact: { name: 'John Doe', relationship: 'Son', phone: '555-5001' },
        primaryCondition: 'Dementia',
        secondaryConditions: ['Diabetes Type 2', 'Hypertension'],
        mobilityLevel: 'Assisted mobility',
        cognitiveStatus: 'Moderate impairment',
        communication: 'Normal',
        allergies: ['Penicillin', 'Shellfish'],
        currentMedications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
          { name: 'Donepezil', dosage: '10mg', frequency: 'Once daily' },
        ],
        behavioralNotes: ['Sundowning in evenings', 'May resist bathing'],
        dietaryRestrictions: ['Low sodium', 'Diabetic diet'],
        preferredRoutine: 'Breakfast at 8am, morning walk at 10am, nap at 2pm, dinner at 6pm',
        doNotDoList: ['Do not leave alone for extended periods', 'Do not give sugar-containing drinks'],
        preferredCaregiverGender: 'No preference',
        preferredLanguages: ['English'],
        preferredCaregivers: [{ id: '1', name: 'Sarah Johnson' }, { id: '2', name: 'Maria Garcia' }],
        blockedCaregivers: [],
        serviceTypesNeeded: ['CNA', 'HHA'],
        hhaTasks: ['Cooking', 'Companionship', 'Mobility Assist'],
        hasActiveServices: true,
        lastServiceDate: '2024-04-20',
      },
      {
        id: 'CR002',
        clientId: 'CL001',
        fullName: 'Eleanor Doe',
        dateOfBirth: '1944-11-05',
        age: 79,
        gender: 'Female',
        relationshipToClient: 'Parent',
        primaryAddress: '123 Main Street, New York, NY 10001',
        emergencyContact: { name: 'John Doe', relationship: 'Son', phone: '555-5001' },
        primaryCondition: 'Post-surgery recovery',
        secondaryConditions: ['Osteoporosis'],
        mobilityLevel: 'Assisted mobility',
        cognitiveStatus: 'Alert',
        communication: 'Normal',
        allergies: [],
        currentMedications: [
          { name: 'Calcium + Vitamin D', dosage: '600mg/400IU', frequency: 'Once daily' },
          { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed' },
        ],
        behavioralNotes: [],
        dietaryRestrictions: [],
        preferredRoutine: 'Prefers morning appointments, light exercise in afternoon',
        doNotDoList: ['Do not rush mobility exercises'],
        preferredCaregiverGender: 'Female',
        preferredLanguages: ['English'],
        preferredCaregivers: [{ id: '2', name: 'Maria Garcia' }],
        blockedCaregivers: [],
        serviceTypesNeeded: ['HHA'],
        hhaTasks: ['Companionship', 'Mobility Assist', 'Cleaning'],
        hasActiveServices: false,
        lastServiceDate: '2024-03-15',
      },
    ],
    totalBookings: 24,
    completedBookings: 20,
    cancelledBookings: 2,
    disputedBookings: 0,
    activeBookingCount: 2,
    carePlanIds: ['CP001'],
    reviewsGiven: [
      { id: 'rv1', bookingId: 'BK001', caregiverId: '1', caregiverName: 'Sarah Johnson', rating: 5, reviewText: 'Excellent care, very attentive and professional.', submittedAt: '2024-04-18', flagged: false },
      { id: 'rv2', bookingId: 'BK003', caregiverId: '2', caregiverName: 'Maria Garcia', rating: 5, reviewText: 'Maria is wonderful with my father.', submittedAt: '2024-04-15', flagged: false },
    ],
    reviewsReceived: [
      { id: 'rr1', bookingId: 'BK001', caregiverId: '1', caregiverName: 'Sarah Johnson', rating: 5, notes: 'Wonderful family, very organized and communicative.', submittedAt: '2024-04-18' },
    ],
    avgRatingGiven: 5.0,
    avgRatingReceived: 5.0,
    communications: [
      { id: 'com1', type: 'Booking confirmation', channel: 'App', subject: 'Booking Confirmed', preview: 'Your booking BK001 has been confirmed...', status: 'Read', sentAt: '2024-04-10' },
      { id: 'com2', type: 'Payment receipt', channel: 'Email', subject: 'Payment Receipt', preview: 'Thank you for your payment of $180...', status: 'Delivered', sentAt: '2024-04-20' },
    ],
    notificationPreferences: {
      bookingConfirmation: true,
      replacementAlerts: true,
      paymentReceipts: true,
      disputeUpdates: true,
      generalUpdates: false,
    },
    adminNotes: [
      { id: 'an1', content: 'Long-term client, very reliable. Managing care for both parents.', author: 'Admin', createdAt: '2023-07-01' },
    ],
  },
  {
    id: 'CL002',
    fullName: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '555-5002',
    dateOfBirth: '1975-07-22',
    gender: 'Female',
    preferredLanguage: 'English',
    primaryAddress: '789 Elm Street, Boston, MA 02101',
    alternateAddresses: [],
    accountType: 'Self',
    howFoundPlatform: 'Organic',
    preferredContactMethod: 'SMS',
    emergencyContact: { name: 'Tom Smith', relationship: 'Husband', phone: '555-5012' },
    joinedDate: '2024-01-10',
    lastActiveDate: '2024-04-19',
    status: 'Active',
    flagged: false,
    flags: [],
    riskScore: 'Low',
    totalSpent: 720,
    outstandingBalance: 0,
    paymentMethods: [
      { id: 'pm3', type: 'Mastercard', last4: '5555', expiryDate: '08/26', isDefault: true },
    ],
    billingHistory: [
      { id: 'bl3', bookingId: 'BK002', description: 'HHA Care - Emily Chen', amount: 90, paymentMethod: 'Mastercard ****5555', status: 'Paid', processedAt: '2024-04-15' },
    ],
    careRecipients: [
      {
        id: 'CR003',
        clientId: 'CL002',
        fullName: 'Jane Smith',
        dateOfBirth: '1975-07-22',
        age: 48,
        gender: 'Female',
        relationshipToClient: 'Self',
        primaryAddress: '789 Elm Street, Boston, MA 02101',
        emergencyContact: { name: 'Tom Smith', relationship: 'Husband', phone: '555-5012' },
        primaryCondition: 'Post-surgery recovery',
        secondaryConditions: [],
        mobilityLevel: 'Assisted mobility',
        cognitiveStatus: 'Alert',
        communication: 'Normal',
        allergies: ['Latex'],
        currentMedications: [
          { name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 6 hours as needed' },
        ],
        behavioralNotes: [],
        dietaryRestrictions: ['Vegetarian'],
        preferredRoutine: 'Flexible schedule, prefers afternoon visits',
        doNotDoList: [],
        preferredCaregiverGender: 'Female',
        preferredLanguages: ['English'],
        preferredCaregivers: [{ id: '3', name: 'Emily Chen' }],
        blockedCaregivers: [],
        serviceTypesNeeded: ['HHA'],
        hhaTasks: ['Cooking', 'Cleaning'],
        hasActiveServices: true,
        lastServiceDate: '2024-04-19',
      },
    ],
    totalBookings: 8,
    completedBookings: 7,
    cancelledBookings: 1,
    disputedBookings: 0,
    activeBookingCount: 1,
    carePlanIds: [],
    reviewsGiven: [
      { id: 'rv3', bookingId: 'BK002', caregiverId: '3', caregiverName: 'Emily Chen', rating: 4, reviewText: 'Good service, always on time.', submittedAt: '2024-04-12', flagged: false },
    ],
    reviewsReceived: [
      { id: 'rr2', bookingId: 'BK002', caregiverId: '3', caregiverName: 'Emily Chen', rating: 5, notes: 'Very pleasant client, clear communication.', submittedAt: '2024-04-12' },
    ],
    avgRatingGiven: 4.0,
    avgRatingReceived: 5.0,
    communications: [
      { id: 'com3', type: 'Booking confirmation', channel: 'SMS', subject: 'Booking Confirmed', preview: 'Your booking has been confirmed...', status: 'Delivered', sentAt: '2024-04-12' },
    ],
    notificationPreferences: {
      bookingConfirmation: true,
      replacementAlerts: true,
      paymentReceipts: true,
      disputeUpdates: true,
      generalUpdates: true,
    },
    adminNotes: [],
  },
  {
    id: 'CL003',
    fullName: 'Patricia Davis',
    email: 'patricia.davis@email.com',
    phone: '555-5003',
    dateOfBirth: '1958-12-03',
    gender: 'Female',
    preferredLanguage: 'English',
    primaryAddress: '456 Pine Avenue, Chicago, IL 60601',
    alternateAddresses: [],
    accountType: 'Self',
    howFoundPlatform: 'Ad',
    preferredContactMethod: 'Email',
    emergencyContact: { name: 'Michael Davis', relationship: 'Son', phone: '555-5013' },
    joinedDate: '2023-09-20',
    lastActiveDate: '2024-04-01',
    status: 'Active',
    flagged: false,
    flags: [],
    riskScore: 'Low',
    totalSpent: 1200,
    outstandingBalance: 0,
    paymentMethods: [
      { id: 'pm4', type: 'Visa', last4: '1234', expiryDate: '03/27', isDefault: true },
    ],
    billingHistory: [
      { id: 'bl4', bookingId: 'BK004', description: 'CNA Care - James Wilson', amount: 400, paymentMethod: 'Visa ****1234', status: 'Paid', processedAt: '2024-04-05' },
    ],
    careRecipients: [
      {
        id: 'CR004',
        clientId: 'CL003',
        fullName: 'Patricia Davis',
        dateOfBirth: '1958-12-03',
        age: 65,
        gender: 'Female',
        relationshipToClient: 'Self',
        primaryAddress: '456 Pine Avenue, Chicago, IL 60601',
        emergencyContact: { name: 'Michael Davis', relationship: 'Son', phone: '555-5013' },
        primaryCondition: 'Diabetes',
        secondaryConditions: ['Arthritis'],
        mobilityLevel: 'Fully mobile',
        cognitiveStatus: 'Alert',
        communication: 'Normal',
        allergies: ['Aspirin'],
        currentMedications: [
          { name: 'Insulin', dosage: '10 units', frequency: 'Before meals' },
          { name: 'Methotrexate', dosage: '7.5mg', frequency: 'Weekly' },
        ],
        behavioralNotes: [],
        dietaryRestrictions: ['Diabetic diet'],
        preferredRoutine: 'Morning blood sugar check required',
        doNotDoList: ['Do not administer insulin without checking blood sugar first'],
        preferredCaregiverGender: 'No preference',
        preferredLanguages: ['English'],
        preferredCaregivers: [{ id: '4', name: 'James Wilson' }],
        blockedCaregivers: [],
        serviceTypesNeeded: ['CNA'],
        hhaTasks: [],
        hasActiveServices: false,
        lastServiceDate: '2024-04-01',
      },
    ],
    totalBookings: 12,
    completedBookings: 11,
    cancelledBookings: 1,
    disputedBookings: 0,
    activeBookingCount: 0,
    carePlanIds: [],
    reviewsGiven: [
      { id: 'rv4', bookingId: 'BK004', caregiverId: '4', caregiverName: 'James Wilson', rating: 5, reviewText: 'Excellent care and professionalism.', submittedAt: '2024-04-02', flagged: false },
    ],
    reviewsReceived: [
      { id: 'rr3', bookingId: 'BK004', caregiverId: '4', caregiverName: 'James Wilson', rating: 5, notes: 'Great client, follows care instructions well.', submittedAt: '2024-04-02' },
    ],
    avgRatingGiven: 5.0,
    avgRatingReceived: 5.0,
    communications: [],
    notificationPreferences: {
      bookingConfirmation: true,
      replacementAlerts: true,
      paymentReceipts: true,
      disputeUpdates: true,
      generalUpdates: false,
    },
    adminNotes: [],
  },
  {
    id: 'CL004',
    fullName: 'Robert Wilson',
    email: 'robert.wilson@email.com',
    phone: '555-5004',
    dateOfBirth: '1970-05-18',
    gender: 'Male',
    preferredLanguage: 'English',
    primaryAddress: '321 Cedar Lane, Los Angeles, CA 90001',
    alternateAddresses: ['100 Oak Street, Pasadena, CA 91101'],
    accountType: 'Family Manager',
    howFoundPlatform: 'Org Referral',
    preferredContactMethod: 'App notification',
    emergencyContact: { name: 'Susan Wilson', relationship: 'Wife', phone: '555-5014' },
    joinedDate: '2024-02-01',
    lastActiveDate: '2024-04-18',
    status: 'Active',
    flagged: true,
    flags: [
      { id: 'fl1', type: 'High Dispute Rate', reason: 'Client has filed disputes on 2 of last 5 bookings', flaggedBy: 'System', flaggedAt: '2024-04-16', status: 'Active' },
    ],
    riskScore: 'Medium',
    totalSpent: 560,
    outstandingBalance: 0,
    paymentMethods: [
      { id: 'pm5', type: 'Amex', last4: '3782', expiryDate: '11/26', isDefault: true },
    ],
    billingHistory: [
      { id: 'bl5', bookingId: 'BK005', description: 'HHA Care - Robert Martinez', amount: 109.2, paymentMethod: 'Amex ****3782', status: 'Pending', processedAt: '2024-04-18' },
    ],
    careRecipients: [
      {
        id: 'CR005',
        clientId: 'CL004',
        fullName: 'Helen Wilson',
        dateOfBirth: '1938-02-14',
        age: 86,
        gender: 'Female',
        relationshipToClient: 'Parent',
        primaryAddress: '100 Oak Street, Pasadena, CA 91101',
        emergencyContact: { name: 'Robert Wilson', relationship: 'Son', phone: '555-5004' },
        primaryCondition: 'Parkinson\'s disease',
        secondaryConditions: ['Depression'],
        mobilityLevel: 'Wheelchair',
        cognitiveStatus: 'Mild impairment',
        communication: 'Normal',
        allergies: ['Sulfa drugs'],
        currentMedications: [
          { name: 'Levodopa', dosage: '250mg', frequency: 'Three times daily' },
          { name: 'Sertraline', dosage: '50mg', frequency: 'Once daily' },
        ],
        behavioralNotes: ['May have tremors during meals', 'Needs assistance with fine motor tasks'],
        dietaryRestrictions: [],
        preferredRoutine: 'Medication must be given exactly on schedule',
        doNotDoList: ['Do not rush during meals - swallowing difficulties'],
        preferredCaregiverGender: 'Female',
        preferredLanguages: ['English', 'Spanish'],
        preferredCaregivers: [],
        blockedCaregivers: [{ id: '5', name: 'Lisa Anderson', reason: 'Previous incident - arrived late and was unprofessional' }],
        serviceTypesNeeded: ['HHA'],
        hhaTasks: ['Cooking', 'Cleaning', 'Mobility Assist'],
        hasActiveServices: true,
        lastServiceDate: '2024-04-18',
      },
    ],
    totalBookings: 6,
    completedBookings: 3,
    cancelledBookings: 1,
    disputedBookings: 2,
    activeBookingCount: 1,
    carePlanIds: [],
    reviewsGiven: [
      { id: 'rv5', bookingId: 'BK005', caregiverId: '6', caregiverName: 'Robert Martinez', rating: 2, reviewText: 'Service was not up to standards.', submittedAt: '2024-04-16', flagged: false },
    ],
    reviewsReceived: [
      { id: 'rr4', bookingId: 'BK005', caregiverId: '6', caregiverName: 'Robert Martinez', rating: 3, notes: 'Client has high expectations, can be difficult to please.', submittedAt: '2024-04-16' },
    ],
    avgRatingGiven: 2.0,
    avgRatingReceived: 3.0,
    communications: [
      { id: 'com4', type: 'Replacement alert', channel: 'App', subject: 'Caregiver Replacement', preview: 'Your caregiver has been replaced...', status: 'Read', sentAt: '2024-04-18' },
    ],
    notificationPreferences: {
      bookingConfirmation: true,
      replacementAlerts: true,
      paymentReceipts: true,
      disputeUpdates: true,
      generalUpdates: true,
    },
    adminNotes: [
      { id: 'an2', content: 'Client has complained about multiple caregivers. Consider review before next booking.', author: 'Admin', createdAt: '2024-04-16' },
    ],
  },
  {
    id: 'CL005',
    fullName: 'Margaret Anderson',
    email: 'margaret.anderson@email.com',
    phone: '555-5005',
    dateOfBirth: '1952-09-30',
    gender: 'Female',
    preferredLanguage: 'English',
    primaryAddress: '567 Birch Road, Seattle, WA 98101',
    alternateAddresses: [],
    accountType: 'Self',
    howFoundPlatform: 'Organic',
    preferredContactMethod: 'Email',
    emergencyContact: { name: 'David Anderson', relationship: 'Son', phone: '555-5015' },
    joinedDate: '2024-03-15',
    lastActiveDate: '2024-04-19',
    status: 'Suspended',
    flagged: true,
    flags: [
      { id: 'fl2', type: 'Payment Default', reason: 'Failed payment on last 2 bookings', flaggedBy: 'System', flaggedAt: '2024-04-15', status: 'Active' },
    ],
    riskScore: 'High',
    totalSpent: 180,
    outstandingBalance: 180,
    paymentMethods: [
      { id: 'pm6', type: 'Visa', last4: '9999', expiryDate: '01/24', isDefault: true },
    ],
    billingHistory: [
      { id: 'bl6', bookingId: 'BK007', description: 'CNA Care - Sarah Johnson', amount: 180, paymentMethod: 'Visa ****9999', status: 'Failed', processedAt: '2024-04-19' },
    ],
    careRecipients: [
      {
        id: 'CR006',
        clientId: 'CL005',
        fullName: 'Margaret Anderson',
        dateOfBirth: '1952-09-30',
        age: 71,
        gender: 'Female',
        relationshipToClient: 'Self',
        primaryAddress: '567 Birch Road, Seattle, WA 98101',
        emergencyContact: { name: 'David Anderson', relationship: 'Son', phone: '555-5015' },
        primaryCondition: 'Heart disease',
        secondaryConditions: ['High cholesterol'],
        mobilityLevel: 'Fully mobile',
        cognitiveStatus: 'Alert',
        communication: 'Hearing impaired',
        allergies: [],
        currentMedications: [
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' },
          { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily' },
        ],
        behavioralNotes: ['Needs to speak loudly due to hearing issues'],
        dietaryRestrictions: ['Low fat', 'Low sodium'],
        preferredRoutine: 'Prefers morning appointments',
        doNotDoList: [],
        preferredCaregiverGender: 'No preference',
        preferredLanguages: ['English'],
        preferredCaregivers: [],
        blockedCaregivers: [],
        serviceTypesNeeded: ['CNA'],
        hhaTasks: [],
        hasActiveServices: false,
        lastServiceDate: '2024-04-19',
      },
    ],
    totalBookings: 2,
    completedBookings: 1,
    cancelledBookings: 0,
    disputedBookings: 0,
    activeBookingCount: 0,
    carePlanIds: [],
    reviewsGiven: [],
    reviewsReceived: [],
    avgRatingGiven: 0,
    avgRatingReceived: 0,
    communications: [
      { id: 'com5', type: 'General', channel: 'Email', subject: 'Payment Failed', preview: 'Your payment method has been declined...', status: 'Delivered', sentAt: '2024-04-19' },
    ],
    notificationPreferences: {
      bookingConfirmation: true,
      replacementAlerts: true,
      paymentReceipts: true,
      disputeUpdates: true,
      generalUpdates: false,
    },
    adminNotes: [
      { id: 'an3', content: 'Account suspended due to payment issues. Contact client about updating payment method.', author: 'Admin', createdAt: '2024-04-19' },
    ],
  },
  {
    id: 'CL006',
    fullName: 'Thomas Lee',
    email: 'thomas.lee@email.com',
    phone: '555-5006',
    dateOfBirth: '1968-04-12',
    gender: 'Male',
    preferredLanguage: 'English',
    primaryAddress: '890 Maple Drive, Denver, CO 80201',
    alternateAddresses: [],
    accountType: 'Family Manager',
    howFoundPlatform: 'Referral',
    preferredContactMethod: 'SMS',
    emergencyContact: { name: 'Linda Lee', relationship: 'Sister', phone: '555-5016' },
    joinedDate: '2024-02-20',
    lastActiveDate: '2024-04-14',
    status: 'Active',
    flagged: false,
    flags: [],
    riskScore: 'Low',
    totalSpent: 420,
    outstandingBalance: 0,
    paymentMethods: [
      { id: 'pm7', type: 'Mastercard', last4: '7777', expiryDate: '06/27', isDefault: true },
    ],
    billingHistory: [
      { id: 'bl7', bookingId: 'BK008', description: 'HHA Care - Emily Chen', amount: 28, paymentMethod: 'Mastercard ****7777', status: 'Refunded', processedAt: '2024-04-18' },
    ],
    careRecipients: [
      {
        id: 'CR007',
        clientId: 'CL006',
        fullName: 'George Lee',
        dateOfBirth: '1940-10-08',
        age: 83,
        gender: 'Male',
        relationshipToClient: 'Parent',
        primaryAddress: '890 Maple Drive, Denver, CO 80201',
        emergencyContact: { name: 'Thomas Lee', relationship: 'Son', phone: '555-5006' },
        primaryCondition: 'Stroke recovery',
        secondaryConditions: ['Speech difficulties', 'Right-side weakness'],
        mobilityLevel: 'Assisted mobility',
        cognitiveStatus: 'Mild impairment',
        communication: 'Speech impaired',
        allergies: ['Codeine'],
        currentMedications: [
          { name: 'Clopidogrel', dosage: '75mg', frequency: 'Once daily' },
          { name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily' },
        ],
        behavioralNotes: ['May get frustrated with communication difficulties', 'Uses communication board'],
        dietaryRestrictions: ['Pureed foods due to swallowing difficulty'],
        preferredRoutine: 'Speech therapy exercises in morning, rest in afternoon',
        doNotDoList: ['Do not give thin liquids - choking hazard', 'Do not leave unattended when eating'],
        preferredCaregiverGender: 'Male',
        preferredLanguages: ['English'],
        preferredCaregivers: [],
        blockedCaregivers: [],
        serviceTypesNeeded: ['CNA', 'HHA'],
        hhaTasks: ['Cooking', 'Mobility Assist', 'Errands'],
        hasActiveServices: false,
        lastServiceDate: '2024-04-14',
      },
    ],
    totalBookings: 5,
    completedBookings: 4,
    cancelledBookings: 0,
    disputedBookings: 1,
    activeBookingCount: 0,
    carePlanIds: [],
    reviewsGiven: [
      { id: 'rv6', bookingId: 'BK008', caregiverId: '3', caregiverName: 'Emily Chen', rating: 2, reviewText: 'Tasks not completed to satisfaction.', submittedAt: '2024-04-15', flagged: false },
    ],
    reviewsReceived: [
      { id: 'rr5', bookingId: 'BK008', caregiverId: '3', caregiverName: 'Emily Chen', rating: 4, notes: 'Client was understanding about the situation.', submittedAt: '2024-04-15' },
    ],
    avgRatingGiven: 2.0,
    avgRatingReceived: 4.0,
    communications: [
      { id: 'com6', type: 'Dispute update', channel: 'Email', subject: 'Dispute Resolution', preview: 'Your dispute has been reviewed...', status: 'Read', sentAt: '2024-04-18' },
    ],
    notificationPreferences: {
      bookingConfirmation: true,
      replacementAlerts: true,
      paymentReceipts: true,
      disputeUpdates: true,
      generalUpdates: true,
    },
    adminNotes: [],
  },
]

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'City Health Care',
    description: 'Premier healthcare provider in urban areas',
    status: 'Active',
    totalCaregivers: 24,
    activeCaregivers: 22,
    certificationsIssued: 18,
    totalBookings: 156,
    contactInfo: {
      name: 'Dr. Robert Smith',
      email: 'contact@cityhealthcare.com',
      phone: '555-1000',
      address: '123 Main St, New York, NY 10001',
    },
    foundedDate: '2015-05-10',
    certifications: [
      { type: 'CNA', count: 12 },
      { type: 'HHA', count: 6 },
    ],
    caregivers: ['1', '4'],
  },
  {
    id: '2',
    name: 'Wellness Services Inc',
    description: 'Comprehensive home health and wellness solutions',
    status: 'Active',
    totalCaregivers: 18,
    activeCaregivers: 17,
    certificationsIssued: 14,
    totalBookings: 124,
    contactInfo: {
      name: 'Margaret Johnson',
      email: 'info@wellnessservices.com',
      phone: '555-2000',
      address: '456 Oak Ave, Boston, MA 02101',
    },
    foundedDate: '2018-03-15',
    certifications: [
      { type: 'CNA', count: 8 },
      { type: 'HHA', count: 6 },
    ],
    caregivers: ['2'],
  },
  {
    id: '3',
    name: 'Community Care Partners',
    description: 'Community-focused care solutions',
    status: 'Active',
    totalCaregivers: 12,
    activeCaregivers: 11,
    certificationsIssued: 8,
    totalBookings: 87,
    contactInfo: {
      name: 'Emily Davis',
      email: 'contact@communitycare.com',
      phone: '555-3000',
      address: '789 Pine Rd, Chicago, IL 60601',
    },
    foundedDate: '2019-08-20',
    certifications: [
      { type: 'CNA', count: 4 },
      { type: 'HHA', count: 4 },
    ],
    caregivers: ['5'],
  },
]

export function useCaregivers() {
  const [caregivers] = useState<Caregiver[]>(mockCaregivers)

  const getActiveCaregivers = useMemo(
    () => () => caregivers.filter(c => c.status === 'Active'),
    [caregivers]
  )

  const getAtRiskCaregivers = useMemo(
    () => () => caregivers.filter(c => c.strikeCount >= 2),
    [caregivers]
  )

  const getCaregiverById = useMemo(
    () => (id: string) => caregivers.find(c => c.id === id),
    [caregivers]
  )

  return {
    caregivers,
    getActiveCaregivers,
    getAtRiskCaregivers,
    getCaregiverById,
  }
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)

  const getActiveBookings = useMemo(
    () => () => bookings.filter(b => b.status === 'In Progress' || b.status === 'Scheduled'),
    [bookings]
  )

  const getDisruptedBookings = useMemo(
    () => () => bookings.filter(b => b.status === 'Disrupted'),
    [bookings]
  )

  const getBookingById = useMemo(
    () => (id: string) => bookings.find(b => b.id === id),
    [bookings]
  )

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const updateSeries = (seriesId: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.recurringSeriesId === seriesId ? { ...b, ...updates } : b))
  }

  // Financial Actions
  const processRefund = (id: string, amount: number, reason: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b
      const newPayment: PaymentRecord = {
        id: `REF-${Math.random().toString(36).substr(2, 9)}`,
        amount: -amount,
        status: 'Processed',
        processedAt: new Date().toISOString(),
        method: 'Bank Transfer',
        notes: `Refund: ${reason}`
      }
      return { 
        ...b, 
        status: amount >= (b.finalRate * b.totalHours) ? 'Cancelled' : b.status,
        payment: [...b.payment, newPayment],
        activityLog: [...b.activityLog, {
          timestamp: new Date().toISOString(),
          action: 'Refund Processed',
          performedBy: 'Admin',
          details: `${reason} - $${amount} refunded`
        }]
      }
    }))
  }

  const completeServiceWithPayout = (id: string, actualHours: number) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b
      
      const totalAmount = b.finalRate * b.totalHours
      const caregiverPayout = totalAmount * 0.85 // 85% payout
      const platformFee = totalAmount * 0.15 // 15% commission

      return {
        ...b,
        status: 'Completed',
        activityLog: [...b.activityLog, {
          timestamp: new Date().toISOString(),
          action: 'Service Completed',
          performedBy: 'System',
          details: `Payout calculated: Caregiver gets $${caregiverPayout.toFixed(2)}, Platform keeps $${platformFee.toFixed(2)}`
        }]
      }
    }))
  }

  const requestReplacement = (bookingId: string, replacementCaregiverId: string, replacementCaregiverName: string, reason: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b
      
      const newReplacementEvent: ReplacementEvent = {
        originalCaregiverId: b.caregiverId,
        originalCaregiverName: b.caregiverName || 'Unknown',
        replacementCaregiverId,
        replacementCaregiverName,
        reason,
        strikeApplied: 1, // Automatic strike for replacement request
        surgeMultiplier: 1.5, // Emergency replacement surge
        surgeRate: b.finalRate * 1.5,
        createdAt: new Date().toISOString().split('T')[0]
      }

      return {
        ...b,
        status: 'Replacement In Progress',
        caregiverId: replacementCaregiverId,
        caregiverName: replacementCaregiverName,
        replacementHistory: [...b.replacementHistory, newReplacementEvent],
        activityLog: [...b.activityLog, {
          timestamp: new Date().toISOString(),
          action: 'Replacement Requested',
          performedBy: 'Admin',
          details: `Requested replacement: ${replacementCaregiverName}. Reason: ${reason}`
        }]
      }
    }))
  }

  return {
    bookings,
    getActiveBookings,
    getDisruptedBookings,
    getBookingById,
    updateBooking,
    updateSeries,
    processRefund,
    completeServiceWithPayout,
    requestReplacement,
  }
}

export function useOrganizations() {
  const [organizations] = useState<Organization[]>(mockOrganizations)

  const getOrganizationById = useMemo(
    () => (id: string) => organizations.find(o => o.id === id),
    [organizations]
  )

  return {
    organizations,
    getOrganizationById,
  }
}

export function useCarePlans() {
  const [carePlans] = useState<CarePlan[]>(mockCarePlans)

  const getCarePlanById = useMemo(
    () => (id: string) => carePlans.find(cp => cp.id === id),
    [carePlans]
  )

  return {
    carePlans,
    getCarePlanById,
  }
}

const mockApplications: CaregiverApplication[] = [
  {
    id: 'APP001',
    applicantName: 'David Thompson',
    email: 'david.thompson@email.com',
    phone: '555-0201',
    appliedDate: '2024-04-01',
    requestedServiceTypes: ['CNA'],
    currentStage: 'Initial Screening',
    stageHistory: [
      { stage: 'Application Submitted', status: 'Completed', completedAt: '2024-04-01' },
      { stage: 'Initial Screening', status: 'In Progress', notes: 'Reviewing application' }
    ],
    documents: [
      { id: 'doc1', name: 'Resume', type: 'Other', status: 'Verified', uploadedAt: '2024-04-01' }
    ],
    backgroundCheckStatus: 'Not Started',
    referencesProvided: 2,
    onboardingProgress: 15,
  },
  {
    id: 'APP002',
    applicantName: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    phone: '555-0202',
    appliedDate: '2024-03-28',
    requestedServiceTypes: ['HHA'],
    currentStage: 'Document Review',
    stageHistory: [
      { stage: 'Application Submitted', status: 'Completed', completedAt: '2024-03-28' },
      { stage: 'Initial Screening', status: 'Completed', completedAt: '2024-03-30' },
      { stage: 'Document Review', status: 'In Progress' }
    ],
    documents: [
      { id: 'doc2', name: 'Government ID', type: 'Government ID', status: 'Verified', uploadedAt: '2024-03-28', verifiedBy: 'Admin', verifiedAt: '2024-03-29' }
    ],
    backgroundCheckStatus: 'Pending',
    referencesProvided: 3,
    onboardingProgress: 30,
  },
  {
    id: 'APP003',
    applicantName: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '555-0203',
    appliedDate: '2024-03-15',
    requestedServiceTypes: ['CNA', 'HHA'],
    currentStage: 'Background Check',
    stageHistory: [
      { stage: 'Application Submitted', status: 'Completed', completedAt: '2024-03-15' },
      { stage: 'Initial Screening', status: 'Completed', completedAt: '2024-03-17' },
      { stage: 'Document Review', status: 'Completed', completedAt: '2024-03-20' },
      { stage: 'Background Check', status: 'In Progress', notes: 'Waiting for agency response' }
    ],
    documents: [
      { id: 'doc3', name: 'Government ID', type: 'Government ID', status: 'Verified', uploadedAt: '2024-03-15', verifiedBy: 'Admin', verifiedAt: '2024-03-16' },
      { id: 'doc4', name: 'Resume', type: 'Other', status: 'Verified', uploadedAt: '2024-03-15' }
    ],
    backgroundCheckStatus: 'Pending',
    referencesProvided: 4,
    onboardingProgress: 45,
  },
  {
    id: 'APP004',
    applicantName: 'Amanda Martinez',
    email: 'amanda.martinez@email.com',
    phone: '555-0204',
    appliedDate: '2024-03-10',
    requestedServiceTypes: ['HHA'],
    currentStage: 'Interview Completed',
    stageHistory: [
      { stage: 'Application Submitted', status: 'Completed', completedAt: '2024-03-10' },
      { stage: 'Initial Screening', status: 'Completed', completedAt: '2024-03-12' },
      { stage: 'Document Review', status: 'Completed', completedAt: '2024-03-14' },
      { stage: 'Background Check', status: 'Completed', completedAt: '2024-03-20' },
      { stage: 'Interview Scheduled', status: 'Completed', completedAt: '2024-03-25' },
      { stage: 'Interview Completed', status: 'Completed', completedAt: '2024-04-05', notes: 'Strong candidate' }
    ],
    documents: [
      { id: 'doc5', name: 'Background Check', type: 'Background Check', status: 'Verified', uploadedAt: '2024-03-20', expiryDate: '2027-03-20', verifiedBy: 'Admin', verifiedAt: '2024-03-21' }
    ],
    backgroundCheckStatus: 'Passed',
    interviewScheduledAt: '2024-03-25',
    interviewedBy: 'Admin',
    interviewNotes: 'Great communication skills, ready for onboarding',
    referencesProvided: 3,
    onboardingProgress: 75,
  },
  {
    id: 'APP005',
    applicantName: 'Christopher Davis',
    email: 'christopher.davis@email.com',
    phone: '555-0205',
    appliedDate: '2024-02-20',
    requestedServiceTypes: ['CNA'],
    currentStage: 'Final Review',
    stageHistory: [
      { stage: 'Application Submitted', status: 'Completed', completedAt: '2024-02-20' },
      { stage: 'Initial Screening', status: 'Completed', completedAt: '2024-02-22' },
      { stage: 'Document Review', status: 'Completed', completedAt: '2024-02-24' },
      { stage: 'Background Check', status: 'Completed', completedAt: '2024-03-05' },
      { stage: 'Interview Scheduled', status: 'Completed', completedAt: '2024-03-10' },
      { stage: 'Interview Completed', status: 'Completed', completedAt: '2024-03-15' },
      { stage: 'Final Review', status: 'In Progress' }
    ],
    documents: [],
    backgroundCheckStatus: 'Passed',
    interviewScheduledAt: '2024-03-10',
    interviewedBy: 'Manager',
    referencesProvided: 3,
    onboardingProgress: 85,
  },
  {
    id: 'APP006',
    applicantName: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '555-0206',
    appliedDate: '2024-02-01',
    requestedServiceTypes: ['CNA', 'HHA'],
    currentStage: 'Approved',
    stageHistory: [
      { stage: 'Application Submitted', status: 'Completed', completedAt: '2024-02-01' },
      { stage: 'Initial Screening', status: 'Completed', completedAt: '2024-02-03' },
      { stage: 'Document Review', status: 'Completed', completedAt: '2024-02-05' },
      { stage: 'Background Check', status: 'Completed', completedAt: '2024-02-15' },
      { stage: 'Interview Scheduled', status: 'Completed', completedAt: '2024-02-20' },
      { stage: 'Interview Completed', status: 'Completed', completedAt: '2024-02-22' },
      { stage: 'Final Review', status: 'Completed', completedAt: '2024-02-28' },
      { stage: 'Approved', status: 'Completed', completedAt: '2024-03-05' }
    ],
    documents: [],
    backgroundCheckStatus: 'Passed',
    interviewScheduledAt: '2024-02-20',
    interviewedBy: 'Manager',
    approvedBy: 'Admin',
    approvalNotes: 'Excellent candidate, approved for immediate onboarding',
    referencesProvided: 4,
    onboardingProgress: 100,
  },
  {
    id: 'APP007',
    applicantName: 'Kevin Anderson',
    email: 'kevin.anderson@email.com',
    phone: '555-0207',
    appliedDate: '2024-01-15',
    requestedServiceTypes: ['HHA'],
    currentStage: 'Rejected',
    stageHistory: [
      { stage: 'Application Submitted', status: 'Completed', completedAt: '2024-01-15' },
      { stage: 'Initial Screening', status: 'Completed', completedAt: '2024-01-17' },
      { stage: 'Document Review', status: 'Rejected', completedAt: '2024-01-20', notes: 'Missing required certifications' }
    ],
    documents: [],
    backgroundCheckStatus: 'Not Started',
    referencesProvided: 1,
    onboardingProgress: 5,
    rejectionReason: 'Does not meet minimum certification requirements',
  },
]

export function useCaregiverApplications() {
  const [applications, setApplications] = useState<CaregiverApplication[]>(mockApplications)

  const getApplicationById = useMemo(
    () => (id: string) => applications.find(app => app.id === id),
    [applications]
  )

  const getApplicationsByStage = useMemo(
    () => (stage: string) => applications.filter(app => app.currentStage === stage),
    [applications]
  )

  const getPendingApplications = useMemo(
    () => () => applications.filter(app => app.currentStage !== 'Approved' && app.currentStage !== 'Rejected'),
    [applications]
  )

  const updateApplication = (id: string, updates: Partial<CaregiverApplication>) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ))
  }

  const updateStage = (id: string, stageName: CaregiverApplication['currentStage'], status: ApplicationStage['status'], notes?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app

      const now = new Date().toISOString()
      const newStage: ApplicationStage = {
        stage: stageName,
        status: status,
        completedAt: status === 'Completed' ? now : undefined,
        notes: notes
      }

      // Update history: if stage exists, update it, otherwise add it
      const existingStageIndex = app.stageHistory.findIndex(s => s.stage === stageName)
      let newHistory = [...app.stageHistory]
      
      if (existingStageIndex >= 0) {
        newHistory[existingStageIndex] = { ...newHistory[existingStageIndex], ...newStage }
      } else {
        newHistory.push(newStage)
      }

      // Calculate progress based on stage
      const stages = [
        'Application Submitted',
        'Initial Screening',
        'Document Review',
        'Background Check',
        'Interview Scheduled',
        'Interview Completed',
        'Final Review',
        'Approved'
      ]
      const currentIdx = stages.indexOf(stageName)
      const progress = Math.min(100, Math.round(((currentIdx + (status === 'Completed' ? 1 : 0.5)) / stages.length) * 100))

      return {
        ...app,
        currentStage: stageName,
        stageHistory: newHistory,
        onboardingProgress: progress
      }
    }))
  }

  return {
    applications,
    getApplicationById,
    getApplicationsByStage,
    getPendingApplications,
    updateApplication,
    updateStage,
  }
}

export function useClients() {
  const [clients] = useState<Client[]>(mockClients)

  const getClientById = useMemo(
    () => (id: string) => clients.find(c => c.id === id),
    [clients]
  )

  const getActiveClients = useMemo(
    () => () => clients.filter(c => c.status === 'Active'),
    [clients]
  )

  const getFlaggedClients = useMemo(
    () => () => clients.filter(c => c.flagged),
    [clients]
  )

  const getClientsWithDisputes = useMemo(
    () => () => clients.filter(c => c.disputedBookings > 0),
    [clients]
  )

  const getAllCareRecipients = useMemo(
    () => () => clients.flatMap(c => c.careRecipients),
    [clients]
  )

  const getCareRecipientById = useMemo(
    () => (id: string) => {
      for (const client of clients) {
        const recipient = client.careRecipients.find(cr => cr.id === id)
        if (recipient) return { recipient, client }
      }
      return undefined
    },
    [clients]
  )

  // Stats
  const stats = useMemo(() => {
    const total = clients.length
    const active = clients.filter(c => {
      const lastActive = new Date(c.lastActiveDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return lastActive >= thirtyDaysAgo
    }).length
    const newThisMonth = clients.filter(c => {
      const joinedDate = new Date(c.joinedDate)
      const now = new Date()
      return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear()
    }).length
    const withDisputes = clients.filter(c => c.disputedBookings > 0).length
    const flagged = clients.filter(c => c.flagged).length
    const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0)

    return {
      total,
      active,
      newThisMonth,
      withDisputes,
      flagged,
      totalRevenue,
    }
  }, [clients])

  return {
    clients,
    getClientById,
    getActiveClients,
    getFlaggedClients,
    getClientsWithDisputes,
    getAllCareRecipients,
    getCareRecipientById,
    stats,
  }
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    bookingId: 'BK-001',
    clientName: 'Robert Fox',
    caregiverName: 'Sarah Johnson',
    totalAmount: 200,
    platformFee: 30,
    caregiverPayout: 170,
    status: 'Paid',
    createdAt: '2024-04-10',
    expectedPayoutDate: '2024-04-11',
    actualPayoutDate: '2024-04-11',
  },
  {
    id: 'TXN-002',
    bookingId: 'BK-002',
    clientName: 'Jane Cooper',
    caregiverName: 'Emily Chen',
    totalAmount: 150,
    platformFee: 22.5,
    caregiverPayout: 127.5,
    status: 'Ready',
    createdAt: '2024-04-20',
    expectedPayoutDate: '2024-04-22',
  },
  {
    id: 'TXN-003',
    bookingId: 'BK-003',
    clientName: 'Cody Fisher',
    caregiverName: 'Sarah Johnson',
    totalAmount: 45,
    platformFee: 6.75,
    caregiverPayout: 38.25,
    status: 'Ready',
    createdAt: '2024-04-21',
    expectedPayoutDate: '2024-04-23',
    adjustments: [
      { type: 'Penalty', amount: 45, reason: 'Late Cancellation Penalty (1hr charge)' }
    ]
  },
  {
    id: 'TXN-004',
    bookingId: 'BK-004',
    clientName: 'Esther Howard',
    caregiverName: 'Maria Garcia',
    totalAmount: 320,
    platformFee: 48,
    caregiverPayout: 272,
    status: 'Escrow',
    createdAt: '2024-04-22',
    expectedPayoutDate: '2024-04-25',
    adjustments: [
      { type: 'Overage', amount: 80, reason: '2 Hours Overage (Emergency stay)' }
    ]
  },
  {
    id: 'TXN-005',
    bookingId: 'BK-005',
    clientName: 'Cameron Williamson',
    caregiverName: 'James Wilson',
    totalAmount: 180,
    platformFee: 0,
    caregiverPayout: 180,
    status: 'Ready',
    createdAt: '2024-04-22',
    expectedPayoutDate: '2024-04-24',
    adjustments: [
      { type: 'Fee Adjustment', amount: 0, reason: 'Platform Fee Waived (Promotional)' }
    ]
  },
  {
    id: 'TXN-006',
    bookingId: 'BK-006',
    clientName: 'Jenny Wilson',
    caregiverName: 'Sarah Johnson',
    totalAmount: 120,
    platformFee: 18,
    caregiverPayout: 102,
    status: 'Refunded',
    createdAt: '2024-04-15',
    expectedPayoutDate: '2024-04-17',
    adjustments: [
      { type: 'Penalty', amount: -60, reason: 'Early Checkout (Finished 2 hrs early)' }
    ]
  },
  {
    id: 'TXN-007',
    bookingId: 'BK-007',
    clientName: 'Guy Hawkins',
    caregiverName: 'Maria Garcia',
    totalAmount: 250,
    platformFee: 37.5,
    caregiverPayout: 212.5,
    status: 'Disputed',
    createdAt: '2024-04-20',
    expectedPayoutDate: '2024-04-22',
    adjustments: [
      { type: 'Penalty', amount: 0, reason: 'Quality Issue: Client reported poor care' }
    ]
  },
  {
    id: 'TXN-008',
    bookingId: 'BK-008',
    clientName: 'Leslie Alexander',
    caregiverName: 'Emily Chen + Replacement',
    totalAmount: 400,
    platformFee: 60,
    caregiverPayout: 340,
    status: 'Escrow',
    createdAt: '2024-04-23',
    expectedPayoutDate: '2024-04-26',
    adjustments: [
      { type: 'Penalty', amount: 0, reason: 'Split Payout: Caregiver A (3h), Replacement (5h)' }
    ]
  },
  {
    id: 'TXN-009',
    bookingId: 'BK-009',
    clientName: 'Theresa Webb',
    caregiverName: 'James Wilson',
    totalAmount: 200,
    platformFee: 30,
    caregiverPayout: 220,
    status: 'Ready',
    createdAt: '2024-04-23',
    expectedPayoutDate: '2024-04-25',
    adjustments: [
      { type: 'Tip', amount: 50, reason: 'Post-service Tip from Client' }
    ]
  }
]

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)

  const stats = useMemo(() => {
    const totalVolume = transactions.reduce((sum, t) => sum + t.totalAmount, 0)
    const platformRevenue = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.platformFee, 0)
    const pendingPayouts = transactions.filter(t => t.status === 'Ready' || t.status === 'Escrow').reduce((sum, t) => sum + t.caregiverPayout, 0)
    const activeDisputes = transactions.filter(t => t.status === 'Disputed').length

    return {
      totalVolume,
      platformRevenue,
      pendingPayouts,
      activeDisputes
    }
  }, [transactions])

  const confirmPayout = (id: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'Paid', actualPayoutDate: new Date().toISOString() } : t
    ))
  }

  const processRefund = (id: string, amount: number) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'Refunded', totalAmount: t.totalAmount - amount } : t
    ))
  }

  const addAdjustment = (id: string, type: Transaction['adjustments'][0]['type'], amount: number, reason: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id !== id) return t
      const newTotal = t.totalAmount + amount
      return {
        ...t,
        totalAmount: newTotal,
        platformFee: newTotal * 0.15,
        caregiverPayout: newTotal * 0.85,
        adjustments: [...(t.adjustments || []), { type, amount, reason }]
      }
    }))
  }

  return {
    transactions,
    stats,
    confirmPayout,
    processRefund,
    addAdjustment,
  }
}

export type { Client, CareRecipient, ClientFlag, ClientPaymentMethod, ClientBillingRecord, ClientReview, CaregiverReviewOfClient, ClientCommunication, AdminNote, Transaction }
