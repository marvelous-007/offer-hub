export interface ConversionRates {
    XLM: { USD: number; EUR: number }
    USD: { XLM: number; EUR: number }
    EUR: { XLM: number; USD: number }
    [key: string]: { [key: string]: number }
}

export interface CoinImages {
    XLM: string
    USD: string
    EUR: string
    [key: string]: string
}

export interface Service {
    id: number
    name: string
    price: string
    currency: string
}