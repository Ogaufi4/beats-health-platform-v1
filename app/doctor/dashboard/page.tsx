"use client"

import { useState, useEffect } from "react"
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
  Plus,
  Clock,
  FileText,
  Stethoscope,
  Monitor,
  Camera,
  Microscope,
  CheckCircle,
  UserPlus,
} from "lucide-react"
import BeatsLogo from "@/components/BeatsLogo"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DoctorDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [selectedDate, setSelectedDate] = useState("2024-01-11")
  const [selectedTown, setSelectedTown] = useState("all")

  // Modal States
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)

  const walkInQueue = [
    {
      id: "WI001",
      queueNumber: 12,
      patientName: "Thato Moeti",
      age: 34,
      priority: "urgent",
      department: "Cardiology",
      chiefComplaint: "Chest pain, shortness of breath",
      triageTime: "08:45 AM",
      estimatedWait: "15 min",
      status: "waiting",
    },
    {
      id: "WI002",
      queueNumber: 13,
      patientName: "Lesego Kgosi",
      age: 56,
      priority: "routine",
      department: "Cardiology",
      chiefComplaint: "Follow-up for hypertension",
      triageTime: "09:10 AM",
      estimatedWait: "30 min",
      status: "waiting",
    },
    {
      id: "WI003",
      queueNumber: 14,
      patientName: "Mpho Setlhare",
      age: 42,
      priority: "emergency",
      department: "Cardiology",
      chiefComplaint: "Severe chest pain, suspected MI",
      triageTime: "09:25 AM",
      estimatedWait: "Immediate",
      status: "in-progress",
    },
  ]

  const content = {
    en: {
      title: "Dr. Sarah Molefe - Cardiologist",
      subtitle: "Sedilega Private Hospital",
      appointments: "Appointments",
      patients: "Patients",
      equipment: "Medical Equipment",
      referrals: "Referrals",
      results: "Lab Results",
      walkInQueue: "Walk-In Queue",
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
      callPatient: "Call Patient",
      markComplete: "Mark Complete",
      emergency: "Emergency",
      urgent: "Urgent",
      routine: "Routine",
      waiting: "Waiting",
      inProgress: "In Progress",
      stats: {
        todayPatients: "Today's Patients",
        pendingResults: "Pending Results",
        equipmentBooked: "Equipment Booked",
        referralsSent: "Referrals Sent",
        walkInsToday: "Walk-Ins Today",
        avgWaitTime: "Avg Wait Time",
      },
      success: {
        appointment: "Appointment Booked Successfully!",
        equipment: "Equipment Booked Successfully!",
        referral: "Referral Sent Successfully!",
        description: "Your request has been successfully processed.",
        closeModal: "Close",
        viewDetails: "View Details",
      },
    },
    tn: {
      title: "Dr. Sarah Molefe - Modiri wa Dipelo",
      subtitle: "Sepetlele sa Sedilega",
      appointments: "Dikopano",
      patients: "Balwetse",
      equipment: "Didirisiwa tsa Bongaka",
      referrals: "Go Romela",
      results: "Diphetho tsa Tlhatlhobo",
      walkInQueue: "Mola wa Baeti",
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
      callPatient: "Bitsa Molwetse",
      markComplete: "Tshwaya e Fedile",
      emergency: "Potlako Thata",
      urgent: "Potlako",
      routine: "Tlwaelo",
      waiting: "E Emetse",
      inProgress: "E Tsweletse",
      stats: {
        todayPatients: "Balwetse ba Gompieno",
        pendingResults: "Diphetho tse di Emetsweng",
        equipmentBooked: "Didirisiwa tse di Beelweng",
        referralsSent: "Go Romela go Dirweng",
        walkInsToday: "Baeti ba Gompieno",
        avgWaitTime: "Nako ya Emetse",
      },
      success: {
        appointment: "Kopano e Beelitswe ka Botlhokwa!",
        equipment: "Sedirisiwa se Beelitswe ka Botlhokwa!",
        referral: "Go Romela e Dirilwe ka Botlhokwa!",
        description: "Kopo ya gago e neilwe ka botlhokwa.",
        closeModal: "Fihla",
        viewDetails: "Bona Dintlha",
      },
    },
  }

  const [displayFacility, setDisplayFacility] = useState({ en: content.en.subtitle, tn: content.tn.subtitle })

  useEffect(() => {
    const savedEn = localStorage.getItem("userFacilityNameEn")
    const savedTn = localStorage.getItem("userFacilityNameTn")
    if (savedEn && savedTn) {
      setDisplayFacility({ en: savedEn, tn: savedTn })
    }
  }, [])

  const t = {
    ...content[language],
    subtitle: language === "en" ? displayFacility.en : displayFacility.tn
  }

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

  const medicalEquipment = [
    {
      id: 1,
      name: "ECG Machine",
      type: "Diagnostic",
      town: "Gaborone",
      clinic: "Princess Marina Hospital",
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
      icon: <Clock className="h-4 w-4" />,
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
  ]

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
  const availableTowns = Array.from(new Set(medicalEquipment.map((eq) => eq.town)))

  // Filter by selected town
  const filteredEquipment =
    selectedTown === "all" ? medicalEquipment : medicalEquipment.filter((eq) => eq.town === selectedTown)

  // Group by town
  const filteredEquipmentByTown = Array.from(
    filteredEquipment.reduce((acc, eq) => {
      if (!acc.has(eq.town)) acc.set(eq.town, [])
      acc.get(eq.town)!.push(eq)
      return acc
    }, new Map<string, typeof medicalEquipment>()),
  ).sort((a, b) => a[0].localeCompare(b[0]))

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
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "routine":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-progress":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Handle Actions → Open Modals
  const handleBookAppointment = () => {
    setIsAppointmentModalOpen(true)
  }

  const handleBookEquipment = () => {
    setIsEquipmentModalOpen(true)
  }

  const handleCreateReferral = () => {
    setIsReferralModalOpen(true)
  }

  const handleCallPatient = (patientId: string) => {
    console.log("[v0] Calling patient:", patientId)
    // In real implementation, this would update the patient status and send SMS
  }

  const handleMarkComplete = (patientId: string) => {
    console.log("[v0] Marking patient complete:", patientId)
    // In real implementation, this would update the patient status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BeatsLogo size={52} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.title}</h1>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" />
                  {t.subtitle}
                </p>
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
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

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.walkInsToday}</p>
                  <p className="text-2xl font-bold text-indigo-600">{walkInQueue.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.avgWaitTime}</p>
                  <p className="text-2xl font-bold text-teal-600">22 min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments">{t.appointments}</TabsTrigger>
            <TabsTrigger value="walk-ins">{t.walkInQueue}</TabsTrigger>
            <TabsTrigger value="equipment">{t.equipment}</TabsTrigger>
            <TabsTrigger value="referrals">{t.referrals}</TabsTrigger>
            <TabsTrigger value="results">{t.results}</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.todaySchedule}</h2>
              <div className="flex gap-2">
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleBookAppointment}>
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

          <TabsContent value="walk-ins" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.walkInQueue}</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-sm">
                  {language === "en" ? "Real-time Queue" : "Mola wa Nako ya Nnete"}
                </Badge>
              </div>
            </div>

            {/* Queue Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Total in Queue" : "Kakaretso mo Moleng"}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">{walkInQueue.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{language === "en" ? "Emergency" : "Potlako Thata"}</p>
                    <p className="text-3xl font-bold text-red-600">
                      {walkInQueue.filter((p) => p.priority === "emergency").length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{language === "en" ? "Urgent" : "Potlako"}</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {walkInQueue.filter((p) => p.priority === "urgent").length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{language === "en" ? "Avg Wait" : "Nako ya Emetse"}</p>
                    <p className="text-3xl font-bold text-green-600">22 min</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Walk-in Queue List */}
            <div className="grid gap-4">
              {walkInQueue.map((patient) => (
                <Card key={patient.id} className={patient.priority === "emergency" ? "border-red-500 border-2" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">#{patient.queueNumber}</div>
                          <div className="text-xs text-gray-500">{patient.triageTime}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{patient.patientName}</h3>
                          <p className="text-sm text-gray-600">
                            {language === "en" ? "Age" : "Dingwaga"}: {patient.age} • {patient.department}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>{language === "en" ? "Chief Complaint:" : "Bothata:"}</strong>{" "}
                            {patient.chiefComplaint}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {language === "en" ? "Est. Wait:" : "Nako ya Emetse:"} {patient.estimatedWait}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(patient.priority)}>
                            {patient.priority === "emergency"
                              ? t.emergency
                              : patient.priority === "urgent"
                                ? t.urgent
                                : t.routine}
                          </Badge>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status === "waiting" ? t.waiting : t.inProgress}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleCallPatient(patient.id)}
                          >
                            {t.callPatient}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleMarkComplete(patient.id)}>
                            {t.markComplete}
                          </Button>
                        </div>
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

                <Button className="bg-green-600 hover:bg-green-700" onClick={handleBookEquipment}>
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
                            onClick={handleBookEquipment}
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
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleCreateReferral}>
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

      {/* ✅ Appointment Success Modal */}
      <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              {t.success.appointment}
            </DialogTitle>
            <DialogDescription>{t.success.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "Your appointment has been successfully booked."
                : "Kopano ya gago e beelitswe ka botlhokwa."}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAppointmentModalOpen(false)}>
              {t.success.closeModal}
            </Button>
            <Button
              onClick={() => {
                setIsAppointmentModalOpen(false)
                // Optional: navigate to appointment details
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t.success.viewDetails}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Equipment Booking Success Modal */}
      <Dialog open={isEquipmentModalOpen} onOpenChange={setIsEquipmentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              {t.success.equipment}
            </DialogTitle>
            <DialogDescription>{t.success.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "The equipment has been successfully booked for you."
                : "Sedirisiwa se beelitswe ka botlhokwa mo go gago."}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEquipmentModalOpen(false)}>
              {t.success.closeModal}
            </Button>
            <Button
              onClick={() => {
                setIsEquipmentModalOpen(false)
                // Optional: navigate to equipment booking history
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t.success.viewDetails}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Referral Success Modal */}
      <Dialog open={isReferralModalOpen} onOpenChange={setIsReferralModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              {t.success.referral}
            </DialogTitle>
            <DialogDescription>{t.success.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "Your referral has been successfully sent to the specialist."
                : "Go romela ga gago e dirilwe ka botlhokwa moongwing."}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReferralModalOpen(false)}>
              {t.success.closeModal}
            </Button>
            <Button
              onClick={() => {
                setIsReferralModalOpen(false)
                // Optional: navigate to referral history
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t.success.viewDetails}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
