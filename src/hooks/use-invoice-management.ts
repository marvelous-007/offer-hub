"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  Invoice,
  InvoiceFilters,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceAnalytics,
  InvoiceItem,
} from "@/types/invoice.types"
import {
  generateInvoiceNumber,
  calculateItemTotal,
  calculateSubtotal,
  calculateTaxAmount,
  calculateInvoiceTotal,
  isInvoiceOverdue,
} from "@/utils/invoice-helpers"

export const useInvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration with realistic data spread across different time periods
  useEffect(() => {
    const now = new Date()
    const mockInvoices: Invoice[] = [
      // Recent invoices (last month)
      {
        id: "1",
        invoiceNumber: "INV-001",
        status: "paid",
        customer: {
          id: "cust-1",
          name: "TechCorp Solutions",
          email: "billing@techcorp.com",
          address: {
            street: "123 Innovation Drive",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-1",
            description: "Custom Web Application Development",
            quantity: 80,
            unitPrice: 125,
            total: 10000,
          },
          {
            id: "item-2",
            description: "UI/UX Design Services",
            quantity: 20,
            unitPrice: 100,
            total: 2000,
          },
        ],
        subtotal: 12000,
        taxAmount: 1020,
        total: 13020,
        currency: "USD",
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        invoiceNumber: "INV-002",
        status: "sent",
        customer: {
          id: "cust-2",
          name: "Digital Marketing Agency",
          email: "accounts@dmaagency.com",
          address: {
            street: "789 Creative Blvd",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-3",
            description: "E-commerce Platform Development",
            quantity: 120,
            unitPrice: 95,
            total: 11400,
          },
        ],
        subtotal: 11400,
        taxAmount: 969,
        total: 12369,
        currency: "USD",
        dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      // 2-3 months old
      {
        id: "3",
        invoiceNumber: "INV-003",
        status: "paid",
        customer: {
          id: "cust-3",
          name: "StartupXYZ Inc.",
          email: "finance@startupxyz.com",
          address: {
            street: "456 Startup Lane",
            city: "Austin",
            state: "TX",
            zipCode: "73301",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-4",
            description: "Mobile App Development - iOS",
            quantity: 200,
            unitPrice: 110,
            total: 22000,
          },
          {
            id: "item-5",
            description: "Mobile App Development - Android",
            quantity: 180,
            unitPrice: 110,
            total: 19800,
          },
        ],
        subtotal: 41800,
        taxAmount: 3553,
        total: 45353,
        currency: "USD",
        dueDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
      },
      {
        id: "4",
        invoiceNumber: "INV-004",
        status: "overdue",
        customer: {
          id: "cust-4",
          name: "Enterprise Solutions Ltd",
          email: "billing@enterprise-solutions.com",
          address: {
            street: "321 Corporate Plaza",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-6",
            description: "Cloud Infrastructure Setup",
            quantity: 40,
            unitPrice: 150,
            total: 6000,
          },
          {
            id: "item-7",
            description: "DevOps Consulting",
            quantity: 30,
            unitPrice: 175,
            total: 5250,
          },
        ],
        subtotal: 11250,
        taxAmount: 956.25,
        total: 12206.25,
        currency: "USD",
        dueDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000),
      },
      // 3-6 months old
      {
        id: "5",
        invoiceNumber: "INV-005",
        status: "paid",
        customer: {
          id: "cust-5",
          name: "HealthTech Innovations",
          email: "accounting@healthtech.com",
          address: {
            street: "789 Medical Center Dr",
            city: "Boston",
            state: "MA",
            zipCode: "02101",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-8",
            description: "Healthcare Management System",
            quantity: 300,
            unitPrice: 85,
            total: 25500,
          },
        ],
        subtotal: 25500,
        taxAmount: 2167.5,
        total: 27667.5,
        currency: "USD",
        dueDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(now.getTime() - 95 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 95 * 24 * 60 * 60 * 1000),
      },
      {
        id: "6",
        invoiceNumber: "INV-006",
        status: "paid",
        customer: {
          id: "cust-6",
          name: "EduPlatform Co.",
          email: "finance@eduplatform.edu",
          address: {
            street: "555 Learning Ave",
            city: "Seattle",
            state: "WA",
            zipCode: "98101",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-9",
            description: "Learning Management System",
            quantity: 160,
            unitPrice: 90,
            total: 14400,
          },
          {
            id: "item-10",
            description: "Student Portal Development",
            quantity: 80,
            unitPrice: 95,
            total: 7600,
          },
        ],
        subtotal: 22000,
        taxAmount: 1870,
        total: 23870,
        currency: "USD",
        dueDate: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(now.getTime() - 125 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 125 * 24 * 60 * 60 * 1000),
      },
      // 6-12 months old
      {
        id: "7",
        invoiceNumber: "INV-007",
        status: "paid",
        customer: {
          id: "cust-7",
          name: "FinanceFirst Bank",
          email: "vendor.payments@financefirst.com",
          address: {
            street: "100 Wall Street",
            city: "New York",
            state: "NY",
            zipCode: "10005",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-11",
            description: "Banking Security Audit",
            quantity: 50,
            unitPrice: 200,
            total: 10000,
          },
          {
            id: "item-12",
            description: "Compliance System Updates",
            quantity: 100,
            unitPrice: 120,
            total: 12000,
          },
        ],
        subtotal: 22000,
        taxAmount: 1870,
        total: 23870,
        currency: "USD",
        dueDate: new Date(now.getTime() - 210 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 240 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(now.getTime() - 215 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 240 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 215 * 24 * 60 * 60 * 1000),
      },
      {
        id: "8",
        invoiceNumber: "INV-008",
        status: "viewed",
        customer: {
          id: "cust-8",
          name: "RetailChain Stores",
          email: "ap@retailchain.com",
          address: {
            street: "888 Commerce Way",
            city: "Miami",
            state: "FL",
            zipCode: "33101",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-13",
            description: "Inventory Management System",
            quantity: 240,
            unitPrice: 75,
            total: 18000,
          },
        ],
        subtotal: 18000,
        taxAmount: 1530,
        total: 19530,
        currency: "USD",
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      },
      // More recent data for better monthly analytics
      {
        id: "9",
        invoiceNumber: "INV-009",
        status: "draft",
        customer: {
          id: "cust-9",
          name: "GreenEnergy Solutions",
          email: "billing@greenenergy.com",
          address: {
            street: "777 Solar Drive",
            city: "Phoenix",
            state: "AZ",
            zipCode: "85001",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-14",
            description: "Smart Grid Analytics Platform",
            quantity: 180,
            unitPrice: 130,
            total: 23400,
          },
        ],
        subtotal: 23400,
        taxAmount: 1989,
        total: 25389,
        currency: "USD",
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        issueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "10",
        invoiceNumber: "INV-010",
        status: "paid",
        customer: {
          id: "cust-1",
          name: "TechCorp Solutions",
          email: "billing@techcorp.com",
          address: {
            street: "123 Innovation Drive",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: [
          {
            id: "item-15",
            description: "API Integration Services",
            quantity: 60,
            unitPrice: 115,
            total: 6900,
          },
        ],
        subtotal: 6900,
        taxAmount: 586.5,
        total: 7486.5,
        currency: "USD",
        dueDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        issueDate: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000),
        paymentDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      },
    ]
    setInvoices(mockInvoices)
  }, [])

  // Helper function to get date range based on time ran
  // ge string
  const getDateRangeFromTimeRange = useCallback((timeRange: string) => {
    const now = new Date()
    const endDate = new Date(now)
    const startDate = new Date(now)

    switch (timeRange) {
      case "1month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "3months":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "6months":
        startDate.setMonth(now.getMonth() - 6)
        break
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1) // Default to 1 month
    }

    return { startDate, endDate }
  }, [])

  // Filter invoices by time range
  const getInvoicesInTimeRange = useCallback((timeRange?: string) => {
    if (!timeRange) return invoices

    const { startDate, endDate } = getDateRangeFromTimeRange(timeRange)
    
    return invoices.filter(invoice => {
      const issueDate = new Date(invoice.issueDate)
      return issueDate >= startDate && issueDate <= endDate
    })
  }, [invoices, getDateRangeFromTimeRange])

  const createInvoice = useCallback(async (request: CreateInvoiceRequest): Promise<Invoice> => {
    setLoading(true)
    setError(null)

    try {
      // Calculate totals
      const itemsWithTotals = request.items.map((item) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        total: calculateItemTotal(item.quantity, item.unitPrice),
      }))

      const subtotal = calculateSubtotal(itemsWithTotals)
      const taxAmount = calculateTaxAmount(subtotal, 8.5) // Default tax rate
      const total = calculateInvoiceTotal(subtotal, taxAmount)

      const newInvoice: Invoice = {
        id: Math.random().toString(36).substr(2, 9),
        invoiceNumber: generateInvoiceNumber(),
        status: "draft",
        customer: {
          id: request.customerId,
          name: "Customer Name", // Would be fetched from customer service
          email: "customer@example.com",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        },
        company: {
          name: "Offer Hub",
          email: "billing@offerhub.com",
          address: {
            street: "456 Business Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        items: itemsWithTotals,
        subtotal,
        taxAmount,
        total,
        currency: request.currency,
        dueDate: request.dueDate,
        issueDate: new Date(),
        notes: request.notes,
        terms: request.terms,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: request.projectId,
        milestoneId: request.milestoneId,
      }

      setInvoices((prev) => [...prev, newInvoice])
      return newInvoice
    } catch (err) {
      setError("Failed to create invoice")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

const updateInvoice = useCallback(
  async (id: string, updates: UpdateInvoiceRequest): Promise<Invoice> => {
    setLoading(true)
    setError(null)

    try {
      const updatedInvoices = invoices.map((invoice) => {
        if (invoice.id === id) {
          // Create a copy of the invoice first
          let updatedInvoice: Invoice = { ...invoice, updatedAt: new Date() }

          // Handle items separately to maintain proper typing
          if (updates.items) {
            const itemsWithTotals: InvoiceItem[] = updates.items.map((item, index) => ({
              ...item,
              id: invoice.items[index]?.id || Math.random().toString(36).substr(2, 9),
              total: calculateItemTotal(item.quantity, item.unitPrice),
            }))

            const subtotal = calculateSubtotal(itemsWithTotals)
            const taxAmount = calculateTaxAmount(subtotal, 8.5)
            const total = calculateInvoiceTotal(subtotal, taxAmount)

            updatedInvoice = {
              ...updatedInvoice,
              items: itemsWithTotals,
              subtotal,
              taxAmount,
              total,
            }
          }

          // Apply other updates (excluding items since we handled it above)
          const { items: _, ...otherUpdates } = updates
          updatedInvoice = {
            ...updatedInvoice,
            ...otherUpdates,
          }

          return updatedInvoice
        }
        return invoice
      })

      setInvoices(updatedInvoices)
      return updatedInvoices.find((inv) => inv.id === id)!
    } catch (err) {
      setError("Failed to update invoice")
      throw err
    } finally {
      setLoading(false)
    }
  },
  [invoices],
)

  const deleteInvoice = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
    } catch (err) {
      setError("Failed to delete invoice")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getFilteredInvoices = useCallback(
    (filters: InvoiceFilters): Invoice[] => {
      return invoices.filter((invoice) => {
        if (filters.status && !filters.status.includes(invoice.status)) {
          return false
        }

        if (filters.dateRange) {
          const issueDate = new Date(invoice.issueDate)
          if (issueDate < filters.dateRange.start || issueDate > filters.dateRange.end) {
            return false
          }
        }

        if (filters.customer && !invoice.customer.name.toLowerCase().includes(filters.customer.toLowerCase())) {
          return false
        }

        if (filters.minAmount && invoice.total < filters.minAmount) {
          return false
        }

        if (filters.maxAmount && invoice.total > filters.maxAmount) {
          return false
        }

        if (filters.currency && invoice.currency !== filters.currency) {
          return false
        }

        return true
      })
    },
    [invoices],
  )

  // Updated getInvoiceAnalytics to accept optional timeRange parameter
  const getInvoiceAnalytics = useCallback((timeRange?: string): InvoiceAnalytics => {
    // Use filtered invoices based on time range, or all invoices if no time range
    const filteredInvoices = timeRange ? getInvoicesInTimeRange(timeRange) : invoices
    
    const totalInvoices = filteredInvoices.length
    const paidInvoices = filteredInvoices.filter((inv) => inv.status === "paid").length
    const pendingInvoices = filteredInvoices.filter((inv) => ["sent", "viewed"].includes(inv.status)).length
    const overdueInvoices = filteredInvoices.filter((inv) => isInvoiceOverdue(inv)).length
    const totalRevenue = filteredInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)

    const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0

    // Calculate average payment time
    const paidInvoicesWithPaymentDate = filteredInvoices.filter((inv) => inv.status === "paid" && inv.paymentDate)
    const averagePaymentTime =
      paidInvoicesWithPaymentDate.length > 0
        ? paidInvoicesWithPaymentDate.reduce((sum, inv) => {
            const paymentTime = (inv.paymentDate!.getTime() - inv.issueDate.getTime()) / (1000 * 60 * 60 * 24)
            return sum + paymentTime
          }, 0) / paidInvoicesWithPaymentDate.length
        : 0

    // Generate monthly revenue data based on filtered invoices and time range
    const generateMonthlyRevenue = () => {
      if (!timeRange) {
        // Default mock data when no time range is specified
        return [
          { month: "Jan", revenue: 15000, invoiceCount: 12 },
          { month: "Feb", revenue: 18000, invoiceCount: 15 },
          { month: "Mar", revenue: 22000, invoiceCount: 18 },
          { month: "Apr", revenue: 19000, invoiceCount: 16 },
          { month: "May", revenue: 25000, invoiceCount: 20 },
          { month: "Jun", revenue: 28000, invoiceCount: 22 },
        ]
      }

      // Generate monthly data based on actual filtered invoices
      const { startDate } = getDateRangeFromTimeRange(timeRange)
      const monthlyData: { [key: string]: { revenue: number; count: number } } = {}

      filteredInvoices.forEach(invoice => {
        if (invoice.status === "paid") {
          const monthKey = invoice.issueDate.toLocaleDateString('en-US', { 
            month: 'short',
            year: startDate.getFullYear() !== new Date().getFullYear() ? '2-digit' : undefined 
          })
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { revenue: 0, count: 0 }
          }
          
          monthlyData[monthKey].revenue += invoice.total
          monthlyData[monthKey].count += 1
        }
      })

      return Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          revenue: data.revenue,
          invoiceCount: data.count,
        }))
        .sort((a, b) => {
          // Sort by month chronologically
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          return months.indexOf(a.month.substring(0, 3)) - months.indexOf(b.month.substring(0, 3))
        })
    }

    const monthlyRevenue = generateMonthlyRevenue()

    return {
      totalInvoices,
      totalRevenue,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      averagePaymentTime,
      paymentRate,
      monthlyRevenue,
    }
  }, [invoices, getInvoicesInTimeRange, getDateRangeFromTimeRange])

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getFilteredInvoices,
    getInvoiceAnalytics, // Now accepts optional timeRange parameter
    getInvoicesInTimeRange, // Expose this helper for other use cases
  }
}