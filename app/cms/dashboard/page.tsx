"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, AlertTriangle, TrendingUp, MapPin, Heart, Globe, Bell, Settings, LogOut, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function CMSDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [selectedRegion, setSelectedRegion] = useState("all")

  const content = {
    en: {
      title: "Central Medical Stores Dashboard",
      subtitle: "National Medicine Distribution & Supply Chain Management",
      overview: "Overview",
      alerts: "Stock Alerts",
      deliveries: "Deliveries",
      suppliers: "Suppliers",
      analytics: "Analytics",
      stats: {
        totalFacilities: "Facilities Served",
        pendingAlerts: "Pending Stock Alerts",
        activeDeliveries: "Active Deliveries",
        suppliersActive: "Active Suppliers",
        deliverySuccess: "Delivery Success Rate",
        avgDeliveryTime: "Avg Delivery Time",
      },
      criticalAlerts: "Critical Stock Alerts",
      recentDeliveries: "Recent Deliveries",
      regionalDistribution: "Regional Distribution",
      demandForecast: "Demand Forecast",
      scheduleDelivery: "Schedule Delivery",
      viewDetails: "View Details",
      processAlert: "Process Alert",
      regions: {
        all: "All Regions",
        central: "Central",
        southern: "Southern",
        northern: "Northern",
        western: "Western",
        eastern: "Eastern",
      },
    },
    tn: {
      title: "Dashboard ya Central Medical Stores",
      subtitle: "Taolo ya Kabo ya Dihlare ya Naga le Supply Chain",
      overview: "Kakaretso",
      alerts: "Dikitsiso tsa Stock",
      deliveries: "Diromelo",
      suppliers: "Bafani",
      analytics: "Tshekatsheko",
      stats: {
        totalFacilities: "Mafelo a a Direlwang",
        pendingAlerts: "Dikitsiso tse di Emetsweng",
        activeDeliveries: "Diromelo tse di Dirang",
        suppliersActive: "Bafani ba ba Dirang",
        deliverySuccess: "Seelo sa Katlego ya Diromelo",
        avgDeliveryTime: "Nako ya Karolelano ya Diromelo",
      },
      criticalAlerts: "Dikitsiso tse di Botlhokwa tsa Stock",
      recentDeliveries: "Diromelo tsa Bosheng",
      regionalDistribution: "Kabo ya Dikgaolo",
      demandForecast: "Ponelopele ya Tlhokego",
      scheduleDelivery: "Rulaganya Diromelo",
      viewDetails: "Bona Dintlha",
      processAlert: "Dira Kitsiso",
      regions: {
        all: "Dikgaolo Tsotlhe",
        central: "Bogareng",
        southern: "Borwa",
        northern: "Bokone",
        western: "Bophirima",
        eastern: "Botlhaba",
      },
    },
  }

  const t = content[language]

  const criticalAlerts = [
    {
      id: 1,
      facility: "Kasane Clinic",
      medicine: "Amlodipine 5mg",
      currentStock: 2,
      daysRemaining: 2,
      region: "Chobe",
      priority: "critical",
      requestDate: "2024-01-10",
      estimatedNeed: 200,
    },
    {
      id: 2,
      facility: "Ghanzi Hospital",
      medicine: "Insulin (Rapid Acting)",
      currentStock: 5,
      daysRemaining: 3,
      region: "Ghanzi",
      priority: "critical",
      requestDate: "2024-01-10",
      estimatedNeed: 100,
    },
    {
      id: 3,
      facility: "Tsabong Clinic",
      medicine: "Paracetamol 500mg",
      currentStock: 15,
      daysRemaining: 5,
      region: "Kgalagadi",
      priority: "high",
      requestDate: "2024-01-09",
      estimatedNeed: 300,
    },
    {
      id: 4,
      facility: "Maun General Hospital",
      medicine: "Metformin 500mg",
      currentStock: 25,
      daysRemaining: 7,
      region: "Ngami",
      priority: "medium",
      requestDate: "2024-01-09",
      estimatedNeed: 400,
    },
  ]

  const recentDeliveries = [
    {
      id: "DEL001",
      facilities: ["Princess Marina Hospital", "Gaborone Main Clinic"],
      medicines: ["Amlodipine 5mg", "Metformin 500mg"],
      totalUnits: 1500,
      status: "delivered",
      deliveryDate: "2024-01-10",
      driver: "Thabo Mogale",
      region: "Central",
    },
    {
      id: "DEL002",
      facilities: ["Nyangabgwe Hospital", "Francistown Clinic"],
      medicines: ["Insulin", "Paracetamol 500mg"],
      totalUnits: 800,
      status: "in_transit",
      deliveryDate: "2024-01-11",
      driver: "Keabetswe Tsheko",
      region: "Northern",
    },
    {
      id: "DEL003",
      facilities: ["Scottish Livingstone Hospital"],
      medicines: ["Amoxicillin 250mg", "Amlodipine 5mg"],
      totalUnits: 600,
      status: "scheduled",
      deliveryDate: "2024-01-12",
      driver: "Mpho Setlhare",
      region: "Central",
    },
    {
      id: "DEL004",
      facilities: ["Maun General Hospital", "Maun Clinic"],
      medicines: ["Metformin 500mg", "Paracetamol 500mg"],
      totalUnits: 1200,
      status: "preparing",
      deliveryDate: "2024-01-13",
      driver: "Gorata Mmusi",
      region: "Western",
    },
  ]

  const regionalData = [
    {
      region: "Central",
      facilities: 45,
      alertsCount: 8,
      deliveriesThisWeek: 12,
      stockLevel: 85,
      avgDeliveryTime: "2.3 days",
    },
    {
      region: "Southern",
      facilities: 38,
      alertsCount: 5,
      deliveriesThisWeek: 9,
      stockLevel: 78,
      avgDeliveryTime: "2.8 days",
    },
    {
      region: "Northern",
      facilities: 42,
      alertsCount: 12,
      deliveriesThisWeek: 8,
      stockLevel: 72,
      avgDeliveryTime: "3.2 days",
    },
    {
      region: "Western",
      facilities: 28,
      alertsCount: 15,
      deliveriesThisWeek: 6,
      stockLevel: 68,
      avgDeliveryTime: "4.1 days",
    },
    {
      region: "Eastern",
      facilities: 35,
      alertsCount: 7,
      deliveriesThisWeek: 10,
      stockLevel: 82,
      avgDeliveryTime: "2.9 days",
    },
  ]

  const suppliers = [
    {
      name: "Botswana Pharmaceuticals",
      medicines: ["Amlodipine", "Metformin", "Paracetamol"],
      reliability: 94,
      avgDeliveryTime: "5-7 days",
      lastDelivery: "2024-01-08",
      status: "active",
    },
    {
      name: "African Medical Supplies",
      medicines: ["Insulin", "Amoxicillin"],
      reliability: 89,
      avgDeliveryTime: "7-10 days",
      lastDelivery: "2024-01-05",
      status: "active",
    },
    {
      name: "Global Health Solutions",
      medicines: ["Specialized medicines"],
      reliability: 96,
      avgDeliveryTime: "10-14 days",
      lastDelivery: "2024-01-03",
      status: "active",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_transit":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "scheduled":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
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
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Beats Health - CMS</h1>
                  <p className="text-sm text-gray-600">{t.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "tn" : "en")}>
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "Setswana" : "English"}
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <Badge variant="secondary" className="mb-4">
            <Truck className="h-4 w-4 mr-1" />
            {language === "en" ? "Supply Chain Control Center" : "Setsi sa Taolo ya Supply Chain"}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t.stats.totalFacilities}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">188</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                All regions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t.stats.pendingAlerts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">47</div>
              <div className="text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Needs attention
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t.stats.activeDeliveries}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-xs text-purple-600">In progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t.stats.suppliersActive}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-green-600">Verified</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t.stats.deliverySuccess}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">96.2%</div>
              <div className="text-xs text-green-600">This month</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t.stats.avgDeliveryTime}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">2.8</div>
              <div className="text-xs text-orange-600">Days</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="alerts">{t.alerts}</TabsTrigger>
            <TabsTrigger value="deliveries">{t.deliveries}</TabsTrigger>
            <TabsTrigger value="suppliers">{t.suppliers}</TabsTrigger>
            <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Overview Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Critical Alerts */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      {t.criticalAlerts}
                    </CardTitle>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t.regions.all}</SelectItem>
                        <SelectItem value="central">{t.regions.central}</SelectItem>
                        <SelectItem value="southern">{t.regions.southern}</SelectItem>
                        <SelectItem value="northern">{t.regions.northern}</SelectItem>
                        <SelectItem value="western">{t.regions.western}</SelectItem>
                        <SelectItem value="eastern">{t.regions.eastern}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {criticalAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                            <span className="text-sm font-medium">{alert.region}</span>
                          </div>
                          <span className="text-xs text-gray-500">{alert.requestDate}</span>
                        </div>
                        <h3 className="font-semibold text-red-900">{alert.facility}</h3>
                        <p className="text-sm text-red-800 mb-2">{alert.medicine}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-red-700">Current: </span>
                            <span className="font-medium">{alert.currentStock}</span>
                          </div>
                          <div>
                            <span className="text-red-700">Days left: </span>
                            <span className="font-medium">{alert.daysRemaining}</span>
                          </div>
                          <div>
                            <span className="text-red-700">Need: </span>
                            <span className="font-medium">{alert.estimatedNeed}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Truck className="h-4 w-4 mr-2" />
                            {t.scheduleDelivery}
                          </Button>
                          <Button size="sm" variant="outline">
                            {t.viewDetails}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Deliveries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {t.recentDeliveries}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentDeliveries.slice(0, 4).map((delivery) => (
                      <div key={delivery.id} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status === "delivered"
                              ? language === "en"
                                ? "Delivered"
                                : "E isitswe"
                              : delivery.status === "in_transit"
                                ? language === "en"
                                  ? "In Transit"
                                  : "E tsamaya"
                                : delivery.status === "scheduled"
                                  ? language === "en"
                                    ? "Scheduled"
                                    : "E rulagantse"
                                  : language === "en"
                                    ? "Preparing"
                                    : "E baakanya"}
                          </Badge>
                          <span className="text-xs text-gray-500">{delivery.deliveryDate}</span>
                        </div>
                        <p className="font-medium text-sm">{delivery.id}</p>
                        <p className="text-xs text-gray-600 mb-1">{delivery.region} Region</p>
                        <p className="text-xs text-gray-600 mb-1">
                          {delivery.totalUnits} units • {delivery.driver}
                        </p>
                        <div className="text-xs text-gray-500">
                          {delivery.facilities.length} {language === "en" ? "facilities" : "mafelo"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t.regionalDistribution}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {regionalData.map((region) => (
                    <div key={region.region} className="p-4 rounded-lg border">
                      <h3 className="font-semibold mb-3">{region.region}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Facilities:</span>
                          <span className="font-medium">{region.facilities}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Alerts:</span>
                          <span className={`font-medium ${region.alertsCount > 10 ? "text-red-600" : "text-gray-900"}`}>
                            {region.alertsCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deliveries:</span>
                          <span className="font-medium">{region.deliveriesThisWeek}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stock Level:</span>
                          <span
                            className={`font-medium ${
                              region.stockLevel >= 80
                                ? "text-green-600"
                                : region.stockLevel >= 70
                                  ? "text-orange-600"
                                  : "text-red-600"
                            }`}
                          >
                            {region.stockLevel}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Delivery:</span>
                          <span className="font-medium text-xs">{region.avgDeliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Stock Alert Management</CardTitle>
                <CardDescription>Process and respond to facility stock requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{alert.facility}</h3>
                          <p className="text-sm text-gray-600">
                            {alert.medicine} - {alert.region} Region
                          </p>
                          <p className="text-xs text-gray-500">
                            Current: {alert.currentStock} | Need: {alert.estimatedNeed} | Days left:{" "}
                            {alert.daysRemaining}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            {t.processAlert}
                          </Button>
                          <Button size="sm" variant="outline">
                            {t.viewDetails}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliveries">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Management</CardTitle>
                <CardDescription>Track and manage medicine deliveries nationwide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDeliveries.map((delivery) => (
                    <div key={delivery.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{delivery.id}</h3>
                          <p className="text-sm text-gray-600">
                            {delivery.region} Region • {delivery.driver}
                          </p>
                        </div>
                        <Badge className={getStatusColor(delivery.status)}>{delivery.status}</Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Facilities:</p>
                          {delivery.facilities.map((facility, idx) => (
                            <p key={idx} className="font-medium">
                              {facility}
                            </p>
                          ))}
                        </div>
                        <div>
                          <p className="text-gray-600">Medicines:</p>
                          {delivery.medicines.map((medicine, idx) => (
                            <p key={idx} className="font-medium">
                              {medicine}
                            </p>
                          ))}
                        </div>
                        <div>
                          <p className="text-gray-600">Total Units:</p>
                          <p className="font-medium">{delivery.totalUnits}</p>
                          <p className="text-gray-600 mt-2">Delivery Date:</p>
                          <p className="font-medium">{delivery.deliveryDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Management</CardTitle>
                <CardDescription>Monitor supplier performance and relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers.map((supplier, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <p className="text-sm text-gray-600">
                            Reliability: {supplier.reliability}% • Avg delivery: {supplier.avgDeliveryTime}
                          </p>
                        </div>
                        <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                          {supplier.status}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Medicines supplied:</p>
                          <div className="flex flex-wrap gap-1">
                            {supplier.medicines.map((medicine, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {medicine}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Last delivery:</p>
                          <p className="font-medium">{supplier.lastDelivery}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Analytics</CardTitle>
                <CardDescription>Data insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Advanced analytics and reporting interface would be implemented here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Including demand forecasting, delivery optimization, and cost analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
