"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Bell,
  CheckCircle2,
  CircleX,
  Download,
  Globe,
  LogOut,
  MapPin,
  Minus,
  Plus,
  Search,
  TriangleAlert,
  Users,
} from "lucide-react"
import BeatsLogo from "@/components/BeatsLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { findMedicine, getFacilities, getTasks, subscribe, updateStock, updateTaskStatus } from "@/components/mock-service"

type RequestDecision = "accepted" | "limited" | "declined"

type TaskRecord = {
  id: string
  type: string
  fromFacility: string
  toFacility: string
  payload: Record<string, unknown>
  status: string
  createdAt: string
}

type FacilityRecord = {
  id: string
  facility: string
  stock: Record<string, number>
  medicineUpdates?: Record<string, { last_updated: string }>
}

type LocalMedicine = {
  name: string
  qty: number
  availability: "Available" | "Limited" | "Out of Stock"
  lastUpdated?: string
}

function toRelativeTime(timestamp?: string) {
  if (!timestamp) return "just now"
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.max(1, Math.floor(diffMs / 60000))
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

function toAvailability(qty: number): LocalMedicine["availability"] {
  if (qty <= 0) return "Out of Stock"
  if (qty <= 50) return "Limited"
  return "Available"
}

function getStatusClass(status: string) {
  if (status === "Available") return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (status === "Limited") return "bg-amber-50 text-amber-700 border-amber-200"
  return "bg-rose-50 text-rose-700 border-rose-200"
}

function getDecisionLabel(decision: RequestDecision) {
  if (decision === "accepted") return "Accepted"
  if (decision === "limited") return "Limited"
  return "Declined"
}

function toUrgency(payload: Record<string, unknown>) {
  const raw = payload.urgency
  if (typeof raw === "string") {
    const value = raw.toLowerCase()
    if (value.includes("urgent")) return "Urgent"
    if (value.includes("priority")) return "Priority"
  }
  return "Routine"
}

export default function PharmacistDashboardPage() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [activeTab, setActiveTab] = useState("inventory")
  const [facilityId, setFacilityId] = useState("pmh")
  const [displayFacility, setDisplayFacility] = useState("Princess Marina Hospital")
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [facilities, setFacilities] = useState<FacilityRecord[]>([])
  const [localInventory, setLocalInventory] = useState<LocalMedicine[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [visibilityResults, setVisibilityResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [respondingTaskId, setRespondingTaskId] = useState<string | null>(null)
  const [adjustingMedicine, setAdjustingMedicine] = useState<string | null>(null)
  const [stockAdjustments, setStockAdjustments] = useState<Record<string, string>>({})
  const [showSpecialistModal, setShowSpecialistModal] = useState(false)
  const [specialistSearch, setSpecialistSearch] = useState("")
  const [specialistSearchResults, setSpecialistSearchResults] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedFacilityId = localStorage.getItem("userFacilityKey") || "pmh"
    const savedFacilityName = localStorage.getItem("userFacilityNameEn") || "Princess Marina Hospital"
    setFacilityId(savedFacilityId)
    setDisplayFacility(savedFacilityName)
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      const [facilityData, taskData] = await Promise.all([getFacilities(), getTasks()])
      setFacilities(facilityData as FacilityRecord[])
      setTasks(taskData as TaskRecord[])
    }

    loadDashboardData()
    const unsubTaskAdd = subscribe("tasks:added", loadDashboardData)
    const unsubTaskUpdate = subscribe("tasks:updated", loadDashboardData)
    const unsubFacilities = subscribe("facilities:changed", loadDashboardData)

    return () => {
      unsubTaskAdd()
      unsubTaskUpdate()
      unsubFacilities()
    }
  }, [])

  useEffect(() => {
    const localFacility = facilities.find((facility) => facility.id === facilityId)
    if (!localFacility) {
      setLocalInventory([])
      return
    }

    const inventory = Object.entries(localFacility.stock).map(([name, qty]) => {
      const numericQty = Number(qty)
      return {
        name,
        qty: numericQty,
        availability: toAvailability(numericQty),
        lastUpdated: localFacility.medicineUpdates?.[name]?.last_updated,
      } satisfies LocalMedicine
    })
    setLocalInventory(inventory.sort((left, right) => left.name.localeCompare(right.name)))
  }, [facilities, facilityId])

  const incomingAvailabilityRequests = useMemo(() => {
    return tasks
      .filter((task) => task.toFacility === facilityId && task.status === "pending")
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
  }, [facilityId, tasks])

  const mostRequiredMedicines = useMemo(() => {
    const counts = new Map<string, number>()
    incomingAvailabilityRequests.forEach((task) => {
      const resource = task.payload?.item
      if (typeof resource === "string" && resource.trim()) {
        counts.set(resource, (counts.get(resource) ?? 0) + 1)
      }
    })

    return Array.from(counts.entries())
      .map(([medicine, count]) => ({ medicine, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 5)
  }, [incomingAvailabilityRequests])

  const topRequestingFacilities = useMemo(() => {
    const counts = new Map<string, number>()
    incomingAvailabilityRequests.forEach((task) => {
      const facilityName = facilities.find((facility) => facility.id === task.fromFacility)?.facility ?? task.fromFacility.toUpperCase()
      counts.set(facilityName, (counts.get(facilityName) ?? 0) + 1)
    })

    return Array.from(counts.entries())
      .map(([facility, count]) => ({ facility, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 5)
  }, [facilities, incomingAvailabilityRequests])

  const criticalLowMedicines = useMemo(() => {
    return localInventory.filter((medicine) => medicine.qty <= 20).sort((left, right) => left.qty - right.qty)
  }, [localInventory])

  const mostlyUsedMedicines = useMemo(() => {
    return [...localInventory].sort((left, right) => left.qty - right.qty).slice(0, 5)
  }, [localInventory])

  const handleVisibilitySearch = async () => {
    const query = searchQuery.trim()
    if (!query) {
      setVisibilityResults([])
      return
    }

    setSearching(true)
    try {
      const results = await findMedicine(query)
      setVisibilityResults(results)
    } finally {
      setSearching(false)
    }
  }

  const respondToIncomingRequest = async (task: TaskRecord, decision: RequestDecision) => {
    setRespondingTaskId(task.id)
    const mappedStatus = decision === "declined" ? "cancelled" : "approved"
    await updateTaskStatus(task.id, mappedStatus as any)
    setRespondingTaskId(null)

    toast({
      title: `${getDecisionLabel(decision)}: ${String(task.payload.item ?? "resource")}`,
      description: `Response sent to ${facilities.find((f) => f.id === task.fromFacility)?.facility ?? task.fromFacility}.`,
    })
  }

  const applyStockAdjustment = async (medicine: LocalMedicine, direction: 1 | -1) => {
    const rawValue = stockAdjustments[medicine.name] ?? "0"
    const units = Math.floor(Number(rawValue))

    if (!Number.isFinite(units) || units <= 0) {
      toast({
        title: "Stock adjustment needed",
        description: "Enter a positive whole number of units before adjusting stock.",
      })
      return
    }

    setAdjustingMedicine(medicine.name)
    const updatedFacility = await updateStock(facilityId, medicine.name, units * direction)
    setAdjustingMedicine(null)

    if (!updatedFacility) {
      toast({
        title: "Stock update failed",
        description: "The selected facility could not be found.",
      })
      return
    }

    setStockAdjustments((current) => ({ ...current, [medicine.name]: "" }))
    toast({
      title: "Stock adjusted",
      description: `${medicine.name} ${direction > 0 ? "increased" : "reduced"} by ${units} unit${units === 1 ? "" : "s"}.`,
    })
  }

  const exportInventoryData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      facilityId,
      facility: displayFacility,
      inventory: localInventory,
      totals: {
        skus: localInventory.length,
        criticalLow: criticalLowMedicines.length,
        available: localInventory.filter((medicine) => medicine.availability === "Available").length,
        limited: localInventory.filter((medicine) => medicine.availability === "Limited").length,
        outOfStock: localInventory.filter((medicine) => medicine.availability === "Out of Stock").length,
      },
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `pharmacy-stock-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export complete",
      description: "Local stock data has been exported successfully.",
    })
  }

  const exportAnalyticsData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      facilityId,
      facility: displayFacility,
      inventory: localInventory,
      criticalLowMedicines,
      mostlyUsedMedicines,
      mostRequiredMedicines,
      topRequestingFacilities,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `pharmacy-analytics-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export complete",
      description: "Analytics data has been exported successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <BeatsLogo size={48} />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Pharmacy Command</h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">{displayFacility}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSpecialistModal(true)}>
              <Users className="mr-2 h-4 w-4" />
              Specialist Network
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "tn" : "en")}>
              <Globe className="mr-2 h-4 w-4" />
              {language === "en" ? "Setswana" : "English"}
            </Button>
            <Button variant="outline" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Link href="/login">
              <Button variant="outline" size="icon" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Local SKUs</CardDescription>
              <CardTitle className="text-2xl">{localInventory.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Critical Low</CardDescription>
              <CardTitle className="text-2xl">{criticalLowMedicines.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Incoming Availability Requests</CardDescription>
              <CardTitle className="text-2xl">{incomingAvailabilityRequests.length}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-white p-1 md:grid-cols-4">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Local Stock
            </TabsTrigger>
            <TabsTrigger value="visibility" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              National Visibility
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Supply Requests
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Usage Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Local Stock</h2>
              <Button variant="outline" onClick={exportInventoryData}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {localInventory.map((item) => (
                <Card key={item.name}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <Badge className={`border ${getStatusClass(item.availability)}`}>{item.availability}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                    <p className="text-xs text-slate-500">Updated {toRelativeTime(item.lastUpdated)}</p>
                    <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={stockAdjustments[item.name] ?? ""}
                        onChange={(event) =>
                          setStockAdjustments((current) => ({
                            ...current,
                            [item.name]: event.target.value,
                          }))
                        }
                        placeholder="Units"
                        aria-label={`Stock adjustment units for ${item.name}`}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          aria-label={`Reduce ${item.name} stock`}
                          onClick={() => applyStockAdjustment(item, -1)}
                          disabled={adjustingMedicine === item.name}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          className="bg-purple-600 hover:bg-purple-500"
                          aria-label={`Increase ${item.name} stock`}
                          onClick={() => applyStockAdjustment(item, 1)}
                          disabled={adjustingMedicine === item.name}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="visibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">National Visibility Search</CardTitle>
                <CardDescription>Type a medicine and search to see availability across facilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="pl-9"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onKeyDown={(event) => event.key === "Enter" && handleVisibilitySearch()}
                      placeholder="Search medicine (e.g. paracetamol, insulin)"
                    />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleVisibilitySearch} disabled={searching}>
                    {searching ? "Searching..." : "Search"}
                  </Button>
                </div>

                {visibilityResults.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {visibilityResults.map((result, index) => (
                      <Card key={`${result.facilityId}-${result.item}-${index}`}>
                        <CardContent className="space-y-2 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-slate-900">{result.item}</p>
                            <Badge className={`border ${getStatusClass(String(result.availability_status))}`}>
                              {String(result.availability_status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {result.facilityName}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500">Updated {toRelativeTime(String(result.last_updated))}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {searchQuery.trim() && visibilityResults.length === 0 && !searching && (
                  <p className="rounded-md border border-dashed p-3 text-sm text-slate-500">
                    No national visibility matches found for "{searchQuery}".
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Incoming Availability Requests</CardTitle>
                <CardDescription>Review and respond to requests from other facilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {incomingAvailabilityRequests.length === 0 && (
                  <p className="rounded-md border border-dashed p-4 text-sm text-slate-500">
                    No incoming availability requests at this time.
                  </p>
                )}

                {incomingAvailabilityRequests.map((task) => {
                  const resource = typeof task.payload.item === "string" ? task.payload.item : "Unspecified resource"
                  const fromFacility = facilities.find((facility) => facility.id === task.fromFacility)?.facility ?? task.fromFacility.toUpperCase()
                  const urgency = toUrgency(task.payload)
                  return (
                    <div key={task.id} className="rounded-md border p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">{resource}</p>
                          <p className="text-xs text-slate-500">From: {fromFacility}</p>
                          <p className="text-xs text-slate-500">Received {toRelativeTime(task.createdAt)}</p>
                        </div>
                        <Badge className={`border ${urgency === "Urgent" ? "border-rose-200 bg-rose-50 text-rose-700" : urgency === "Priority" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-100 text-slate-700"}`}>
                          {urgency}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500"
                          onClick={() => respondToIncomingRequest(task, "accepted")}
                          disabled={respondingTaskId === task.id}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-200 text-amber-700 hover:bg-amber-50"
                          onClick={() => respondToIncomingRequest(task, "limited")}
                          disabled={respondingTaskId === task.id}
                        >
                          <TriangleAlert className="mr-1 h-4 w-4" />
                          Limited
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-rose-200 text-rose-700 hover:bg-rose-50"
                          onClick={() => respondToIncomingRequest(task, "declined")}
                          disabled={respondingTaskId === task.id}
                        >
                          <CircleX className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Usage Analytics</h2>
              <Button variant="outline" onClick={exportAnalyticsData}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Critically Low Medicines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {criticalLowMedicines.length === 0 && <p className="text-sm text-slate-500">No critically low medicines right now.</p>}
                  {criticalLowMedicines.map((medicine) => (
                    <div key={medicine.name} className="flex items-center justify-between rounded-md border p-2">
                      <p className="text-sm font-medium">{medicine.name}</p>
                      <Badge className="border border-rose-200 bg-rose-50 text-rose-700">Qty {medicine.qty}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mostly Used Medicines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mostlyUsedMedicines.map((medicine) => (
                    <div key={medicine.name} className="flex items-center justify-between rounded-md border p-2">
                      <p className="text-sm font-medium">{medicine.name}</p>
                      <Badge variant="outline">Qty {medicine.qty}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Most Required Medicines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mostRequiredMedicines.length === 0 && <p className="text-sm text-slate-500">No incoming medicine demand signals yet.</p>}
                  {mostRequiredMedicines.map((entry) => (
                    <div key={entry.medicine} className="flex items-center justify-between rounded-md border p-2">
                      <p className="text-sm font-medium">{entry.medicine}</p>
                      <Badge variant="outline">{entry.count} requests</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Requesting Facilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topRequestingFacilities.length === 0 && <p className="text-sm text-slate-500">No requesting facility trend yet.</p>}
                  {topRequestingFacilities.map((entry) => (
                    <div key={entry.facility} className="flex items-center justify-between rounded-md border p-2">
                      <p className="text-sm font-medium">{entry.facility}</p>
                      <Badge variant="outline">{entry.count} requests</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
