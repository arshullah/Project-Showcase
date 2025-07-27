"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "./(main)/Navbar"
import { ProjectCard } from "@/components/project-card"
import { Search, TrendingUp, Users, FolderOpen, Award, ArrowRight, Filter, GraduationCap, Sparkles, Star, Globe, Heart } from "lucide-react"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

// Sample data
const featuredProjects = [
  {
    id: "1",
    title: "AI-Powered Student Management System",
    description:
      "A comprehensive web application that uses machine learning to predict student performance and provide personalized learning recommendations.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Computer Science",
    student: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Computer Science",
    },
    date: "Dec 2024",
    views: 1250,
    likes: 89,
    rating: 4.8,
    featured: true,
  },
  {
    id: "2",
    title: "Sustainable Energy Monitoring IoT Device",
    description:
      "An IoT-based system for monitoring and optimizing energy consumption in smart buildings using renewable energy sources.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Engineering",
    student: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Electrical Engineering",
    },
    date: "Nov 2024",
    views: 980,
    likes: 67,
    rating: 4.6,
    featured: true,
  },
  {
    id: "3",
    title: "Mental Health Support Mobile App",
    description:
      "A React Native application providing mental health resources, mood tracking, and peer support for college students.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Mobile Development",
    student: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Psychology & CS",
    },
    date: "Oct 2024",
    views: 756,
    likes: 54,
    rating: 4.7,
  },
]

const categories = [
  "Computer Science",
  "Engineering",
  "Mobile Development",
  "Web Development",
  "Data Science",
  "AI/ML",
  "Blockchain",
  "IoT",
  "AR/VR",
  "Design",
]

export default function HomePage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  // Add state for dashboard stats
  const [stats, setStats] = useState({ totalProjects: 0, activeStudents: 0, categoriesCount: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/getall`)
        setProjects(res.data)
      } catch (error) {
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Fetch dashboard stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectRes, userRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/stats`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/stats`)
        ]);
        setStats({
          totalProjects: projectRes.data.totalProjects,
          categoriesCount: projectRes.data.categoriesCount,
          activeStudents: userRes.data.activeStudents
        });
      } catch (error) {
        // Optionally handle error
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 font-medium text-xs sm:text-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Showcasing Student Innovation
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight px-2">
            Discover Amazing
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              College Projects
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4">
            Explore innovative projects created by talented students from universities worldwide. Get inspired, learn,
            and connect with the next generation of creators.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-12 px-4">
            {categories.slice(0, 6).map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-transparent shadow-sm hover:shadow-lg"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {/* <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600">Handpicked exceptional projects by our community</p>
            </div>
            <Button variant="outline" className="px-6 py-3 rounded-xl border-blue-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent px-4">
              Platform Statistics
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-4">
              Discover the impact of our student community and the amazing projects being shared
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl lg:max-w-5xl mx-auto">
            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardContent className="pt-8 sm:pt-10 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <FolderOpen className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {statsLoading ? '...' : stats.totalProjects}
                </div>
                <div className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-800">Total Projects</div>
                <div className="text-sm sm:text-base text-gray-600">Innovative student work</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardContent className="pt-8 sm:pt-10 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Users className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {statsLoading ? '...' : stats.activeStudents}
                </div>
                <div className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-800">Active Students</div>
                <div className="text-sm sm:text-base text-gray-600">Building the future</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-8 sm:pt-10 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Award className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {statsLoading ? '...' : stats.categoriesCount}
                </div>
                <div className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-800">Categories</div>
                <div className="text-sm sm:text-base text-gray-600">Diverse fields of study</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Recent Projects
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">Latest submissions from our student community</p>
            </div>
            <Button variant="outline" className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-blue-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 w-full sm:w-auto">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600 shadow-sm">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading projects...
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-gray-500 text-base sm:text-lg">No projects found.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project._id} {...project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent px-4">
              Explore by Category
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-4">
              Browse projects across different fields of study and discover what interests you most
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link key={category} href={`/browse-project?category=${encodeURIComponent(category)}`} passHref legacyBehavior>
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden group">
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                    <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                      {category}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">Ready to Share Your Project?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 opacity-90 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4">
            Join thousands of students showcasing their innovative work. Get feedback, recognition, and connect with
            peers and industry professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link href="/new-project-add">
              <Button size="lg" variant="secondary" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Submit Project
              </Button>
            </Link>
            {/* <Button
              size="lg"
              variant="outline"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl border-white text-white hover:bg-white hover:text-blue-600 bg-transparent transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Learn More
            </Button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ProjectHub
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Empowering students to showcase their innovative projects and connect with the world.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Explore</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Featured Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Recent Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Top Students
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Community</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Submit Project
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Connect</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
