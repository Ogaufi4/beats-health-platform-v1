"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  Activity,
  Heart,
  Globe,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  Clock,
  FileText,
  Stethoscope,
  Monitor,
  Camera,
  Zap,
  Brain,
  Eye,
  Microscope,
} from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [selectedDate, setSelectedDate] = useState("2024-01-11")
  const [selectedTown, setSelectedTown] = useState("all");

  const content = {
    en: {
      title: "Dr. Sarah Molefe - Cardiologist",
      subtitle: "Princess Marina Hospital",
      appointments: "Appointments",
      patients: "Patients",
      equipment: "Medical Equipment",
      referrals: "Referrals",
      results: "Lab Results",
      todaySchedule: "Today's Schedule",
      upcomingAppointments: "Upcoming Appointments",
      patientRecords: "Patient Records",
      equipmentBooking: "Equipment Booking",
      availableEquipment: "Available Equipment",
      bookEquipment: "Book Equipment",
      newReferral: "New Referral",
      viewResults: "View Results",
      searchPatients: "Search patients...",
      bookAppointment: "Book Appointment",
      viewRecord: "View Record",
      reschedule: "Reschedule",
      complete: "Complete",
      pending: "Pending",
      confirmed: "Confirmed",
      stats: {
        todayPatients: "Today's Patients",
        pendingResults: "Pending Results",
        equipmentBooked: "Equipment Booked",
        referralsSent: "Referrals Sent",
      },
    },
    tn: {
      title: "Dr. Sarah Molefe - Ngaka ya Pelo",
      subtitle: "Sepetlele sa Princess Marina",
      appointments: "Dikopano",
      patients: "Balwetse",
      equipment: "Didirisiwa tsa Bongaka",
      referrals: "Go Romela",
      results: "Diphetho tsa Tlhatlhobo",
      todaySchedule: "Lenaneo la Gompieno",
      upcomingAppointments: "Dikopano tse di Tlang",
      patientRecords: "Direkoto tsa Balwetse",
      equipmentBooking: "Go Beela Didirisiwa",
      availableEquipment: "Didirisiwa tse di Teng",
      bookEquipment: "Beela Sedirisiwa",
      newReferral: "Go Romela go Goša",
      viewResults: "Bona Diphetho",
      searchPatients: "Batla balwetse...",
      bookAppointment: "Beela Kopano",
      viewRecord: "Bona Rekoto",
      reschedule: "Rulaganya Gape",
      complete: "Feditse",
      pending: "E Emetse",
      confirmed: "E Netefatsitswe",
      stats: {
        todayPatients: "Balwetse ba Gompieno",
        pendingResults: "Diphetho tse di Emetsweng",
        equipmentBooked: "Didirisiwa tse di Beelweng",
        referralsSent: "Go Romela go Dirweng",
      },
    },
  }

  const t = content[language]

  const todayAppointments = [
    {
      id: 1,
      time: "08:00",
      patient: "Thabo Mogale",
      age: 45,
      condition: "Hypertension Follow-up",
      type: "consultation",
      status: "confirmed",
      duration: 30,
      room: "Cardiology 201",
    },
    {
      id: 2,
      time: "09:00",
      patient: "Keabetswe Tsheko",
      age: 38,
      condition: "Chest Pain Assessment",
      type: "consultation",
      status: "confirmed",
      duration: 45,
      room: "Cardiology 201",
    },
    {
      id: 3,
      time: "10:30",
      patient: "Mpho Setlhare",
      age: 52,
      condition: "ECG Interpretation",
      type: "procedure",
      status: "pending",
      duration: 30,
      room: "ECG Room 1",
    },
    {
      id: 4,
      time: "14:00",
      patient: "Gorata Mmusi",
      age: 41,
      condition: "Cardiac Catheterization",
      type: "procedure",
      status: "confirmed",
      duration: 120,
      room: "Cath Lab",
    },
  ]

  const recentPatients = [
    {
      id: "BW123456",
      name: "Mma Boitumelo",
      age: 58,
      lastVisit: "2024-01-10",
      condition: "Atrial Fibrillation",
      nextAppointment: "2024-01-18",
      status: "stable",
    },
    {
      id: "BW789012",
      name: "Rra Kagiso",
      age: 62,
      lastVisit: "2024-01-09",
      condition: "Heart Failure",
      nextAppointment: "2024-01-16",
      status: "monitoring",
    },
    {
      id: "BW345678",
      name: "Mma Naledi",
      age: 35,
      lastVisit: "2024-01-08",
      condition: "Mitral Valve Prolapse",
      nextAppointment: "2024-01-22",
      status: "stable",
    },
  ]

  const medicalEquipment = [
  {
    id: 1,
    name: "ECG Machine",
    type: "Diagnostic",
    town: "Gaborone", // 👈 new
    clinic: "Princess Marina Hospital", // 👈 new
    status: "available",
    nextAvailable: "Now",
    bookedSlots: 3,
    icon: <Activity className="h-6 w-6" />,
    description: "12-lead electrocardiogram",
  },
  {
    id: 2,
    name: "Echocardiogram",
    type: "Imaging",
    town: "Gaborone",
    clinic: "Princess Marina Hospital",
    status: "busy",
    nextAvailable: "11:30 AM",
    bookedSlots: 8,
    icon: <Heart className="h-6 w-6" />,
    description: "Cardiac ultrasound imaging",
  },
  {
    id: 3,
    name: "Stress Test Machine",
    type: "Diagnostic",
    town: "Francistown",
    clinic: "Nyanga Clinic",
    status: "available",
    nextAvailable: "Now",
    bookedSlots: 2,
    icon: <Monitor className="h-6 w-6" />,
    description: "Exercise stress testing",
  },
  {
    id: 4,
    name: "Holter Monitor",
    type: "Monitoring",
    town: "Gaborone",
    clinic: "Equipment Room",
    status: "available",
    nextAvailable: "Now",
    bookedSlots: 1,
    icon: <Clock className="h-6 w-6" />,
    description: "24-hour cardiac monitoring",
  },
  {
    id: 5,
    name: "CT Scanner",
    type: "Imaging",
    town: "Maun",
    clinic: "Maun General Hospital",
    status: "maintenance",
    nextAvailable: "2:00 PM",
    bookedSlots: 12,
    icon: <Camera className="h-6 w-6" />,
    description: "Computed tomography",
  },
  // ... add more as needed
];

  const pendingResults = [
    {
      id: 1,
      patient: "Thabo Mogale",
      test: "Cardiac Enzymes",
      orderedDate: "2024-01-09",
      expectedDate: "2024-01-11",
      status: "processing",
      priority: "routine",
    },
    {
      id: 2,
      patient: "Keabetswe Tsheko",
      test: "Echocardiogram",
      orderedDate: "2024-01-08",
      expectedDate: "2024-01-10",
      status: "ready",
      priority: "urgent",
    },
    {
      id: 3,
      patient: "Mpho Setlhare",
      test: "Stress Test",
      orderedDate: "2024-01-10",
      expectedDate: "2024-01-12",
      status: "scheduled",
      priority: "routine",
    },
  ]

  const recentReferrals = [
    {
      id: 1,
      patient: "Gorata Mmusi",
      referredTo: "Dr. James Kgathi - Cardiac Surgeon",
      reason: "Valve replacement consultation",
      date: "2024-01-10",
      status: "pending",
      facility: "Princess Marina Hospital",
    },
    {
      id: 2,
      patient: "Mma Boitumelo",
      referredTo: "Dr. Peter Sebego - Electrophysiologist",
      reason: "Arrhythmia management",
      date: "2024-01-09",
      status: "accepted",
      facility: "Nyangabgwe Hospital",
    },
  ]
  // Get unique towns
const availableTowns = Array.from(new Set(medicalEquipment.map(eq => eq.town)));

// Filter by selected town
const filteredEquipment = selectedTown === "all"
  ? medicalEquipment
  : medicalEquipment.filter(eq => eq.town === selectedTown);

// Group by town
const filteredEquipmentByTown = Array.from(
  filteredEquipment.reduce((acc, eq) => {
    if (!acc.has(eq.town)) acc.set(eq.town, []);
    acc.get(eq.town)!.push(eq);
    return acc;
  }, new Map<string, typeof medicalEquipment>())
).sort((a, b) => a[0].localeCompare(b[0])); // Sort towns alphabetically

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "busy":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "maintenance":
        return "bg-red-100 text-red-800 border-red-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
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
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.todayPatients}</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.pendingResults}</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.equipmentBooked}</p>
                  <p className="text-2xl font-bold text-green-600">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.referralsSent}</p>
                  <p className="text-2xl font-bold text-purple-600">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments">{t.appointments}</TabsTrigger>
            <TabsTrigger value="patients">{t.patients}</TabsTrigger>
            <TabsTrigger value="equipment">{t.equipment}</TabsTrigger>
            <TabsTrigger value="referrals">{t.referrals}</TabsTrigger>
            <TabsTrigger value="results">{t.results}</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.todaySchedule}</h2>
              <div className="flex gap-2">
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.bookAppointment}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {todayAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{appointment.time}</div>
                          <div className="text-xs text-gray-500">{appointment.duration} min</div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{appointment.patient}</h3>
                          <p className="text-sm text-gray-600">
                            {language === "en" ? "Age" : "Dingwaga"}: {appointment.age} • {appointment.condition}
                          </p>
                          <p className="text-sm text-gray-500">{appointment.room}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status === "confirmed" ? t.confirmed : t.pending}
                        </Badge>
                        <Badge variant="outline">
                          {appointment.type === "consultation"
                            ? language === "en"
                              ? "Consultation"
                              : "Puisano"
                            : language === "en"
                              ? "Procedure"
                              : "Tiro"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {t.viewRecord}
                        </Button>
                        <Button variant="outline" size="sm">
                          {t.reschedule}
                        </Button>
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

            <div className="grid gap-4">
              {recentPatients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-gray-600">
                            {patient.id} • {language === "en" ? "Age" : "Dingwaga"}: {patient.age}
                          </p>
                          <p className="text-sm text-gray-600">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              patient.status === "stable"
                                ? "default"
                                : patient.status === "monitoring"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {patient.status === "stable"
                              ? language === "en"
                                ? "Stable"
                                : "Siame"
                              : language === "en"
                                ? "Monitoring"
                                : "Tlhokomelo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "Last visit:" : "Etela ya bofelo:"} {patient.lastVisit}
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "Next:" : "E latelang:"} {patient.nextAppointment}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          {t.viewRecord}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold">{t.equipmentBooking}</h2>
    <div className="flex gap-2">
      {/* Town/Region Filter */}
      <select
        value={selectedTown}
        onChange={(e) => setSelectedTown(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">{language === "en" ? "All Towns" : "Metse ohle"}</option>
        {availableTowns.map((town) => (
          <option key={town} value={town}>
            {town}
          </option>
        ))}
      </select>

      <Button className="bg-green-600 hover:bg-green-700">
        <Plus className="h-4 w-4 mr-2" />
        {t.bookEquipment}
      </Button>
    </div>
  </div>

  {/* Group equipment by town */}
  {filteredEquipmentByTown.map(([town, equipmentList]) => (
    <div key={town} className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        {language === "en" ? "Location:" : "Lefelo:"} {town}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentList.map((equipment) => (
          <Card key={equipment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">{equipment.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                    <CardDescription>{equipment.type}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(equipment.status)}>
                  {equipment.status === "available"
                    ? language === "en"
                      ? "Available"
                      : "E teng"
                    : equipment.status === "busy"
                    ? language === "en"
                      ? "Busy"
                      : "E dirisiwa"
                    : language === "en"
                    ? "Maintenance"
                    : "Tokafatso"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-600">{equipment.description}</p>
                  <p className="text-gray-600 mt-1">
                    <strong>{language === "en" ? "Clinic:" : "Sepetlele:"}</strong> {equipment.clinic}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {language === "en" ? "Next available:" : "E tla nna teng:"}
                  </span>
                  <span className="font-medium">{equipment.nextAvailable}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {language === "en" ? "Booked today:" : "E beelitswe gompieno:"}
                  </span>
                  <span className="font-medium">{equipment.bookedSlots}</span>
                </div>
                <Button
                  className="w-full"
                  variant={equipment.status === "available" ? "default" : "outline"}
                  disabled={equipment.status === "maintenance"}
                >
                  {equipment.status === "available"
                    ? language === "en"
                      ? "Book Now"
                      : "Beela Jaanong"
                    : equipment.status === "busy"
                    ? language === "en"
                      ? "Schedule Later"
                      : "Rulaganya Morago"
                    : language === "en"
                    ? "Under Maintenance"
                    : "Mo Tokafatsong"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ))}
</TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{language === "en" ? "Patient Referrals" : "Go Romela Balwetse"}</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                {t.newReferral}
              </Button>
            </div>

            <div className="grid gap-4">
              {recentReferrals.map((referral) => (
                <Card key={referral.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{referral.patient}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === "en" ? "Referred to:" : "E rometswe go:"} {referral.referredTo}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === "en" ? "Reason:" : "Lebaka:"} {referral.reason}
                        </p>
                        <p className="text-sm text-gray-500">
                          {referral.facility} • {referral.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            referral.status === "accepted"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {referral.status === "accepted"
                            ? language === "en"
                              ? "Accepted"
                              : "E amogetse"
                            : language === "en"
                              ? "Pending"
                              : "E emetse"}
                        </Badge>
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            {language === "en" ? "Follow Up" : "Latela"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {language === "en" ? "Laboratory & Imaging Results" : "Diphetho tsa Lab le Ditshwantsho"}
              </h2>
              <Button variant="outline">
                <Microscope className="h-4 w-4 mr-2" />
                {language === "en" ? "Order Tests" : "Odara Ditlhatlhobo"}
              </Button>
            </div>

            <div className="grid gap-4">
              {pendingResults.map((result) => (
                <Card key={result.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{result.patient}</h3>
                        <p className="text-sm text-gray-600 mb-1">{result.test}</p>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "Ordered:" : "E odarilwe:"} {result.orderedDate} •{" "}
                          {language === "en" ? "Expected:" : "E solofetswe:"} {result.expectedDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(result.status)}>
                            {result.status === "ready"
                              ? language === "en"
                                ? "Ready"
                                : "E siametse"
                              : result.status === "processing"
                                ? language === "en"
                                  ? "Processing"
                                  : "E sekasekwa"
                                : language === "en"
                                  ? "Scheduled"
                                  : "E rulagantse"}
                          </Badge>
                          <Badge
                            variant={result.priority === "urgent" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {result.priority === "urgent"
                              ? language === "en"
                                ? "Urgent"
                                : "Potlako"
                              : language === "en"
                                ? "Routine"
                                : "Tlwaelo"}
                          </Badge>
                        </div>
                        <Button
                          variant={result.status === "ready" ? "default" : "outline"}
                          size="sm"
                          disabled={result.status !== "ready"}
                        >
                          {result.status === "ready" ? t.viewResults : language === "en" ? "Pending" : "E emetse"}
                        </Button>
                      </div>
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
