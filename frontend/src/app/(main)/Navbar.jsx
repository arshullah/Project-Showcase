"use client"

import { useState, useContext } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { GraduationCap, Menu, Search, Sparkles, BookOpen, Plus, User, LogOut } from "lucide-react"
import { AuthContext } from "@/context/AppContext"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { authToken, logout } = useContext(AuthContext)

  const navItems = [
    { name: "Home", href: "/", icon: Sparkles },
    { name: "Projects", href: "/browse-project", icon: BookOpen },
    { name: "Add Project", href: "/new-project-add", icon: Plus },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <GraduationCap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                ProjectHub
              </span>
              <Badge variant="secondary" className="hidden sm:inline-flex w-fit text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
                College Innovation
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative group p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            </Button>
            
            {authToken ? (
              <div className="flex items-center space-x-4">
                <Link href="/user/profile" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                  <Avatar className="h-9 w-9 ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300 shadow-md">
                    <AvatarImage src="https://images.unsplash.com/photo-1510706019500-d23a509eecd4?auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="User Avatar" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">U</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">Student</Badge>
                    <span className="text-xs text-gray-600">Profile</span>
                  </div>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="border-red-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-300 px-4 py-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 px-6 py-2.5 rounded-xl font-medium"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm" className="relative group p-2 sm:p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] md:w-[400px] bg-white/95 backdrop-blur-xl border-l border-gray-200">
              <div className="flex flex-col space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                <div className="flex items-center space-x-2 sm:space-x-3 pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg">
                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    ProjectHub
                  </span>
                </div>
                
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 text-base sm:text-lg font-medium transition-all duration-300 hover:text-blue-700 group p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                
                <div className="flex flex-col space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                  {authToken ? (
                    <div className="flex flex-col space-y-3">
                      <Link href="/user/profile" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300" onClick={() => setIsOpen(false)}>
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-blue-200 shadow-md">
                          <AvatarImage src="https://images.unsplash.com/photo-1510706019500-d23a509eecd4?auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="User Avatar" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm sm:text-base">U</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <Badge variant="secondary" className="w-fit text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">Student</Badge>
                          <span className="text-xs sm:text-sm text-gray-600">View Profile</span>
                        </div>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="justify-start bg-transparent border-red-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl text-sm sm:text-base" 
                        onClick={() => { logout(); setIsOpen(false); }}
                      >
                        <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="justify-start bg-transparent border-blue-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 w-full rounded-xl text-sm sm:text-base"
                      >
                        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
