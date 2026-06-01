"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  Bell,
  CheckCircle2,
  CircleX,
  Clock3,
  Globe,
  ListChecks,
  LogOut,
  RefreshCw,
  TriangleAlert,
} from "lucide-react"
import BeatsLogo from "@/components/BeatsLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getBloodAvailability, getFacilities, getTasks, getWardAvailability, subscribe, updateTaskStatus } from "@/components/mock-service"

type RequestUrgency = "Urgent" | "Priority" | "Routine"
type RequestDecision = "accepted" | "limited" | "declined"
type AvailabilityStatus = "Available" | "Limited" | "Unavailable"
type AvailabilityKey = "medicines" | "blood" | "equipment" | "beds" | "lab"

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
  equipment: Record<string, "available" | "busy" | "maintenance">
}

const AVAILABILITY_LABELS: Record<AvailabilityKey, string> = {
  medicines: "Medicines",
  blood: "Blood",
  equipment: "Equipment",
  beds: "Beds",
  lab: "Lab",
}

const URGENCY_ORDER: Record<RequestUrgency, number> = {
  Urgent: 3,
  Priority: 2,
  Routine: 1,
}

const STATUS_OPTIONS: AvailabilityStatus[] = ["Available", "Limited", "Unavailable"]

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

function toUrgency(task: TaskRecord): RequestUrgency {
  const raw = task.payload?.urgency
  if (typeof raw === "string") {
    const normalized = raw.toLowerCase()
    if (normalized.includes("urgent")) return "Urgent"
    if (normalized.includes("priority")) return "Priority"
  }
  return "Routine"
}

function toAvailabilityFromNumbers(values: number[]) {
  if (!values.length) return "Unavailable" as AvailabilityStatus
  const availableCount = values.filter((qty) => qty > 50).length
  const hasUnavailable = values.some((qty) => qty <= 0)
  if (availableCount === values.length) return "Available"
  if (hasUnavailable && availableCount === 0) return "Unavailable"
  return "Limited"
}

function isToday(timestamp: string) {
  const value = new Date(timestamp)
  const now = new Date()
  return (
    value.getFullYear() === now.getFullYear() &&
    value.getMonth() === now.getMonth() &&
    value.getDate() === now.getDate()
  )
}

function getUrgencyBadgeClass(urgency: RequestUrgency) {
  if (urgency === "Urgent") return "border-rose-200 bg-rose-50 text-rose-700"
  if (urgency === "Priority") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-slate-200 bg-slate-100 text-slate-700"
}

function getDecisionBadgeClass(decision: RequestDecision) {
  if (decision === "accepted") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (decision === "limited") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-rose-200 bg-rose-50 text-rose-700"
}

function getDecisionLabel(decision: RequestDecision) {
  if (decision === "accepted") return "Accepted"
  if (decision === "limited") return "Limited"
  return "Declined"
}

export default function FacilityDashboardPage() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [facilityId, setFacilityId] = useState("ub_clinic")
  const [displayFacility, setDisplayFacility] = useState("UB Clinic")
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [facilities, setFacilities] = useState<FacilityRecord[]>([])
  const [bloodRows, setBloodRows] = useState<any[]>([])
  const [wardRows, setWardRows] = useState<any[]>([])
  const [availabilityControl, setAvailabilityControl] = useState<Record<AvailabilityKey, AvailabilityStatus>>({
    medicines: "Limited",
    blood: "Limited",
    equipment: "Limited",
    beds: "Limited",
    lab: "Limited",
  })
  const [lastUpdatedAt, setLastUpdatedAt] = useState(new Date().toISOString())
  const [respondingTaskId, setRespondingTaskId] = useState<string | null>(null)
  const [recentResponses, setRecentResponses] = useState<
    Array<{ id: string; resource: string; decision: RequestDecision; createdAt: string }>
  >([])
  const { toast } = useToast()
  const incomingRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const savedFacilityId = localStorage.getItem("userFacilityKey") || "ub_clinic"
    const savedFacilityName = localStorage.getItem("userFacilityNameEn") || "UB Clinic"
    setFacilityId(savedFacilityId)
    setDisplayFacility(savedFacilityName)
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      const [taskData, facilityData, bloodData, wardsData] = await Promise.all([
        getTasks(),
        getFacilities(),
        getBloodAvailability(""),
        getWardAvailability(""),
      ])
      setTasks(taskData as TaskRecord[])
      setFacilities(facilityData as FacilityRecord[])
      setBloodRows(bloodData)
      setWardRows(wardsData)
    }

    loadDashboardData()
    const unsubTaskAdd = subscribe("tasks:added", loadDashboardData)
    const unsubTaskUpdate = subscribe("tasks:updated", loadDashboardData)
    const unsubFacility = subscribe("facilities:changed", loadDashboardData)

    return () => {
      unsubTaskAdd()
      unsubTaskUpdate()
      unsubFacility()
    }
  }, [])

  const localFacility = useMemo(
    () => facilities.find((facility) => facility.id === facilityId) ?? null,
    [facilities, facilityId],
  )

  const incomingRequests = useMemo(() => {
    return tasks
      .filter((task) => task.toFacility === facilityId && task.status === "pending")
      .sort((left, right) => {
        const urgencyDelta = URGENCY_ORDER[toUrgency(right)] - URGENCY_ORDER[toUrgency(left)]
        if (urgencyDelta !== 0) return urgencyDelta
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      })
  }, [facilityId, tasks])

  const pendingNoResponseCount = useMemo(() => {
    return incomingRequests.filter((task) => Date.now() - new Date(task.createdAt).getTime() >= 15 * 60 * 1000).length
  }, [incomingRequests])

  const receivedTodayCount = useMemo(() => {
    return tasks.filter((task) => task.toFacility === facilityId && isToday(task.createdAt)).length
  }, [facilityId, tasks])

  const respondedCount = useMemo(() => {
    return tasks.filter((task) => task.toFacility === facilityId && task.status !== "pending").length
  }, [facilityId, tasks])

  const pendingCount = incomingRequests.length

  const computedAvailability = useMemo(() => {
    if (!localFacility) {
      return {
        medicines: "Limited",
        blood: "Limited",
        equipment: "Limited",
        beds: "Limited",
        lab: "Limited",
      } satisfies Record<AvailabilityKey, AvailabilityStatus>
    }

    const medicines = toAvailabilityFromNumbers(Object.values(localFacility.stock ?? {}).map((qty) => Number(qty)))

    const bloodForFacility = bloodRows.filter((row) => String(row.facilityId) === facilityId)
    const blood = toAvailabilityFromNumbers(
      bloodForFacility.map((row) => {
        const status = String(row.availability_status)
        if (status === "Available") return 100
        if (status === "Limited") return 30
        return 0
      }),
    )

    const equipmentStates = Object.values(localFacility.equipment ?? {})
    const equipment =
      equipmentStates.length === 0
        ? "Unavailable"
        : equipmentStates.every((value) => value === "available")
          ? "Available"
          : equipmentStates.every((value) => value === "maintenance")
            ? "Unavailable"
            : "Limited"

    const wardForFacility = wardRows.filter((row) => String(row.facilityId) === facilityId)
    const beds = toAvailabilityFromNumbers(
      wardForFacility.map((row) => {
        const status = String(row.availability_status)
        if (status === "Available") return 100
        if (status === "Limited") return 30
        return 0
      }),
    )

    const lab = pendingCount >= 8 ? "Limited" : "Available"

    return { medicines, blood, equipment, beds, lab } satisfies Record<AvailabilityKey, AvailabilityStatus>
  }, [bloodRows, facilityId, localFacility, pendingCount, wardRows])

  useEffect(() => {
    setAvailabilityControl(computedAvailability)
  }, [computedAvailability])

  const getResourceName = (task: TaskRecord) => {
    const item = task.payload?.item
    return typeof item === "string" && item.trim().length > 0 ? item : "Unspecified resource"
  }

  const getSourceFacility = (task: TaskRecord) => {
    return facilities.find((facility) => facility.id === task.fromFacility)?.facility ?? task.fromFacility.toUpperCase()
  }

  const respondToRequest = async (task: TaskRecord, decision: RequestDecision) => {
    setRespondingTaskId(task.id)
    const mappedStatus = decision === "declined" ? "cancelled" : "approved"
    await updateTaskStatus(task.id, mappedStatus as any)
    setRespondingTaskId(null)

    setRecentResponses((previous) => {
      const next = [{ id: task.id, resource: getResourceName(task), decision, createdAt: new Date().toISOString() }, ...previous]
      return next.slice(0, 6)
    })

    toast({
      title: `${getDecisionLabel(decision)}: ${getResourceName(task)}`,
      description: `Response sent to ${getSourceFacility(task)}.`,
    })
  }

  const updateStatusSnapshot = () => {
    setLastUpdatedAt(new Date().toISOString())
    toast({
      title: "Status updated",
      description: "Availability statuses were refreshed successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <BeatsLogo size={48} />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Facility Admin Command</h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{displayFacility}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

      <main className="mx-auto max-w-7xl space-y-5 px-6 py-6">
        <section ref={incomingRef}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-blue-600" />
                Incoming Requests
              </CardTitle>
              <CardDescription>Review and respond to facility requests immediately</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {incomingRequests.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-slate-500">No pending incoming requests right now.</p>
              )}

              {incomingRequests.map((task) => {
                const urgency = toUrgency(task)
                return (
                  <div key={task.id} className="rounded-md border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">{getResourceName(task)}</p>
                        <p className="text-xs text-slate-500">From: {getSourceFacility(task)}</p>
                        <p className="text-xs text-slate-500">Received: {toRelativeTime(task.createdAt)}</p>
                      </div>
                      <Badge className={`border ${getUrgencyBadgeClass(urgency)}`}>{urgency}</Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500"
                        onClick={() => respondToRequest(task, "accepted")}
                        disabled={respondingTaskId === task.id}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-200 text-amber-700 hover:bg-amber-50"
                        onClick={() => respondToRequest(task, "limited")}
                        disabled={respondingTaskId === task.id}
                      >
                        <TriangleAlert className="mr-1 h-4 w-4" />
                        Limited
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-200 text-rose-700 hover:bg-rose-50"
                        onClick={() => respondToRequest(task, "declined")}
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
        </section>

        <section>
          <Card className={pendingNoResponseCount > 0 ? "border-rose-200 bg-rose-50/40" : "border-emerald-200 bg-emerald-50/40"}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-2">
                <TriangleAlert className={pendingNoResponseCount > 0 ? "h-5 w-5 text-rose-600" : "h-5 w-5 text-emerald-600"} />
                <p className="text-sm font-semibold">
                  {pendingNoResponseCount > 0
                    ? `${pendingNoResponseCount} requests pending - no response`
                    : "No escalation alerts at the moment"}
                </p>
              </div>
              {pendingNoResponseCount > 0 && (
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-500"
                  onClick={() => incomingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  Respond now
                </Button>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Availability Control</CardTitle>
              <CardDescription>Edit facility readiness status by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Object.keys(AVAILABILITY_LABELS) as AvailabilityKey[]).map((key) => (
                <div key={key} className="flex items-center justify-between gap-3 rounded-md border p-3">
                  <p className="text-sm font-medium text-slate-800">{AVAILABILITY_LABELS[key]}</p>
                  <select
                    value={availabilityControl[key]}
                    onChange={(event) =>
                      setAvailabilityControl((previous) => ({
                        ...previous,
                        [key]: event.target.value as AvailabilityStatus,
                      }))
                    }
                    className="h-9 min-w-[140px] rounded-md border border-slate-200 bg-white px-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Last Updated</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-700">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    Last updated: {toRelativeTime(lastUpdatedAt)}
                  </span>
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={updateStatusSnapshot}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update status
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Activity Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span>Requests received today</span>
                  <span className="font-semibold">{receivedTodayCount}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Requests responded</span>
                  <span className="font-semibold">{respondedCount}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Pending requests</span>
                  <span className="font-semibold">{pendingCount}</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Responses</CardTitle>
              <CardDescription>Latest response outcomes for quick review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentResponses.length === 0 && (
                <p className="rounded-md border border-dashed p-3 text-sm text-slate-500">No recent responses yet.</p>
              )}
              {recentResponses.map((entry) => (
                <div key={`${entry.id}-${entry.createdAt}`} className="flex items-center justify-between rounded-md border p-3">
                  <p className="text-sm font-medium text-slate-800">{entry.resource}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`border ${getDecisionBadgeClass(entry.decision)}`}>{getDecisionLabel(entry.decision)}</Badge>
                    <span className="text-xs text-slate-500">{toRelativeTime(entry.createdAt)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
