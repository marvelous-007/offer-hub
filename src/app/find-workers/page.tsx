import WorkerCard from "@/components/Card/workers-card"

// Mock data for workers
const workers = [
  {
    id: 1,
    name: "Leonardo Di Caprio",
    title: "Designer",
    pricePerJob: 20.0,
    jobsDone: 125,
    rating: 5.0,
    imageUrl:'/images/worker-image.png',
    isVerified: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Web Developer",
    pricePerJob: 25.0,
    jobsDone: 98,
    rating: 4.9,
    imageUrl:'/images/worker-image.png',
    isVerified: true,
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "UI/UX Designer",
    pricePerJob: 22.0,
    jobsDone: 156,
    rating: 4.8,
    imageUrl:'/images/worker-image.png',
    isVerified: true,
  },
  {
    id: 4,
    name: "Emma Wilson",
    title: "Product Designer",
    pricePerJob: 23.0,
    jobsDone: 143,
    rating: 4.9,
    imageUrl:'/images/worker-image.png',
    isVerified: true,
  },
]

export default function FindWorkers() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Find Workers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <WorkerCard key={worker.id} {...worker} />
        ))}
      </div>
    </div>
  )
}

