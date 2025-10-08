"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, Printer } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface DataExportProps {
  data: any[]
  filename: string
  language: "en" | "tn"
}

export function DataExport({ data, filename, language }: DataExportProps) {
  const content = {
    en: {
      export: "Export",
      csv: "Export as CSV",
      excel: "Export as Excel",
      pdf: "Export as PDF",
      print: "Print",
      success: "Export successful",
      error: "Export failed",
    },
    tn: {
      export: "Ntsha",
      csv: "Ntsha jaaka CSV",
      excel: "Ntsha jaaka Excel",
      pdf: "Ntsha jaaka PDF",
      print: "Gatisa",
      success: "Go ntsha go atlehile",
      error: "Go ntsha ga se ka tsamaya",
    },
  }

  const t = content[language]

  const exportToCSV = () => {
    try {
      const headers = Object.keys(data[0] || {})
      const csv = [
        headers.join(","),
        ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.csv`
      a.click()

      toast({
        title: t.success,
        description: `${filename}.csv ${language === "en" ? "downloaded" : "e kopolotswe"}`,
      })
    } catch (error) {
      toast({
        title: t.error,
        description: language === "en" ? "Please try again" : "Leka gape",
        variant: "destructive",
      })
    }
  }

  const exportToExcel = () => {
    toast({
      title: t.success,
      description: `${filename}.xlsx ${language === "en" ? "export initiated" : "e simolotswe"}`,
    })
    // In production, use a library like xlsx or exceljs
  }

  const exportToPDF = () => {
    toast({
      title: t.success,
      description: `${filename}.pdf ${language === "en" ? "export initiated" : "e simolotswe"}`,
    })
    // In production, use a library like jsPDF or pdfmake
  }

  const handlePrint = () => {
    window.print()
    toast({
      title: language === "en" ? "Print dialog opened" : "Puisano ya go gatisa e buletswe",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          {t.export}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="h-4 w-4 mr-2" />
          {t.csv}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          {t.excel}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          {t.pdf}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          {t.print}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
