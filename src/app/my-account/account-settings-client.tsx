"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Search, LayoutDashboard, Briefcase, DollarSign, HelpCircle, MessageSquare, Bell, Sun, Settings, LogOut, Eye, EyeOff, Menu, X } from "lucide-react"
import { FaCircleCheck, FaRegCircle } from "react-icons/fa6"
import userImage from "../../../public/avatar_olivia.jpg"
import Image from "next/image"
import usdLogo from "../../../public/logo-usd.svg"
import eurLogo from "../../../public/logo-euro.svg"
import xlmLogo from "../../../public/logo-xlm.svg"
import offerHubLogo from "../../../public/dark_logo.svg"

// Define types for conversion rates
interface ConversionRates {
    XLM: { USD: number; EUR: number }
    USD: { XLM: number; EUR: number }
    EUR: { XLM: number; USD: number }
    [key: string]: { [key: string]: number }
}

// Define types for coin images
interface CoinImages {
    XLM: string
    USD: string
    EUR: string
    [key: string]: string
}

// Define service type
interface Service {
    id: number
    name: string
    price: string
    currency: string
}

// Fallback conversion rates in case API fails
const fallbackConversionRates: ConversionRates = {
    XLM: { USD: 0.12, EUR: 0.11 },
    USD: { XLM: 8.33, EUR: 0.92 },
    EUR: { XLM: 9.09, USD: 1.09 }
}

export default function AccountSettings() {
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [walletAddress, setWalletAddress] = useState("")
    const [walletPlaceholder, setWalletPlaceholder] = useState("0x1234...x30d")
    const [conversionRates, setConversionRates] = useState<ConversionRates>(fallbackConversionRates)
    const [apiError, setApiError] = useState<string | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isUserActive, setIsUserActive] = useState(true) // Placeholder for active state, can be replaced with actual logic

    // Notification states
    const [jobAlert, setJobAlert] = useState(true)
    const [paymentAlert, setPaymentAlert] = useState(true)
    const [messagesAlert, setMessagesAlert] = useState(true)
    const [securityAlert, setSecurityAlert] = useState(true)

    // Services data
    const [services, setServices] = useState<Service[]>([
        { id: 1, name: "Logo Design", price: "2.617", currency: "XLM" },
        { id: 2, name: "3D Design", price: "0.56", currency: "XLM" },
    ])

    const [newServiceName, setNewServiceName] = useState("")
    const [newServicePrice, setNewServicePrice] = useState("")
    const [newServiceCurrency, setNewServiceCurrency] = useState("XLM")

    // Fetch conversion rates from CoinGecko API
    useEffect(() => {
        const fetchConversionRates = async () => {
            try {
                const response = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd,eur"
                )
                if (!response.ok) throw new Error("Failed to fetch conversion rates")
                const data = await response.json()

                const usdEurResponse = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=eur"
                )
                if (!usdEurResponse.ok) throw new Error("Failed to fetch USD-EUR rate")
                const usdEurData = await usdEurResponse.json()

                const xlmPrice = data.stellar
                const usdToEur = usdEurData["usd-coin"].eur

                const newRates: ConversionRates = {
                    XLM: {
                        USD: xlmPrice.usd,
                        EUR: xlmPrice.eur
                    },
                    USD: {
                        XLM: 1 / xlmPrice.usd,
                        EUR: usdToEur
                    },
                    EUR: {
                        XLM: 1 / xlmPrice.eur,
                        USD: 1 / usdToEur
                    }
                }

                setConversionRates(newRates)
                setApiError(null)
            } catch (error) {
                console.error("Error fetching conversion rates:", error)
                setApiError("Failed to fetch conversion rates. Using fallback rates.")
                setConversionRates(fallbackConversionRates)
            }
        }

        fetchConversionRates()
    }, [])

    // Wallet update function
    const updateWallet = () => {
        if (walletAddress) {
            const trimmedAddress = walletAddress.trim()
            if (trimmedAddress.length >= 4) {
                const shortAddress = `${trimmedAddress.slice(0, 6)}...${trimmedAddress.slice(-4)}`
                setWalletPlaceholder(shortAddress)
                setWalletAddress("")
            }
        }
    }

    // Password validation
    const getPasswordStrength = (password: string) => {
        let strengthScore = 0
        const checks = {
            length: password.length >= 8,
            upperLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        }

        Object.values(checks).forEach(check => {
            if (check) strengthScore++
        })

        if (strengthScore <= 1) return { strength: "Weak", color: "text-red-500", checks }
        if (strengthScore <= 3) return { strength: "Strong", color: "text-[#667085]", checks }
        return { strength: "Very Strong", color: "text-green-600", checks }
    }

    const passwordStrength = getPasswordStrength(password)

    // Convert price based on selected currency
    const convertPrice = (price: string, fromCurrency: string, toCurrency: string): string => {
        if (fromCurrency === toCurrency) return price
        const rate = conversionRates[fromCurrency]?.[toCurrency] || 1
        return (parseFloat(price) * rate).toFixed(3)
    }

    const removeService = (id: number) => {
        setServices(services.filter((service) => service.id !== id))
    }

    const addService = () => {
        if (newServiceName && newServicePrice) {
            const newService: Service = {
                id: Date.now(),
                name: newServiceName,
                price: newServicePrice,
                currency: newServiceCurrency,
            }
            setServices([...services, newService])
            setNewServiceName("")
            setNewServicePrice("")
            setNewServiceCurrency("XLM")
        }
    }

    function TabTitleComponent({ label }: { label: string }) {
        return <h3 className="text-[20px] text-[#002333] font-normal mb-4">{label}</h3>
    }

    // Coin image mapping
    const coinImages: CoinImages = {
        XLM: xlmLogo.src,
        USD: usdLogo.src,
        EUR: eurLogo.src
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-1 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                        <Image src={offerHubLogo} alt="OfferHub Logo" width={40} height={40} className="w-10 h-10" />
                        <span className="text-xl font-semibold text-gray-900">OfferHub</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search"
                                className="pl-10 w-20 sm:w-64 bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:min-h-screen`}
                >
                    <div className="p-4 sm:p-6">
                        {/* User Profile */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={userImage.src} />
                                    <AvatarFallback className="bg-gray-200">OR</AvatarFallback>
                                </Avatar>
                                <div
                                    className={`w-3 h-3 absolute z-10 bottom-0 right-1 ${
                                        isUserActive ? "bg-green-500" : "bg-slate-400"
                                    } rounded-full`}
                                ></div>
                            </div>
                            <div>
                                <div className="font-medium text-sm">Olivia Rhye</div>
                                <div className="text-xs text-gray-500">0x030rZ...0YeH</div>
                            </div>
                        </div>

                        {/* Online status */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm text-gray-600">Online for messages</span>
                            <Switch className="bg-green-600" checked={isUserActive} onCheckedChange={setIsUserActive} />
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-3" />
                                Dashboard
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                            >
                                <Briefcase className="w-4 h-4 mr-3" />
                                Discover Jobs
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                            >
                                <DollarSign className="w-4 h-4 mr-3" />
                                Manage Finance
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                            >
                                <HelpCircle className="w-4 h-4 mr-3" />
                                Help
                            </Button>
                        </nav>

                        <Separator className="my-6" />

                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                            >
                                <MessageSquare className="w-4 h-4 mr-3" />
                                Messages
                                <div className="w-2 h-2 bg-red-500 rounded-full ml-auto"></div>
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                            >
                                <Bell className="w-4 h-4 mr-3" />
                                Notifications
                                <div className="w-2 h-2 bg-red-500 rounded-full ml-auto"></div>
                            </Button>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                            >
                                <Sun className="w-4 h-4 mr-3" />
                                Theme: Light
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-600 bg-gray-50 hover:text-gray-900"
                            >
                                <Settings className="w-4 h-4 mr-3" />
                                Account Settings
                            </Button>
                        </div>

                        <div className="mt-8">
                            <Button
                                variant="outline"
                                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-3" />
                                Log out
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile when sidebar is open */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <div className="flex-1 p-4 sm:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl sm:text-2xl font-semibold">Account settings</h1>
                            </div>
                        </div>
                        {/* User Info */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
                            <div className="bg-white flex min-w-[190px] py-3 px-2 rounded-lg justify-around">
                                <div className="relative">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={userImage.src} />
                                        <AvatarFallback className="bg-gray-200">OR</AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`w-3 h-3 absolute z-10 bottom-0 right-1 ${
                                            isUserActive ? "bg-green-500" : "bg-slate-400"
                                        } rounded-full`}
                                    ></div>
                                </div>
                                <div>
                                    <div className="font-medium">Olivia Rhye</div>
                                    <div className="text-sm text-gray-500">0x030rZ...0YeH</div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="text-red-600 py-3 bg-inherit rounded-full border-red-200 hover:bg-red-50"
                            >
                                Deactivate Account
                            </Button>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="wallet" className="w-full">
                            <TabsList className="grid grid-cols-4 sm:grid-cols-4 mb-8 bg-[#F1F3F7] rounded-full items-center h-13 px-0 sm:px-2 py-1">
                                <TabsTrigger
                                    value="wallet"
                                    className="data-[state=active]:bg-[#002333] data-[state=active]:text-white p-1 sm:p-3 rounded-full text-xs sm:text-sm"
                                >
                                    Wallet
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="data-[state=active]:bg-[#002333] data-[state=active]:text-white p-1 sm:p-3 rounded-full text-xs sm:text-sm"
                                >
                                    Security
                                </TabsTrigger>
                                <TabsTrigger
                                    value="notifications"
                                    className="data-[state=active]:bg-[#002333] data-[state=active]:text-white px-2 py-1 sm:p-3 rounded-full text-xs sm:text-sm"
                                >
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger
                                    value="services"
                                    className="data-[state=active]:bg-[#002333] data-[state=active]:text-white p-1 sm:p-3 rounded-full text-xs sm:text-sm"
                                >
                                    Services
                                </TabsTrigger>
                            </TabsList>

                            {/* Wallet Tab */}
                            <TabsContent value="wallet" className="space-y-6">
                                <div>
                                    <TabTitleComponent label="Wallet & Payment Settings" />
                                    <div className="space-y-4">
                                        <div>
                                            <Input
                                                value={walletAddress}
                                                onChange={(e) => setWalletAddress(e.target.value)}
                                                placeholder={walletPlaceholder}
                                                className="bg-gray-50 border-gray-200 text-neutral-600"
                                            />
                                        </div>
                                        <Button
                                            className="bg-teal-600 hover:bg-teal-700 text-white px-8 rounded-full"
                                            onClick={updateWallet}
                                        >
                                            Update Wallet
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security" className="space-y-6 bg-white p-4 sm:p-6 rounded-lg">
                                <div>
                                    <TabTitleComponent label="Login & Security" />
                                    <div className="space-y-6">
                                        <div>
                                            <Label
                                                htmlFor="password"
                                                className="text-sm font-normal text-[#344054]"
                                            >
                                                Enter password
                                            </Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="pr-10 bg-gray-50 border-gray-200 text-[#667085]"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm font-bold mb-2 text-[#667085]">
                                                Strength:{" "}
                                                <span className={passwordStrength.color}>
                                                    {passwordStrength.strength}
                                                </span>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    {passwordStrength.checks.length ? (
                                                        <FaCircleCheck className="w-4 h-4 text-[#00ED27]" />
                                                    ) : (
                                                        <FaRegCircle className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span className="text-neutral-600">
                                                        At least 8 characters
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {passwordStrength.checks.upperLower ? (
                                                        <FaCircleCheck className="w-4 h-4 text-[#00ED27]" />
                                                    ) : (
                                                        <FaRegCircle className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span className="text-neutral-600">
                                                        At least one uppercase and lowercase character
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {passwordStrength.checks.number ? (
                                                        <FaCircleCheck className="w-4 h-4 text-[#00ED27]" />
                                                    ) : (
                                                        <FaRegCircle className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span className="text-neutral-600">
                                                        At least one number
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {passwordStrength.checks.special ? (
                                                        <FaCircleCheck className="w-4 h-4 text-[#00ED27]" />
                                                    ) : (
                                                        <FaRegCircle className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span className="text-neutral-600">
                                                        At least one special character
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="new-password"
                                                className="text-sm font-medium text-[#344054]"
                                            >
                                                Confirm password
                                            </Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="new-password"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className={`pr-10 ${
                                                        password !== newPassword
                                                            ? "border-red-200 focus:border-red-300"
                                                            : "border-gray-200"
                                                    }`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                            </div>
                                            {password !== newPassword && (
                                                <div className="text-xs text-red-500 mt-1">
                                                    Password mis-match
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                                            disabled={
                                                password !== newPassword ||
                                                !passwordStrength.checks.length
                                            }
                                        >
                                            Change password
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Notifications Tab */}
                            <TabsContent
                                value="notifications"
                                className="space-y-6 bg-white p-4 sm:p-6 rounded-lg"
                            >
                                <div>
                                    <TabTitleComponent label="Notification preferences" />
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-[#7F7E85]">
                                            <span className="text-sm font-medium text-secondary-500">
                                                Job Alert
                                            </span>
                                            <Switch
                                                className={`${jobAlert ? "bg-[#12B76A]" : ""}`}
                                                checked={jobAlert}
                                                onCheckedChange={setJobAlert}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between pb-3 border-b border-[#7F7E85]">
                                            <span className="text-sm font-medium text-secondary-500">
                                                Payment Alert
                                            </span>
                                            <Switch
                                                className={`${paymentAlert ? "bg-[#12B76A]" : ""}`}
                                                checked={paymentAlert}
                                                onCheckedChange={setPaymentAlert}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between pb-3 border-b border-[#7F7E85]">
                                            <span className="text-sm font-medium text-secondary-500">
                                                Messages Alert
                                            </span>
                                            <Switch
                                                className={`${messagesAlert ? "bg-[#12B76A]" : ""}`}
                                                checked={messagesAlert}
                                                onCheckedChange={setMessagesAlert}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between pb-3 border-b border-[#7F7E85]">
                                            <span className="text-sm font-medium text-secondary-500">
                                                Security Alert
                                            </span>
                                            <Switch
                                                className={`${securityAlert ? "bg-[#12B76A]" : ""}`}
                                                checked={securityAlert}
                                                onCheckedChange={setSecurityAlert}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Services Tab */}
                            <TabsContent
                                value="services"
                                className="space-y-6 bg-white p-4 sm:p-6 rounded-lg"
                            >
                                <div>
                                    <TabTitleComponent label="My Services" />
                                    {apiError && (
                                        <div className="text-sm text-red-500 mb-4">{apiError}</div>
                                    )}
                                    <div className="space-y-4">
                                        {services.map((service) => (
                                            <div
                                                key={service.id}
                                                className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center"
                                            >
                                                <Input
                                                    value={service.name}
                                                    readOnly
                                                    className="text-secondary-500 border-gray-200"
                                                />
                                                <div className="relative">
                                                    <Input
                                                        value={`${service.price} | ${service.currency}`}
                                                        readOnly
                                                        className="text-secondary-500 border-gray-200 pl-10"
                                                    />
                                                    <Image
                                                        width={50}
                                                        height={50}
                                                        src={coinImages[service.currency]}
                                                        alt={service.currency}
                                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                                    />
                                                </div>
                                                <Select
                                                    defaultValue={service.currency}
                                                    onValueChange={(value: string) => {
                                                        setServices(
                                                            services.map((s) =>
                                                                s.id === service.id
                                                                    ? {
                                                                          ...s,
                                                                          currency: value,
                                                                          price: convertPrice(
                                                                              s.price,
                                                                              s.currency,
                                                                              value
                                                                          ),
                                                                      }
                                                                    : s
                                                            )
                                                        )
                                                    }}
                                                >
                                                    <SelectTrigger className="bg-gray-50 border-gray-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="XLM">
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    width={50}
                                                                    height={50}
                                                                    src={coinImages.XLM}
                                                                    alt="XLM"
                                                                    className="w-4 h-4"
                                                                />
                                                                XLM
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="USD">
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    width={50}
                                                                    height={50}
                                                                    src={coinImages.USD}
                                                                    alt="USD"
                                                                    className="w-4 h-4"
                                                                />
                                                                USD
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="EUR">
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    width={50}
                                                                    height={50}
                                                                    src={coinImages.EUR}
                                                                    alt="EUR"
                                                                    className="w-4 h-4"
                                                                />
                                                                EUR
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="outline"
                                                    className="text-[#FF2000] border-[#FF2000] bg-red-200 hover:bg-red-400"
                                                    onClick={() => removeService(service.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}

                                        {/* Add new service row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                                            <Input
                                                placeholder="New Service Name"
                                                value={newServiceName}
                                                onChange={(e) =>
                                                    setNewServiceName(e.target.value)
                                                }
                                                className="border-gray-200"
                                            />
                                            <div className="relative">
                                                <Input
                                                    placeholder="Price"
                                                    value={newServicePrice}
                                                    onChange={(e) =>
                                                        setNewServicePrice(e.target.value)
                                                    }
                                                    className="border-gray-200 pl-10"
                                                />
                                                <Image
                                                    width={50}
                                                    height={50}
                                                    src={coinImages[newServiceCurrency]}
                                                    alt={newServiceCurrency}
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                                />
                                            </div>
                                            <Select
                                                value={newServiceCurrency}
                                                onValueChange={setNewServiceCurrency}
                                            >
                                                <SelectTrigger className="border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="XLM">
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src={coinImages.XLM}
                                                                alt="XLM"
                                                                className="w-4 h-4"
                                                            />
                                                            XLM
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="USD">
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src={coinImages.USD}
                                                                alt="USD"
                                                                className="w-4 h-4"
                                                            />
                                                            USD
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="EUR">
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src={coinImages.EUR}
                                                                alt="EUR"
                                                                className="w-4 h-4"
                                                            />
                                                            EUR
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                className="bg-teal-700 hover:bg-teal-800 text-white"
                                                onClick={addService}
                                                disabled={!newServiceName || !newServicePrice}
                                            >
                                                Add service
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}