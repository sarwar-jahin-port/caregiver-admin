'use client'

import { useState } from 'react'
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTransactions } from '@/lib/hooks/use-data'
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  MoreVertical,
  Undo2,
  PlusCircle,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentsPage() {
  const { transactions, stats, confirmPayout, processRefund, addAdjustment } = useTransactions()
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false)
  const [selectedTxn, setSelectedTxn] = useState<any>(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState('')
  const [adjustmentType, setAdjustmentType] = useState<any>('Tip')
  const [adjustmentReason, setAdjustmentReason] = useState('')

  const handleConfirmPayout = (id: string) => {
    confirmPayout(id)
    toast.success('Payout confirmed successfully')
  }

  const handleAdjustment = () => {
    if (!selectedTxn || !adjustmentAmount) return
    addAdjustment(selectedTxn.id, adjustmentType, parseFloat(adjustmentAmount), adjustmentReason)
    setIsAdjustmentOpen(false)
    resetAdjustment()
    toast.success('Adjustment applied successfully')
  }

  const resetAdjustment = () => {
    setAdjustmentAmount('')
    setAdjustmentReason('')
    setSelectedTxn(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Financial Center</h1>
          <p className="text-gray-600 mt-2">Manage caregiver payouts, platform revenue, and adjustments.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Automatic Payouts Enabled
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 relative overflow-hidden border-none shadow-md bg-white group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-500 mb-1">Total GSV</p>
          <p className="text-3xl font-bold text-gray-900">${stats.totalVolume.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-green-600 mt-2 text-xs font-bold bg-green-50 w-fit px-2 py-0.5 rounded">
            <ArrowUpRight className="w-3 h-3" />
            12.5%
          </div>
          <TrendingUp className="absolute bottom-4 right-4 text-blue-100 w-8 h-8" />
        </Card>

        <Card className="p-6 relative overflow-hidden border-none shadow-md bg-white group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-[#B91C4E]/5 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-500 mb-1">Platform Revenue (15%)</p>
          <p className="text-3xl font-bold text-[#B91C4E]">${stats.platformRevenue.toLocaleString()}</p>
          <div className="text-xs text-gray-400 mt-2">Accrued this month</div>
          <CreditCard className="absolute bottom-4 right-4 text-[#B91C4E]/10 w-8 h-8" />
        </Card>

        <Card className="p-6 relative overflow-hidden border-none shadow-md bg-white group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-500 mb-1">Held in Escrow</p>
          <p className="text-3xl font-bold text-amber-600">${stats.pendingPayouts.toLocaleString()}</p>
          <div className="text-xs text-gray-400 mt-2">Waiting for settlement</div>
          <Clock className="absolute bottom-4 right-4 text-amber-100 w-8 h-8" />
        </Card>

        <Card className="p-6 relative overflow-hidden border-none shadow-md bg-white group hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Active Disputes</p>
          <p className="text-3xl font-bold text-red-600">{stats.activeDisputes}</p>
          <div className="text-xs text-red-500 font-bold mt-2 hover:underline cursor-pointer">Needs immediate action</div>
          <AlertCircle className="absolute bottom-4 right-4 text-red-100 w-8 h-8" />
        </Card>
      </div>

      {/* Main Content Areas */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <TabsList className="bg-transparent gap-1">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-[#B91C4E] data-[state=active]:text-white">All Transactions</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-[#B91C4E] data-[state=active]:text-white">Pending Settlements</TabsTrigger>
            <TabsTrigger value="paid" className="rounded-lg data-[state=active]:bg-[#B91C4E] data-[state=active]:text-white">Paid Out</TabsTrigger>
            <TabsTrigger value="issues" className="rounded-lg data-[state=active]:bg-[#B91C4E] data-[state=active]:text-white">Issues & Disputes</TabsTrigger>
          </TabsList>
          <div className="flex gap-2 px-2">
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              Download CSV
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <Card className="border-none shadow-md overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Client & Caregiver</TableHead>
                  <TableHead>Amount (GSV)</TableHead>
                  <TableHead>15% Fee</TableHead>
                  <TableHead>Caregiver Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Estimated Payout</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id} className="group transition-colors hover:bg-gray-50/50">
                    <TableCell className="font-mono text-xs text-gray-500 font-medium">#{txn.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{txn.clientName}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          Caregiver: <span className="font-medium text-[#B91C4E]">{txn.caregiverName}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-gray-900">${txn.totalAmount.toLocaleString()}</div>
                      {txn.adjustments && txn.adjustments.length > 0 && (
                        <div className="flex flex-col gap-1 mt-1">
                          {txn.adjustments.map((adj, i) => (
                            <Badge key={i} variant="outline" className={`text-[10px] py-0 h-4 border-amber-200 ${adj.amount < 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-amber-700 bg-amber-50'}`}>
                              {adj.reason} ({adj.amount > 0 ? '+' : ''}{adj.amount}$)
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-600">${txn.platformFee.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-bold text-green-700">${txn.caregiverPayout.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`
                        ${txn.status === 'Paid' ? 'bg-green-100 text-green-700' : ''}
                        ${txn.status === 'Ready' ? 'bg-blue-100 text-blue-700 animate-pulse' : ''}
                        ${txn.status === 'Escrow' ? 'bg-amber-100 text-amber-700' : ''}
                        ${txn.status === 'Disputed' ? 'bg-red-100 text-red-700' : ''}
                        ${txn.status === 'Refunded' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {txn.status === 'Ready' && <Clock className="w-3 h-3 mr-1" />}
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 italic">
                        {txn.status === 'Paid' ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            {txn.actualPayoutDate}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-500">
                            {txn.expectedPayoutDate}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {txn.status === 'Ready' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-bold"
                            onClick={() => handleConfirmPayout(txn.id)}
                          >
                            Release Funds
                          </Button>
                        )}
                        {txn.status === 'Disputed' && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="font-bold flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3" /> Mediate
                          </Button>
                        )}
                        <Dialog open={isAdjustmentOpen} onOpenChange={(val) => {
                          setIsAdjustmentOpen(val);
                          if(!val) resetAdjustment();
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full" onClick={() => setSelectedTxn(txn)}>
                              <PlusCircle className="w-4 h-4 text-gray-400" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Adjust Transaction</DialogTitle>
                              <DialogDescription>
                                Add a manual adjustment to #{txn.id}. This will recalculate the 85/15 split.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">Type</Label>
                                <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Tip">Caregiver Tip (post-service)</SelectItem>
                                    <SelectItem value="Overage">Extra Hours/Overage</SelectItem>
                                    <SelectItem value="Penalty">Late/Service Penalty</SelectItem>
                                    <SelectItem value="Fee Adjustment">Platform Fee Wavier</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">Amount ($)</Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  placeholder="25.00"
                                  className="col-span-3"
                                  value={adjustmentAmount}
                                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reason" className="text-right">Reason</Label>
                                <Input
                                  id="reason"
                                  placeholder="e.g., Client requested extra 30 mins"
                                  className="col-span-3"
                                  value={adjustmentReason}
                                  onChange={(e) => setAdjustmentReason(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAdjustmentOpen(false)}>Cancel</Button>
                              <Button className="bg-[#B91C4E]" onClick={handleAdjustment}>Save Adjustment</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="m-0">
          <Card className="p-12 text-center border-dashed border-2 flex flex-col items-center justify-center bg-gray-50">
             <Clock className="w-12 h-12 text-amber-400 mb-4 opacity-50" />
             <h3 className="text-lg font-bold text-gray-900">Filter View: Pending Settlements</h3>
             <p className="text-gray-500 max-w-sm mt-2">Currently showing only Escrow and Ready-to-release transactions.</p>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="m-0">
          <Card className="border-none shadow-md overflow-hidden">
            <Table>
              <TableHeader className="bg-red-50/50">
                <TableRow className="hover:bg-transparent border-b border-red-100">
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Client & Caregiver</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Issue Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Mediation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.filter(t => t.status === 'Disputed' || t.status === 'Refunded').map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-red-50/30">
                    <TableCell className="font-mono text-xs text-gray-500 font-medium">#{txn.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{txn.clientName}</span>
                        <span className="text-xs text-gray-500 italic">Target: {txn.caregiverName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-red-700">${txn.totalAmount}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {txn.adjustments?.map((adj, i) => (
                          <div key={i} className="text-xs text-gray-600 flex items-center gap-1">
                             <AlertCircle className="w-3 h-3 text-red-500" />
                             {adj.reason}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={txn.status === 'Disputed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}>
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-bold">
                         Handle Ticket
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Low row: Platform Health & Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="p-6 border-none shadow-md bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" /> Payout System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400 text-sm">Escrow Wallet Balance</span>
              <span className="font-mono text-xl text-green-400">$124,500.00</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400 text-sm">Last Automated Run</span>
              <span className="text-sm font-medium">14 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Stripe Connection</span>
              <Badge className="bg-green-500/20 text-green-400 border-none">Stable</Badge>
            </div>
          </div>
          <Button className="w-full mt-6 bg-white text-gray-900 hover:bg-gray-100 font-bold">
            Emergency Pause Manual Trigger
          </Button>
        </Card>

        <Card className="p-6 border-none shadow-md">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#B91C4E]" /> Recent Financial Activity
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-[220px] pr-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 group">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                   <ArrowUpRight className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payout Released for Sarah Johnson</p>
                  <p className="text-xs text-gray-500 font-medium">Txn: #TXN00{i} • April 2{i}, 2024</p>
                </div>
                <div className="ml-auto text-sm font-mono font-bold text-gray-400">+$153.00</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
