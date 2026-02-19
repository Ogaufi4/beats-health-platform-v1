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
import BeatsLogo from "@/components/BeatsLogo"

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
                <BeatsLogo size={40} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Princess Marina Hospital", region: "Central (Gaborone)", type: "Referral Hospital", beds: 560, status: "operational", alerts: 2 },
                { name: "Nyangabgwe Referral Hospital", region: "Northern (Francistown)", type: "Referral Hospital", beds: 370, status: "operational", alerts: 1 },
                { name: "Scottish Livingstone Hospital", region: "Southern (Molepolole)", type: "District Hospital", beds: 280, status: "operational", alerts: 0 },
                { name: "Maun General Hospital", region: "Western (Maun)", type: "District Hospital", beds: 200, status: "partial", alerts: 3 },
                { name: "Ghanzi Primary Hospital", region: "Western (Ghanzi)", type: "Primary Hospital", beds: 100, status: "partial", alerts: 4 },
                { name: "Kasane Primary Hospital", region: "Northern (Kasane)", type: "Primary Hospital", beds: 80, status: "operational", alerts: 1 },
                { name: "Tsabong District Hospital", region: "Southern (Tsabong)", type: "District Hospital", beds: 120, status: "maintenance", alerts: 2 },
                { name: "Gaborone Main Clinic", region: "Central (Gaborone)", type: "Clinic", beds: 0, status: "operational", alerts: 0 },
                { name: "Bokamoso Private Hospital", region: "Central (Gaborone)", type: "Private", beds: 174, status: "operational", alerts: 0 },
              ].map((fac, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{fac.name}</h3>
                        <p className="text-sm text-gray-500">{fac.region}</p>
                      </div>
                      <Badge variant={fac.status === "operational" ? "default" : fac.status === "partial" ? "secondary" : "destructive"}
                        className={`text-[10px] font-bold uppercase ${
                          fac.status === "operational" ? "bg-green-100 text-green-700 border-green-200" :
                          fac.status === "partial" ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-red-100 text-red-700 border-red-200"
                        }`}>
                        {fac.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{fac.type}</span>
                      {fac.beds > 0 && <span className="text-gray-500">{fac.beds} beds</span>}
                    </div>
                    {fac.alerts > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-red-600 font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        {fac.alerts} active alert{fac.alerts > 1 ? "s" : ""}
                      </div>
                    )}
                    <Button size="sm" variant="outline" className="mt-4 w-full text-xs">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specialists">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Dr. Sarah Molefe", specialty: "Cardiologist", facility: "Princess Marina Hospital", status: "available", patients: 8 },
                { name: "Dr. James Kgathi", specialty: "Cardiac Surgeon", facility: "Princess Marina Hospital", status: "busy", patients: 12 },
                { name: "Dr. Peter Sebego", specialty: "Electrophysiologist", facility: "Nyangabgwe Hospital", status: "available", patients: 5 },
                { name: "Dr. Naledi Moatlhodi", specialty: "Oncologist", facility: "Nyangabgwe Hospital", status: "available", patients: 7 },
                { name: "Dr. Keabetswe Tau", specialty: "Radiologist", facility: "Princess Marina Hospital", status: "busy", patients: 14 },
                { name: "Dr. Thabo Moeng", specialty: "Neurologist", facility: "Scottish Livingstone Hospital", status: "off-duty", patients: 0 },
                { name: "Dr. Lesego Kgang", specialty: "General Surgeon", facility: "Maun General Hospital", status: "available", patients: 6 },
                { name: "Dr. Gorata Mmusi", specialty: "Pediatrician", facility: "Gaborone Main Clinic", status: "available", patients: 9 },
                { name: "Dr. Boitumelo Seele", specialty: "Orthopedic Surgeon", facility: "Princess Marina Hospital", status: "busy", patients: 11 },
              ].map((spec, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">{spec.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{spec.specialty}</p>
                    <p className="text-xs text-gray-500 mt-1">{spec.facility}</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        spec.status === "available" ? "bg-green-500" :
                        spec.status === "busy" ? "bg-amber-500" : "bg-gray-400"
                      }`} />
                      <span className="text-xs font-medium capitalize text-gray-600">{spec.status}</span>
                      {spec.patients > 0 && <span className="text-xs text-gray-400">• {spec.patients} pts today</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stock">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Paracetamol 500mg", total: 45000, critical: 3, regions: [85, 78, 72, 62, 88] },
                  { name: "Amlodipine 5mg", total: 12000, critical: 5, regions: [64, 55, 80, 48, 75] },
                  { name: "Metformin 500mg", total: 28000, critical: 2, regions: [90, 85, 70, 65, 82] },
                  { name: "Amoxicillin 250mg", total: 18000, critical: 1, regions: [88, 92, 76, 71, 86] },
                  { name: "Insulin (Rapid Acting)", total: 6500, critical: 4, regions: [72, 68, 55, 45, 79] },
                  { name: "Furosemide 40mg", total: 9200, critical: 0, regions: [95, 91, 87, 83, 93] },
                ].map((med, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{med.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{med.total.toLocaleString()} units national</p>
                        </div>
                        {med.critical > 0 && (
                          <Badge variant="destructive" className="text-[10px]">{med.critical} critical</Badge>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {["Central", "Southern", "Northern", "Western", "Eastern"].map((r, i) => (
                          <div key={r} className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 w-14">{r}</span>
                            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  med.regions[i] >= 80 ? "bg-green-500" :
                                  med.regions[i] >= 65 ? "bg-amber-500" : "bg-red-500"
                                }`}
                                style={{ width: `${med.regions[i]}%` }}
                              />
                            </div>
                            <span className={`text-[10px] font-bold w-8 text-right ${
                              med.regions[i] >= 80 ? "text-green-600" :
                              med.regions[i] >= 65 ? "text-amber-600" : "text-red-600"
                            }`}>{med.regions[i]}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Monthly Facility Report", desc: "Performance metrics for all 188 facilities", date: "Jan 2026", icon: <Activity className="h-6 w-6 text-blue-600" />, color: "bg-blue-50" },
                { title: "Medicine Stock Summary", desc: "National inventory levels and critical alerts", date: "Jan 2026", icon: <Package className="h-6 w-6 text-green-600" />, color: "bg-green-50" },
                { title: "Specialist Utilisation", desc: "Specialist booking rates by facility and region", date: "Jan 2026", icon: <Stethoscope className="h-6 w-6 text-purple-600" />, color: "bg-purple-50" },
                { title: "Referral Network", desc: "Inter-facility referral patterns and outcomes", date: "Jan 2026", icon: <Users className="h-6 w-6 text-orange-600" />, color: "bg-orange-50" },
                { title: "Equipment Uptime", desc: "Diagnostic equipment uptime and maintenance logs", date: "Jan 2026", icon: <TrendingUp className="h-6 w-6 text-teal-600" />, color: "bg-teal-50" },
                { title: "Rural Coverage Index", desc: "CHW activity and rural community health metrics", date: "Jan 2026", icon: <MapPin className="h-6 w-6 text-rose-600" />, color: "bg-rose-50" },
              ].map((report, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${report.color} shrink-0`}>
                      {report.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
                      <p className="text-xs text-gray-400 mt-2">{report.date}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">Download</Button>
                      <Button size="sm" variant="outline" className="text-xs">Preview</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
