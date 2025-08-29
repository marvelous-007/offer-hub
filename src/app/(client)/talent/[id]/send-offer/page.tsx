"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import TalentLayout from "@/components/talent/talents/TalentLayout"

export default function SendOfferPage() {
    const params = useParams()
    const router = useRouter()
    const talentId = params.id as string

    const [formData, setFormData] = useState({
        jobTitle: "",
        jobDescription: "",
        estimate: "",
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        sessionStorage.setItem("offerFormData", JSON.stringify(formData))
        router.push(`/talent/${talentId}/send-offer/project-type`)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className='bg-white px-6 py-2'>
                <div className='flex items-center justify-between'>
                    <div className='flex-1 text-center'>
                        <h1 className='text-base font-bold text-gray-900'>Talents</h1>
                    </div>
                </div>
            </div>
            <TalentLayout>
                <div className="max-w-md mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Send an offer</h1>
                        <p className="text-teal-600 font-semibold">Create and send offer to hire</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Job title</label>
                            <Input
                                placeholder="Give your job a title"
                                value={formData.jobTitle}
                                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        {/* Job Description */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Job description</label>
                            <Textarea
                                placeholder="Enter a description..."
                                value={formData.jobDescription}
                                onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[120px] resize-none"
                            />
                        </div>

                        {/* Estimate */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">What is your estimate for this project</label>
                            <Input
                                placeholder="$0"
                                value={formData.estimate}
                                type="number"
                                onChange={(e) => handleInputChange("estimate", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-12 space-y-4 px-10">
                        <Button
                            onClick={handleNext}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-full font-medium"
                        >
                            Next
                        </Button>
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white border-teal-500 py-3 rounded-full font-medium"
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </TalentLayout>
        </div>
    )
}
