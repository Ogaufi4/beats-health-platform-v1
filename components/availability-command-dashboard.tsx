"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Activity,
  BedDouble,
  Bell,
  CheckCircle2,
  CircleX,
  ClipboardCheck,
  Clock3,
  Droplets,
  Globe,
  Hospital,
  LogOut,
  MapPin,
  Pill,
  Scan,
  Stethoscope,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"
import BeatsLogo from "@/components/BeatsLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { addTask, getBloodAvailability, getFacilities, getTasks, getWardAvailability, subscribe } from "@/components/mock-service"

type DashboardRole = "doctor" | "nurse"
type ResourceCategoryId = "medicines" | "blood" | "lab" | "equipment" | "wards"
type ResourceStatus = "Available" | "Limited" | "Unavailable" | "Busy / Engaged" | "In Use" | "Full"
type SortMode = "distance" | "availability"
type FacilityFilterMode = "nearby" | "all" | string
type RequestUrgency = "Routine" | "Priority" | "Urgent"
type RequestOutcome = "accepted" | "limited" | "declined"

type FacilityRecord = {
  id: string
  facility: string
  location?: string
  distance?: number
  stock: Record<string, number>
  bloodStock: Record<string, number>
  wards: Array<{
    ward_name: string
    ward_type: string
    total_beds: number
    available_beds: number
    last_updated: string
  }>
  medicineUpdates?: Record<string, { last_updated: string }>
  equipment: Record<string, "available" | "busy" | "maintenance">
}

type TaskRecord = {
  id: string
  type: string
  fromFacility: string
  toFacility: string
  payload: Record<string, unknown>
  status: string
  createdAt: string
}

type ResourceItem = {
  id: string
  category: ResourceCategoryId
  resourceName: string
  facilityId: string
  facilityName: string
  distance?: number
  status: ResourceStatus
  statusScore: number
  detail: string
  lastUpdated?: string
}

type RequestFeedback = {
  id: string
  resourceId: string
  resourceName: string
  facilityName: string
  urgency: RequestUrgency
  outcome: RequestOutcome
  note?: string
  createdAt: string
}

const CATEGORY_META: Record<ResourceCategoryId, { label: string; icon: LucideIcon; hint: string }> = {
  medicines: { label: "Medicines", icon: Pill, hint: "Available / Limited / Unavailable" },
  blood: { label: "Blood", icon: Droplets, hint: "Available / Limited / Unavailable" },
  lab: { label: "Lab / Diagnostics", icon: Scan, hint: "Capacity only, no results shown" },
  equipment: { label: "Equipment", icon: Activity, hint: "MRI, X-Ray, Ultrasound" },
  wards: { label: "Ward / Beds", icon: BedDouble, hint: "Available / Limited / Full" },
}

const STATUS_SCORE: Record<ResourceStatus, number> = {
  Available: 5,
  Limited: 4,
  "Busy / Engaged": 3,
  "In Use": 3,
  Unavailable: 2,
  Full: 1,
}

const RESPONSE_COPY: Record<RequestOutcome, { title: string; action: string }> = {
  accepted: { title: "Accepted", action: "Send patient" },
  limited: { title: "Limited", action: "Proceed with caution" },
  declined: { title: "Declined", action: "Not available" },
}

const EQUIPMENT_TARGETS = ["MRI", "X-Ray", "Ultrasound"] as const

function getLatestTimestamp(values: Array<string | undefined>): string | undefined {
  const timestamps = values.filter(Boolean) as string[]
  if (!timestamps.length) return undefined
  return timestamps.reduce((latest, current) =>
    new Date(current).getTime() > new Date(latest).getTime() ? current : latest,
  )
}

function toRelativeTime(timestamp?: string) {
  if (!timestamp) return "Updated just now"
  const deltaMs = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.max(1, Math.floor(deltaMs / 60000))
  if (minutes < 60) return `Updated ${minutes} mins ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Updated ${hours} hrs ago`
  const days = Math.floor(hours / 24)
  return `Updated ${days} day${days === 1 ? "" : "s"} ago`
}

function getStatusClass(status: ResourceStatus) {
  if (status === "Available") return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (status === "Limited" || status === "Busy / Engaged" || status === "In Use") {
    return "bg-amber-50 text-amber-700 border-amber-200"
  }
  return "bg-rose-50 text-rose-700 border-rose-200"
}

function getFeedbackClass(outcome: RequestOutcome) {
  if (outcome === "accepted") return "text-emerald-700 bg-emerald-50 border-emerald-200"
  if (outcome === "limited") return "text-amber-700 bg-amber-50 border-amber-200"
  return "text-rose-700 bg-rose-50 border-rose-200"
}

function getTrafficLevel(pendingCount: number) {
  if (pendingCount <= 2) return "Low"
  if (pendingCount <= 5) return "Moderate"
  return "High"
}

function toMedicineStatus(stock: Record<string, number>): ResourceStatus {
  const quantities = Object.values(stock)
  if (!quantities.length) return "Unavailable"
  const available = quantities.filter((value) => value > 50).length
  const limited = quantities.filter((value) => value > 0 && value <= 50).length
  const unavailable = quantities.filter((value) => value <= 0).length

  if (available === 0 && limited === 0) return "Unavailable"
  if (available >= limited + unavailable) return "Available"
  return "Limited"
}

function toBloodStatus(statuses: string[]): ResourceStatus {
  if (!statuses.length) return "Unavailable"
  const available = statuses.filter((status) => status === "Available").length
  const limited = statuses.filter((status) => status === "Limited").length
  if (available >= 5) return "Available"
  if (available === 0 && limited === 0) return "Unavailable"
  return "Limited"
}

function toLabPcrStatus(pendingRequests: number): ResourceStatus {
  if (pendingRequests <= 1) return "Available"
  if (pendingRequests <= 3) return "Limited"
  return "Busy / Engaged"
}

function toEquipmentStatus(equipmentStatus?: "available" | "busy" | "maintenance"): ResourceStatus {
  if (!equipmentStatus) return "Limited"
  if (equipmentStatus === "available") return "Available"
  if (equipmentStatus === "busy") return "In Use"
  return "Limited"
}

function toRequestOutcome(status: ResourceStatus): RequestOutcome {
  if (status === "Available") return "accepted"
  if (status === "Limited" || status === "Busy / Engaged" || status === "In Use") return "limited"
  return "declined"
}

function getRoleCopy(role: DashboardRole) {
  if (role === "doctor") {
    return {
      title: "Doctor Availability Command",
      subtitle: "Primary decision dashboard",
      quote: "I do not guess anymore. I know before I move the patient.",
      actionLabel: "Request Availability",
      helperLabel: "Decision support in one screen",
      assistantAction: "Follow-up on request",
    }
  }

  return {
    title: "Nurse Availability Support",
    subtitle: "Support and execution dashboard",
    quote: "I can coordinate fast and support the doctor without extra complexity.",
    actionLabel: "Send Request",
    helperLabel: "Simplified coordination view",
    assistantAction: "Assist Doctor Request",
  }
}

export default function AvailabilityCommandDashboard({ role }: { role: DashboardRole }) {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [activeCategory, setActiveCategory] = useState<ResourceCategoryId>("medicines")
  const [sortBy, setSortBy] = useState<SortMode>("availability")
  const [facilityFilter, setFacilityFilter] = useState<FacilityFilterMode>("nearby")
  const [selectedFacilityId, setSelectedFacilityId] = useState("ub_clinic")
  const [displayFacility, setDisplayFacility] = useState("UB Clinic")
  const [facilities, setFacilities] = useState<FacilityRecord[]>([])
  const [bloodRows, setBloodRows] = useState<any[]>([])
  const [wardRows, setWardRows] = useState<any[]>([])
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [requestingItem, setRequestingItem] = useState<ResourceItem | null>(null)
  const [requestUrgency, setRequestUrgency] = useState<RequestUrgency>("Routine")
  const [requestNote, setRequestNote] = useState("")
  const [submittingRequest, setSubmittingRequest] = useState(false)
  const [feedbackHistory, setFeedbackHistory] = useState<RequestFeedback[]>([])
  const { toast } = useToast()

  const roleCopy = getRoleCopy(role)

  useEffect(() => {
    const savedFacilityId = localStorage.getItem("userFacilityKey") || "ub_clinic"
    const savedFacilityName = localStorage.getItem("userFacilityNameEn") || "UB Clinic"
    setSelectedFacilityId(savedFacilityId)
    setDisplayFacility(savedFacilityName)
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      const [facilityData, bloodData, wardData, taskData] = await Promise.all([
        getFacilities(),
        getBloodAvailability(""),
        getWardAvailability(""),
        getTasks(),
      ])
      setFacilities(facilityData as FacilityRecord[])
      setBloodRows(bloodData)
      setWardRows(wardData)
      setTasks(taskData as TaskRecord[])
    }

    loadDashboardData()
    const unsubTasksAdded = subscribe("tasks:added", loadDashboardData)
    const unsubTasksUpdated = subscribe("tasks:updated", loadDashboardData)
    const unsubFacilities = subscribe("facilities:changed", loadDashboardData)

    return () => {
      unsubTasksAdded()
      unsubTasksUpdated()
      unsubFacilities()
    }
  }, [])

  const nearbyFacilities = useMemo(() => {
    const withoutCurrent = facilities.filter((facility) => facility.id !== selectedFacilityId)
    if (!withoutCurrent.length) return facilities
    const byDistance = [...withoutCurrent].sort(
      (left, right) => (left.distance ?? Number.POSITIVE_INFINITY) - (right.distance ?? Number.POSITIVE_INFINITY),
    )
    const nearest = byDistance.filter((facility) => (facility.distance ?? Number.POSITIVE_INFINITY) <= 15)
    return nearest.length ? nearest : byDistance.slice(0, 4)
  }, [facilities, selectedFacilityId])

  const pendingRequestsByFacility = useMemo(() => {
    return tasks.reduce((accumulator, task) => {
      if (task.status !== "pending") return accumulator
      accumulator.set(task.toFacility, (accumulator.get(task.toFacility) ?? 0) + 1)
      return accumulator
    }, new Map<string, number>())
  }, [tasks])

  const bloodByFacility = useMemo(() => {
    return bloodRows.reduce((accumulator, row) => {
      const facilityId = String(row.facilityId)
      const currentRows = accumulator.get(facilityId) ?? []
      currentRows.push(row)
      accumulator.set(facilityId, currentRows)
      return accumulator
    }, new Map<string, any[]>())
  }, [bloodRows])

  const baseResourceItems = useMemo(() => {
    const medicines: ResourceItem[] = facilities.map((facility) => {
      const quantities = Object.values(facility.stock)
      const available = quantities.filter((value) => value > 50).length
      const unavailable = quantities.filter((value) => value <= 0).length
      const status = toMedicineStatus(facility.stock)
      const lastUpdated = getLatestTimestamp(
        Object.values(facility.medicineUpdates ?? {}).map((update) => update.last_updated),
      )

      return {
        id: `medicines-${facility.id}`,
        category: "medicines",
        resourceName: "Medicines",
        facilityId: facility.id,
        facilityName: facility.facility,
        distance: facility.distance,
        status,
        statusScore: STATUS_SCORE[status],
        detail: `${available} available lines, ${unavailable} unavailable lines`,
        lastUpdated,
      }
    })

    const blood: ResourceItem[] = facilities.map((facility) => {
      const facilityBloodRows = bloodByFacility.get(facility.id) ?? []
      const statuses = facilityBloodRows.map((row) => String(row.availability_status))
      const status = toBloodStatus(statuses)
      const lastUpdated = getLatestTimestamp(facilityBloodRows.map((row) => String(row.last_updated)))
      const availableTypes = facilityBloodRows.filter((row) => row.availability_status === "Available").length

      return {
        id: `blood-${facility.id}`,
        category: "blood",
        resourceName: "Blood Bank Capacity",
        facilityId: facility.id,
        facilityName: facility.facility,
        distance: facility.distance,
        status,
        statusScore: STATUS_SCORE[status],
        detail: `${availableTypes}/8 blood types currently available`,
        lastUpdated,
      }
    })

    const lab: ResourceItem[] = facilities.flatMap((facility) => {
      const facilityBloodRows = bloodByFacility.get(facility.id) ?? []
      const bloodStatus = toBloodStatus(facilityBloodRows.map((row) => String(row.availability_status)))
      const pendingCount = pendingRequestsByFacility.get(facility.id) ?? 0
      const pcrStatus = toLabPcrStatus(pendingCount)
      const equipmentStatuses = Object.values(facility.equipment)
      const availableMachines = equipmentStatuses.filter((status) => status === "available").length
      const busyMachines = equipmentStatuses.filter((status) => status === "busy").length
      const imagingStatus: ResourceStatus =
        busyMachines > availableMachines ? "Busy / Engaged" : availableMachines > 0 ? "Available" : "Limited"
      const sharedLastUpdated = getLatestTimestamp([
        getLatestTimestamp(facilityBloodRows.map((row) => String(row.last_updated))),
        getLatestTimestamp(Object.values(facility.medicineUpdates ?? {}).map((update) => update.last_updated)),
      ])

      return [
        {
          id: `lab-blood-tests-${facility.id}`,
          category: "lab" as const,
          resourceName: "Blood Tests",
          facilityId: facility.id,
          facilityName: facility.facility,
          distance: facility.distance,
          status: bloodStatus,
          statusScore: STATUS_SCORE[bloodStatus],
          detail: "Capacity only, no patient result details shown",
          lastUpdated: sharedLastUpdated,
        },
        {
          id: `lab-pcr-${facility.id}`,
          category: "lab" as const,
          resourceName: "PCR Machine",
          facilityId: facility.id,
          facilityName: facility.facility,
          distance: facility.distance,
          status: pcrStatus,
          statusScore: STATUS_SCORE[pcrStatus],
          detail: `${pendingCount} pending request${pendingCount === 1 ? "" : "s"} in queue`,
          lastUpdated: sharedLastUpdated,
        },
        {
          id: `lab-imaging-${facility.id}`,
          category: "lab" as const,
          resourceName: "Imaging Lab",
          facilityId: facility.id,
          facilityName: facility.facility,
          distance: facility.distance,
          status: imagingStatus,
          statusScore: STATUS_SCORE[imagingStatus],
          detail: `${availableMachines} machines available now`,
          lastUpdated: sharedLastUpdated,
        },
      ]
    })

    const equipment: ResourceItem[] = facilities.flatMap((facility) => {
      return EQUIPMENT_TARGETS.map((equipmentName) => {
        const matchingEntry = Object.entries(facility.equipment).find(([name]) =>
          name.toLowerCase().includes(equipmentName.toLowerCase()),
        )
        const equipmentStatus = matchingEntry ? matchingEntry[1] : undefined
        const status = toEquipmentStatus(equipmentStatus)
        const lastUpdated = getLatestTimestamp(
          Object.values(facility.medicineUpdates ?? {}).map((update) => update.last_updated),
        )

        return {
          id: `equipment-${equipmentName}-${facility.id}`,
          category: "equipment" as const,
          resourceName: equipmentName,
          facilityId: facility.id,
          facilityName: facility.facility,
          distance: facility.distance,
          status,
          statusScore: STATUS_SCORE[status],
          detail: matchingEntry ? matchingEntry[0] : "Not currently installed on site",
          lastUpdated,
        }
      })
    })

    const wards: ResourceItem[] = wardRows.map((row, index) => {
      const rawStatus = String(row.availability_status)
      const status: ResourceStatus = rawStatus === "Full" ? "Full" : rawStatus === "Available" ? "Available" : "Limited"

      return {
        id: `ward-${index}-${row.facilityId}`,
        category: "wards",
        resourceName: String(row.ward_name),
        facilityId: String(row.facilityId),
        facilityName: String(row.facility),
        distance: facilities.find((facility) => facility.id === row.facilityId)?.distance,
        status,
        statusScore: STATUS_SCORE[status],
        detail: `${String(row.ward_type)} ward`,
        lastUpdated: String(row.last_updated),
      }
    })

    return { medicines, blood, lab, equipment, wards }
  }, [bloodByFacility, facilities, pendingRequestsByFacility, wardRows])

  const latestUpdate = useMemo(() => {
    const allTimestamps = Object.values(baseResourceItems)
      .flat()
      .map((item) => item.lastUpdated)
    return getLatestTimestamp(allTimestamps)
  }, [baseResourceItems])

  const filteredItems = useMemo(() => {
    const selected = baseResourceItems[activeCategory]
    const nearbyIds = new Set(nearbyFacilities.map((facility) => facility.id))

    const facilityScoped = selected.filter((item) => {
      if (role === "nurse") return nearbyIds.has(item.facilityId)
      if (facilityFilter === "all") return true
      if (facilityFilter === "nearby") return nearbyIds.has(item.facilityId)
      return item.facilityId === facilityFilter
    })

    const sorted = [...facilityScoped].sort((left, right) => {
      if (sortBy === "distance") {
        return (left.distance ?? Number.POSITIVE_INFINITY) - (right.distance ?? Number.POSITIVE_INFINITY)
      }
      if (left.statusScore === right.statusScore) {
        return (left.distance ?? Number.POSITIVE_INFINITY) - (right.distance ?? Number.POSITIVE_INFINITY)
      }
      return right.statusScore - left.statusScore
    })

    return role === "nurse" ? sorted.slice(0, 8) : sorted
  }, [activeCategory, baseResourceItems, facilityFilter, nearbyFacilities, role, sortBy])

  const feedbackByResource = useMemo(() => {
    return feedbackHistory.reduce((accumulator, feedback) => {
      if (!accumulator.has(feedback.resourceId)) {
        accumulator.set(feedback.resourceId, feedback)
      }
      return accumulator
    }, new Map<string, RequestFeedback>())
  }, [feedbackHistory])

  const nearbyPendingRequests = useMemo(() => {
    return nearbyFacilities.reduce((sum, facility) => sum + (pendingRequestsByFacility.get(facility.id) ?? 0), 0)
  }, [nearbyFacilities, pendingRequestsByFacility])

  const currentTraffic = getTrafficLevel(nearbyPendingRequests)

  const openRequestDialog = (item: ResourceItem) => {
    setRequestingItem(item)
    setRequestUrgency("Routine")
    setRequestNote("")
  }

  const closeRequestDialog = () => {
    setRequestingItem(null)
    setRequestUrgency("Routine")
    setRequestNote("")
  }

  const submitRequest = async () => {
    if (!requestingItem) return
    setSubmittingRequest(true)
    const outcome = toRequestOutcome(requestingItem.status)

    await addTask({
      type: requestingItem.category === "wards" ? "patient_referral" : "booking_request",
      fromFacility: selectedFacilityId,
      toFacility: requestingItem.facilityId,
      payload: {
        item: requestingItem.resourceName,
        status: requestingItem.status,
        urgency: requestUrgency,
        note: requestNote.trim(),
        requestedAt: new Date().toISOString(),
      },
    })

    const feedback: RequestFeedback = {
      id: `feedback-${Date.now()}`,
      resourceId: requestingItem.id,
      resourceName: requestingItem.resourceName,
      facilityName: requestingItem.facilityName,
      urgency: requestUrgency,
      outcome,
      note: requestNote.trim() || undefined,
      createdAt: new Date().toISOString(),
    }

    setFeedbackHistory((previous) => [feedback, ...previous].slice(0, 20))
    setSubmittingRequest(false)
    closeRequestDialog()
    const responseText = RESPONSE_COPY[outcome]

    toast({
      title: `${responseText.title}: ${requestingItem.resourceName}`,
      description: `${responseText.action} at ${requestingItem.facilityName}.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <BeatsLogo size={48} />
              <div>
                <h1 className="text-xl font-bold tracking-tight">{roleCopy.title}</h1>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{displayFacility}</p>
                <p className="text-xs text-slate-500">{roleCopy.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <Card className="border-blue-100 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            {role === "doctor" ? <Stethoscope className="h-5 w-5 text-blue-600" /> : <ClipboardCheck className="h-5 w-5 text-blue-600" />}
            <div>
              <p className="text-sm font-semibold text-slate-700">{roleCopy.helperLabel}</p>
              <p className="text-sm text-slate-500">{roleCopy.quote}</p>
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Hospital className="h-4 w-4" />
                Nearby Facilities
              </CardDescription>
              <CardTitle className="text-2xl">{nearbyFacilities.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Closest facilities for immediate referral checks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Facility Traffic
              </CardDescription>
              <CardTitle className="text-2xl">{currentTraffic}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">{nearbyPendingRequests} pending coordination requests nearby</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Last Updated
              </CardDescription>
              <CardTitle className="text-xl">{toRelativeTime(latestUpdate)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Live snapshot refreshed from facility capacity feeds</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Resource Availability</h2>
              <p className="text-sm text-slate-500">Check capacity first, then request instantly</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {role === "doctor" && (
                <select
                  value={facilityFilter}
                  onChange={(event) => setFacilityFilter(event.target.value as FacilityFilterMode)}
                  className="h-10 min-w-[180px] rounded-md border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="nearby">Nearby facilities</option>
                  <option value="all">All facilities</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.facility}
                    </option>
                  ))}
                </select>
              )}
              {role === "nurse" && (
                <Badge variant="outline" className="h-10 items-center rounded-md px-3 text-slate-600">
                  Nearby facilities only
                </Badge>
              )}
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortMode)}
                className="h-10 min-w-[160px] rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="availability">Sort by availability</option>
                <option value="distance">Sort by distance</option>
              </select>
            </div>
          </div>

          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as ResourceCategoryId)}>
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-white p-1 md:grid-cols-5">
              {(Object.keys(CATEGORY_META) as ResourceCategoryId[]).map((category) => {
                const meta = CATEGORY_META[category]
                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="gap-2 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <meta.icon className="h-4 w-4" />
                    {meta.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>

          <p className="text-xs text-slate-500">{CATEGORY_META[activeCategory].hint}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => {
              const response = feedbackByResource.get(item.id)
              return (
                <Card key={item.id} className="border-slate-200">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{item.resourceName}</p>
                        <p className="text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.facilityName}
                          </span>
                          {typeof item.distance === "number" ? ` • ${item.distance.toFixed(1)} km` : ""}
                        </p>
                      </div>
                      <Badge className={`border ${getStatusClass(item.status)}`}>{item.status}</Badge>
                    </div>

                    <p className="text-sm text-slate-600">{item.detail}</p>
                    <p className="text-xs text-slate-500">{toRelativeTime(item.lastUpdated)}</p>

                    <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={() => openRequestDialog(item)}>
                      {roleCopy.actionLabel}
                    </Button>

                    {response && (
                      <div className={`rounded-md border p-3 text-xs ${getFeedbackClass(response.outcome)}`}>
                        <p className="font-semibold">{RESPONSE_COPY[response.outcome].title}</p>
                        <p>{RESPONSE_COPY[response.outcome].action}</p>
                        <p className="mt-1 text-[11px] opacity-80">{toRelativeTime(response.createdAt)}</p>
                      </div>
                    )}

                    {role === "nurse" && (
                      <Button variant="outline" className="w-full">
                        {roleCopy.assistantAction}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Response Feedback</CardTitle>
              <CardDescription>Instant guidance before any patient movement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {feedbackHistory.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-slate-500">
                  No responses yet. Send a request to receive acceptance guidance.
                </p>
              )}
              {feedbackHistory.slice(0, 6).map((feedback) => (
                <div key={feedback.id} className={`rounded-md border p-3 text-sm ${getFeedbackClass(feedback.outcome)}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">
                      {feedback.resourceName} • {feedback.facilityName}
                    </p>
                    <Badge variant="outline">{feedback.urgency}</Badge>
                  </div>
                  <p className="mt-1">
                    {feedback.outcome === "accepted" && (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Send patient
                      </span>
                    )}
                    {feedback.outcome === "limited" && (
                      <span className="inline-flex items-center gap-1">
                        <TriangleAlert className="h-4 w-4" />
                        Proceed with caution
                      </span>
                    )}
                    {feedback.outcome === "declined" && (
                      <span className="inline-flex items-center gap-1">
                        <CircleX className="h-4 w-4" />
                        Not available
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nearby Facilities</CardTitle>
              <CardDescription>Distance and pressure view for rapid coordination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyFacilities.map((facility) => {
                const pending = pendingRequestsByFacility.get(facility.id) ?? 0
                return (
                  <div key={facility.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{facility.facility}</p>
                      <Badge variant="outline">{getTrafficLevel(pending)}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {typeof facility.distance === "number" ? `${facility.distance.toFixed(1)} km away` : "Distance not set"} • {pending} active requests
                    </p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>
      </main>

      <Dialog open={Boolean(requestingItem)} onOpenChange={(open) => (!open ? closeRequestDialog() : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{roleCopy.actionLabel}</DialogTitle>
            <DialogDescription>
              {requestingItem
                ? `${requestingItem.resourceName} at ${requestingItem.facilityName} is currently ${requestingItem.status}.`
                : "Submit your request with urgency"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <p className="mb-1 text-sm font-medium">Urgency</p>
              <select
                value={requestUrgency}
                onChange={(event) => setRequestUrgency(event.target.value as RequestUrgency)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="Routine">Routine</option>
                <option value="Priority">Priority</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Optional note</p>
              <Textarea
                value={requestNote}
                onChange={(event) => setRequestNote(event.target.value)}
                placeholder="Add context for the receiving facility"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeRequestDialog} disabled={submittingRequest}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-500" onClick={submitRequest} disabled={submittingRequest}>
              {submittingRequest ? "Sending..." : roleCopy.actionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
