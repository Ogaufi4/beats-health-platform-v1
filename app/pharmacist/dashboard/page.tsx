"use client"

import { useState, useEffect, useMemo } from "react"
import BeatsLogo from "@/components/BeatsLogo"
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

  const [displayFacility, setDisplayFacility] = useState({ en: content.en.subtitle, tn: content.tn.subtitle })

  useEffect(() => {
    const savedEn = localStorage.getItem("userFacilityNameEn")
    const savedTn = localStorage.getItem("userFacilityNameTn")
    if (savedEn && savedTn) {
      setDisplayFacility({ en: savedEn, tn: savedTn })
    }

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
    const facilityKey = localStorage.getItem("userFacilityKey") || "pmh"
    const facilities = await getFacilities()
    const currentFac = facilities.find(f => f.id === facilityKey)
    if (currentFac) {
      setLocalInventory(Object.entries(currentFac.stock).map(([med, qty]) => ({ med, qty: Number(qty) })))
    }
  }

  const t = {
    ...content[language],
    subtitle: language === "en" ? displayFacility.en : displayFacility.tn
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

  const handleRequestTransfer = async (item: { facilityId: string; item: string; facilityName: string }) => {
    const facilityKey = localStorage.getItem("userFacilityKey") || "pmh"
    await addTask({
      type: "supply_order",
      fromFacility: facilityKey,
      toFacility: "cms_supply_hub",
      payload: {
        item: item.item,
        qty: 100,
        urgency: "urgent",
        requestedAt: new Date().toISOString(),
        requestedFrom: item.facilityName,
      }
    })

    toast({
      title: "Supply Order Placed",
      description: `Ordered 100 units of ${item.item} via Supply Hub.`
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* Premium Dashboard Header */}
      <header className="border-b bg-white backdrop-blur-md sticky top-0 z-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <BeatsLogo size={44} />
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">{t.title}</h1>
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {t.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 flex items-center gap-2">
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
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Database className="h-5 w-5" /></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Local SKUs</p>
                <p className="text-xl font-bold">{localInventory.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><AlertTriangle className="h-5 w-5" /></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Low Stock</p>
                <p className="text-xl font-bold">{localInventory.filter(i => i.qty < 50).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Truck className="h-5 w-5" /></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pending Orders</p>
                <p className="text-xl font-bold">{tasks.filter(t => (t.type === 'transfer_request' || t.type === 'supply_order') && t.status === 'pending').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm">
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
          <TabsList className="bg-white border border-slate-200 p-1 w-full md:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6">
              {t.inventory}
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6">
              {t.network}
            </TabsTrigger>
            <TabsTrigger value="transfers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 relative">
              {t.transfers}
              {tasks.filter(tk => tk.status === 'pending' && (tk.type === 'transfer_request' || tk.type === 'supply_order')).length > 0 && (
                <span className="ml-2 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {tasks.filter(tk => tk.status === 'pending' && (tk.type === 'transfer_request' || tk.type === 'supply_order')).length}
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
                  <Database className="h-6 w-6 text-purple-600" />
                  Local Station Stock
                </h2>
                <p className="text-slate-500 text-sm">Real-time inventory for Station 01</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20">
                <Plus className="h-4 w-4 mr-2" /> Adjust Stock
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {localInventory.map((item, idx) => (
                <Card key={idx} className="bg-white border-slate-200 hover:border-purple-500/50 transition-all group overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors" />
                  <CardContent className="p-5 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{item.med}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Dispensing Station A</p>
                      </div>
                      <Badge variant={item.qty < 50 ? "destructive" : "secondary"} className={`${item.qty < 50 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} px-2 py-0.5`}>
                        {item.qty} units
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
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
                className="pl-12 py-6 bg-white border-slate-200 text-lg rounded-xl focus:ring-purple-500/50 transition-all border-2 shadow-sm text-slate-900"
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
                <Card key={idx} className="bg-white border-slate-200 hover:border-purple-500/50 transition-all overflow-hidden relative group shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                        <Pill className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="border-slate-200 text-slate-500 uppercase text-[10px] tracking-widest bg-slate-50 px-2 py-1">
                        {item.location || "3.2km away"}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.item}</h3>
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
                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                  <Search className="h-10 w-10 text-slate-200 mx-auto mb-3" />
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
            
            {tasks.filter(t => t.type === 'transfer_request' || t.type === 'supply_order').length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
                <Truck className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">No active logistics requests found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.filter(t => t.type === 'transfer_request' || t.type === 'supply_order').map((task) => (
                  <Card key={task.id} className="bg-white border-slate-200 border-l-4 border-l-purple-600 hover:bg-slate-50 transition-all shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                          <div className="text-center w-24">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{new Date(task.createdAt).toLocaleDateString()}</p>
                            <p className="text-lg font-bold text-purple-400 tabular-nums">{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="hidden md:block h-12 w-px bg-slate-100" />
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-slate-900 text-lg">{task.payload.item}</h3>
                              <Badge className="bg-slate-50 text-[10px] h-5 border-slate-200 text-slate-600">{task.payload.qty} UNITS</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                              <MapPin className="h-3 w-3" />
                              <span className="font-medium text-slate-300">{task.fromFacility}</span>
                              <ArrowRight className="h-3 w-3 text-slate-600" />
                              <span className="font-medium text-slate-300">
                                {task.type === "supply_order" ? "CMS Supply Hub" : task.toFacility}
                              </span>
                            </div>
                            <div className="mt-1 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                              {task.type === "supply_order" ? "Supply Order" : "Transfer Request"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          <div className="flex flex-col items-end">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">Network Status</p>
                            <Badge className={`${
                              task.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              task.status === 'approved' ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' :
                              task.status === 'in-transit' ? 'bg-purple-50 text-purple-600 border-purple-100 animate-pulse' :
                              'bg-emerald-50 text-emerald-600 border-emerald-100'
                            } border px-3 py-1 font-bold text-[10px] tracking-wider`}>
                              {task.status.toUpperCase().replace('-', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            {task.status === 'pending' && task.type === 'transfer_request' && task.fromFacility === 'pmh' && (
                              <>
                                <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 h-9 font-bold">Reject</Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-9 font-bold px-4" onClick={() => updateTaskStatus(task.id, 'approved')}>Dispatch</Button>
                              </>
                            )}
                            {task.status === 'approved' && task.type === 'transfer_request' && task.fromFacility === 'pmh' && (
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-500 font-bold px-4" onClick={() => updateTaskStatus(task.id, 'in-transit')}>Mark as Dispatched</Button>
                            )}
                            {task.status === 'in-transit' && task.type === 'transfer_request' && task.toFacility === 'pmh' && (
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 font-bold px-4" onClick={() => updateTaskStatus(task.id, 'fulfilled')}>Confirm Delivery</Button>
                            )}
                            {task.type === "supply_order" && task.status === "pending" && (
                              <Badge className="bg-slate-50 text-slate-500 border-slate-200 h-9 px-4 flex items-center gap-2">
                                Awaiting CMS
                              </Badge>
                            )}
                            {task.status === 'fulfilled' && (
                              <Badge className="bg-slate-50 text-slate-500 border-slate-200 h-9 px-4 flex items-center gap-2">
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

          <TabsContent value="analytics" className="py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <Activity className="h-16 w-16 text-slate-100 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-slate-900 font-bold text-2xl mb-2">Network Demand Intelligence</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Forecasting regional demand based on inter-facility transfer requests. Link active to National Health Data Hub in Gaborone.</p>
            <div className="mt-8 flex justify-center gap-2">
               <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Avg Request Latency</p>
                  <p className="text-xl font-bold text-blue-600">42 min</p>
               </div>
               <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Network Saving</p>
                  <p className="text-xl font-bold text-emerald-600">24%</p>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
