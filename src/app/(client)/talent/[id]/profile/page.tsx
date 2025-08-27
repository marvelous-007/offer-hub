"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useTalentData } from "@/hooks/talent/useTalentData"
import type { TalentProfile } from "@/lib/mockData/talent-mock-data"
import TalentLayout from "@/components/talent/talents/TalentLayout"
import TalentCard from "@/components/talent/TalentCard"
import { unknown } from "zod"
import PortfolioCarousel from "@/components/talent/talents/Portfolio"
import ReviewsCarousel from "@/components/talent/talents/Review"

const TalentProfilePage = () => {
    const params = useParams()
    const router = useRouter()
    const { getTalentById, loading } = useTalentData()
    const [talent, setTalent] = useState<TalentProfile | null>(null)
    const [portfolioIndex, setPortfolioIndex] = useState(0)
    const [reviewsIndex, setReviewsIndex] = useState(0)

    useEffect(() => {
        if (!loading && params.id) {
            const talentData = getTalentById(Number(params.id))
            setTalent(talentData || null)
        }
    }, [params.id, getTalentById, loading])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!talent) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Talent not found</h1>
                    <Button onClick={() => router.back()} className="bg-teal-600 hover:bg-teal-700">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    const nextPortfolio = () => {
        setPortfolioIndex((prev) => (prev + 1) % talent.portfolio.length)
    }

    const prevPortfolio = () => {
        setPortfolioIndex((prev) => (prev - 1 + talent.portfolio.length) % talent.portfolio.length)
    }

    const nextReview = () => {
        setReviewsIndex((prev) => (prev + 1) % talent.reviews.length)
    }

    const prevReview = () => {
        setReviewsIndex((prev) => (prev - 1 + talent.reviews.length) % talent.reviews.length)
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <TalentLayout>
                <div className="max-w-4xl mx-auto p-6 space-y-8">
                    {/* Profile Section - Reusing talent card design */}
                    <TalentCard
                        id={talent.id}
                        name={talent.name}
                        title={talent.title}
                        location={talent.location}
                        skills={talent.skills}
                        avatar={talent.avatar}
                        actionText={talent.actionText}
                        description={talent.description}
                        className="border border-gray-200"
                    />

                    {/* Portfolio Section */}
                    <PortfolioCarousel
                        title="Portfolio"
                        items={talent.portfolio}
                    />

                    {/* Reviews Section */}
                    <ReviewsCarousel
                        itemsPerPage={3}
                        reviews={talent.reviews}
                        renderStars={() => renderStars(5)}
                    />
                </div>
            </TalentLayout>
        </div>
    )
}

export default TalentProfilePage
