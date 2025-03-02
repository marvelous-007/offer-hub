/* eslint-disable @next/next/no-img-element */
import { Star, CheckCircle, MessageCircle, ClipboardCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface WorkerCardProps {
  name: string
  title: string
  pricePerJob: number
  jobsDone: number
  rating: number
  imageUrl: string
  isVerified: boolean
}

export default function WorkerCard({
  name,
  title,
  pricePerJob,
  jobsDone,
  rating,
  imageUrl,
  isVerified,
}: WorkerCardProps) {
  return (
    <Card className="max-w-sm overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative">
        <img src={imageUrl || "/placeholder.svg"} alt={`${title}`} className="w-full h-72 object-cover" />
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              {name}
              <MessageCircle className="w-6 h-6 text-blue-400/60" />
            </h3>
            <p className="text-gray-600">{title}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">${pricePerJob.toFixed(2)}</span>
            <span className="text-gray-600">Per job</span>
          </div>

          <div className="flex items-center gap-6">
            {isVerified && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-400 " />
                <span>Verified</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-blue-400" />
              <span>({jobsDone} jobs done)</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

