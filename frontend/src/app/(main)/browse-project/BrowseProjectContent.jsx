"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid3X3, List, Users, BookOpen, TrendingUp, RefreshCw, X, Filter, Sparkles, GraduationCap } from "lucide-react"
import { useSearchParams } from "next/navigation"

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

const statuses = ["Ongoing", "Completed", "Archived", "Pending Approval"]
const academicYears = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"]

export default function BrowseProjectContent() {
	const [projectList, setProjectList] = useState([])
	const [filteredProjects, setFilteredProjects] = useState([])
	const [searchQuery, setSearchQuery] = useState("")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [statusFilter, setStatusFilter] = useState("all")
	const [yearFilter, setYearFilter] = useState("all")
	const [sortBy, setSortBy] = useState("newest")
	const [viewMode, setViewMode] = useState("grid")
	const [isLoading, setIsLoading] = useState(true)
	const [activeFilters, setActiveFilters] = useState([])

	const searchParams = useSearchParams();

	// Set category filter from query param on initial load
	useEffect(() => {
		const categoryFromQuery = searchParams.get("category")
		if (categoryFromQuery && categories.includes(categoryFromQuery)) {
			setCategoryFilter(categoryFromQuery)
		}
	}, [searchParams])

	// Fetch projects from the backend
	const fetchProjects = async () => {
		setIsLoading(true)
		try {
			const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/getall`)
			setProjectList(res.data)
			console.log(res.data);
			
			setFilteredProjects(res.data)
		} catch (error) {
			console.error("Error fetching projects:", error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchProjects()
	}, [])

	// Update active filters
	useEffect(() => {
		const filters = []
		if (searchQuery) filters.push(`Search: "${searchQuery}"`)
		if (categoryFilter !== "all") filters.push(`Category: ${categoryFilter}`)
		if (statusFilter !== "all") filters.push(`Status: ${statusFilter}`)
		if (yearFilter !== "all") filters.push(`Year: ${yearFilter}`)
		setActiveFilters(filters)
	}, [searchQuery, categoryFilter, statusFilter, yearFilter])

	// Filter and sort projects
	useEffect(() => {
		let filtered = [...projectList]

		// Apply search filter
		if (searchQuery) {
			filtered = filtered.filter(
				(project) =>
					project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					project.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
					project.contributors.some((contributor) => contributor.toLowerCase().includes(searchQuery.toLowerCase())) ||
					project.technologiesUsed.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
			)
		}

		// Apply filters
		if (categoryFilter !== "all") {
			filtered = filtered.filter((project) => {
				return project.categories && project.categories.includes(categoryFilter)
			})
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter((project) => project.status === statusFilter)
		}

		if (yearFilter !== "all") {
			filtered = filtered.filter((project) => project.academicYear === yearFilter)
		}

		// Apply sorting
		switch (sortBy) {
			case "newest":
				filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
				break
			case "oldest":
				filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
				break
			case "title-asc":
				filtered.sort((a, b) => a.title.localeCompare(b.title))
				break
			case "title-desc":
				filtered.sort((a, b) => b.title.localeCompare(a.title))
				break
			default:
				break
		}

		setFilteredProjects(filtered)
	}, [projectList, searchQuery, categoryFilter, statusFilter, yearFilter, sortBy])

	const clearAllFilters = () => {
		setSearchQuery("")
		setCategoryFilter("all")
		setStatusFilter("all")
		setYearFilter("all")
	}

	const removeFilter = (filterText) => {
		if (filterText.startsWith("Search:")) {
			setSearchQuery("")
		} else if (filterText.startsWith("Category:")) {
			setCategoryFilter("all")
		} else if (filterText.startsWith("Status:")) {
			setStatusFilter("all")
		} else if (filterText.startsWith("Year:")) {
			setYearFilter("all")
		}
	}

	const getStatusStats = () => {
		const stats = {}
		projectList.forEach((project) => {
			stats[project.status] = (stats[project.status] || 0) + 1
		})
		return Object.entries(stats).map(([status, count]) => ({ status, count }))
	}

	const getCategoryStats = () => {
		const stats = {}
		projectList.forEach((project) => {
			if (project.categories) {
				project.categories.forEach((category) => {
					stats[category] = (stats[category] || 0) + 1
				})
			}
		})
		return Object.entries(stats)
			.map(([category, count]) => ({ category, count }))
			.sort((a, b) => b.count - a.count)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
			{/* Background Decorations */}
			<div className="absolute inset-0">
				<div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl"></div>
			</div>

			<main className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
				{/* Header Section */}
				<div className="text-center mb-8 sm:mb-12">
					<div className="flex items-center justify-center space-x-3 mb-6">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
							<div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
								<BookOpen className="h-8 w-8 text-white" />
							</div>
						</div>
						<span className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
							ProjectHub
						</span>
					</div>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
						Browse Projects
					</h1>
					<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
						Discover innovative projects from talented students across different fields and technologies
					</p>
				</div>

				{/* Search and Filter Section */}
				<Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
					<CardContent className="p-6 sm:p-8">
						<div className="space-y-6">
							{/* Search Bar */}
							<div className="relative">
								<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<Input
									type="text"
									placeholder="Search projects, contributors, technologies..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-12 h-12 text-base bg-white/60 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
								/>
							</div>

							{/* Filters Row */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								<Select value={categoryFilter} onValueChange={setCategoryFilter}>
									<SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
										<SelectValue placeholder="All Categories" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Categories</SelectItem>
										{categories.map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
										<SelectValue placeholder="All Statuses" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Statuses</SelectItem>
										{statuses.map((status) => (
											<SelectItem key={status} value={status}>
												{status}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select value={yearFilter} onValueChange={setYearFilter}>
									<SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
										<SelectValue placeholder="All Years" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Years</SelectItem>
										{academicYears.map((year) => (
											<SelectItem key={year} value={year}>
												{year}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select value={sortBy} onValueChange={setSortBy}>
									<SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="newest">Newest First</SelectItem>
										<SelectItem value="oldest">Oldest First</SelectItem>
										<SelectItem value="title-asc">Title A-Z</SelectItem>
										<SelectItem value="title-desc">Title Z-A</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Active Filters */}
							{activeFilters.length > 0 && (
								<div className="flex flex-wrap gap-2 items-center">
									<span className="text-sm text-gray-600 font-medium">Active filters:</span>
									{activeFilters.map((filter, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-all duration-300 bg-white/60 backdrop-blur-sm border border-gray-200"
											onClick={() => removeFilter(filter)}
										>
											{filter}
											<X className="h-3 w-3 ml-1" />
										</Badge>
									))}
									<Button
										variant="ghost"
										size="sm"
										onClick={clearAllFilters}
										className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
									>
										Clear all
									</Button>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Results Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
					<div>
						<h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
							{filteredProjects.length} Project{filteredProjects.length !== 1 ? "s" : ""} Found
						</h2>
						<p className="text-gray-600 text-sm sm:text-base">
							{activeFilters.length > 0 ? "Filtered results" : "Showing all projects"}
						</p>
					</div>

					<div className="flex items-center gap-3">
						<Button 
							variant="outline" 
							size="sm" 
							onClick={fetchProjects} 
							disabled={isLoading}
							className="border-gray-200 hover:bg-white/80 backdrop-blur-sm transition-all duration-300"
						>
							<RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
							Refresh
						</Button>

						<div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white/60 backdrop-blur-sm">
							<Button
								variant={viewMode === "grid" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("grid")}
								className="rounded-r-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
							>
								<Grid3X3 className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("list")}
								className="rounded-l-none hover:bg-gray-100"
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Loading State */}
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden">
								<div className="aspect-video bg-gray-200" />
								<CardContent className="p-4 space-y-3">
									<div className="h-4 bg-gray-200 rounded w-3/4" />
									<div className="h-3 bg-gray-200 rounded w-full" />
									<div className="h-3 bg-gray-200 rounded w-2/3" />
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					/* Project Grid */
					<div
						className={`grid gap-6 ${
							viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
						}`}
					>
						{filteredProjects.map((project) => (
							<ProjectCard
								key={project._id}
								_id={project._id}
								title={project.title}
								description={project.description}
								abstract={project.abstract}
								contributors={project.contributors}
								technologiesUsed={project.technologiesUsed}
								tags={project.tags}
								sourceCodeUrl={project.sourceCodeUrl}
								thumbnailUrl={project.thumbnailUrl}
								academicYear={project.academicYear}
								status={project.status}
								creator={project.creator}
								categories={project.categories}
							/>
						))}
					</div>
				)}

				{/* Empty State */}
				{!isLoading && filteredProjects.length === 0 && (
					<Card className="text-center py-12 sm:py-16 bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl">
						<CardContent>
							<BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-6" />
							<h3 className="text-2xl font-bold text-gray-900 mb-3">No projects found</h3>
							<p className="text-gray-600 mb-6 text-lg">Try adjusting your search criteria or filters</p>
							<Button 
								onClick={clearAllFilters} 
								variant="outline"
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-3 rounded-xl transition-all duration-300"
							>
								Clear all filters
							</Button>
						</CardContent>
					</Card>
				)}

				{/* Quick Stats */}
				{!isLoading && projectList.length > 0 && (
					<div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
							<CardContent className="p-6 sm:p-8">
								<h3 className="font-bold text-lg mb-6 flex items-center gap-3 text-gray-900">
									<TrendingUp className="h-5 w-5 text-blue-600" />
									Projects by Status
								</h3>
								<div className="space-y-3">
									{getStatusStats().map((stat) => (
										<div key={stat.status} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
											<span className="text-sm font-medium text-gray-700">{stat.status}</span>
											<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
												{stat.count}
											</Badge>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
							<CardContent className="p-6 sm:p-8">
								<h3 className="font-bold text-lg mb-6 flex items-center gap-3 text-gray-900">
									<Users className="h-5 w-5 text-purple-600" />
									Active Categories
								</h3>
								<div className="space-y-3">
									{getCategoryStats()
										.slice(0, 5)
										.map((stat) => (
											<div key={stat.category} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
												<span className="text-sm font-medium text-gray-700 truncate">{stat.category}</span>
												<Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
													{stat.count}
												</Badge>
											</div>
										))}
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</main>
		</div>
	)
} 