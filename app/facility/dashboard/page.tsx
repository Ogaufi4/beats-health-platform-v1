"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
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
  Plus,
  Scan,
  Phone,
  MessageSquare,
  Activity,
} from "lucide-react"
import Link from "next/link"

export default function FacilityDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [activeTab, setActiveTab] = useState("appointments")

  const content = {
    en: {
      title: "Princess Marina Hospital",
      subtitle: "Facility Dashboard",
      appointments: "Appointments",
      stock: "Medicine Stock",
      patients: "Patients",
      sms: "SMS/USSD",
      todayAppointments: "Today's Appointments",
      upcomingAppointments: "Upcoming Appointments",
      newAppointment: "New Appointment",
      searchPatients: "Search patients...",
      stockLevels: "Current Stock Levels",
      lowStock: "Low Stock Alerts",
      scanBarcode: "Scan Barcode",
      reorderMedicine: "Reorder Medicine",
      patientRecords: "Patient Records",
      ruralPatients: "Rural Patients",
      smsNotifications: "SMS Notifications",
      ussdAccess: "USSD Access",
    },
    tn: {
      title: "Sepetlele sa Princess Marina",
      subtitle: "Dashboard ya Lefelo",
      appointments: "Dikopano",
      stock: "Stock ya Dihlare",
      patients: "Balwetse",
      sms: "SMS/USSD",
      todayAppointments: "Dikopano tsa Gompieno",
      upcomingAppointments: "Dikopano tse di Tlang",
      newAppointment: "Kopano e Ntšha",
      searchPatients: "Batla balwetse...",
      stockLevels: "Maemo a Stock a Jaana",
      lowStock: "Dikitsiso tsa Stock e e Kwa Tlase",
      scanBarcode: "Scan Barcode",
      reorderMedicine: "Odara Dihlare Gape",
      patientRecords: "Direkoto tsa Balwetse",
      ruralPatients: "Balwetse ba Magae",
      smsNotifications: "Dikitsiso tsa SMS",
      ussdAccess: "Phitlhelelo ya USSD",
    },
  }

  const t = content[language]

  const todayAppointments = [
    {
      id: 1,
      time: "09:00",
      patient: "Thabo Mogale",
      type: "Cardiology Consultation",
      doctor: "Dr. Sekai Moyo",
      status: "confirmed",
      location: "Room 204",
    },
    {
      id: 2,
      time: "10:30",
      patient: "Keabetswe Tsheko",
      type: "MRI Scan",
      doctor: "Dr. James Kgathi",
      status: "pending",
      location: "Radiology Dept",
    },
    {
      id: 3,
      time: "14:00",
      patient: "Mpho Setlhare",
      type: "Orthopedic Follow-up",
      doctor: "Dr. Sarah Molefe",
      status: "confirmed",
      location: "Room 301",
    },
    {
      id: 4,
      time: "15:30",
      patient: "Gorata Mmusi",
      type: "Diabetes Check-up",
      doctor: "Dr. Peter Sebego",
      status: "confirmed",
      location: "Room 105",
    },
  ]

  const stockData = [
    {
      medicine: "Amlodipine 5mg",
      current: 45,
      minimum: 100,
      status: "critical",
      lastOrdered: "2024-01-08",
    },
    {
      medicine: "Metformin 500mg",
      current: 230,
      minimum: 200,
      status: "good",
      lastOrdered: "2024-01-05",
    },
    {
      medicine: "Paracetamol 500mg",
      current: 89,
      minimum: 150,
      status: "low",
      lastOrdered: "2024-01-10",
    },
    {
      medicine: "Insulin (Rapid Acting)",
      current: 12,
      minimum: 50,
      status: "critical",
      lastOrdered: "2024-01-09",
    },
  ]

  const equipmentStatus = [
    {
      equipment: "MRI Scanner",
      status: "operational",
      uptime: "98.5%",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-02-05",
      bookingsToday: 8,
    },
    {
      equipment: "CT Scanner",
      status: "maintenance",
      uptime: "85.2%",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-01-11",
      bookingsToday: 0,
    },
    {
      equipment: "X-Ray Machine",
      status: "operational",
      uptime: "99.1%",
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-02-08",
      bookingsToday: 15,
    },
    {
      equipment: "Ultrasound",
      status: "operational",
      uptime: "97.8%",
      lastMaintenance: "2024-01-07",
      nextMaintenance: "2024-02-07",
      bookingsToday: 12,
    },
  ]

  const smsQueue = [
    {
      id: 1,
      patient: "Mma Kgomotso",
      message:
        language === "en"
          ? "Appointment confirmed for tomorrow 10:00 AM with Dr. Moyo"
          : "Kopano e netefatsitswe kamoso 10:00 AM le Dr. Moyo",
      status: "sent",
      time: "2 min ago",
    },
    {
      id: 2,
      patient: "Rra Tebogo",
      message: language === "en" ? "Your medication is ready for collection" : "Dihlare tsa gago di siametse go tsewa",
      status: "pending",
      time: "5 min ago",
    },
    {
      id: 3,
      patient: "Mma Lesego",
      message:
        language === "en"
          ? "Reminder: Blood test tomorrow at 8:00 AM"
          : "Segopotso: Tlhatlhobo ya madi kamoso ka 8:00 AM",
      status: "sent",
      time: "15 min ago",
    },
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
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Stock Alerts</p>
                  <p className="text-2xl font-bold text-red-600">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Patients</p>
                  <p className="text-2xl font-bold text-green-600">89</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">SMS Sent Today</p>
                  <p className="text-2xl font-bold text-purple-600">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments">{t.appointments}</TabsTrigger>
            <TabsTrigger value="stock">{t.stock}</TabsTrigger>
            <TabsTrigger value="patients">{t.patients}</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="sms">{t.sms}</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.todayAppointments}</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t.newAppointment}
              </Button>
            </div>

            <div className="grid gap-4">
              {todayAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{appointment.time}</div>
                          <div className="text-xs text-gray-500">{appointment.location}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{appointment.patient}</h3>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-sm text-gray-500">{appointment.doctor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status === "confirmed"
                            ? language === "en"
                              ? "Confirmed"
                              : "E netefatsitswe"
                            : language === "en"
                              ? "Pending"
                              : "E emetse"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.stockLevels}</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Scan className="h-4 w-4 mr-2" />
                  {t.scanBarcode}
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Package className="h-4 w-4 mr-2" />
                  {t.reorderMedicine}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {stockData.map((item, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    item.status === "critical"
                      ? "border-red-500"
                      : item.status === "low"
                        ? "border-orange-500"
                        : "border-green-500"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{item.medicine}</h3>
                        <p className="text-sm text-gray-600">
                          {language === "en" ? "Last ordered:" : "Ya bofelo e odarilwe:"} {item.lastOrdered}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-bold ${
                              item.status === "critical"
                                ? "text-red-600"
                                : item.status === "low"
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            {item.current}
                          </span>
                          <span className="text-gray-500">/ {item.minimum}</span>
                        </div>
                        <Badge
                          variant={
                            item.status === "critical" ? "destructive" : item.status === "low" ? "secondary" : "default"
                          }
                        >
                          {item.status === "critical"
                            ? language === "en"
                              ? "Critical"
                              : "Botlhokwa"
                            : item.status === "low"
                              ? language === "en"
                                ? "Low"
                                : "Kwa tlase"
                              : language === "en"
                                ? "Good"
                                : "Siame"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.patientRecords}</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder={t.searchPatients} className="pl-10 w-64" />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "New Patient" : "Molwetse o Moša"}
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {language === "en" ? "Recent Patients" : "Balwetse ba Bosheng"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Mma Boitumelo", id: "BW123456", lastVisit: "2024-01-10", condition: "Hypertension" },
                      { name: "Rra Kagiso", id: "BW789012", lastVisit: "2024-01-09", condition: "Diabetes" },
                      { name: "Mma Naledi", id: "BW345678", lastVisit: "2024-01-08", condition: "Pregnancy Check" },
                      { name: "Rra Thabo", id: "BW901234", lastVisit: "2024-01-07", condition: "Chest Pain" },
                    ].map((patient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">
                            {patient.id} • {patient.condition}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{patient.lastVisit}</p>
                          <Button variant="outline" size="sm">
                            {language === "en" ? "View" : "Bona"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t.ruralPatients}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                      <p className="font-medium">
                        {language === "en" ? "CHW Assisted Bookings" : "Dikopano tse di Thusitsweng ke CHW"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "15 appointments booked via Community Health Workers this week"
                          : "Dikopano di le 15 tse di beelwang ka CHW beke eno"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
                      <p className="font-medium">{language === "en" ? "USSD Access" : "Phitlhelelo ya USSD"}</p>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "23 patients accessed services via USSD today"
                          : "Balwetse ba 23 ba dirisitse USSD gompieno"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 border-l-4 border-purple-500">
                      <p className="font-medium">
                        {language === "en" ? "Transport Arranged" : "Dipalangwa di Rulagantse"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "8 rural patients have transport arranged for specialist visits"
                          : "Balwetse ba 8 ba magae ba na le dipalangwa tsa go ya go dingaka"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Medical Equipment Status</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Activity className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>

            <div className="grid gap-4">
              {equipmentStatus.map((item, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    item.status === "operational"
                      ? "border-green-500"
                      : item.status === "maintenance"
                        ? "border-red-500"
                        : "border-orange-500"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{item.equipment}</h3>
                        <p className="text-sm text-gray-600">
                          Uptime: {item.uptime} • Bookings today: {item.bookingsToday}
                        </p>
                        <p className="text-sm text-gray-500">Last maintenance: {item.lastMaintenance}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={item.status === "operational" ? "default" : "destructive"}>
                          {item.status === "operational" ? "Operational" : "Maintenance"}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">Next: {item.nextMaintenance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.smsNotifications}</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                {language === "en" ? "Send SMS" : "Romela SMS"}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Recent SMS Activity" : "Ditiro tsa SMS tsa Bosheng"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {smsQueue.map((sms) => (
                      <div key={sms.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            sms.status === "sent" ? "bg-green-500" : "bg-orange-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{sms.patient}</p>
                          <p className="text-sm text-gray-600">{sms.message}</p>
                          <p className="text-xs text-gray-500">{sms.time}</p>
                        </div>
                        <Badge variant={sms.status === "sent" ? "default" : "secondary"}>
                          {sms.status === "sent"
                            ? language === "en"
                              ? "Sent"
                              : "E rometswe"
                            : language === "en"
                              ? "Pending"
                              : "E emetse"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.ussdAccess}</CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "USSD code: *123*4# for basic health services"
                      : "Khoutu ya USSD: *123*4# ya ditirelo tsa motheo tsa boitekanelo"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-gray-50">
                      <h4 className="font-medium mb-2">
                        {language === "en" ? "USSD Menu Structure" : "Thulaganyo ya Menu ya USSD"}
                      </h4>
                      <div className="text-sm space-y-1 font-mono">
                        <div>1. {language === "en" ? "Check Appointment" : "Tlhola Kopano"}</div>
                        <div>2. {language === "en" ? "Medicine Collection" : "Go Tsaya Dihlare"}</div>
                        <div>3. {language === "en" ? "Emergency Contact" : "Mogala wa Maemo a a Maswe"}</div>
                        <div>4. {language === "en" ? "Health Tips" : "Dikgakololo tsa Boitekanelo"}</div>
                        <div>5. {language === "en" ? "Facility Locations" : "Mafelo a Boitekanelo"}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">156</div>
                        <div className="text-sm text-gray-600">
                          {language === "en" ? "USSD Sessions Today" : "Dithulaganyo tsa USSD Gompieno"}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50">
                        <div className="text-2xl font-bold text-green-600">89%</div>
                        <div className="text-sm text-gray-600">
                          {language === "en" ? "Success Rate" : "Seelo sa Katlego"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
