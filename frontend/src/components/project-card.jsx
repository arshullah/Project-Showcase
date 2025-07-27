import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { FolderOpen, ExternalLink } from "lucide-react"

export function ProjectCard(props) {
  const {
    _id,
    title,
    description,
    abstract,
    contributors,
    technologiesUsed,
    tags,
    sourceCodeUrl,
    thumbnailUrl,
    department,
    academicYear,
    status,
    creator,
    categories,
  } = props;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Link href={`/project-detail/${_id}`}>

    <Card className="group overflow-hidden transition-all hover:shadow-lg border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FolderOpen className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
            </div>
          )}
          <Badge className={`absolute top-2 sm:top-3 right-2 sm:right-3 text-xs ${getStatusColor(status)}`}>{status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4">
        {/* Remove department badge, show categories instead */}
        <div className="flex flex-wrap gap-1 mb-2">
          {Array.isArray(categories) && categories.length > 0 && categories.map((cat, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {cat}
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground ml-auto">{academicYear}</span>
        </div>

        {/* <Link href={`/project-detail/${_id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">{title}</h3>
        </Link> */}
        {creator && (
          <p className="text-xs text-muted-foreground mb-2">
            <span className="font-semibold">Creator:</span> {creator.name || creator.email || 'Unknown'}
          </p>
        )}

        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3 mb-3">{description || abstract}</p>

        {Array.isArray(contributors) && contributors.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Contributors:</p>
            <div className="flex flex-wrap gap-1">
              {contributors.slice(0, 2).map((contributor, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {contributor.name || contributor.email || "Contributor"}
                </Badge>
              ))}
              {contributors.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{contributors.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {technologiesUsed && technologiesUsed.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {technologiesUsed.slice(0, 3).map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {technologiesUsed.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{technologiesUsed.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-3 sm:px-4 py-2 sm:py-3 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {sourceCodeUrl && (
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 sm:h-9 sm:w-9 p-0">
              <a href={sourceCodeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </Button>
          )}
        </div>
        {/* <Button variant="ghost" size="sm" asChild>
          <Link href={`/projects/${_id}`}>
            View Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button> */}
      </CardFooter>
    </Card>
    </Link>
  )
}
