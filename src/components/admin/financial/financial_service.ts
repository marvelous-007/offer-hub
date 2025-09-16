// Financial Service - Backend operations for financial management
// Handles all financial data operations, calculations, and reporting

import type {
  RevenueStream,
  Fee,
  Transaction,
  Expense,
  FinancialMetrics,
  FinancialReport,
  PaymentProcessingMetrics,
  ProfitabilityAnalysis,
} from "@/types/financial.types"

import React from "react"
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"
import {
  mockRevenueStreams,
  mockFees,
  mockTransactions,
  mockExpenses,
  mockFinancialMetrics,
  mockPaymentMetrics,
  mockProfitabilityAnalysis,
} from "@/data/mock-financial-data"

class FinancialService {
  async getRevenueStreams(period?: { start: Date; end: Date }): Promise<RevenueStream[]> {
    if (period) {
      return mockRevenueStreams.filter((stream) => stream.date >= period.start && stream.date <= period.end)
    }
    return mockRevenueStreams
  }

  async getTransactions(filters?: {
    type?: string
    status?: string
    dateRange?: { start: Date; end: Date }
  }): Promise<Transaction[]> {
    let filteredTransactions = mockTransactions

    if (filters?.type) {
      filteredTransactions = filteredTransactions.filter((t) => t.type === filters.type)
    }
    if (filters?.status) {
      filteredTransactions = filteredTransactions.filter((t) => t.status === filters.status)
    }
    if (filters?.dateRange) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.date >= filters.dateRange!.start && t.date <= filters.dateRange!.end,
      )
    }

    return filteredTransactions
  }

  async getFinancialMetrics(period?: { start: Date; end: Date }): Promise<FinancialMetrics> {
    return mockFinancialMetrics
  }

  async getExpenses(period?: { start: Date; end: Date }): Promise<Expense[]> {
    if (period) {
      return mockExpenses.filter((expense) => expense.date >= period.start && expense.date <= period.end)
    }
    return mockExpenses
  }

  async getFees(): Promise<Fee[]> {
    return mockFees
  }

  async updateFee(feeId: string, updates: Partial<Fee>): Promise<Fee> {
    // Simulate API update
    const fees = await this.getFees()
    const fee = fees.find((f) => f.id === feeId)
    if (!fee) throw new Error("Fee not found")

    return { ...fee, ...updates, updatedAt: new Date() }
  }

  async getPaymentProcessingMetrics(): Promise<PaymentProcessingMetrics> {
    return mockPaymentMetrics
  }

  async getProfitabilityAnalysis(): Promise<ProfitabilityAnalysis> {
    return mockProfitabilityAnalysis
  }

  async generateReport(type: string, period: { start: Date; end: Date }): Promise<FinancialReport> {
    const metrics = await this.getFinancialMetrics(period)

    return {
      id: `report_${Date.now()}`,
      name: `${type.replace("_", " ").toUpperCase()} Report`,
      type: type as any,
      period,
      data: metrics,
      generatedAt: new Date(),
      generatedBy: "system",
    }
  }

  async exportData(format: "csv" | "pdf", data: any): Promise<Blob> {
    console.log("[v0] Export called with format:", format, "and data:", data)

    try {
      let blob: Blob

      switch (format) {
        case "csv":
          blob = this.exportToCSV(data)
          break
        case "pdf":
          blob = await this.exportToPDF(data)
          break
        default:
          throw new Error(`Unsupported format: ${format}`)
      }

      console.log("[v0] Created blob:", blob.size, "bytes")
      if (!blob || blob.size === 0) {
        throw new Error("Failed to create export blob")
      }
      return blob
    } catch (error) {
      console.error("[v0] Export error:", error)
      throw new Error(`Failed to export data as ${format}: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private exportToCSV(data: any): Blob {
    const csvRows: string[] = []

    // Add header with report info
    csvRows.push(`"Financial Report - Generated ${new Date().toLocaleDateString()}"`)
    csvRows.push("") // Empty row for spacing

    // Financial Summary Section
    if (data.totalRevenue !== undefined) {
      csvRows.push('"=== FINANCIAL SUMMARY ==="')
      csvRows.push('"Metric","Value","Formatted"')
      csvRows.push(`"Total Revenue","${data.totalRevenue}","$${data.totalRevenue.toLocaleString()}"`)
      csvRows.push(`"Total Expenses","${data.totalExpenses}","$${data.totalExpenses.toLocaleString()}"`)
      csvRows.push(`"Net Profit","${data.netProfit}","$${data.netProfit.toLocaleString()}"`)
      csvRows.push(`"Profit Margin","${data.profitMargin}","${data.profitMargin.toFixed(2)}%"`)
      csvRows.push("") // Empty row
    }

    // Expense Breakdown Section
    if (data.expenseBreakdownData && data.expenseBreakdownData.length > 0) {
      csvRows.push('"=== EXPENSE DISTRIBUTION ==="')
      csvRows.push('"Category","Amount","Percentage","Color"')

      const total = data.expenseBreakdownData.reduce((sum: number, item: any) => sum + item.value, 0)
      data.expenseBreakdownData.forEach((item: any) => {
        const percentage = ((item.value / total) * 100).toFixed(2)
        csvRows.push(`"${item.name}","${item.value}","${percentage}%","${item.color || "N/A"}"`)
      })
      csvRows.push("") // Empty row
    }

    // Revenue Streams Section
    if (data.revenueStreams && data.revenueStreams.length > 0) {
      csvRows.push('"=== REVENUE STREAMS ==="')
      csvRows.push('"ID","Name","Type","Amount","Currency","Date","Status"')

      data.revenueStreams.forEach((stream: any) => {
        csvRows.push(
          `"${stream.id}","${stream.name}","${stream.type}","${stream.amount}","${stream.currency}","${new Date(stream.date).toLocaleDateString()}","${stream.status}"`,
        )
      })
    }

    const csvContent = csvRows.join("\n")
    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  }

  private async exportToPDF(data: any): Promise<Blob> {
    const styles = StyleSheet.create({
      page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 30,
        fontFamily: "Helvetica",
      },
      title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        color: "#002333",
        fontWeight: "bold",
      },
      subtitle: {
        fontSize: 16,
        marginBottom: 15,
        marginTop: 20,
        color: "#002333",
        fontWeight: "bold",
        borderBottom: "2 solid #3B82F6",
        paddingBottom: 5,
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        paddingHorizontal: 10,
      },
      label: {
        fontSize: 12,
        color: "#002333",
        fontWeight: "bold",
        flex: 1,
      },
      value: {
        fontSize: 12,
        color: "#002333",
        flex: 1,
        textAlign: "right",
      },
      tableHeader: {
        flexDirection: "row",
        backgroundColor: "#DEEFE7",
        padding: 8,
        marginBottom: 5,
      },
      tableRow: {
        flexDirection: "row",
        padding: 8,
        borderBottom: "1 solid #DEEFE7",
      },
      tableCell: {
        fontSize: 10,
        color: "#002333",
        flex: 1,
        textAlign: "left",
      },
      summary: {
        backgroundColor: "#F8FAFC",
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
      },
      date: {
        fontSize: 10,
        color: "#666666",
        textAlign: "center",
        marginBottom: 20,
      },
    })

    const PDFDocument = () =>
      React.createElement(
        Document,
        null,
        React.createElement(
          Page,
          { size: "A4", style: styles.page },
          React.createElement(Text, { style: styles.title }, "Financial Report"),
          React.createElement(Text, { style: styles.date }, `Generated: ${new Date().toLocaleDateString()}`),

          // Financial Summary Section
          data.totalRevenue !== undefined &&
            React.createElement(
              View,
              null,
              React.createElement(Text, { style: styles.subtitle }, "Financial Summary"),
              React.createElement(
                View,
                { style: styles.summary },
                React.createElement(
                  View,
                  { style: styles.row },
                  React.createElement(Text, { style: styles.label }, "Total Revenue:"),
                  React.createElement(Text, { style: styles.value }, `$${data.totalRevenue.toLocaleString()}`),
                ),
                React.createElement(
                  View,
                  { style: styles.row },
                  React.createElement(Text, { style: styles.label }, "Total Expenses:"),
                  React.createElement(Text, { style: styles.value }, `$${data.totalExpenses.toLocaleString()}`),
                ),
                React.createElement(
                  View,
                  { style: styles.row },
                  React.createElement(Text, { style: styles.label }, "Net Profit:"),
                  React.createElement(Text, { style: styles.value }, `$${data.netProfit.toLocaleString()}`),
                ),
                React.createElement(
                  View,
                  { style: styles.row },
                  React.createElement(Text, { style: styles.label }, "Profit Margin:"),
                  React.createElement(Text, { style: styles.value }, `${data.profitMargin.toFixed(2)}%`),
                ),
              ),
            ),

          // Revenue Streams Section
          data.revenueStreams &&
            data.revenueStreams.length > 0 &&
            React.createElement(
              View,
              null,
              React.createElement(Text, { style: styles.subtitle }, "Revenue Streams (Top 10)"),
              React.createElement(
                View,
                { style: styles.tableHeader },
                React.createElement(Text, { style: [styles.tableCell, { fontWeight: "bold" }] }, "Name"),
                React.createElement(Text, { style: [styles.tableCell, { fontWeight: "bold" }] }, "Type"),
                React.createElement(Text, { style: [styles.tableCell, { fontWeight: "bold" }] }, "Amount"),
                React.createElement(Text, { style: [styles.tableCell, { fontWeight: "bold" }] }, "Status"),
              ),
              ...data.revenueStreams
                .slice(0, 10)
                .map((stream: any, index: number) =>
                  React.createElement(
                    View,
                    { key: index, style: styles.tableRow },
                    React.createElement(Text, { style: styles.tableCell }, stream.name),
                    React.createElement(Text, { style: styles.tableCell }, stream.type.replace("_", " ")),
                    React.createElement(Text, { style: styles.tableCell }, `$${stream.amount.toLocaleString()}`),
                    React.createElement(Text, { style: styles.tableCell }, stream.status),
                  ),
                ),
            ),
        ),
      )

    const pdfBlob = await pdf(PDFDocument()).toBlob()
    return pdfBlob
  }
}

const financialService = new FinancialService()

export { financialService }
export default financialService
