import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import usdLogo from "../../../public/logo-usd.svg"
import eurLogo from "../../../public/logo-euro.svg"
import xlmLogo from "../../../public/logo-xlm.svg"
import { ConversionRates, Service } from "./types"
import { ServiceRow } from "./service-row"

interface ServiceSettingsProps {
    services: Service[]
    setServices: (services: Service[]) => void
    newServiceName: string
    setNewServiceName: (name: string) => void
    newServicePrice: string
    setNewServicePrice: (price: string) => void
    newServiceCurrency: string
    setNewServiceCurrency: (currency: string) => void
    conversionRates: ConversionRates
    apiError: string | null
    addService: () => void
    removeService: (id: number) => void
}

export function ServiceSettings({
    services,
    setServices,
    newServiceName,
    setNewServiceName,
    newServicePrice,
    setNewServicePrice,
    newServiceCurrency,
    setNewServiceCurrency,
    conversionRates,
    apiError,
    addService,
    removeService
}: ServiceSettingsProps) {
    function TabTitleComponent({ label }: { label: string }) {
        return <h3 className="text-[20px] text-[#002333] font-normal mb-4">{label}</h3>
    }

    const coinImages = {
        XLM: xlmLogo.src,
        USD: usdLogo.src,
        EUR: eurLogo.src
    }

    return (
        <div>
            <TabTitleComponent label="My Services" />
            {apiError && (
                <div className="text-sm text-red-500 mb-4">{apiError}</div>
            )}
            <div className="space-y-4">
                {services.map((service) => (
                    <ServiceRow
                        services={services}
                        key={service.id}
                        service={service}
                        coinImages={coinImages}
                        conversionRates={conversionRates}
                        setServices={setServices}
                        removeService={removeService}
                    />
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                    <Input
                        placeholder="New Service Name"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="border-gray-200"
                    />
                    <div className="relative">
                        <Input
                            placeholder="Price"
                            value={newServicePrice}
                            onChange={(e) => setNewServicePrice(e.target.value)}
                            className="border-gray-200 pl-10"
                        />
                        <Image
                            width={50}
                            height={50}
                            src={coinImages[newServiceCurrency as keyof typeof coinImages]}
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
                                    <Image width={50} height={50} src={coinImages.XLM} alt="XLM" className="w-4 h-4" />
                                    XLM
                                </div>
                            </SelectItem>
                            <SelectItem value="USD">
                                <div className="flex items-center gap-2">
                                    <Image width={50} height={50} src={coinImages.USD} alt="USD" className="w-4 h-4" />
                                    USD
                                </div>
                            </SelectItem>
                            <SelectItem value="EUR">
                                <div className="flex items-center gap-2">
                                    <Image width={50} height={50} src={coinImages.EUR} alt="EUR" className="w-4 h-4" />
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
    )
}
