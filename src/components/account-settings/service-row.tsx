import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { ConversionRates, Service } from "./types"

interface ServiceRowProps {
    service: Service
    services: Service[] // Add services prop
    coinImages: { [key: string]: string }
    conversionRates: ConversionRates
    setServices: (services: Service[]) => void
    removeService: (id: number) => void
}

export function ServiceRow({ service, services, coinImages, conversionRates, setServices, removeService }: ServiceRowProps) {
    const convertPrice = (price: string, fromCurrency: string, toCurrency: string): string => {
        if (fromCurrency === toCurrency) return price
        const rate = conversionRates[fromCurrency]?.[toCurrency] || 1
        return (parseFloat(price) * rate).toFixed(3)
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
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
                                ? { ...s, currency: value, price: convertPrice(s.price, s.currency, value) }
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
                variant="outline"
                className="text-[#FF2000] border-[#FF2000] bg-red-200 hover:bg-red-400"
                onClick={() => removeService(service.id)}
            >
                Remove
            </Button>
        </div>
    )
}