"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { AuthContext } from "@/context/AppContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Hash, Calendar, User, Edit3, ArrowLeft } from "lucide-react"

const ProfilePage = () => {
  const router = useRouter()
  const { authToken, userRole } = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      if (!authToken) return

      try {
        const tokenPayload = JSON.parse(atob(authToken.split(".")[1]))
        const userId = tokenPayload.id
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyid/${userId}`)
        setUser(res.data)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [authToken])

  if (!authToken) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Authentication Required</h2>
                <p className="text-muted-foreground mb-6">Please login to view your profile</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Profile Card Skeleton */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="flex-1 text-center sm:text-left space-y-3">
                    <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
                    <Skeleton className="h-5 w-20 mx-auto sm:mx-0" />
                    <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Profile Not Found</h2>
                <p className="text-muted-foreground mb-6">Unable to load your profile information</p>
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Student Profile</h1>
            <p className="text-muted-foreground">Manage your academic profile and information</p>
          </div>

          {/* Profile Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Profile Information</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    const tokenPayload = JSON.parse(atob(authToken.split(".")[1]))
                    const userId = tokenPayload.id
                    router.push(`/user/update-user/${userId}`)
                  }}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg?height=96&width=96"}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl font-semibold bg-muted">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{user.name}</h2>
                  <Badge variant="secondary" className="mb-3 text-xs font-medium">
                    {userRole || user.role || "Student"}
                  </Badge>
                  {user.course && <p className="text-muted-foreground font-medium">{user.course}</p>}
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Contact & Academic Information */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                  Contact & Academic Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Email Address
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {user.rollNo && (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Roll Number
                        </p>
                        <p className="text-sm font-medium text-foreground">{user.rollNo}</p>
                      </div>
                    </div>
                  )}

                  {user.year && (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Academic Year
                        </p>
                        <p className="text-sm font-medium text-foreground">{user.year}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
