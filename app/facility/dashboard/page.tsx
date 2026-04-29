"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { WalkInQueue } from "@/components/walk-in-queue"
import { PredictiveAnalytics } from "@/components/predictive-analytics"
import { NewAppointmentDialog } from "@/components/new-appointment-dialog"
import { NewPatientRegistrationDialog } from "@/components/new-patient-registration-dialog"
import { MedicalEquipmentBookingDialog } from "@/components/medical-equipment-booking-dialog"
import { AddMedicationDialog } from "@/components/add-medication-dialog"
import { NewReferralDialog } from "@/components/new-referral-dialog"
import { PatientRecordsViewer } from "@/components/patient-records-viewer"
import {
  Calendar,
  Package,
  Users,
  Heart,
  Globe,
  Bell,
  Settings,
  LogOut,
  Search,
  Scan,
  Plus,
  Phone,
  MessageSquare,
  Activity,
  MapPin,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import {
  getTasks,
  addTask,
  updateTaskStatus,
  subscribe,
  getFacilities,
  getBloodAvailability,
  getWardAvailability,
  searchResourceAvailability,
} from "@/components/mock-service"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-sm">Loading Map...</div>
})
import BeatsLogo from "@/components/BeatsLogo"
import { useToast } from "@/components/ui/use-toast"

export default function FacilityDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [activeTab, setActiveTab] = useState("radar")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchCategory, setSearchCategory] = useState<"all" | "medication" | "blood" | "bed">("all")
  const [searchFacilityId, setSearchFacilityId] = useState("all")
  const [wardFilter, setWardFilter] = useState("")
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [localFacility, setLocalFacility] = useState<any>(null)
  const [facilityOptions, setFacilityOptions] = useState<any[]>([])
  const [bloodAvailability, setBloodAvailability] = useState<any[]>([])
  const [wardAvailability, setWardAvailability] = useState<any[]>([])

  const fallbackTasks = [
    {
      id: "fallback-1",
      type: "transfer_request",
      fromFacility: "ub_clinic",
      toFacility: "pmh",
      payload: { item: "paracetamol", qty: 80, requestedAt: "2026-02-22T08:30:00.000Z" },
      createdAt: "2026-02-22T08:30:00.000Z",
      status: "pending",
    },
    {
      id: "fallback-2",
      type: "booking_request",
      fromFacility: "bdf_clinic",
      toFacility: "pmh",
      payload: { item: "Ultrasound", qty: 1, requestedAt: "2026-02-22T09:10:00.000Z" },
      createdAt: "2026-02-22T09:10:00.000Z",
      status: "pending",
    },
  ]

  const workloadFacilities = [
    { name: "Princess Marina Hospital", patient: 78, equipment: 64, specialist: 71 },
    { name: "Sir Ketumile Masire Hospital", patient: 66, equipment: 58, specialist: 62 },
    { name: "Nyangabgwe Hospital", patient: 54, equipment: 47, specialist: 59 },
    { name: "Maun General Hospital", patient: 81, equipment: 73, specialist: 68 },
  ]

  const content = {
    en: {
      title: "UB Clinic - Station 01",
      subtitle: "Command & Control Center",
      radar: "Resource Radar",
      inventory: "Medication Logistics",
      equipment: "Equipment Coordination",
      workload: "Facility Workload",
      specialists: "Specialist Network",
      tasks: "Pending Requests",
      searchPlaceholder: "Search medicines, blood type, facility, ward, or category...",
      todayActivity: "Operational Overview",
      facilityRadar: "National Resource Radar",
      requestTransfer: "Request Transfer",
      bookEquipment: "Book Resource",
      contactSpecialist: "Contact / Request",
    },
    tn: {
      title: "UB Clinic - Station 01",
      subtitle: "Lefelo la Taolo ya Ditiro",
      radar: "Radar ya Didirisiwa",
      inventory: "Taolo ya Dihlare",
      equipment: "Thulaganyo ya Didirisiwa",
      workload: "Boloko jwa Mošomo",
      specialists: "Network ya Dingaka",
      tasks: "Dikopo tse di Emetsweng",
      searchPlaceholder: "Batla dihlare, madi, lefelo, ward kgotsa category...",
      todayActivity: "Tlhatlhobo ya Ditiro",
      facilityRadar: "Radar ya Didirisiwa ya Sechaba",
      requestTransfer: "Kopo ya go Romela",
      bookEquipment: "Beela Didirisiwa",
      contactSpecialist: "Ikanye / Kopa",
    },
  }

  const [displayName, setDisplayName] = useState({ en: content.en.title, tn: content.tn.title })

  useEffect(() => {
    const savedEn = localStorage.getItem("userFacilityNameEn")
    const savedTn = localStorage.getItem("userFacilityNameTn")
    if (savedEn && savedTn) {
      setDisplayName({ en: savedEn, tn: savedTn })
    }
    
    loadFacilityData()
    loadTasks()
    loadAvailabilityPanels()
    const unsubAdded = subscribe("tasks:added", loadTasks)
    const unsubUpdated = subscribe("tasks:updated", loadTasks)
    const unsubFac = subscribe("facilities:changed", () => {
      loadFacilityData()
      loadAvailabilityPanels()
    })
    return () => {
      unsubAdded()
      unsubUpdated()
      unsubFac()
    }
  }, [])

  const displayTasks =
    tasks.length >= 2 ? tasks : [...tasks, ...fallbackTasks.slice(0, 2 - tasks.length)]

  const t = {
    ...content[language],
    title: language === "en" ? displayName.en : displayName.tn
  }

  const loadFacilityData = async () => {
    const facilityKey = localStorage.getItem("userFacilityKey") || "ub_clinic"
    const facilities = await getFacilities()
    setFacilityOptions(facilities)
    const found = facilities.find(f => f.id === facilityKey)
    if (found) setLocalFacility(found)
  }

  const loadAvailabilityPanels = async () => {
    const [blood, wards] = await Promise.all([getBloodAvailability(""), getWardAvailability("")])
    setBloodAvailability(blood)
    setWardAvailability(wards)
  }

  const loadTasks = async () => {
    const data = await getTasks()
    setTasks(data)
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const results = await searchResourceAvailability({
        query: searchQuery,
        category: searchCategory,
        facilityId: searchFacilityId === "all" ? undefined : searchFacilityId,
        wardName: wardFilter || undefined,
      })

      setSearchResults(results)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (item: any) => {
    const facilityKey = localStorage.getItem("userFacilityKey") || "ub_clinic"
    const type = item.resource_type === "bed" ? "patient_referral" : "transfer_request"
    
    await addTask({
      type,
      fromFacility: facilityKey,
      toFacility: item.facilityId,
      payload: {
        item: item.resource_name ?? item.item,
        availability_status: item.availability_status,
        requestedAt: new Date().toISOString()
      }
    })

    toast({
      title: "Request Sent",
      description: `Sent a ${type.replace("_", " ")} for ${item.resource_name ?? item.item} to ${item.facilityName}.`
    })
  }

  const formatLastUpdated = (timestamp?: string) => {
    if (!timestamp) return "Last updated just now"
    const diffMs = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.max(1, Math.floor(diffMs / 60000))
    if (minutes < 60) return `Last updated ${minutes} mins ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Last updated ${hours} hrs ago`
    const days = Math.floor(hours / 24)
    return `Last updated ${days} day${days === 1 ? "" : "s"} ago`
  }

  const getStatusBadgeClass = (status: string) => {
    if (status === "Available") return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (status === "Limited") return "bg-amber-50 text-amber-700 border-amber-200"
    if (status === "Out of Stock" || status === "Full") return "bg-rose-50 text-rose-700 border-rose-200"
    return "bg-slate-100 text-slate-700 border-slate-200"
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* Premium Dark Header */}
      <header className="border-b bg-white backdrop-blur-md sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <BeatsLogo size={44} />
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.title}</h1>
                  <p className="text-xs font-medium text-blue-400 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {t.subtitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400 mr-8">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Network: Online</span>
                <span className="flex items-center gap-2">Region: Gaborone Central</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "en" ? "tn" : "en")} className="text-slate-400 hover:text-white font-bold">
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "Setswana" : "English"}
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/login">
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Resource Radar Top Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">{t.facilityRadar}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="relative group lg:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder={t.searchPlaceholder} 
                className="pl-12 py-7 bg-white border-slate-200 text-lg rounded-xl focus-visible:ring-blue-500/50 shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value as "all" | "medication" | "blood" | "bed")}
              className="h-14 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm"
            >
              <option value="all">All Categories</option>
              <option value="medication">Medication</option>
              <option value="blood">Blood</option>
              <option value="bed">Bed/Ward</option>
            </select>
            <select
              value={searchFacilityId}
              onChange={(e) => setSearchFacilityId(e.target.value)}
              className="h-14 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm"
            >
              <option value="all">All Facilities</option>
              {facilityOptions.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.facility}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <Input
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              placeholder="Optional ward filter (e.g. ICU, Maternity)"
              className="h-12 bg-white border-slate-200 rounded-xl"
            />
            <Button 
              className="bg-blue-600 hover:bg-blue-500 px-8 h-12"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              {searchResults.map((item, idx) => (
                <Card key={idx} className="bg-white border-slate-200 hover:border-blue-500/50 transition-all group overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-3">
                    <Badge variant="outline" className="text-slate-500 border-slate-800">
                      {String(item.resource_category ?? "resource").toUpperCase()}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-900">{item.resource_name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {item.facility}
                      </p>
                      {item.ward_name && (
                        <p className="text-xs text-slate-500">
                          Ward: <span className="font-semibold text-slate-700">{item.ward_name}</span> ({item.ward_type})
                        </p>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <Badge className={`border ${getStatusBadgeClass(item.availability_status)}`}>
                          {item.availability_status}
                        </Badge>
                        <Button size="sm" onClick={() => handleAction(item)} className="bg-slate-800 hover:bg-blue-600 text-xs border-none h-8">
                          {item.resource_type === "bed" ? "Create Referral Check" : t.requestTransfer}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">{formatLastUpdated(item.last_updated)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {searchResults.length === 0 && (searchQuery || wardFilter || searchCategory !== "all" || searchFacilityId !== "all") && !loading && (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              No matching resources found.
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 w-full md:w-auto h-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <TabsTrigger value="radar" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.radar}</TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.inventory}</TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.equipment}</TabsTrigger>
            <TabsTrigger value="specialists" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.specialists}</TabsTrigger>
            <TabsTrigger value="workload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.workload}</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6 relative">
              {t.tasks}
              {displayTasks.filter(tk => tk.status === "pending").length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 text-[10px] items-center justify-center font-bold text-white">
                    {displayTasks.filter(tk => tk.status === "pending").length}
                  </span>
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radar" className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Operational Overview Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <Map
                      center={[-24.658, 25.923]}
                      zoom={13}
                      markers={[
                        { position: [-24.658, 25.923], label: "UB Clinic (You)" },
                        { position: [-24.653, 25.906], label: "Princess Marina Hospital" },
                        { position: [-24.665, 25.942], label: "Sir Ketumile Masire Hospital" },
                        { position: [-24.640, 25.910], label: "Bokamoso Private Hospital" },
                        { position: [-24.670, 25.930], label: "BDF Clinic" },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-sm font-bold uppercase tracking-wider">{language === "en" ? "Recent Network Activity" : "Ditiro tsa Network tsa Bosheng"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayTasks.slice(0, 5).map((tk, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors underline-offset-4 cursor-default">
                      <div className={`p-2 rounded-full ${tk.type === "transfer_request" ? "bg-purple-500/20 text-purple-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                        {tk.type === "transfer_request" ? <Truck className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-slate-900">{tk.payload.item}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Origin: {tk.fromFacility}</p>
                      </div>
                      <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider ${tk.status === "pending" ? "border-blue-500/50 text-blue-400" : "border-slate-200 text-slate-400"}`}>
                        {tk.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Blood Availability by Facility</CardTitle>
                  <CardDescription>A+, A-, B+, B-, AB+, AB-, O+, O-</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bloodAvailability.slice(0, 12).map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">Blood Type: {item.blood_type}</p>
                          <p className="text-xs text-slate-500">Facility: {item.facility}</p>
                        </div>
                        <Badge className={`border ${getStatusBadgeClass(item.availability_status)}`}>
                          {item.availability_status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{formatLastUpdated(item.last_updated)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Bed and Ward Availability</CardTitle>
                  <CardDescription>Use this before referring patients to avoid blind referrals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {wardAvailability.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{item.ward_name}</p>
                          <p className="text-xs text-slate-500">
                            Facility: {item.facility} | Type: {item.ward_type}
                          </p>
                        </div>
                        <Badge className={`border ${getStatusBadgeClass(item.availability_status)}`}>
                          {item.availability_status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{formatLastUpdated(item.last_updated)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Regional Coordination Desk</h2>
            </div>

            <div className="grid gap-4">
              {displayTasks.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                  <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-slate-500">No active resource requests at this time.</p>
                </div>
              ) : (
                displayTasks.map((task) => (
                  <Card key={task.id} className="bg-white border-slate-200 border-l-4 border-l-blue-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                          <div className="text-center w-24">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{new Date(task.createdAt).toLocaleDateString()}</div>
                            <div className="text-lg font-bold text-blue-400 tabular-nums">{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          <div className="hidden md:block h-12 w-px bg-slate-100" />
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-slate-900 text-lg">{task.payload.item}</h3>
                              <Badge className="bg-slate-100 text-[10px] h-5 border-slate-200 text-slate-600">REQUESTED</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                              <MapPin className="h-3 w-3 text-slate-500" />
                              <span className="font-medium text-slate-600">{task.fromFacility}</span>
                              <ArrowRight className="h-3 w-3 text-slate-400" />
                              <span className="font-medium text-slate-600">{task.toFacility}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <Badge className={`${
                            task.status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                            task.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-500"
                          } font-bold px-3 py-1 border`}>
                            {task.status.toUpperCase()}
                          </Badge>
                          <div className="flex gap-2">
                            {task.status === "pending" && (
                              <>
                                <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 h-9 font-bold" onClick={() => updateTaskStatus(task.id, "cancelled")}>Deny</Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-9 font-bold px-4" onClick={() => updateTaskStatus(task.id, "approved")}>Approve</Button>
                              </>
                            )}
                            {task.status === "approved" && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 h-9 font-bold px-4" onClick={() => updateTaskStatus(task.id, "in-transit")}>Dispatch</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="animate-in fade-in duration-300">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                   <Package className="h-6 w-6 text-blue-500" /> Local Medication Inventory
                </h2>
                <Button className="bg-blue-600 hover:bg-blue-500">
                  <Plus className="h-4 w-4 mr-2" /> Adjust Medication
                </Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {localFacility && Object.entries(localFacility.stock).map(([med, qty]: [string, any], idx) => (
                  <Card key={idx} className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <p className="font-bold text-slate-900 text-lg">{med}</p>
                        <Badge className={`border ${getStatusBadgeClass(Number(qty) <= 0 ? "Out of Stock" : Number(qty) <= 50 ? "Limited" : "Available")}`}>
                          {Number(qty) <= 0 ? "Out of Stock" : Number(qty) <= 50 ? "Limited" : "Available"}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {formatLastUpdated(localFacility.medicineUpdates?.[med]?.last_updated)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </TabsContent>

          <TabsContent value="equipment" className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-500" /> Unit Equipment Status
                </h2>
                <p className="text-sm text-slate-500">Machines available at this facility</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localFacility && Object.entries(localFacility.equipment).map(([name, status]: [string, any], idx) => (
                  <Card key={idx} className="bg-white border-slate-200 shadow-sm overflow-hidden group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                          <Activity className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900">{name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                             <div className={`w-2 h-2 rounded-full ${status === 'available' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`} />
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{status}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">Maintain</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="specialists" className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" /> Specialist Roster
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localFacility && Object.entries(localFacility.specialists).map(([name, status]: [string, any], idx) => (
                  <Card key={idx} className="bg-white border-slate-200 group relative shadow-sm">
                    <CardContent className="p-6 text-center">
                       <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-slate-100 group-hover:border-blue-500/50 transition-colors">
                          <Users className="h-10 w-10 text-slate-400" />
                       </div>
                       <h3 className="font-bold text-slate-900 text-lg mb-1">{name}</h3>
                       <Badge className={`${status === 'available' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-500'} font-bold uppercase text-[9px] tracking-widest`}>
                          {status === 'available' ? 'Active on Station' : status}
                       </Badge>
                       <div className="mt-6 flex justify-center gap-2">
                          <Button size="icon" variant="ghost" className="rounded-full hover:bg-blue-600/10 hover:text-blue-400 h-10 w-10"><Phone className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="rounded-full hover:bg-blue-600/10 hover:text-blue-400 h-10 w-10"><MessageSquare className="h-4 w-4" /></Button>
                       </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="workload" className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-500" /> Facility Workload
                </h2>
                <p className="text-sm text-slate-500">Capacity across patient, equipment, and specialist workloads</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workloadFacilities.map((fac) => (
                <Card key={fac.name} className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-slate-900 mb-4">{fac.name}</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Patient workload</span>
                          <span className="font-semibold text-slate-700">{fac.patient}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-blue-500" style={{ width: `${fac.patient}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Equipment workload</span>
                          <span className="font-semibold text-slate-700">{fac.equipment}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-emerald-500" style={{ width: `${fac.equipment}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Specialist workload</span>
                          <span className="font-semibold text-slate-700">{fac.specialist}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-amber-500" style={{ width: `${fac.specialist}%` }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="walkins" className="space-y-6">
            <WalkInQueue />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <PredictiveAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
