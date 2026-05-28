"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Activity, Bell, Globe, LogOut, ShieldCheck, TrendingUp, TriangleAlert, Users } from "lucide-react"
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
}

type TaskRecord = {
  payload?: { item?: string }
  status: string
  createdAt: string
  toFacility: string
}

function toTitleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

export default function AdminDashboardPage() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [facilities, setFacilities] = useState<FacilityRecord[]>([])
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [bloodRows, setBloodRows] = useState<any[]>([])
  const [wardRows, setWardRows] = useState<any[]>([])

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

  const highPressureFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const pending = pendingByFacility.get(facility.id) ?? 0
      const lowBedWards = facility.wards.filter((ward) => {
        const ratio = ward.available_beds / Math.max(1, ward.total_beds)
        return ratio <= 0.2
      }).length
      return pending >= 3 || lowBedWards >= 1
    }).length
  }, [facilities, pendingByFacility])

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

  const mostUnavailableItems = useMemo(() => {
    const counts = new Map<string, number>()

    facilities.forEach((facility) => {
      Object.entries(facility.stock ?? {}).forEach(([item, qty]) => {
        if (Number(qty) <= 0) {
          counts.set(`Medicine: ${item}`, (counts.get(`Medicine: ${item}`) ?? 0) + 1)
        }
      })
    })

    bloodRows.forEach((row) => {
      if (String(row.availability_status) === "Out of Stock") {
        const key = `Blood: ${String(row.blood_type)}`
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    })

    wardRows.forEach((row) => {
      if (String(row.availability_status) === "Full") {
        const key = `Ward: ${String(row.ward_name)}`
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    })

    return Array.from(counts.entries())
      .map(([resource, facilitiesAffected]) => ({ resource, facilitiesAffected }))
      .sort((left, right) => right.facilitiesAffected - left.facilitiesAffected)
      .slice(0, 6)
  }, [bloodRows, facilities, wardRows])

  const medicineNames = useMemo(() => {
    const names = new Set<string>()
    facilities.forEach((facility) => {
      Object.keys(facility.stock ?? {}).forEach((item) => names.add(item.toLowerCase()))
    })
    return names
  }, [facilities])

  const mostRequestedMedicineByDistrict = useMemo(() => {
    const counts = new Map<string, { medicine: string; district: string; count: number }>()

    tasks.forEach((task) => {
      const rawItem = task.payload?.item
      if (typeof rawItem !== "string") return
      const normalizedItem = rawItem.trim().toLowerCase()
      if (!medicineNames.has(normalizedItem)) return

      const district = facilities.find((facility) => facility.id === task.toFacility)?.location ?? "Unknown district"
      const key = `${normalizedItem}|${district.toLowerCase()}`
      const existing = counts.get(key)
      if (existing) {
        existing.count += 1
        return
      }

      counts.set(key, {
        medicine: toTitleCase(rawItem),
        district,
        count: 1,
      })
    })

    return Array.from(counts.values()).sort((left, right) => right.count - left.count)[0] ?? null
  }, [facilities, medicineNames, tasks])

  const demandPatternLabel = mostRequestedMedicineByDistrict?.medicine ?? "No medicine demand signal yet"

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
        <Card className="border-blue-100 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">
              {language === "en"
                ? "Oversight dashboard only: system usage, facility pressure, demand patterns, and national risk signals."
                : "Dashboard ya tebelo fela: tiriso ya tsamaiso, kgatelelo ya mafelo, dipaterone tsa tlhokego, le ditshwao tsa kotsi."}
            </p>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                System Usage
              </CardDescription>
              <CardTitle className="text-3xl">{tasks.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Total coordination requests tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TriangleAlert className="h-4 w-4" />
                Facility Pressure
              </CardDescription>
              <CardTitle className="text-3xl">{highPressureFacilities}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Facilities showing high pressure signals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Demand Pattern
              </CardDescription>
              <CardTitle className="text-lg">{demandPatternLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                {mostRequestedMedicineByDistrict
                  ? `Top district: ${mostRequestedMedicineByDistrict.district} (${mostRequestedMedicineByDistrict.count} requests)`
                  : "No medicine request trend captured yet"}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most Requested Resources</CardTitle>
              <CardDescription>National demand signals for policy planning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mostRequestedMedicineByDistrict && (
                <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">Most Requested Medicine</p>
                  <p className="text-sm text-slate-700">
                    {mostRequestedMedicineByDistrict.medicine} - {mostRequestedMedicineByDistrict.district}
                  </p>
                  <p className="text-xs text-slate-500">{mostRequestedMedicineByDistrict.count} total requests</p>
                </div>
              )}
              {mostRequestedResources.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-slate-500">No requests captured yet.</p>
              )}
              {mostRequestedResources.map((entry) => (
                <div key={entry.resource} className="flex items-center justify-between rounded-md border p-3">
                  <p className="font-medium text-slate-800">{entry.resource}</p>
                  <Badge variant="outline">{entry.count} requests</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most Unavailable Items</CardTitle>
              <CardDescription>Scarcity signals across medicine, blood, and wards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mostUnavailableItems.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-slate-500">No unavailability signals captured yet.</p>
              )}
              {mostUnavailableItems.map((entry) => (
                <div key={entry.resource} className="flex items-center justify-between rounded-md border p-3">
                  <p className="font-medium text-slate-800">{entry.resource}</p>
                  <Badge className="border border-rose-200 bg-rose-50 text-rose-700">{entry.facilitiesAffected} facilities</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Policy Notes</CardTitle>
            <CardDescription>Read-only view for national planning decisions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>
              <span className="inline-flex items-center gap-2 font-medium text-slate-800">
                <Activity className="h-4 w-4 text-blue-600" />
                This screen does not include operational approvals or facility-level controls.
              </span>
            </p>
            <p>Use this dashboard to monitor pressure and demand trends before policy intervention.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
