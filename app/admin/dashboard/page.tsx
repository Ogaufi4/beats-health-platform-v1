"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Activity, Bed, Bell, Building2, Clock, Globe, LogOut, ShieldCheck, Stethoscope, TrendingUp, TriangleAlert, Users, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import BeatsLogo from "@/components/BeatsLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBloodAvailability, getFacilities, getTasks, getWardAvailability, subscribe } from "@/components/mock-service"

type FacilityRecord = {
  id: string
  facility: string
  location?: string
  stock: Record<string, number>
  wards: Array<{ available_beds: number; total_beds: number }>
  specialists: Record<string, "available" | "busy" | "off-duty">
}

type TaskRecord = {
  id: string
  payload?: { item?: string; qty?: number }
  status: string
  createdAt: string
  toFacility: string
  fromFacility: string
  type?: string
}

type UrgencyLevel = "urgent" | "priority" | "routine"

function toTitleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

function getUrgencyLevel(item: string): UrgencyLevel {
  const urgent = ["insulin", "blood", "mri", "ct", "emergency"]
  const priority = ["amoxicillin", "ceftriaxone", "oxygen", "equipment"]
  const itemLower = item.toLowerCase()
  
  if (urgent.some(u => itemLower.includes(u))) return "urgent"
  if (priority.some(p => itemLower.includes(p))) return "priority"
  return "routine"
}

function getUrgencyColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "urgent": return "bg-red-100 border-red-300"
    case "priority": return "bg-amber-100 border-amber-300"
    case "routine": return "bg-gray-100 border-gray-300"
  }
}

function getUrgencyBadgeColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "urgent": return "bg-red-500"
    case "priority": return "bg-amber-500"
    case "routine": return "bg-gray-400"
  }
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function AdminDashboardPage() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [facilities, setFacilities] = useState<FacilityRecord[]>([])
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [bloodRows, setBloodRows] = useState<any[]>([])
  const [wardRows, setWardRows] = useState<any[]>([])
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, "Available" | "Limited" | "Unavailable">>({
    medicines: "Available",
    blood: "Available",
    equipment: "Available",
    beds: "Available",
    lab: "Available",
  })
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date>(new Date())

  useEffect(() => {
    const loadData = async () => {
      const [facilityData, taskData, bloodData, wardsData] = await Promise.all([
        getFacilities(),
        getTasks(),
        getBloodAvailability(""),
        getWardAvailability(""),
      ])
      setFacilities(facilityData as FacilityRecord[])
      setTasks(taskData as TaskRecord[])
      setBloodRows(bloodData)
      setWardRows(wardsData)
    }

    loadData()
    const unsubTasksAdded = subscribe("tasks:added", loadData)
    const unsubTasksUpdated = subscribe("tasks:updated", loadData)
    const unsubFacilities = subscribe("facilities:changed", loadData)

    return () => {
      unsubTasksAdded()
      unsubTasksUpdated()
      unsubFacilities()
    }
  }, [])

  const pendingByFacility = useMemo(() => {
    return tasks.reduce((accumulator, task) => {
      if (task.status !== "pending") return accumulator
      accumulator.set(task.toFacility, (accumulator.get(task.toFacility) ?? 0) + 1)
      return accumulator
    }, new Map<string, number>())
  }, [tasks])

  // A. INCOMING REQUESTS - sorted by most recent first
  const incomingRequests = useMemo(() => {
    return tasks
      .filter(t => t.status === "pending")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [tasks])

  // B. ESCALATION ALERTS - count of pending requests
  const escalationAlertCount = useMemo(() => {
    return tasks.filter(t => t.status === "pending").length
  }, [tasks])

  // E. QUICK ACTIVITY SNAPSHOT - stats
  const activityStats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaysTasks = tasks.filter(t => new Date(t.createdAt).getTime() >= today.getTime())
    const responded = tasks.filter(t => t.status !== "pending").length
    const pending = tasks.filter(t => t.status === "pending").length
    
    return {
      receivedToday: todaysTasks.length,
      respondedTo: responded,
      pendingRequests: pending,
    }
  }, [tasks])

  // F. MOST REQUESTED MEDICINE BY FACILITY
  const mostRequestedMedicinesByFacility = useMemo(() => {
    const medicineNames = new Set<string>()
    facilities.forEach((facility) => {
      Object.keys(facility.stock ?? {}).forEach((item) => medicineNames.add(item.toLowerCase()))
    })

    const counts = new Map<string, { medicine: string; facility: string; location?: string; count: number }>()

    tasks.forEach((task) => {
      const rawItem = task.payload?.item
      if (typeof rawItem !== "string") return
      const normalizedItem = rawItem.trim().toLowerCase()
      if (!medicineNames.has(normalizedItem)) return

      const facility = facilities.find((item) => item.id === task.toFacility)
      const facilityName = facility?.facility ?? task.toFacility.toUpperCase()
      const key = `${normalizedItem}|${task.toFacility}`
      const existing = counts.get(key)
      if (existing) {
        existing.count += 1
        return
      }

      counts.set(key, {
        medicine: toTitleCase(rawItem),
        facility: facilityName,
        location: facility?.location,
        count: 1,
      })
    })

    return Array.from(counts.values()).sort((left, right) => right.count - left.count).slice(0, 4)
  }, [facilities, tasks])

  const hospitalCapacity = useMemo(() => {
    return facilities
      .map((facility) => {
        const totalBeds = facility.wards.reduce((sum, ward) => sum + Number(ward.total_beds ?? 0), 0)
        const availableBeds = facility.wards.reduce((sum, ward) => sum + Number(ward.available_beds ?? 0), 0)
        const occupiedBeds = Math.max(0, totalBeds - availableBeds)
        const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
        const pending = pendingByFacility.get(facility.id) ?? 0

        return {
          facility: facility.facility,
          location: facility.location,
          totalBeds,
          availableBeds,
          occupiedBeds,
          occupancyRate,
          pending,
        }
      })
      .sort((left, right) => right.occupancyRate - left.occupancyRate)
  }, [facilities, pendingByFacility])

  const specialistCapacity = useMemo(() => {
    return facilities
      .map((facility) => {
        const specialists = Object.entries(facility.specialists ?? {})
        const available = specialists.filter(([, status]) => status === "available").length

        return {
          facility: facility.facility,
          location: facility.location,
          available,
          total: specialists.length,
          names: specialists.map(([name]) => name).slice(0, 3),
        }
      })
      .sort((left, right) => right.available - left.available)
  }, [facilities])

  const toggleAvailabilityStatus = (key: keyof typeof availabilityStatus) => {
    const current = availabilityStatus[key]
    const nextStatus: "Available" | "Limited" | "Unavailable" = 
      current === "Available" ? "Limited" : current === "Limited" ? "Unavailable" : "Available"
    
    setAvailabilityStatus(prev => ({
      ...prev,
      [key]: nextStatus
    }))
    setLastUpdatedTime(new Date())
  }

  const updateStatus = () => {
    setLastUpdatedTime(new Date())
  }

  const mostRequestedResources = useMemo(() => {
    const counts = new Map<string, number>()
    tasks.forEach((task) => {
      const item = task.payload?.item ?? "Unspecified resource"
      counts.set(item, (counts.get(item) ?? 0) + 1)
    })

    return Array.from(counts.entries())
      .map(([resource, count]) => ({ resource, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 6)
  }, [tasks])

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-4">
            <BeatsLogo size={52} />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {language === "en" ? "MOHW Oversight Dashboard" : "Dashboard ya MOHW"}
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {language === "en" ? "National View Only" : "Ponelopele ya Naga Fela"}
                </span>
              </p>
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
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {/* Info Banner */}
        <Card className="border-blue-100 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">
              {language === "en"
                ? "Oversight dashboard only: system usage, facility pressure, demand patterns, and national risk signals."
                : "Dashboard ya tebelo fela: tiriso ya tsamaiso, kgatelelo ya mafelo, dipaterone tsa tlhokego, le ditshwao tsa kotsi."}
            </p>
          </CardContent>
        </Card>

        {/* A. INCOMING REQUESTS (TOP PRIORITY) */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                {language === "en" ? "Incoming Requests" : "Dipolo Tse Tsenang"}
              </CardTitle>
              <CardDescription>
                {language === "en" 
                  ? `${incomingRequests.length} pending requests - sorted by most recent`
                  : `${incomingRequests.length} dipolo tse iphagameng - dikarabelo tse dingwe`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {incomingRequests.length === 0 ? (
                <p className="rounded-md border border-dashed p-4 text-center text-sm text-slate-500">
                  {language === "en" ? "No pending requests" : "Ga go na dipolo"}
                </p>
              ) : (
                incomingRequests.map((request) => {
                  const resourceName = request.payload?.item ? toTitleCase(String(request.payload.item)) : "Unknown Resource"
                  const facility = facilities.find(f => f.id === request.toFacility)
                  const urgency = getUrgencyLevel(String(request.payload?.item ?? ""))
                  
                  return (
                    <div
                      key={request.id}
                      className={`rounded-lg border-2 p-4 ${getUrgencyColor(urgency)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-900">{resourceName}</h4>
                            <Badge className={`${getUrgencyBadgeColor(urgency)} text-white`}>
                              {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700">
                            {language === "en" ? "From: " : "Go tswa: "}
                            <span className="font-medium">{facilities.find(f => f.id === request.fromFacility)?.facility ?? request.fromFacility}</span>
                          </p>
                          <p className="text-sm text-slate-700">
                            {language === "en" ? "To: " : "Go: "}
                            <span className="font-medium">{facility?.facility ?? request.toFacility}</span>
                          </p>
                          {facility?.location && (
                            <p className="text-xs text-slate-600">
                              {language === "en" ? "Location: " : "Lefelo: "}{facility.location}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-2">
                            {language === "en" ? "Time received: " : "Nako ya go amogelwa: "}
                            {formatTimeAgo(request.createdAt)} ({new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                          </p>
                        </div>
                        <div className="flex gap-2 flex-col">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            {language === "en" ? "Accept" : "Amogela"}
                          </Button>
                          <Button size="sm" variant="outline" className="border-amber-300 text-amber-700">
                            {language === "en" ? "Limited" : "Sekepe"}
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                            <XCircle className="h-4 w-4 mr-1" />
                            {language === "en" ? "Decline" : "Gaisa"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </section>

        {/* B. ESCALATION ALERTS */}
        <section>
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <TriangleAlert className="h-5 w-5" />
                {language === "en" ? "Escalation Alerts" : "Pele Tse Kgonakgonang"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? `${escalationAlertCount} pending requests awaiting response`
                  : `${escalationAlertCount} dipolo tse iphagameng`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {escalationAlertCount > 0 ? (
                <>
                  <div className="flex items-center justify-between rounded-md bg-red-100 p-3">
                    <div>
                      <p className="font-semibold text-red-900">{escalationAlertCount} Unresponded Requests</p>
                      <p className="text-sm text-red-700">
                        {language === "en"
                          ? "These requests require immediate attention"
                          : "Dipolo tse di naya kopano ya bonopagatso"}
                      </p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">
                      {language === "en" ? "Respond Now" : "Karabela Jaanong"}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="rounded-md border border-dashed p-4 text-center text-sm text-green-700">
                  {language === "en" ? "All requests have been responded to" : "Dipolo tsotlhe di lekile"}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* C. AVAILABILITY CONTROL */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Availability Control" : "Taolo ya Go Nna Teng"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Click items to toggle between Available, Limited, and Unavailable"
                  : "Ruta go fetela tokantsong"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(availabilityStatus).map(([key, status]) => {
                  const statusColors = {
                    "Available": "bg-green-100 border-green-300 text-green-700 hover:bg-green-200",
                    "Limited": "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200",
                    "Unavailable": "bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                  }
                  
                  const labels: Record<string, { en: string; tn: string }> = {
                    medicines: { en: "Medicines", tn: "Meriana" },
                    blood: { en: "Blood", tn: "Mogala" },
                    equipment: { en: "Equipment", tn: "Dijerata" },
                    beds: { en: "Beds", tn: "Dibedimogo" },
                    lab: { en: "Lab", tn: "Lab" }
                  }
                  
                  return (
                    <button
                      key={key}
                      onClick={() => toggleAvailabilityStatus(key as keyof typeof availabilityStatus)}
                      className={`rounded-lg border-2 p-3 text-center font-medium cursor-pointer transition-all ${statusColors[status]}`}
                    >
                      <p className="text-sm">{labels[key][language]}</p>
                      <p className="text-xs mt-1">{status}</p>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* D. LAST UPDATED INDICATOR */}
        <section>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <p className="text-sm text-slate-600">
                    {language === "en" ? "Last updated: " : "Phetogo ya mafelelo: "}
                    <span className="font-semibold text-slate-900">{formatTimeAgo(lastUpdatedTime.toISOString())}</span>
                  </p>
                </div>
                <Button size="sm" onClick={updateStatus} className="bg-blue-600 hover:bg-blue-700">
                  {language === "en" ? "Update Status" : "Araba Tokantsong"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* E. QUICK ACTIVITY SNAPSHOT */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {language === "en" ? "Requests Today" : "Dipolo Gompieno"}
              </CardDescription>
              <CardTitle className="text-3xl">{activityStats.receivedToday}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                {language === "en" ? "Requests received today" : "Dipolo tse apeelwa gompieno"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                {language === "en" ? "Responded" : "Go Karebelwa"}
              </CardDescription>
              <CardTitle className="text-3xl">{activityStats.respondedTo}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                {language === "en" ? "Requests responded to" : "Dipolo tse karebelwa"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                {language === "en" ? "Pending" : "Tse Iphagameng"}
              </CardDescription>
              <CardTitle className="text-3xl text-amber-600">{activityStats.pendingRequests}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                {language === "en" ? "Pending requests" : "Dipolo tse iphagameng"}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* F. NATIONAL PLANNING SIGNALS */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {language === "en" ? "Most Requested Medicine by Facility" : "Meriana e e Kopiwang ka Lefelo"}
              </CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Medicine demand ranked by receiving facility"
                  : "Meditsi e e mo godimo"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mostRequestedMedicinesByFacility.length > 0 ? (
                mostRequestedMedicinesByFacility.map((entry) => (
                  <div key={`${entry.medicine}-${entry.facility}`} className="rounded-md border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{entry.medicine}</p>
                        <p className="text-sm text-slate-600">{entry.facility}</p>
                        {entry.location && <p className="text-xs text-slate-500">{entry.location}</p>}
                      </div>
                      <Badge className="bg-blue-600">{entry.count}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-md border border-dashed p-4 text-center text-sm text-slate-500">
                  {language === "en" ? "No medicine demand signal yet" : "Ga go na seipone"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-amber-600" />
                {language === "en" ? "Beds and Hospital Capacity" : "Dibethe le Bokgoni jwa Maokelo"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Facilities ranked by current bed occupancy" : "Maokelo ka tiriso ya dibethe"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hospitalCapacity.slice(0, 4).map((facility) => (
                <div key={facility.facility} className="rounded-md border p-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{facility.facility}</p>
                      <p className="text-xs text-slate-500">
                        {facility.availableBeds} of {facility.totalBeds} beds available
                      </p>
                    </div>
                    <Badge variant={facility.occupancyRate >= 85 ? "default" : "outline"}>{facility.occupancyRate}% full</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${facility.occupancyRate >= 85 ? "bg-red-500" : facility.occupancyRate >= 70 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(100, facility.occupancyRate)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-green-600" />
                {language === "en" ? "Specialists by Facility" : "Dingaka ka Lefelo"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Available specialists and clinical coverage" : "Dingaka tse di teng"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {specialistCapacity.map((facility) => (
                <div key={facility.facility} className="rounded-md border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{facility.facility}</p>
                      <p className="text-xs text-slate-500">
                        {facility.names.length > 0 ? facility.names.join(", ") : "No specialists listed"}
                      </p>
                    </div>
                    <Badge className="bg-green-600">
                      {facility.available}/{facility.total}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-700" />
                {language === "en" ? "Hospital Capacity Summary" : "Tshobokanyo ya Bokgoni jwa Maokelo"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "National view of available beds, total beds, and pending facility pressure" : "Ponelopele ya naga ya dibethe le kgatelelo"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {hospitalCapacity.map((facility) => (
                  <div key={facility.facility} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium text-slate-900">{facility.facility}</p>
                      <p className="text-xs text-slate-500">
                        {facility.occupiedBeds} occupied, {facility.availableBeds} available, {facility.pending} pending requests
                      </p>
                    </div>
                    <Badge variant="outline">{facility.totalBeds} beds</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{language === "en" ? "Policy Notes" : "Kakantsho"}</CardTitle>
            <CardDescription>{language === "en" ? "Read-only view for national planning decisions" : "Go bua fela"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>
              <span className="inline-flex items-center gap-2 font-medium text-slate-800">
                <Activity className="h-4 w-4 text-blue-600" />
                {language === "en"
                  ? "This screen does not include operational approvals or facility-level controls."
                  : "Sebaka se ga se na dilo tse di iphagameng."}
              </span>
            </p>
            <p>
              {language === "en"
                ? "Use this dashboard to monitor pressure and demand trends before policy intervention."
                : "Dirisa dashboard ye go lebalela dipaterone tse di bosula."}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
