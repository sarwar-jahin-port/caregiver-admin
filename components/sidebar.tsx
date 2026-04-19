'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Heart, Users, Calendar, Briefcase, ClipboardList, AlertTriangle, Sliders, ChevronDown, FileCheck, AlertCircle, Activity, Repeat2, Scale, UserCircle, Flag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function Sidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    caregivers: true,
    clients: true,
    bookings: true,
  })

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: Sliders,
    },
    {
      label: 'Caregivers',
      icon: Users,
      submenu: true,
      subItems: [
        { label: 'All Caregivers', href: '/caregivers', icon: Users },
        { label: 'Applications', href: '/caregivers/applications', icon: FileCheck, badge: '3' },
        { label: 'Penalties', href: '/caregivers/penalties', icon: AlertCircle, badge: '2' },
      ]
    },
    {
      label: 'Clients',
      icon: UserCircle,
      submenu: true,
      subItems: [
        { label: 'All Clients', href: '/clients', icon: UserCircle },
        { label: 'Care Recipients', href: '/clients/care-recipients', icon: Heart },
        { label: 'Flagged Clients', href: '/clients/flagged', icon: Flag, badge: '2' },
      ]
    },
    {
      label: 'Bookings',
      icon: Calendar,
      submenu: true,
      subItems: [
        { label: 'All Bookings', href: '/bookings', icon: Calendar },
        { label: 'Live Monitor', href: '/bookings/monitor', icon: Activity, badge: '2' },
        { label: 'Care Plans', href: '/care-plans', icon: ClipboardList },
        { label: 'Disputes', href: '/bookings/disputes', icon: Scale, badge: '1' },
        { label: 'Recurring Series', href: '/bookings/recurring', icon: Repeat2 },
      ]
    },
    {
      label: 'Organizations',
      href: '/organizations',
      icon: Briefcase,
    },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#B91C4E] flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">CareGiver</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item: any) => {
          const Icon = item.icon
          const active = item.href ? isActive(item.href) : expandedMenus[item.label.toLowerCase()]
          
          if (item.submenu) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label.toLowerCase())}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    expandedMenus[item.label.toLowerCase()]
                      ? 'bg-purple-50 text-[#B91C4E]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus[item.label.toLowerCase()] ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedMenus[item.label.toLowerCase()] && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-0">
                    {item.subItems.map((subItem: any) => {
                      const SubIcon = subItem.icon
                      const subActive = isActive(subItem.href)
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                            subActive
                              ? 'bg-[#B91C4E] text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span className="flex-1">{subItem.label}</span>
                          {subItem.badge && (
                            <Badge className="bg-red-100 text-red-800 text-xs">{subItem.badge}</Badge>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                active
                  ? 'bg-[#B91C4E] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Admin Dashboard</p>
          <p className="mt-1">v1.0</p>
        </div>
      </div>
    </div>
  )
}
