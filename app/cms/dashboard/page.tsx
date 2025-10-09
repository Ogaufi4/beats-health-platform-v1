"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Calendar,
  Package,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  Heart,
  Globe,
  Bell,
  Settings,
  LogOut,
  Stethoscope,
  Pill,
  Truck,
} from "lucide-react"
import Link from "next/link"

export default function CMSDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")

  const content = {
    en: {
      title: "Central Medical Stores",
      subtitle: "Medicine Stock Overview",
      overview: "Overview",
      facilities: "Facilities",
      stock: "Medicine Stock",
      deliveries: "Deliveries",
      reports: "Reports",
      stats: {
        totalFacilities: "Total Health Facilities",
        totalStockItems: "Total Stock Items",
        pendingDeliveries: "Pending Deliveries",
        deliveryUptime: "Delivery Uptime",
        regionalDemand: "Regional Demand",
        budgetRemaining: "Budget Remaining",
      },
      recentActivity: "Recent Delivery Updates",
      criticalAlerts: "Critical Stock Alerts",
      regionalOverview: "Delivery Regions",
    },
    tn: {
      title: "Central Medical Stores",
      subtitle: "Thulaganyo ya Botlalo ya Stock",
      overview: "Kakaretso",
      facilities: "Mafelo",
      stock: "Stock ya Dihlare",
      deliveries: "Go Romela",
      reports: "Dipego",
      stats: {
        totalFacilities: "Mafelo Othle a Boitekanelo",
        totalStockItems: "Dintho Tsotlhe",
        pendingDeliveries: "Go Romela tse di Emetsweng",
        deliveryUptime: "Go Romela go Diragala ka Nako",
        regionalDemand: "Tlhokego ya Kgaolo",
        budgetRemaining: "Tshelete e e Setseng",
      },
      recentActivity: "Dipego tsa Bosheng",
      criticalAlerts: "Dikitsiso tse di Botlhokwa",
      regionalOverview: "Dikgaolo tsa Go Romela",
    },
  }

  const t = content[language]

  const recentActivities = [
    {
      id: 1,
      type: "delivery",
      message:
        language === "en"
          ? "Amlodipine delivery dispatched to Maun General Hospital"
          : "Go romela Amlodipine go rometswe kwa Maun General Hospital",
      time: "2 min ago",
      priority: "normal",
    },
    {
      id: 2,
      type: "stock",
      message:
        language === "en"
          ? "Critical stock level detected for Insulin at Ghanzi Hospital"
          : "Maemo a a kwa tlase thata a Insulin kwa Ghanzi Hospital",
      time: "5 min ago",
      priority: "high",
    },
    {
      id: 3,
      type: "delivery",
      message:
        language === "en"
          ? "Metformin delivery completed to 10 rural clinics"
          : "Go romela Metformin go weditswe kwa dikliniki tse 10 tsa magae",
      time: "15 min ago",
      priority: "normal",
    },
  ]

  const criticalAlerts = [
    {
      id: 1,
      facility: "Kasane Clinic",
      medicine: "Amlodipine 5mg",
      issue:
        language === "en"
          ? "Stock critically low (2 days remaining)"
          : "Stock e kwa tlase thata (malatsi a 2 a setseng)",
      priority: "critical",
      region: "Chobe",
    },
    {
      id: 2,
      facility: "Ghanzi Hospital",
      medicine: "Insulin",
      issue: language === "en" ? "Stock critically low" : "Stock e kwa tlase thata",
      priority: "high",
      region: "Ghanzi",
    },
  ]

  const regionalData = [
    { region: "Central", deliveries: 45, stockLevel: 85 },
    { region: "Southern", deliveries: 38, stockLevel: 78 },
    { region: "Northern", deliveries: 42, stockLevel: 72 },
    { region: "Western", deliveries: 28, stockLevel: 68 },
    { region: "Eastern", deliveries: 35, stockLevel: 82 },
  ]

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
                  <h1 className="text-xl font-bold text-gray-900">Beats Health</h1>
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
            <Activity className="h-4 w-4 mr-1" />
            {language === "en" ? "Live Dashboard" : "Dashboard ya Mmatota"}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="facilities">{t.facilities}</TabsTrigger>
            <TabsTrigger value="stock">{t.stock}</TabsTrigger>
            <TabsTrigger value="deliveries">{t.deliveries}</TabsTrigger>
            <TabsTrigger value="reports">{t.reports}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.totalFacilities}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">188</div>
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +3 this month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.totalStockItems}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">415</div>
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12 this week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.pendingDeliveries}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">1,247</div>
                  <div className="text-xs text-gray-600">Next 7 days</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.deliveryUptime}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">23</div>
                  <div className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Needs attention
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.regionalDemand}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94.2%</div>
                  <div className="text-xs text-green-600">Above target</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.budgetRemaining}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-xs text-purple-600">Budget available</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t.recentActivity}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.priority === "high" ? "bg-red-500" : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        {activity.type === "delivery" && <Truck className="h-4 w-4 text-purple-500" />}
                        {activity.type === "stock" && <Package className="h-4 w-4 text-red-500" />}
                        {activity.type === "equipment" && <Activity className="h-4 w-4 text-green-500" />}
                        {activity.type === "appointment" && <Calendar className="h-4 w-4 text-blue-500" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Critical Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {t.criticalAlerts}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {criticalAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50">
                        <div className="flex items-center justify-between mb-1">
                          <Badge
                            variant={alert.priority === "critical" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {alert.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{alert.region}</span>
                        </div>
                        <p className="text-sm font-medium">{alert.medicine}</p>
                        <p className="text-xs text-gray-600">{alert.issue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t.regionalOverview}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {regionalData.map((region) => (
                    <div key={region.region} className="p-4 rounded-lg border">
                      <h3 className="font-semibold mb-3">{region.region}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deliveries:</span>
                          <span className="font-medium">{region.deliveries}</span>
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle>Health Facilities Management</CardTitle>
                <CardDescription>Monitor and manage all health facilities across Botswana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Facilities management interface would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>National Medicine Stock Overview</CardTitle>
                <CardDescription>Monitor medicine inventory across all facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Stock management interface would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliveries">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Management</CardTitle>
                <CardDescription>Manage medicine deliveries across all regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Delivery management interface would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Generate comprehensive healthcare reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Reports and analytics interface would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
