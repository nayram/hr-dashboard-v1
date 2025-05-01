import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Info, Star, ThumbsUp, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VettingNote {
  id: string
  type: "assessment" | "recommendation"
  content: string
  author: {
    name: string
    title: string
    company?: string
  }
  rating?: number
  date: string
  tags?: string[]
}

interface VettingNotesProps {
  notes: VettingNote[]
  showRequestButton?: boolean
}

export function VettingNotes({ notes, showRequestButton = false }: VettingNotesProps) {
  const assessments = notes.filter((note) => note.type === "assessment")
  const recommendations = notes.filter((note) => note.type === "recommendation")

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader className="bg-gray-50">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg">Vetting Team Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {assessments.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-600" />
              Assessment Notes
            </h3>
            <div className="space-y-4">
              {assessments.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-md p-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-700">{note.content}</p>
                    {note.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < note.rating! ? "text-amber-500 fill-amber-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-white">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{note.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {note.author.title}
                          {note.author.company && `, ${note.author.company}`}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{note.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {assessments.length > 0 && recommendations.length > 0 && <Separator />}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-gray-600" />
              Recommendations & Referrals
            </h3>
            <div className="space-y-4">
              {recommendations.map((note) => (
                <div key={note.id} className="bg-blue-50 rounded-md p-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-700 italic">&ldquo;{note.content}&rdquo;</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{note.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {note.author.title}
                          {note.author.company && `, ${note.author.company}`}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{note.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {showRequestButton && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Want more recommendations?</p>
                <p className="text-gray-600 mt-1">
                  You can request professional recommendations from colleagues and managers who have worked with you.
                  These will be reviewed by our vetting team before being added to your profile.
                </p>
                <Button variant="link" className="px-0 h-auto text-blue-600" asChild>
                  <a href="/profile?tab=recommendations">Request recommendations</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
