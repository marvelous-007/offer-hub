import { CheckCircle, AlertCircle, Zap, MapPin } from "lucide-react"


export default function Notification() {
  const notifications = [
    {
      id: 1,
      type: "payment",
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      title: "New Payment Received",
      description: "0.15 ETH has been successfully credited to your wallet for the project 'DeFi Landing Page Design'.",
      timestamp: "April 18, 2025 - 3:42 PM",
    },
    {
      id: 2,
      type: "milestone",
      icon: AlertCircle,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      title: "Client Funds Milestone",
      description: "Your client @blockchainjay funded the escrow for 'Web3 Brand Identity Design'.",
      timestamp: "April 17, 2025 - 5:15 PM",
    },
    {
      id: 3,
      type: "approval",
      icon: Zap,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      title: "Job Milestone Approved",
      description: "Milestone 2 of 'Crypto Podcast Branding' approved by @bitvoice. Next payout: 0.075 BTC.",
      timestamp: "April 18, 2025 - 8:47 AM",
    },
    {
      id: 4,
      type: "security",
      icon: MapPin,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      title: "Login from New Location",
      description:
        "New login detected from Lagos, Nigeria - Chrome on Windows. If this wasn't you, secure your account.",
      timestamp: "April 18, 2025 - 8:47 AM",
    },
  ]

  return (
    <div className=" w-full p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Notifications</h1>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const IconComponent = notification.icon
          return (
            <div
              key={notification.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.iconBg} flex items-center justify-center`}
                >
                  <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{notification.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{notification.description}</p>
                  <p className="text-gray-400 text-sm">{notification.timestamp}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
        <div className="flex justify-center space-x-8">
          <button className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <span className="text-xs">Ask to edit</span>
          </button>
        </div>
      </div>
    </div>
  )
}
