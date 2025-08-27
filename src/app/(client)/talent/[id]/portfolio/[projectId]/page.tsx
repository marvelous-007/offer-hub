"use client"
import { useParams, useRouter } from "next/navigation"
import { useProjectDetails } from "@/hooks/talent/useProjectDetails"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import TalentLayout from "@/components/talent/talents/TalentLayout"

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getProjectById, loading } = useProjectDetails()

    const projectId = params.projectId as string
    const talentId = params.id as string
    const project = getProjectById(projectId)

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading project details...</p>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <Button onClick={() => router.back()} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <TalentLayout>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Main Images */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {project.mainImages.map((image, index) => (
                                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                    <Image
                                        src={image || "/placeholder.svg"}
                                        alt={`${project.title} - Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project Info */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                        <p className="text-gray-500 mb-6">{project.date}</p>

                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed text-justify">{project.description}</p>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                            <p className="text-gray-600">{project.category}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                            <p className="text-gray-600">{project.duration}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Tools Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tools.map((tool, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {project.client && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                                <p className="text-gray-600">{project.client}</p>
                            </div>
                        )}
                    </div>

                    {/* Additional Images */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {project.additionalImages.map((image, index) => (
                                <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                                    <Image
                                        src={image || "/placeholder.svg"}
                                        alt={`${project.title} - Additional Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hire Button */}
                    <div className="text-center">
                        <Button
                            className="bg-slate-800 hover:bg-slate-700 text-white px-12 py-3 rounded-full text-lg"
                            onClick={() => router.push(`/talent/${talentId}`)}
                        >
                            Hire
                        </Button>
                    </div>
                </div>
            </TalentLayout>
        </div>
    )
}
