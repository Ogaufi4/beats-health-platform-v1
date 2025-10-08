"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, User, Calendar, Package, Pill, Command } from "lucide-react"

interface SearchResult {
  id: string
  type: "patient" | "appointment" | "medicine" | "equipment"
  title: string
  subtitle: string
  metadata?: string
}

interface DashboardSearchProps {
  language: "en" | "tn"
  onSelect?: (result: SearchResult) => void
}

export function DashboardSearch({ language, onSelect }: DashboardSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  const content = {
    en: {
      placeholder: "Search patients, appointments, medicines...",
      shortcut: "Press / to search",
      noResults: "No results found",
      patient: "Patient",
      appointment: "Appointment",
      medicine: "Medicine",
      equipment: "Equipment",
    },
    tn: {
      placeholder: "Batla balwetse, dikopano, dihlare...",
      shortcut: "Tobetsa / go batla",
      noResults: "Ga go na dipholo",
      patient: "Molwetse",
      appointment: "Kopano",
      medicine: "Sehlare",
      equipment: "Sedirisiwa",
    },
  }

  const t = content[language]

  // Mock search data
  const mockData: SearchResult[] = [
    {
      id: "P001",
      type: "patient",
      title: "Thabo Mogale",
      subtitle: "BW123456 • Age 45",
      metadata: "Last visit: 2024-01-10",
    },
    {
      id: "P002",
      type: "patient",
      title: "Keabetswe Tsheko",
      subtitle: "BW789012 • Age 38",
      metadata: "Last visit: 2024-01-09",
    },
    {
      id: "A001",
      type: "appointment",
      title: "Cardiology Consultation",
      subtitle: "Dr. Sekai Moyo",
      metadata: "Today 09:00",
    },
    {
      id: "M001",
      type: "medicine",
      title: "Amlodipine 5mg",
      subtitle: "45 units remaining",
      metadata: "Critical",
    },
    {
      id: "E001",
      type: "equipment",
      title: "MRI Scanner",
      subtitle: "Radiology Department",
      metadata: "Available",
    },
  ]

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const filtered = mockData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setResults(filtered)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
        document.getElementById("dashboard-search")?.focus()
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        setQuery("")
        setResults([])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, performSearch])

  const getIcon = (type: string) => {
    switch (type) {
      case "patient":
        return <User className="h-4 w-4" />
      case "appointment":
        return <Calendar className="h-4 w-4" />
      case "medicine":
        return <Pill className="h-4 w-4" />
      case "equipment":
        return <Package className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "patient":
        return t.patient
      case "appointment":
        return t.appointment
      case "medicine":
        return t.medicine
      case "equipment":
        return t.equipment
      default:
        return type
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="dashboard-search"
          type="text"
          placeholder={t.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
          <Command className="h-3 w-3" />
          <span>/</span>
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute w-full mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-2">
            <div className="space-y-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onSelect?.(result)
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">{getIcon(result.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{result.subtitle}</p>
                      {result.metadata && <p className="text-xs text-gray-500">{result.metadata}</p>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isOpen && query && results.length === 0 && (
        <Card className="absolute w-full mt-2 z-50 shadow-lg">
          <CardContent className="p-6 text-center text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>{t.noResults}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
