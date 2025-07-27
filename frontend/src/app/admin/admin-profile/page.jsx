"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Linkedin, 
  Twitter, 
  Github, 
  Instagram, 
  Facebook, 
  Globe, 
  Camera,
  Crown,
  Shield,
  Settings
} from "lucide-react"

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Ausaf Ahmad",
    email: "kausaf98@gmail.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    role: "System Administrator",
    department: "IT Department",
    bio: "I am a seasoned web designer with over 1 year of experience in creating visually appealing and user-centric designs. My expertise spans UI design, design systems, and custom illustrations. Currently, I work remotely for Notion, where I design template UIs, convert them into HTML and CSS, and provide support to users. I love crafting elegant and functional designs.",
    avatar: "https://tse2.mm.bing.net/th/id/OIP.qUzJIjChocSMt46b4Kgw2AHaHj?pid=Api&P=0&h=180",
    socialMedia: {
      linkedin: "https://linkedin.com/in/ausaf-ahmad",
      twitter: "https://twitter.com/ausaf17",
      github: "https://github.com/Ausaf17",
      instagram: "https://instagram.com/ausaf17",
      facebook: "https://facebook.com/ausaf.ahmad",
      website: "https://ausafahmad.com"
    }
  })

  const [editForm, setEditForm] = useState(profile)

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialMediaChange = (platform, value) => {
    setEditForm(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }))
  }

  const socialMediaIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    instagram: Instagram,
    facebook: Facebook,
    website: Globe
  }

  const socialMediaColors = {
    linkedin: "bg-blue-600",
    twitter: "bg-sky-500",
    github: "bg-gray-800",
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
    facebook: "bg-blue-700",
    website: "bg-gray-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Admin Profile
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">Manage your profile information and social media links</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center pb-6 sm:pb-8">
                <div className="relative inline-block">
                  <Avatar className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 mx-auto mb-4 ring-4 ring-white/20 shadow-lg">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="bg-white/20 text-white text-lg sm:text-xl md:text-2xl font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white text-blue-600 hover:bg-gray-100"
                    >
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold">{profile.name}</CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-blue-100 text-sm sm:text-base">{profile.role}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-600">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-600">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-600">{profile.department}</span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Social Media</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {Object.entries(profile.socialMedia).map(([platform, url]) => {
                      if (!url) return null
                      const Icon = socialMediaIcons[platform]
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center ${socialMediaColors[platform]}`}>
                            <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 capitalize">{platform}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardHeader className="border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    {isEditing ? 'Edit Profile' : 'Profile Information'}
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base px-3 sm:px-4 py-2"
                        >
                          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="text-sm sm:text-base px-3 sm:px-4 py-2">
                          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base px-3 sm:px-4 py-2"
                      >
                        <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isEditing ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-sm sm:text-base">Phone</Label>
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role" className="text-sm sm:text-base">Role</Label>
                          <Input
                            id="role"
                            value={editForm.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="department" className="text-sm sm:text-base">Department</Label>
                          <Input
                            id="department"
                            value={editForm.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <Label htmlFor="bio" className="text-sm sm:text-base">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="mt-1 text-sm sm:text-base"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {/* Social Media */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Social Media Links</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {Object.entries(socialMediaIcons).map(([platform, Icon]) => (
                          <div key={platform}>
                            <Label htmlFor={platform} className="flex items-center gap-2 text-sm sm:text-base">
                              <div className={`w-4 h-4 rounded flex items-center justify-center ${socialMediaColors[platform]}`}>
                                <Icon className="h-2.5 w-2.5 text-white" />
                              </div>
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Label>
                            <Input
                              id={platform}
                              type="url"
                              placeholder={`https://${platform}.com/username`}
                              value={editForm.socialMedia[platform] || ''}
                              onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                              className="mt-1 text-sm sm:text-base"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Basic Information Display */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-500">Full Name</Label>
                          <p className="text-sm sm:text-base text-gray-800 font-medium">{profile.name}</p>
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-500">Email</Label>
                          <p className="text-sm sm:text-base text-gray-800 font-medium">{profile.email}</p>
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-500">Phone</Label>
                          <p className="text-sm sm:text-base text-gray-800 font-medium">{profile.phone}</p>
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-500">Location</Label>
                          <p className="text-sm sm:text-base text-gray-800 font-medium">{profile.location}</p>
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-500">Role</Label>
                          <p className="text-sm sm:text-base text-gray-800 font-medium">{profile.role}</p>
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-500">Department</Label>
                          <p className="text-sm sm:text-base text-gray-800 font-medium">{profile.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bio Display */}
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-500">Bio</Label>
                      <p className="text-sm sm:text-base text-gray-800 leading-relaxed mt-1">{profile.bio}</p>
                    </div>

                    {/* Social Media Display */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Social Media</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {Object.entries(profile.socialMedia).map(([platform, url]) => {
                          if (!url) return null
                          const Icon = socialMediaIcons[platform]
                          return (
                            <div key={platform} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center ${socialMediaColors[platform]}`}>
                                <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-800 capitalize">{platform}</p>
                                <a 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs sm:text-sm text-blue-600 hover:underline truncate block"
                                >
                                  {url}
                                </a>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
