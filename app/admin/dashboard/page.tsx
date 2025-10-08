"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Users,
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

export default function AdminDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")

  const content = {
    en: {
      title: "Ministry of Health Dashboard",
      subtitle: "National Healthcare Coordination Overview",
      overview: "Overview",
      facilities: "Facilities",
      specialists: "Specialists",
      stock: "Medicine Stock",
      reports: "Reports",
      stats: {
        totalFacilities: "Total Health Facilities",
        activeSpecialists: "Active Specialists",
        pendingAppointments: "Pending Appointments",
        stockAlerts: "Stock Alerts",
        equipmentUptime: "Equipment Uptime",
        ruralCoverage: "Rural Coverage",
      },
      recentActivity: "Recent System Activity",
      criticalAlerts: "Critical Alerts",
      regionalOverview: "Regional Overview",
    },
    tn: {
      title: "Dashboard ya Lefapha la Boitekanelo",
      subtitle: "Kakaretso ya Thulaganyo ya Boitekanelo ya Naga",
      overview: "Kakaretso",
      facilities: "Mafelo",
      specialists: "Dingaka tse di Ikgethileng",
      stock: "Stock ya Dihlare",
      reports: "Dipego",
      stats: {
        totalFacilities: "Mafelo otlhe a Boitekanelo",
        activeSpecialists: "Dingaka tse di Ikgethileng tse di Dirang",
        pendingAppointments: "Dikopano tse di Emetsweng",
        stockAlerts: "Dikitsiso tsa Stock",
        equipmentUptime: "Didirisiwa tse di Dirang",
        ruralCoverage: "Phitlhelelo ya Magae",
      },
      recentActivity: "Ditiro tsa Bosheng",
      criticalAlerts: "Dikitsiso tse di Botlhokwa",
      regionalOverview: "Kakaretso ya Dikgaolo",
    },
  }

  const t = content[language]

  const recentActivities = [
    {
      id: 1,
      type: "appointment",
      message:
        language === "en"
          ? "New MRI appointment scheduled at Nyangabgwe Hospital"
          : "Kopano e ntšha ya MRI e beetswe kwa Nyangabgwe Hospital",
      time: "2 min ago",
      priority: "normal",
    },
    {
      id: 2,
      type: "stock",
      message:
        language === "en"
          ? "Critical stock alert: Insulin at Maun General Hospital"
          : "Kitsiso ya botlhokwa: Insulin kwa Maun General Hospital",
      time: "5 min ago",
      priority: "high",
    },
    {
      id: 3,
      type: "equipment",
      message:
        language === "en"
          ? "CT Scanner back online at Princess Marina Hospital"
          : "CT Scanner e boetse mo Princess Marina Hospital",
      time: "15 min ago",
      priority: "normal",
    },
    {
      id: 4,
      type: "delivery",
      message:
        language === "en"
          ? "Medicine delivery completed to 5 rural clinics"
          : "Go romela dihlare go fedile mo dikliniki tse 5 tsa magae",
      time: "1 hour ago",
      priority: "normal",
    },
  ]

  const criticalAlerts = [
    {
      id: 1,
      facility: "Kasane Clinic",
      issue:
        language === "en"
          ? "Amlodipine stock critically low (2 days remaining)"
          : "Stock ya Amlodipine e kwa tlase thata (malatsi a 2 a setseng)",
      priority: "critical",
      region: "Chobe",
    },
    {
      id: 2,
      facility: "Ghanzi Hospital",
      issue: language === "en" ? "X-Ray machine offline for 3 days" : "Motšhini wa X-Ray o sa dire matsatsi a 3",
      priority: "high",
      region: "Ghanzi",
    },
    {
      id: 3,
      facility: "Tsabong Clinic",
      issue: language === "en" ? "No cardiologist available this week" : "Ga go na ngaka ya pelo beke eno",
      priority: "medium",
      region: "Kgalagadi",
    },
  ]

  const regionalData = [
    { region: "Central", facilities: 45, specialists: 120, stockLevel: 85 },
    { region: "Southern", facilities: 38, specialists: 95, stockLevel: 78 },
    { region: "Northern", facilities: 42, specialists: 88, stockLevel: 72 },
    { region: "Western", facilities: 28, specialists: 45, stockLevel: 68 },
    { region: "Eastern", facilities: 35, specialists: 67, stockLevel: 82 },
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="facilities">{t.facilities}</TabsTrigger>
            <TabsTrigger value="specialists">{t.specialists}</TabsTrigger>
            <TabsTrigger value="stock">{t.stock}</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.activeSpecialists}</CardTitle>
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
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.pendingAppointments}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">1,247</div>
                  <div className="text-xs text-gray-600">Next 7 days</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.stockAlerts}</CardTitle>
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
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.equipmentUptime}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94.2%</div>
                  <div className="text-xs text-green-600">Above target</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.ruralCoverage}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-xs text-purple-600">Villages covered</div>
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
                        {activity.type === "appointment" && <Calendar className="h-4 w-4 text-blue-500" />}
                        {activity.type === "stock" && <Package className="h-4 w-4 text-red-500" />}
                        {activity.type === "equipment" && <Activity className="h-4 w-4 text-green-500" />}
                        {activity.type === "delivery" && <Truck className="h-4 w-4 text-purple-500" />}
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
                        <p className="text-sm font-medium">{alert.facility}</p>
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
                          <span className="text-gray-600">Facilities:</span>
                          <span className="font-medium">{region.facilities}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Specialists:</span>
                          <span className="font-medium">{region.specialists}</span>
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

          <TabsContent value="specialists">
            <Card>
              <CardHeader>
                <CardTitle>Medical Specialists Directory</CardTitle>
                <CardDescription>Manage specialist availability and scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Specialists management interface would be implemented here</p>
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
