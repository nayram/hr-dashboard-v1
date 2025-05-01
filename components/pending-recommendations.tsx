"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, RefreshCw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PendingRecommendation {
  id: string
  name: string
  email: string
  company: string
  relationship: string
  requestDate: string
  status: "pending" | "viewed" | "completed" | "declined"
}

interface PendingRecommendationsProps {
  recommendations: PendingRecommendation[]
  onRemove: (id: string) => void
  onResend: (id: string) => void
}

export function PendingRecommendations({ recommendations, onRemove, onResend }: PendingRecommendationsProps) {
  const { toast } = useToast()

  const getStatusBadge = (status: PendingRecommendation["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "viewed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Viewed
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "declined":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Declined
          </Badge>
        )
    }
  }

  const handleResend = (id: string, name: string) => {
    onResend(id)
    toast({
      title: "Request resent!",
      description: `Your recommendation request has been resent to ${name}.`,
    })
  }

  const handleRemove = (id: string) => {
    onRemove(id)
    toast({
      title: "Request removed",
      description: "The recommendation request has been removed from your list.",
    })
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-4 text-center text-muted-foreground">
          <p>You don't have any pending recommendation requests.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card key={rec.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{rec.name}</CardTitle>
                <CardDescription>
                  {rec.relationship} at {rec.company}
                </CardDescription>
              </div>
              {getStatusBadge(rec.status)}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{rec.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4" />
              <span>Requested on {rec.requestDate}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => handleRemove(rec.id)}>
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
            {(rec.status === "pending" || rec.status === "viewed") && (
              <Button variant="outline" size="sm" onClick={() => handleResend(rec.id, rec.name)}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Resend
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
