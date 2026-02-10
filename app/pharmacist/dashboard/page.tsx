<<<<<<< HEAD
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Pill,
  AlertTriangle,
  Clock,
  Truck,
  Plus,
  Search,
  Settings,
  LogOut,
  Globe,
  Bell,
  ArrowRight,
  Database,
  SearchIcon,
  ShieldCheck,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { findMedicine, getTasks, addTask, updateTaskStatus, subscribe, getFacilities } from "@/components/mock-service"

export default function PharmacistDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [activeTab, setActiveTab] = useState("inventory")
  const [searchQuery, setSearchQuery] = useState("")
  const [networkResults, setNetworkResults] = useState<any[]>([])
  const [localInventory, setLocalInventory] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const content = {
    en: {
      title: "Pharmacy Command - Station 01",
      subtitle: "Inventory Logistics Intelligence",
      inventory: "Local Stock",
      network: "Network Hub",
      transfers: "Transfers & Logistics",
      analytics: "Usage Analytics",
      searchPlaceholder: "Search medicine across national network...",
      requestTransfer: "Request Transfer",
      raiseSupplyRequest: "Raise Supply Request",
      lowStockAlert: "Low Local Stock",
      criticalStock: "Critical Alert",
    },
    tn: {
      title: "Pharmacy Command - Station 01",
      subtitle: "Thulaganyo ya Ditiro tsa Dihlare",
      inventory: "Stock ya Mono",
      network: "Network Center",
      transfers: "Dipalangwa le Logistics",
      analytics: "Analytics ya Tiriso",
      searchPlaceholder: "Batla dihlare mo network ya sechaba...",
      requestTransfer: "Kopo ya go Romela",
      raiseSupplyRequest: "Kopo ya go Tlatsa",
      lowStockAlert: "Stock e e kwa tlase",
      criticalStock: "Alert ya Botlhokwa",
    },
  }

  const t = content[language]

  useEffect(() => {
    loadLocalInventory()
    loadTasks()
    const unsubAdded = subscribe("tasks:added", loadTasks)
    const unsubUpdated = subscribe("tasks:updated", loadTasks)
    const unsubFac = subscribe("facilities:changed", loadLocalInventory)
    return () => {
      unsubAdded()
      unsubUpdated()
      unsubFac()
    }
  }, [])

  const loadLocalInventory = async () => {
    const facilities = await getFacilities()
    const pmh = facilities.find(f => f.id === "pmh") // Pretend we are PMH for now
    if (pmh) {
      setLocalInventory(Object.entries(pmh.stock).map(([med, qty]) => ({ med, qty: Number(qty) })))
    }
  }

  const loadTasks = async () => {
    const data = await getTasks()
    setTasks(data)
  }

  const handleNetworkSearch = async () => {
    if (!searchQuery) return
    setLoading(true)
    const results = await findMedicine(searchQuery)
    setNetworkResults(results)
    setLoading(false)
  }

  const handleRequestTransfer = async (item: any) => {
    await addTask({
      type: "transfer_request",
      fromFacility: item.facilityId,
      toFacility: "pmh", // Requesting to our facility
      payload: {
        item: item.item,
        qty: 100,
        urgency: "urgent",
        requestedAt: new Date().toISOString()
      }
    })

    toast({
      title: "Transfer Requested",
      description: `Requested 100 units of ${item.item} from ${item.facilityName}.`
    })
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      {/* Premium Dashboard Header */}
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">{t.title}</h1>
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {t.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">CMS Link Active</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setLanguage(language === "en" ? "tn" : "en")} className="text-slate-400 font-bold">
                <Globe className="h-4 w-4" />
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

      <main className="p-6 max-w-7xl mx-auto">
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-800 shadow-xl shadow-slate-950/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Database className="h-5 w-5" /></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Local SKUs</p>
                <p className="text-xl font-bold">{localInventory.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 shadow-xl shadow-slate-950/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><AlertTriangle className="h-5 w-5" /></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Low Stock</p>
                <p className="text-xl font-bold">{localInventory.filter(i => i.qty < 50).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 shadow-xl shadow-slate-950/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Truck className="h-5 w-5" /></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pending Transfers</p>
                <p className="text-xl font-bold">{tasks.filter(t => t.type === 'transfer_request' && t.status === 'pending').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 shadow-xl shadow-slate-950/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><TrendingUp className="h-5 w-5" /></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Supply Orders</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 w-full md:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6">
              {t.inventory}
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6">
              {t.network}
            </TabsTrigger>
            <TabsTrigger value="transfers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 relative">
              {t.transfers}
              {tasks.filter(tk => tk.status === 'pending').length > 0 && (
                <span className="ml-2 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {tasks.filter(tk => tk.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6">
              {t.analytics}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Database className="h-6 w-6 text-purple-500" />
                  Local Station Stock
                </h2>
                <p className="text-slate-400 text-sm">Real-time inventory for Station 01</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20">
                <Plus className="h-4 w-4 mr-2" /> Adjust Stock
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {localInventory.map((item, idx) => (
                <Card key={idx} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors" />
                  <CardContent className="p-5 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-slate-100 text-lg">{item.med}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Dispensing Station A</p>
                      </div>
                      <Badge variant={item.qty < 50 ? "destructive" : "secondary"} className={`${item.qty < 50 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'} px-2 py-0.5`}>
                        {item.qty} units
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.qty < 50 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} style={{ width: `${Math.min(100, item.qty / 2)}%` }} />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Usage: High</p>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-purple-400 hover:text-purple-300 hover:bg-purple-500/5">Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="h-6 w-6 text-purple-500" />
                Network Supply Hub
              </h2>
              <p className="text-slate-400 text-sm">Discovery and coordination across National Health Network facilities.</p>
            </div>

            <div className="relative group max-w-2xl">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <Input 
                className="pl-12 py-6 bg-slate-900 border-slate-800 text-lg rounded-xl focus:ring-purple-500/50 transition-all border-2"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onKeyDown={(e) => e.key === 'Enter' && handleNetworkSearch()}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleNetworkSearch} disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 py-5">
                {loading ? "Searching..." : "Scan Network"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {networkResults.map((item, idx) => (
                <Card key={idx} className="bg-slate-900 border-slate-800 hover:border-purple-500/50 transition-all overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                        <Pill className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="border-slate-800 text-slate-500 uppercase text-[10px] tracking-widest bg-slate-950/50 px-2 py-1">
                        {item.location || "3.2km away"}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-1">{item.item}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mb-6">
                      <MapPin className="h-3 w-3 text-slate-500" /> {item.facilityName}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Stock Availability</p>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${item.qty > 50 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : item.qty > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                             <span className="text-sm font-bold text-slate-200">{item.qty} units</span>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleRequestTransfer(item)} className="bg-purple-600 hover:bg-purple-500 border-none shadow-lg shadow-purple-600/20">
                          {t.requestTransfer}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {searchQuery && networkResults.length === 0 && !loading && (
                <div className="col-span-full py-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed">
                  <Search className="h-10 w-10 text-slate-800 mx-auto mb-3" />
                  <p className="text-slate-500">No match found for "{searchQuery}" in the regional hub.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transfers" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Truck className="h-6 w-6 text-purple-500" />
                Regional Logistics Desk
              </h2>
            </div>
            
            {tasks.filter(t => t.type === 'transfer_request').length === 0 ? (
              <div className="py-20 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
                <Truck className="h-10 w-10 text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500">No active logistics requests found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.filter(t => t.type === 'transfer_request').map((task) => (
                  <Card key={task.id} className="bg-slate-900 border-slate-800 border-l-4 border-l-purple-600 hover:bg-slate-800/80 transition-all shadow-lg shadow-slate-950/20">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                          <div className="text-center w-24">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{new Date(task.createdAt).toLocaleDateString()}</p>
                            <p className="text-lg font-bold text-purple-400 tabular-nums">{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="hidden md:block h-12 w-px bg-slate-800" />
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-slate-100 text-lg">{task.payload.item}</h3>
                              <Badge className="bg-slate-800 text-[10px] h-5 border-slate-700">{task.payload.qty} UNITS</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                              <MapPin className="h-3 w-3" />
                              <span className="font-medium text-slate-300">{task.fromFacility}</span>
                              <ArrowRight className="h-3 w-3 text-slate-600" />
                              <span className="font-medium text-slate-300">{task.toFacility}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          <div className="flex flex-col items-end">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">Network Status</p>
                            <Badge className={`${
                              task.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              task.status === 'approved' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                              task.status === 'in-transit' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 animate-pulse' :
                              'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            } border px-3 py-1 font-bold text-[10px] tracking-wider`}>
                              {task.status.toUpperCase().replace('-', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            {task.status === 'pending' && task.fromFacility === 'pmh' && (
                              <>
                                <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 h-9 font-bold">Reject</Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-9 font-bold px-4" onClick={() => updateTaskStatus(task.id, 'approved')}>Dispatch</Button>
                              </>
                            )}
                            {task.status === 'approved' && task.fromFacility === 'pmh' && (
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-500 font-bold px-4" onClick={() => updateTaskStatus(task.id, 'in-transit')}>Mark as Dispatched</Button>
                            )}
                            {task.status === 'in-transit' && task.toFacility === 'pmh' && (
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 font-bold px-4" onClick={() => updateTaskStatus(task.id, 'fulfilled')}>Confirm Delivery</Button>
                            )}
                            {task.status === 'fulfilled' && (
                              <Badge className="bg-slate-800 text-slate-500 border-slate-700 h-9 px-4 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Logged
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="py-20 text-center bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Activity className="h-16 w-16 text-slate-800 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-slate-300 font-bold text-2xl mb-2">Network Demand Intelligence</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Forecasting regional demand based on inter-facility transfer requests. Link active to National Health Data Hub in Gaborone.</p>
            <div className="mt-8 flex justify-center gap-2">
               <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Avg Request Latency</p>
                  <p className="text-xl font-bold text-blue-500">42 min</p>
               </div>
               <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Network Saving</p>
                  <p className="text-xl font-bold text-emerald-500">24%</p>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
=======
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Pill,
  AlertTriangle,
  Clock,
  Truck,
  Plus,
  Download,
  Printer,
  Search,
  TrendingUp,
  Database,
  Settings,
  LogOut,
  Globe,
  Bell,
  CheckCircle,
  Info,
  ArrowRight,
  Star,
  BarChart3,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Types
type InventoryItem = {
  id: string
  medicationName: string
  brandName?: string
  dosage: string
  form: string
  stock: number
  unit: string
  reorderLevel: number
  lastRestock: string // YYYY-MM-DD
  nextDelivery?: string
  expirationDate: string // YYYY-MM-DD
  batchNumber: string
  supplier: string
  costPerUnit: number
  location: string
  status: "in-stock" | "low-stock" | "out-of-stock" | "discontinued"
}

type RestockRequest = {
  id: string
  medicationId: string
  medicationName: string
  quantity: number
  supplier: string
  urgency: "routine" | "urgent" | "emergency"
  reason: string
  dateRequested: string
  dateFulfilled?: string
  receivedQuantity?: number
  status: "pending" | "approved" | "delivered" | "cancelled"
}

export default function PharmacistDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | InventoryItem["status"]>("all")
  const [sortBy, setSortBy] = useState<keyof InventoryItem>("medicationName")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false) // 👈 Modal state
  const [showTips, setShowTips] = useState(true)

  const { toast } = useToast()

  const demandForecast = [
    {
      medication: "Paracetamol",
      currentStock: 0,
      predictedDemand: 45,
      timeframe: "Next 24 hours",
      confidence: "High",
      basedOn: "Walk-in patterns + historical data",
      urgency: "critical",
    },
    {
      medication: "Amoxicillin",
      currentStock: 12,
      predictedDemand: 28,
      timeframe: "Next 48 hours",
      confidence: "High",
      basedOn: "Seasonal trends + walk-ins",
      urgency: "high",
    },
    {
      medication: "Insulin Glargine",
      currentStock: 3,
      predictedDemand: 15,
      timeframe: "Next 72 hours",
      confidence: "Medium",
      basedOn: "Chronic patient appointments",
      urgency: "high",
    },
    {
      medication: "Atorvastatin",
      currentStock: 45,
      predictedDemand: 22,
      timeframe: "Next week",
      confidence: "Medium",
      basedOn: "Regular prescription refills",
      urgency: "low",
    },
  ]

  // Mock data
  const inventory: InventoryItem[] = [
    {
      id: "MED001",
      medicationName: "Amoxicillin",
      brandName: "Amoxil",
      dosage: "500mg",
      form: "Capsule",
      stock: 12,
      unit: "strips",
      reorderLevel: 20,
      lastRestock: "2025-09-28",
      nextDelivery: "2025-10-15",
      expirationDate: "2026-03-20",
      batchNumber: "B202503A",
      supplier: "MediSupplies Botswana",
      costPerUnit: 12.5,
      location: "Shelf A3, Bin 12",
      status: "low-stock",
    },
    {
      id: "MED002",
      medicationName: "Paracetamol",
      brandName: "Panado",
      dosage: "500mg",
      form: "Tablet",
      stock: 0,
      unit: "bottles",
      reorderLevel: 15,
      lastRestock: "2025-09-10",
      expirationDate: "2026-01-15",
      batchNumber: "B202501P",
      supplier: "Pharma Distributors",
      costPerUnit: 8.2,
      location: "Shelf B1, Bin 5",
      status: "out-of-stock",
    },
    {
      id: "MED003",
      medicationName: "Atorvastatin",
      dosage: "20mg",
      form: "Tablet",
      stock: 45,
      unit: "strips",
      reorderLevel: 30,
      lastRestock: "2025-10-01",
      expirationDate: "2027-05-10",
      batchNumber: "B202505T",
      supplier: "MediSupplies Botswana",
      costPerUnit: 22.0,
      location: "Shelf C2, Bin 8",
      status: "in-stock",
    },
    {
      id: "MED004",
      medicationName: "Insulin Glargine",
      brandName: "Lantus",
      dosage: "100 IU/mL",
      form: "Injection",
      stock: 3,
      unit: "vials",
      reorderLevel: 10,
      lastRestock: "2025-09-20",
      nextDelivery: "2025-10-12",
      expirationDate: "2026-02-28",
      batchNumber: "B202502I",
      supplier: "Global Pharma",
      costPerUnit: 320.0,
      location: "Refrigerator R1, Bin 3",
      status: "low-stock",
    },
    {
      id: "MED005",
      medicationName: "Doxycycline",
      dosage: "100mg",
      form: "Capsule",
      stock: 8,
      unit: "strips",
      reorderLevel: 25,
      lastRestock: "2025-08-15",
      expirationDate: "2025-11-30", // expires in <30 days
      batchNumber: "B202508D",
      supplier: "Pharma Distributors",
      costPerUnit: 18.75,
      location: "Shelf A5, Bin 2",
      status: "low-stock",
    },
  ]

  const restockHistory: RestockRequest[] = [
    {
      id: "REQ001",
      medicationId: "MED001",
      medicationName: "Amoxicillin",
      quantity: 50,
      supplier: "MediSupplies Botswana",
      urgency: "routine",
      reason: "Regular reorder",
      dateRequested: "2025-09-25",
      dateFulfilled: "2025-10-02",
      receivedQuantity: 50,
      status: "delivered",
    },
    {
      id: "REQ002",
      medicationId: "MED002",
      medicationName: "Paracetamol",
      quantity: 30,
      supplier: "Pharma Distributors",
      urgency: "urgent",
      reason: "Stockout",
      dateRequested: "2025-10-08",
      status: "pending",
    },
  ]

  // Derived data
  const totalInventory = inventory.length
  const lowStockItems = inventory.filter((item) => item.status === "low-stock")
  const outOfStockItems = inventory.filter((item) => item.status === "out-of-stock")
  const expiringSoon = inventory.filter((item) => {
    const expDate = new Date(item.expirationDate)
    const now = new Date()
    const diffTime = expDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 30
  })

  const recentRestocks = restockHistory.filter(
    (req) => new Date(req.dateRequested) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  )

  // Filter & sort inventory
  const filteredInventory = useMemo(() => {
    let result = [...inventory]

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.medicationName.toLowerCase().includes(term) ||
          item.brandName?.toLowerCase().includes(term) ||
          item.batchNumber.toLowerCase().includes(term),
      )
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((item) => item.status === filterStatus)
    }

    // Sort
    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [searchTerm, filterStatus, sortBy, sortOrder, inventory])

  const content = {
    en: {
      title: "Pharmacist Dashboard",
      subtitle: "Princess Marina Hospital Pharmacy",
      overview: "Overview",
      inventory: "Inventory",
      restocking: "Restocking",
      alerts: "Alerts",
      reporting: "Reporting",
      demandForecast: "Demand Forecast",
      searchPlaceholder: "Search medications, batch, brand...",
      totalInventory: "Total Medications",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      expiringSoon: "Expiring Soon",
      recentRestocks: "Recent Restocks",
      medicationName: "Medication",
      brand: "Brand",
      dosage: "Dosage",
      form: "Form",
      stock: "Stock",
      reorderLevel: "Reorder Level",
      expiry: "Expiry",
      batch: "Batch",
      supplier: "Supplier",
      location: "Location",
      status: "Status",
      addMedication: "Add Medication",
      adjustStock: "Adjust Stock",
      generateRestock: "Generate Restock List",
      exportData: "Export Data",
      inStock: "In Stock",
      lowStockLabel: "Low Stock",
      outOfStockLabel: "Out of Stock",
      discontinued: "Discontinued",
      placeOrder: "Place Order",
      orderSuccess: "Order Placed Successfully!",
      orderSent: "Your restock request has been sent to the supplier.",
      viewOrder: "View Order Details",
      closeModal: "Close",
      predictedDemand: "Predicted Demand",
      currentStock: "Current Stock",
      timeframe: "Timeframe",
      confidence: "Confidence",
      basedOn: "Based On",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      userJourney: {
        title: "Your Daily Workflow",
        startDay: "Start Your Day",
        checkExpiries: "Check Expiring Medicines",
        restockNow: "Restock Critical Items",
        completeTasks: "Complete Today's Tasks",
        tips: "Show Tips",
        hideTips: "Hide Tips",
        action: "Action",
        progress: "Progress",
        completed: "Completed",
        pending: "Pending",
        expired: "Expired",
        lowStock: "Low Stock",
        outOfStock: "Out of Stock",
        tooltip: {
          startDay: "Begin by reviewing today’s critical alerts and expiring items.",
          checkExpiries: "Review medicines expiring within 30 days to prevent waste.",
          restockNow: "Order low-stock or out-of-stock items immediately.",
          completeTasks: "Mark all restock requests and adjustments as done.",
        },
      },
    },
    tn: {
      title: "Lebokose la Ngaka ya Meditshene",
      subtitle: "Sepetlele sa Princess Marina - Ngaka ya Meditshene",
      overview: "Tlhatlhobo",
      inventory: "Lekunutlo",
      restocking: "Go Nya Gape",
      alerts: "Ditlhatlhego",
      reporting: "Diporofeta",
      demandForecast: "Tshekatsheko ya Tlhokego",
      searchPlaceholder: "Batla meditshene, batch, brand...",
      totalInventory: "Meditshene eohle",
      lowStock: "Kotsi e Nyenyane",
      outOfStock: "Ga e seng",
      expiringSoon: "E Tla Fela Morago",
      recentRestocks: "Go Nya Gape ga Morago",
      medicationName: "Meditshene",
      brand: "Brand",
      dosage: "Kgato",
      form: "Mongwana",
      stock: "Kotsi",
      reorderLevel: "Kgato ya Go Nya Gape",
      expiry: "Nako ya go Fela",
      batch: "Batch",
      supplier: "Moongwi",
      location: "Lefelo",
      status: "Boemo",
      addMedication: "Oketsa Meditshene",
      adjustStock: "Fetola Kotsi",
      generateRestock: "Dira Lenaneo la Go Nya Gape",
      exportData: "Romela Data",
      inStock: "E teng",
      lowStockLabel: "Kotsi e Nyenyane",
      outOfStockLabel: "Ga e seng",
      discontinued: "E ile ya Tlhatlhwa",
      placeOrder: "Ila Kopo",
      orderSuccess: "Kopo e Neilwe!",
      orderSent: "Kopo ya gago ya go naya gape e ile ya romelwa moongwing.",
      viewOrder: "Bona Dintlha tsa Kopo",
      closeModal: "Fihla",
      predictedDemand: "Tlhokego e e Solofetsweng",
      currentStock: "Kotsi ya Jaanong",
      timeframe: "Nako",
      confidence: "Tshepo",
      basedOn: "E Theilwe mo",
      critical: "Botlhokwa Thata",
      high: "Kwa Godimo",
      medium: "Magareng",
      low: "Kwa Tlase",
      userJourney: {
        title: "Taolo ya Letsoho la Gago",
        startDay: "Qala Letsoho la Gago",
        checkExpiries: "Bona Dihlare tse di Tla Fela",
        restockNow: "Nya Gape Ditlhogo tse di Botlhokwa",
        completeTasks: "Fetola Ditiro tsa Gompieno",
        tips: "Bona Ditlhatlhego",
        hideTips: "Fihla Ditlhatlhego",
        action: "Tiro",
        progress: "Karolelano",
        completed: "E Feditse",
        pending: "E Emetse",
        expired: "E Fela",
        lowStock: "Kotsi e Nyenyane",
        outOfStock: "Ga e seng",
        tooltip: {
          startDay: "Qala ka go bonala dikitsiso tsa botlhokwa le ditlhogo tse di tlang go fela.",
          checkExpiries: "Bona meditshene e tla fela morago ga matsatsi a 30 go tlhokomela go fela.",
          restockNow: "Oketsa ditlhogo tse di nyenyane kapa tse di seng.",
          completeTasks: "Rulaganya ditiro tsa go nya gape le ditiro tse di emetsweng.",
        },
      },
    },
  }

  const t = content[language]

  const getStatusColor = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800"
      case "out-of-stock":
        return "bg-red-100 text-red-800"
      case "discontinued":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  // Handle Place Order → Show Modal
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true)

    // Simulate API call
    setTimeout(() => {
      setIsPlacingOrder(false)
      setIsModalOpen(true) // 👈 Open modal on success
    }, 1000)
  }

  // User Journey Progress
  const userJourneySteps = [
    {
      id: 1,
      title: t.userJourney.startDay,
      description: t.userJourney.tooltip.startDay,
      status: "completed",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: 2,
      title: t.userJourney.checkExpiries,
      description: t.userJourney.tooltip.checkExpiries,
      status: expiringSoon.length > 0 ? "pending" : "completed",
      icon: <Clock className="h-5 w-5 text-orange-500" />,
    },
    {
      id: 3,
      title: t.userJourney.restockNow,
      description: t.userJourney.tooltip.restockNow,
      status: lowStockItems.length > 0 || outOfStockItems.length > 0 ? "pending" : "completed",
      icon: <Truck className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 4,
      title: t.userJourney.completeTasks,
      description: t.userJourney.tooltip.completeTasks,
      status: recentRestocks.some((r) => r.status === "pending") ? "pending" : "completed",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
  ]

  const getStepColor = (status: string) => {
    return status === "completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  // Added urgency color logic for demand forecast
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Pill className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
                  <p className="text-sm text-gray-600">{t.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "tn" : "en")}>
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "Setswana" : "English"}
              </Button>
              <Button variant="outline" size="sm" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Link href="/login">
                <Button variant="outline" size="sm" aria-label="Log out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Actions Toolbar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            {t.addMedication}
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {t.adjustStock}
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            {t.generateRestock}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t.exportData}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTips(!showTips)}>
            <Info className="h-4 w-4 mr-2" />
            {showTips ? t.userJourney.hideTips : t.userJourney.tips}
          </Button>
        </div>

        {/* User Journey Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-600" />
              {t.userJourney.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userJourneySteps.map((step) => (
                <div key={step.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStepColor(step.status)}`}>{step.icon}</div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      {showTips && <p className="text-sm text-gray-600 mt-1">{step.description}</p>}
                    </div>
                  </div>
                  <Badge className={getStepColor(step.status)}>
                    {step.status === "completed" ? t.userJourney.completed : t.userJourney.pending}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.totalInventory}</p>
                  <p className="text-2xl font-bold text-blue-600">{inventory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.lowStock}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {inventory.filter((i) => i.status === "low-stock").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.outOfStock}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {inventory.filter((i) => i.status === "out-of-stock").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.expiringSoon}</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {
                      inventory.filter((i) => {
                        const expDate = new Date(i.expirationDate)
                        const now = new Date()
                        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                        return diffDays > 0 && diffDays <= 30
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.recentRestocks}</p>
                  <p className="text-2xl font-bold text-green-600">{recentRestocks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="inventory">{t.inventory}</TabsTrigger>
            <TabsTrigger value="demand-forecast">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t.demandForecast}
            </TabsTrigger>
            <TabsTrigger value="restocking">{t.restocking}</TabsTrigger>
            <TabsTrigger value="alerts">{t.alerts}</TabsTrigger>
            <TabsTrigger value="reporting">{t.reporting}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Low Stock Items" : "Ditlhogo tse di Nnyane"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {lowStockItems.length === 0 ? (
                    <p className="text-gray-500">
                      {language === "en" ? "No low stock items." : "Ga go na ditlhogo tse di nnyane."}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {lowStockItems.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.medicationName} ({item.brandName})
                          </span>
                          <Badge variant="secondary">
                            {item.stock} {item.unit}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en" ? "Expiring Soon (<30 days)" : "Di tla Fela Morago (<30 matsatsi)"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {expiringSoon.length === 0 ? (
                    <p className="text-gray-500">
                      {language === "en" ? "No expiring items." : "Ga go na tse di tlang go fela."}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {expiringSoon.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.medicationName} - {item.batchNumber}
                          </span>
                          <Badge variant="destructive">{item.expirationDate}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.searchPlaceholder}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">{language === "en" ? "All Status" : "Boemo Bohlale"}</option>
                <option value="in-stock">{t.inStock}</option>
                <option value="low-stock">{t.lowStockLabel}</option>
                <option value="out-of-stock">{t.outOfStockLabel}</option>
                <option value="discontinued">{t.discontinued}</option>
              </select>
            </div>

            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => {
                        setSortBy("medicationName")
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }}
                    >
                      {t.medicationName} {sortBy === "medicationName" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.brand}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.dosage}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.form}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.stock}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.expiry}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.status}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.userJourney.action}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{item.medicationName}</div>
                        <div className="text-sm text-gray-500">Batch: {item.batchNumber}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.brandName || "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.dosage}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.form}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium">{item.stock}</span> {item.unit}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.expirationDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === "in-stock"
                            ? t.inStock
                            : item.status === "low-stock"
                              ? t.lowStockLabel
                              : item.status === "out-of-stock"
                                ? t.outOfStockLabel
                                : t.discontinued}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.status === "out-of-stock" ? (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={handlePlaceOrder}>
                            {t.placeOrder}
                          </Button>
                        ) : item.status === "low-stock" ? (
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700" onClick={handlePlaceOrder}>
                            {t.placeOrder}
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            {t.userJourney.action}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="demand-forecast" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.demandForecast}</h2>
              <Badge variant="outline" className="text-sm">
                <Activity className="h-4 w-4 mr-2" />
                {language === "en" ? "Based on Walk-In Patterns" : "E Theilwe mo Mekgweng ya Baeti"}
              </Badge>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {language === "en" ? "AI-Powered Demand Forecasting" : "Tshekatsheko ya Tlhokego ka AI"}
                </CardTitle>
                <CardDescription className="text-blue-800">
                  {language === "en"
                    ? "Predictive analytics based on walk-in patterns, historical data, and seasonal trends to optimize stock levels."
                    : "Tshekatsheko ya bokamoso e theilwe mo mekgweng ya baeti, data ya histori, le mekgwa ya dingwaga go tokafatsa maemo a stock."}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {demandForecast.map((forecast, index) => (
                <Card key={index} className={forecast.urgency === "critical" ? "border-red-500 border-2" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{forecast.medication}</h3>
                          <Badge className={getUrgencyColor(forecast.urgency)}>
                            {forecast.urgency === "critical"
                              ? t.critical
                              : forecast.urgency === "high"
                                ? t.high
                                : forecast.urgency === "medium"
                                  ? t.medium
                                  : t.low}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">{t.currentStock}</p>
                            <p className="font-bold text-lg">{forecast.currentStock} units</p>
                          </div>
                          <div>
                            <p className="text-gray-600">{t.predictedDemand}</p>
                            <p className="font-bold text-lg text-orange-600">{forecast.predictedDemand} units</p>
                          </div>
                          <div>
                            <p className="text-gray-600">{t.timeframe}</p>
                            <p className="font-medium">{forecast.timeframe}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">{t.confidence}</p>
                            <p className="font-medium">{forecast.confidence}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>{t.basedOn}:</strong> {forecast.basedOn}
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button
                          className={
                            forecast.urgency === "critical"
                              ? "bg-red-600 hover:bg-red-700"
                              : forecast.urgency === "high"
                                ? "bg-orange-600 hover:bg-orange-700"
                                : "bg-blue-600 hover:bg-blue-700"
                          }
                          onClick={() => setIsModalOpen(true)}
                        >
                          {t.placeOrder}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Restocking Tab */}
          <TabsContent value="restocking">
            <div className="flex justify-between items-center mb-4">
              <CardTitle>{language === "en" ? "Restock Requests" : "Dikopo tsa go Nya Gape"}</CardTitle>
              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {language === "en" ? "Placing Order..." : "Go Ila Kopo..."}
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    {language === "en" ? "Place Order" : "Ila Kopo"}
                  </>
                )}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardDescription>
                  {language === "en"
                    ? "Manage pending and fulfilled orders"
                    : "Laola dikopo tse di emetsweng le tse di filweng"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {restockHistory.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{req.medicationName}</h4>
                        <p className="text-sm text-gray-600">
                          {req.quantity} units • {req.supplier} • {req.dateRequested}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            req.status === "delivered"
                              ? "default"
                              : req.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {language === "en" ? "View" : "Bona"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <div className="space-y-6">
              {lowStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-yellow-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {language === "en" ? "Low Stock Alerts" : "Ditlhatlhego tsa Kotsi e Nnyane"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {lowStockItems.map((item) => (
                        <li key={item.id} className="text-sm">
                          <span className="font-medium">{item.medicationName}</span> – only {item.stock} {item.unit}{" "}
                          left (reorder at {item.reorderLevel})
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {expiringSoon.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-700 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {language === "en" ? "Expiry Alerts" : "Ditlhatlhego tsa go Fela"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {expiringSoon.map((item) => (
                        <li key={item.id} className="text-sm">
                          <span className="font-medium">{item.medicationName}</span> (Batch: {item.batchNumber}) expires
                          on {item.expirationDate}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Reporting Tab */}
          <TabsContent value="reporting">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Top 5 Most Used" : "Tse 5 tse di Dumilwang Kwa Ntle"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>1. Paracetamol – 240 units/month</li>
                    <li>2. Amoxicillin – 180 units/month</li>
                    <li>3. Atorvastatin – 120 units/month</li>
                    <li>4. Insulin – 45 units/month</li>
                    <li>5. Doxycycline – 90 units/month</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Monthly Spend" : "Tlhopho ya Kgwedi"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">P 12,450.00</div>
                  <p className="text-sm text-gray-600 mt-1">{language === "en" ? "October 2025" : "Phukwi 2025"}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ✅ Success Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              {t.orderSuccess}
            </DialogTitle>
            <DialogDescription>{t.orderSent}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "Your order has been successfully submitted and will be processed by the supplier."
                : "Kopo ya gago e neilwe ka botlhokwa e tla dirisiwa ke moongwi."}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {t.closeModal}
            </Button>
            <Button
              onClick={() => {
                setIsModalOpen(false)
                // Optional: navigate to order history or details
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t.viewOrder}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
>>>>>>> 3dfe3720b6ac835c6c563c2622e2bbbe02a07cd9
