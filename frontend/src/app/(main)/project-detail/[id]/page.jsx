"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/image-carousel"
import {
  Calendar,
  Users,
  Code,
  ExternalLink,
  Building2,
  FileText,
  ImageIcon,
  Download,
  Share2,
  Clock,
  Award,
  ArrowLeft,
  Globe,
  Star,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react"
import { toast } from "react-hot-toast"

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/getbyid/${id}`)
      setProject(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchProjectDetails()
  }, [id])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      // fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand("copy")
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch (err) {}
      document.body.removeChild(textArea)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Loading Project</h3>
          <p className="text-gray-600 max-w-md text-sm sm:text-base">Please wait while we fetch the project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 text-center max-w-lg w-full border border-white/20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Project Not Found</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">The project you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()} 
            className="w-full h-10 sm:h-12 text-base sm:text-lg font-medium hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          color: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200",
          icon: Award,
          dot: "bg-emerald-500",
          glow: "shadow-emerald-200",
        }
      case "in progress":
        return {
          color: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200",
          icon: Clock,
          dot: "bg-blue-500",
          glow: "shadow-blue-200",
        }
      case "pending":
        return {
          color: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200",
          icon: Clock,
          dot: "bg-amber-500",
          glow: "shadow-amber-200",
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200",
          icon: FileText,
          dot: "bg-gray-500",
          glow: "shadow-gray-200",
        }
    }
  }

  const statusConfig = getStatusConfig(project.status)
  const StatusIcon = statusConfig.icon

  // Combine thumbnail and gallery images for carousel
  const allImages = [
    ...(project.thumbnailUrl ? [project.thumbnailUrl] : []),
    ...(Array.isArray(project.galleryImageUrls) ? project.galleryImageUrls : []),
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content Layout with Left Sidebar for Back and Status */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8 lg:pt-12 pb-8 sm:pb-12 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Left Sidebar: Back + Status */}
        <div className="flex flex-row lg:flex-col items-start gap-3 sm:gap-4 min-w-[160px] lg:min-w-[180px] mb-4 lg:mb-0">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm rounded-xl w-fit text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            Back
          </Button>
          <Badge 
            variant="outline" 
            className={`${statusConfig.color} ${statusConfig.glow} font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 flex items-center gap-1.5 sm:gap-2`}
          >
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${statusConfig.dot} animate-pulse`}></div>
            <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{project.status}</span>
            <span className="sm:hidden">{project.status?.slice(0, 3)}</span>
          </Badge>
        </div>
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Project Gallery at Top */}
          {allImages.length > 0 && (
            <div className="pb-6 sm:pb-8">
              <Card className="overflow-hidden shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-gray-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                      <ImageIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    Project Gallery
                    <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm">
                      {allImages.length} {allImages.length === 1 ? "Image" : "Images"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ImageCarousel images={allImages} title={project.title} />
                </CardContent>
              </Card>
            </div>
          )}
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Left/Main Column */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Project Title & Info */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 text-gray-600 mb-6 sm:mb-8">
                  {project.department && (
                    <div className="flex items-center gap-2 sm:gap-3 bg-white/60 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="font-semibold text-sm sm:text-base">{project.department}</span>
                    </div>
                  )}
                  {project.academicYear && (
                    <div className="flex items-center gap-2 sm:gap-3 bg-white/60 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      <span className="font-semibold text-sm sm:text-base">{project.academicYear}</span>
                    </div>
                  )}
                  {Array.isArray(project.contributors) && (
                    <div className="flex items-center gap-2 sm:gap-3 bg-white/60 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      <span className="font-semibold text-sm sm:text-base">
                        {project.contributors.length} {project.contributors.length === 1 ? "Contributor" : "Contributors"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 sm:px-8 py-3 rounded-xl border-2 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 relative text-sm sm:text-base"
                    onClick={handleShare}
                    type="button"
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    {copied ? "Copied!" : "Share Project"}
                  </Button>
                  {project.sourceCodeUrl && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="px-6 sm:px-8 py-3 rounded-xl border-2 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                    >
                      <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer">
                        <Code className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Contributors and Tags Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Contributors */}
                {Array.isArray(project.contributors) && project.contributors.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                        <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                          <Users className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                        </div>
                        Contributors
                        <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700 font-semibold text-xs sm:text-sm">
                          {project.contributors.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-3">
                        {project.contributors.map((contributor, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                              {(contributor.name || contributor.email || "C").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-sm sm:text-base text-gray-800">
                                {contributor.name || "Contributor"}
                              </p>
                              {contributor.email && (
                                <p className="text-xs sm:text-sm text-gray-600">{contributor.email}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                          <Code className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        Technologies
                        <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm">
                          {project.tags.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {project.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-all duration-300 text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Description */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                    <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                      <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    Project Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="prose prose-sm sm:prose-base max-w-none">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {project.description || project.abstract || "No description available."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6 sm:space-y-8">
              {/* Project Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                    <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                      <Star className="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600" />
                    </div>
                    Project Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                        <span className="text-sm sm:text-base font-medium text-gray-700">Views</span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-indigo-600">1,234</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        <span className="text-sm sm:text-base font-medium text-gray-700">Likes</span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-purple-600">89</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50/50 to-red-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                        <span className="text-sm sm:text-base font-medium text-gray-700">Comments</span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-pink-600">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                    <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg">
                      <Globe className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
                    </div>
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    {project.sourceCodeUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-all duration-300 text-sm sm:text-base"
                        asChild
                      >
                        <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer">
                          <Code className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                          Source Code
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:bg-green-100 transition-all duration-300 text-sm sm:text-base"
                        asChild
                      >
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.documentationUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-all duration-300 text-sm sm:text-base"
                        asChild
                      >
                        <a href={project.documentationUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                          Documentation
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
