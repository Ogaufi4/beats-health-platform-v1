"use client"

import { useState, useEffect } from "react"
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
  Phone,
  MessageSquare,
  Activity,
  MapPin,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { findMedicine, findEquipment, findSpecialists, getTasks, addTask, updateTaskStatus, subscribe, getFacilities } from "@/components/mock-service"
import { useToast } from "@/components/ui/use-toast"

export default function FacilityDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [activeTab, setActiveTab] = useState("radar")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [localFacility, setLocalFacility] = useState<any>(null)

  const content = {
    en: {
      title: "UB Clinic - Station 01",
      subtitle: "Command & Control Center",
      radar: "Resource Radar",
      inventory: "Inventory Logistics",
      equipment: "Equipment Coordination",
      specialists: "Specialist Network",
      tasks: "Pending Requests",
      searchPlaceholder: "Search for medicines, equipment, or specialists...",
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
      inventory: "Taolo ya Stock",
      equipment: "Thulaganyo ya Didirisiwa",
      specialists: "Network ya Dingaka",
      tasks: "Dikopo tse di Emetsweng",
      searchPlaceholder: "Batla dihlare, didirisiwa, kapa dingaka...",
      todayActivity: "Tlhatlhobo ya Ditiro",
      facilityRadar: "Radar ya Didirisiwa ya Sechaba",
      requestTransfer: "Kopo ya go Romela",
      bookEquipment: "Beela Didirisiwa",
      contactSpecialist: "Ikanye / Kopa",
    },
  }

  const t = content[language]

  useEffect(() => {
    loadFacilityData()
    loadTasks()
    const unsubAdded = subscribe("tasks:added", loadTasks)
    const unsubUpdated = subscribe("tasks:updated", loadTasks)
    const unsubFac = subscribe("facilities:changed", loadFacilityData)
    return () => {
      unsubAdded()
      unsubUpdated()
      unsubFac()
    }
  }, [])

  const loadFacilityData = async () => {
    const facilities = await getFacilities()
    const found = facilities.find(f => f.id === "ub_clinic")
    if (found) setLocalFacility(found)
  }

  const loadTasks = async () => {
    const data = await getTasks()
    setTasks(data)
  }

  const handleSearch = async () => {
    if (!searchQuery) return
    setLoading(true)
    let results: any[] = []
    
    // Search across all types
    const meds = await findMedicine(searchQuery)
    const equip = await findEquipment(searchQuery)
    const spec = await findSpecialists(searchQuery)
    
    results = [
      ...meds.map(m => ({ ...m, type: "medicine" })),
      ...equip.map(e => ({ ...e, type: "equipment" })),
      ...spec.map(s => ({ ...s, type: "specialist" }))
    ]
    
    setSearchResults(results)
    setLoading(false)
  }

  const handleAction = async (item: any) => {
    const type = item.type === "medicine" ? "transfer_request" : item.type === "equipment" ? "booking_request" : "specialist_request"
    
    await addTask({
      type,
      fromFacility: "ub_clinic",
      toFacility: item.facilityId,
      payload: {
        item: item.item,
        qty: item.type === "medicine" ? 10 : 1,
        requestedAt: new Date().toISOString()
      }
    })

    toast({
      title: "Request Sent",
      description: `Sent a ${type.replace("_", " ")} for ${item.item} to ${item.facilityName}.`
    })
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Premium Dark Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">{t.title}</h1>
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
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder={t.searchPlaceholder} 
              className="pl-12 py-7 bg-slate-900 border-slate-800 text-lg rounded-xl focus-visible:ring-blue-500/50 shadow-2xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 px-6"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Scan Network"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              {searchResults.map((item, idx) => (
                <Card key={idx} className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all group overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    <Badge variant="outline" className="text-slate-500 border-slate-800">
                      {item.type.toUpperCase()}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        item.type === "medicine" ? "bg-purple-500/10 text-purple-400" : 
                        item.type === "equipment" ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                      }`}>
                        {item.type === "medicine" ? <Package className="h-6 w-6" /> : 
                         item.type === "equipment" ? <Activity className="h-6 w-6" /> : <Users className="h-6 w-6" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-100">{item.item}</h3>
                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {item.facilityName}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.status === "In Stock" || item.status === "Available" || item.status === "On Duty" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-rose-500"}`} />
                            <span className="text-xs font-semibold text-slate-300">{item.status}</span>
                            {item.qty > 1 && <span className="text-xs text-slate-500">({item.qty} units)</span>}
                          </div>
                          <Button size="sm" onClick={() => handleAction(item)} className="bg-slate-800 hover:bg-blue-600 text-xs border-none h-8">
                            {item.type === "medicine" ? t.requestTransfer : item.type === "equipment" ? t.bookEquipment : t.contactSpecialist}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 w-full md:w-auto h-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <TabsTrigger value="radar" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.radar}</TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.inventory}</TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.equipment}</TabsTrigger>
            <TabsTrigger value="specialists" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6">{t.specialists}</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2 px-6 relative">
              {t.tasks}
              {tasks.filter(tk => tk.status === "pending").length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 text-[10px] items-center justify-center font-bold text-white">
                    {tasks.filter(tk => tk.status === "pending").length}
                  </span>
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radar" className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Operational Overview Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <div className="z-10 text-center">
                      <Globe className="h-20 w-20 text-slate-800 mb-4 mx-auto" strokeWidth={0.5} />
                      <p className="text-slate-500 font-medium font-mono text-xs tracking-widest uppercase">Initializing Radar Array...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-sm font-bold uppercase tracking-wider">{language === "en" ? "Recent Network Activity" : "Ditiro tsa Network tsa Bosheng"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tasks.slice(0, 5).map((tk, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 hover:bg-slate-800/40 transition-colors underline-offset-4 cursor-default">
                      <div className={`p-2 rounded-full ${tk.type === "transfer_request" ? "bg-purple-500/20 text-purple-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                        {tk.type === "transfer_request" ? <Truck className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-slate-200">{tk.payload.item}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Origin: {tk.fromFacility}</p>
                      </div>
                      <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider ${tk.status === "pending" ? "border-blue-500/50 text-blue-400" : "border-slate-800 text-slate-600"}`}>
                        {tk.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-100">Regional Coordination Desk</h2>
            </div>

            <div className="grid gap-4">
              {tasks.length === 0 ? (
                <div className="py-20 text-center bg-slate-900 rounded-xl border border-slate-800 border-dashed">
                  <Activity className="h-12 w-12 text-slate-800 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-slate-500">No active resource requests at this time.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <Card key={task.id} className="bg-slate-900 border-slate-800 border-l-4 border-l-blue-600 hover:bg-slate-800/50 transition-colors shadow-lg shadow-slate-950/20">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                          <div className="text-center w-24">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{new Date(task.createdAt).toLocaleDateString()}</div>
                            <div className="text-lg font-bold text-blue-400 tabular-nums">{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          <div className="hidden md:block h-12 w-px bg-slate-800" />
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-slate-100 text-lg">{task.payload.item}</h3>
                              <Badge className="bg-slate-950 text-[10px] h-5 border-slate-800">{task.payload.qty} UNITS</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                              <MapPin className="h-3 w-3 text-slate-600" />
                              <span className="font-medium text-slate-300">{task.fromFacility}</span>
                              <ArrowRight className="h-3 w-3 text-slate-600" />
                              <span className="font-medium text-slate-300">{task.toFacility}</span>
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
                   <Package className="h-6 w-6 text-blue-500" /> Local Unit Inventory
                </h2>
                <Button className="bg-blue-600 hover:bg-blue-500">
                  <Plus className="h-4 w-4 mr-2" /> Adjust Stock
                </Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {localFacility && Object.entries(localFacility.stock).map(([med, qty]: [string, any], idx) => (
                  <Card key={idx} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <p className="font-bold text-slate-100 text-lg">{med}</p>
                        <Badge variant={Number(qty) < 50 ? "destructive" : "secondary"} className="bg-slate-950 font-bold">
                          {qty} units
                        </Badge>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${Number(qty) < 50 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`} style={{ width: `${Math.min(100, Number(qty) * 2)}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </TabsContent>

          <TabsContent value="equipment" className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-500" /> Unit Equipment Status
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localFacility && Object.entries(localFacility.equipment).map(([name, status]: [string, any], idx) => (
                  <Card key={idx} className="bg-slate-900 border-slate-800 overflow-hidden group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-950 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                          <Activity className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-100">{name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                             <div className={`w-2 h-2 rounded-full ${status === 'available' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`} />
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{status}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-slate-800 hover:bg-slate-800">Maintain</Button>
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
                  <Card key={idx} className="bg-slate-900 border-slate-800 group relative">
                    <CardContent className="p-6 text-center">
                       <div className="w-20 h-20 bg-slate-950 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-slate-800 group-hover:border-blue-500/50 transition-colors">
                          <Users className="h-10 w-10 text-slate-700" />
                       </div>
                       <h3 className="font-bold text-slate-100 text-lg mb-1">{name}</h3>
                       <Badge className={`${status === 'available' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-800 text-slate-500'} font-bold uppercase text-[9px] tracking-widest`}>
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
