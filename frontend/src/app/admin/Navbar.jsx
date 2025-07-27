"use client"

import React from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Home, 
  User, 
  LayoutDashboard, 
  Plus, 
  Settings, 
  Users, 
  LogOut,
  Crown
} from "lucide-react"

const Navbar = () => {
  const router = useRouter()

  const handleLogout = () => {
    // Clear all possible authentication data
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear specific auth items
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    
    // Clear session storage
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminUser')
    
    // Clear cookies (if any)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    })
    
    // Force page reload to clear any cached state
    window.location.href = '/login'
    
    // Alternative: Use Next.js router (uncomment if you prefer)
    // router.push('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-2xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ADMIN PANEL
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                href="/admin/admin-profile" 
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link 
                href="/admin" 
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                href="/admin/add-project" 
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Link>
              <Link 
                href="/admin/manage-project" 
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                Manage Projects
              </Link>
              <Link 
                href="/admin/manage-user" 
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Users className="h-4 w-4" />
                Manage Users
              </Link>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              href="/admin/admin-profile" 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href="/admin/add-project" 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Link>
            <Link 
              href="/admin/manage-project" 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              Manage Projects
            </Link>
            <Link 
              href="/admin/manage-user" 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
            >
              <Users className="h-4 w-4" />
              Manage Users
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-base font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar