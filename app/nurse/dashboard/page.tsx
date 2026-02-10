<<<<<<< HEAD
"use client"

import { useEffect, useState } from "react"
import { addPatient, getPatients, addTask } from "@/components/mock-service"
import NurseAvailabilityPanel from "@/app/nurse/components/availability-panel"
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
  ClipboardList,
  Thermometer,
  Droplet,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function NurseDashboardPage() {
  const [name, setName] = useState("")
  const [age, setAge] = useState<number | "">("")
  const [complaint, setComplaint] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getPatients().then(setPatients)
  }, [])

  const onAddPatient = async () => {
    if (!name) return
    setAdding(true)
    const p = await addPatient({ name, age: typeof age === "number" ? age : undefined, complaint })
    setPatients((s) => [p, ...s])
    setName("")
    setAge("")
    setComplaint("")
    setAdding(false)
  }

  const quickSendToPharmacy = async (patient: any, medicine: string) => {
    // Simulate sending a task
    await addTask({ type: "patient_referral", payload: { patientId: patient.id, patientName: patient.name, medicine } })
    alert(`Mock: sent patient ${patient.name} -> pharmacy for "${medicine}"`)
  }

  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const content = {
    en: {
      title: "Nurse Keitumetse Mokgathi",
      subtitle: "Princess Marina Hospital",
      patients: "Patients",
      tasks: "Tasks",
      appointments: "Appointments",
      vitals: "Vitals & Monitoring",
      todaySchedule: "Today's Assignments",
      patientRecords: "Patient Records",
      searchPatients: "Search patients...",
      viewRecord: "View Record",
      complete: "Complete",
      pending: "Pending",
      confirmed: "Confirmed",
      stats: {
        assignedPatients: "Assigned Patients",
        pendingTasks: "Pending Tasks",
        urgentAlerts: "Urgent Alerts",
        medsAdministered: "Meds Administered",
      },
      tasksTab: "Tasks",
      vitalsTab: "Vitals",
    },
    tn: {
      title: "Ngaka ya Bodulo Keitumetse Mokgathi",
      subtitle: "Sepetlele sa Princess Marina",
      patients: "Balwetse",
      tasks: "Ditiro",
      appointments: "Dikopano",
      vitals: "Dipelo le Tlhokomelo",
      todaySchedule: "Tiro tsa Gompieno",
      patientRecords: "Direkoto tsa Balwetse",
      searchPatients: "Batla balwetse...",
      viewRecord: "Bona Rekoto",
      complete: "Feditse",
      pending: "E Emetse",
      confirmed: "E Netefatsitswe",
      stats: {
        assignedPatients: "Balwetse ba Beilweng",
        pendingTasks: "Ditiro tse di Emetsweng",
        urgentAlerts: "Ditlhatlhego tsa Potlako",
        medsAdministered: "Meditshene e Neilweng",
      },
      tasksTab: "Ditiro",
      vitalsTab: "Dipelo",
    },
  }

  const t = content[language]

  // Mock data
  const assignedPatients = [
    {
      id: "BW123456",
      name: "Mma Boitumelo",
      age: 58,
      room: "Ward 3B, Bed 4",
      condition: "Post-op Cardiac",
      nextMed: "10:30 AM – Aspirin",
      vitals: { bp: "128/82", hr: 76, temp: "36.8°C", spo2: "98%" },
      alerts: [],
    },
    {
      id: "BW789012",
      name: "Rra Kagiso",
      age: 62,
      room: "Ward 3B, Bed 2",
      condition: "Heart Failure",
      nextMed: "09:00 AM – Furosemide",
      vitals: { bp: "142/90", hr: 88, temp: "37.1°C", spo2: "94%" },
      alerts: ["High BP", "Low SpO₂"],
    },
    {
      id: "BW345678",
      name: "Mma Naledi",
      age: 35,
      room: "Ward 3A, Bed 1",
      condition: "Post Cath Lab",
      nextMed: "11:00 AM – Clopidogrel",
      vitals: { bp: "118/76", hr: 68, temp: "36.5°C", spo2: "99%" },
      alerts: [],
    },
  ]

  const pendingTasks = [
    { id: 1, patient: "Mma Boitumelo", task: "Morning vitals", due: "08:00", priority: "routine" },
    { id: 2, patient: "Rra Kagiso", task: "IV antibiotic", due: "09:30", priority: "urgent" },
    { id: 3, patient: "Mma Naledi", task: "Wound check", due: "10:15", priority: "routine" },
    { id: 4, patient: "Thabo Mogale", task: "ECG repeat", due: "11:00", priority: "routine" },
  ]

  const todayAppointments = [
    { id: 1, time: "08:30", patient: "Keabetswe Tsheko", room: "Cardiology 201", status: "confirmed" },
    { id: 2, time: "14:00", patient: "Gorata Mmusi", room: "Cath Lab", status: "confirmed" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-800"
      case "urgent": return "bg-red-100 text-red-800"
      case "routine": return "bg-gray-100 text-gray-800"
      default: return "bg-yellow-100 text-yellow-800"
    }
  }

  const getAlertColor = (hasAlert: boolean) => hasAlert ? "text-red-600" : "text-green-600"

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
              <Button variant="outline" size="sm" aria-label={language === "en" ? "Notifications" : "Ditlhatlhego"}>
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" aria-label={language === "en" ? "Settings" : "Ditlhophiso"}>
                <Settings className="h-4 w-4" />
              </Button>
              <Link href="/login">
                <Button variant="outline" size="sm" aria-label={language === "en" ? "Log out" : "Tswalela ka ntle"}>
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
                  <p className="text-sm text-gray-600">{t.stats.assignedPatients}</p>
                  <p className="text-2xl font-bold text-blue-600">{assignedPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.pendingTasks}</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.urgentAlerts}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {assignedPatients.filter(p => p.alerts.length > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.medsAdministered}</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">{t.patients}</TabsTrigger>
            <TabsTrigger value="tasks">{t.tasksTab}</TabsTrigger>
            <TabsTrigger value="appointments">{t.appointments}</TabsTrigger>
            <TabsTrigger value="vitals">{t.vitalsTab}</TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.patientRecords}</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder={t.searchPatients} className="pl-10" />
              </div>
            </div>

            <div className="grid gap-4">
              {assignedPatients.map((patient) => (
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
                          <p className="text-sm text-gray-500">{patient.room}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-1 mb-2">
                          {patient.alerts.map((alert, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {alert}
                            </Badge>
                          ))}
                          {patient.alerts.length === 0 && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                              {language === "en" ? "Stable" : "Siame"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{patient.nextMed}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          {t.viewRecord}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{language === "en" ? "Nursing Tasks" : "Ditiro tsa Ngaka ya Bodulo"}</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {language === "en" ? "New Task" : "Tiro e Ntsha"}
              </Button>
            </div>

            <div className="grid gap-4">
              {pendingTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{task.patient}</h3>
                        <p className="text-sm text-gray-600">{task.task}</p>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "Due:" : "Go tla:"} {task.due}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(task.priority)}>
                          {task.priority === "urgent"
                            ? language === "en" ? "Urgent" : "Potlako"
                            : language === "en" ? "Routine" : "Tlwaelo"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {t.complete}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <h2 className="text-2xl font-bold">{t.todaySchedule}</h2>
            <div className="grid gap-4">
              {todayAppointments.map((appt) => (
                <Card key={appt.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{appt.time}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{appt.patient}</h3>
                          <p className="text-sm text-gray-500">{appt.room}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appt.status)}>
                        {t.confirmed}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-6">
            <h2 className="text-2xl font-bold">{t.vitals}</h2>
            <div className="grid gap-4">
              {assignedPatients.map((patient) => (
                <Card key={patient.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>{patient.room}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <Thermometer className="h-6 w-6 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-600 mt-1">Temp</p>
                        <p className={`text-lg font-bold ${getAlertColor(patient.vitals.temp.includes("37.5") || patient.vitals.temp.includes("38"))}`}>
                          {patient.vitals.temp}
                        </p>
                      </div>
                      <div>
                        <Activity className="h-6 w-6 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-600 mt-1">BP</p>
                        <p className={`text-lg font-bold ${getAlertColor(parseFloat(patient.vitals.bp.split("/")[0]) > 140)}`}>
                          {patient.vitals.bp}
                        </p>
                      </div>
                      <div>
                        <Heart className="h-6 w-6 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-600 mt-1">HR</p>
                        <p className={`text-lg font-bold ${getAlertColor(parseInt(patient.vitals.hr.toString()) > 100 || parseInt(patient.vitals.hr.toString()) < 60)}`}>
                          {patient.vitals.hr} bpm
                        </p>
                      </div>
                      <div>
                        <Monitor className="h-6 w-6 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-600 mt-1">SpO₂</p>
                        <p className={`text-lg font-bold ${getAlertColor(parseInt(patient.vitals.spo2) < 95)}`}>
                          {patient.vitals.spo2}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      {language === "en" ? "Record New Vitals" : "Rekota Dipelo tse Ntsha"}
                    </Button>
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
=======
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { NewPatientRegistrationDialog } from "@/components/new-patient-registration-dialog"
import { WalkInQueue } from "@/components/walk-in-queue"
import { PredictiveAnalytics } from "@/components/predictive-analytics"
import { AddMedicationDialog } from "@/components/add-medication-dialog"
import { PatientRecordsViewer } from "@/components/patient-records-viewer"
import {
  Users,
  Activity,
  Heart,
  Globe,
  Bell,
  Settings,
  LogOut,
  Search,
  Monitor,
  ClipboardList,
  Thermometer,
  Droplet,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function NurseDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const content = {
    en: {
      title: "Nurse Keitumetse Mokgathi",
      subtitle: "Princess Marina Hospital",
      patients: "Patients",
      tasks: "Tasks",
      appointments: "Appointments",
      vitals: "Vitals & Monitoring",
      walkIns: "Walk-In Queue",
      analytics: "Predictive Analytics",
      todaySchedule: "Today's Assignments",
      patientRecords: "Patient Records",
      searchPatients: "Search patients...",
      viewRecord: "View Record",
      complete: "Complete",
      pending: "Pending",
      confirmed: "Confirmed",
      registerPatient: "Register Patient",
      stats: {
        assignedPatients: "Assigned Patients",
        pendingTasks: "Pending Tasks",
        urgentAlerts: "Urgent Alerts",
        medsAdministered: "Meds Administered",
        walkInsToday: "Walk-Ins Today",
        avgWaitTime: "Avg Wait Time",
      },
      tasksTab: "Tasks",
      vitalsTab: "Vitals",
    },
    tn: {
      title: "Ngaka ya Bodulo Keitumetse Mokgathi",
      subtitle: "Sepetlele sa Princess Marina",
      patients: "Balwetse",
      tasks: "Ditiro",
      appointments: "Dikopano",
      vitals: "Dipelo le Tlhokomelo",
      walkIns: "Mola wa Baeti",
      analytics: "Tshekatsheko ya Bokamoso",
      todaySchedule: "Tiro tsa Gompieno",
      patientRecords: "Direkoto tsa Balwetse",
      searchPatients: "Batla balwetse...",
      viewRecord: "Bona Rekoto",
      complete: "Feditse",
      pending: "E Emetse",
      confirmed: "E Netefatsitswe",
      registerPatient: "Kwadisa Molwetse",
      stats: {
        assignedPatients: "Balwetse ba Beilweng",
        pendingTasks: "Ditiro tse di Emetsweng",
        urgentAlerts: "Ditlhatlhego tsa Potlako",
        medsAdministered: "Meditshene e Neilweng",
        walkInsToday: "Baeti ba Gompieno",
        avgWaitTime: "Nako ya Emetse",
      },
      tasksTab: "Ditiro",
      vitalsTab: "Dipelo",
    },
  }

  const t = content[language]

  // Mock data
  const assignedPatients = [
    {
      id: "BW123456",
      name: "Mma Boitumelo",
      age: 58,
      room: "Ward 3B, Bed 4",
      condition: "Post-op Cardiac",
      nextMed: "10:30 AM – Aspirin",
      vitals: { bp: "128/82", hr: 76, temp: "36.8°C", spo2: "98%" },
      alerts: [],
    },
    {
      id: "BW789012",
      name: "Rra Kagiso",
      age: 62,
      room: "Ward 3B, Bed 2",
      condition: "Heart Failure",
      nextMed: "09:00 AM – Furosemide",
      vitals: { bp: "142/90", hr: 88, temp: "37.1°C", spo2: "94%" },
      alerts: ["High BP", "Low SpO₂"],
    },
    {
      id: "BW345678",
      name: "Mma Naledi",
      age: 35,
      room: "Ward 3A, Bed 1",
      condition: "Post Cath Lab",
      nextMed: "11:00 AM – Clopidogrel",
      vitals: { bp: "118/76", hr: 68, temp: "36.5°C", spo2: "99%" },
      alerts: [],
    },
  ]

  const pendingTasks = [
    { id: 1, patient: "Mma Boitumelo", task: "Morning vitals", due: "08:00", priority: "routine" },
    { id: 2, patient: "Rra Kagiso", task: "IV antibiotic", due: "09:30", priority: "urgent" },
    { id: 3, patient: "Mma Naledi", task: "Wound check", due: "10:15", priority: "routine" },
    { id: 4, patient: "Thabo Mogale", task: "ECG repeat", due: "11:00", priority: "routine" },
  ]

  const todayAppointments = [
    { id: 1, time: "08:30", patient: "Keabetswe Tsheko", room: "Cardiology 201", status: "confirmed" },
    { id: 2, time: "14:00", patient: "Gorata Mmusi", room: "Cath Lab", status: "confirmed" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      case "routine":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getAlertColor = (hasAlert: boolean) => (hasAlert ? "text-red-600" : "text-green-600")

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
              <Button variant="outline" size="sm" aria-label={language === "en" ? "Notifications" : "Ditlhatlhego"}>
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" aria-label={language === "en" ? "Settings" : "Ditlhophiso"}>
                <Settings className="h-4 w-4" />
              </Button>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" aria-label={language === "en" ? "Log out" : "Tswalela ka ntle"}>
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
                  <p className="text-sm text-gray-600">{t.stats.assignedPatients}</p>
                  <p className="text-2xl font-bold text-blue-600">{assignedPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.pendingTasks}</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.urgentAlerts}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {assignedPatients.filter((p) => p.alerts.length > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.medsAdministered}</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.walkInsToday}</p>
                  <p className="text-2xl font-bold text-green-600">47</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.avgWaitTime}</p>
                  <p className="text-2xl font-bold text-indigo-600">18 min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="patients">{t.patients}</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="walk-ins">{t.walkIns}</TabsTrigger>
            <TabsTrigger value="tasks">{t.tasksTab}</TabsTrigger>
            <TabsTrigger value="appointments">{t.appointments}</TabsTrigger>
            <TabsTrigger value="vitals">{t.vitalsTab}</TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t.analytics}
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.patientRecords}</h2>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder={t.searchPatients} className="pl-10" />
                </div>
                <NewPatientRegistrationDialog />
              </div>
            </div>

            <div className="grid gap-4">
              {assignedPatients.map((patient) => (
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
                          <p className="text-sm text-gray-500">{patient.room}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-1 mb-2">
                          {patient.alerts.map((alert, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {alert}
                            </Badge>
                          ))}
                          {patient.alerts.length === 0 && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                              {language === "en" ? "Stable" : "Siame"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{patient.nextMed}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            {t.viewRecord}
                          </Button>
                          <AddMedicationDialog />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <PatientRecordsViewer />
          </TabsContent>

          {/* Walk-Ins Tab */}
          <TabsContent value="walk-ins" className="space-y-6">
            <WalkInQueue />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {language === "en" ? "Nursing Tasks" : "Ditiro tsa Ngaka ya Bodulo"}
              </h2>
            </div>

            <div className="grid gap-4">
              {pendingTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{task.patient}</h3>
                        <p className="text-sm text-gray-600">{task.task}</p>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "Due:" : "Go tla:"} {task.due}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(task.priority)}>
                          {task.priority === "urgent"
                            ? language === "en"
                              ? "Urgent"
                              : "Potlako"
                            : language === "en"
                              ? "Routine"
                              : "Tlwaelo"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {t.complete}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <h2 className="text-2xl font-bold">{t.todaySchedule}</h2>
            <div className="grid gap-4">
              {todayAppointments.map((appt) => (
                <Card key={appt.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{appt.time}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{appt.patient}</h3>
                          <p className="text-sm text-gray-500">{appt.room}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appt.status)}>{t.confirmed}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-6">
            <h2 className="text-2xl font-bold">{t.vitals}</h2>
            <div className="grid gap-4">
              {assignedPatients.map((patient) => (
                <Card key={patient.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>{patient.room}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <Thermometer className="h-6 w-6 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-600 mt-1">Temp</p>
                        <p
                          className={`text-lg font-bold ${getAlertColor(patient.vitals.temp.includes("37.5") || patient.vitals.temp.includes("38"))}`}
                        >
                          {patient.vitals.temp}
                        </p>
                      </div>
                      <div>
                        <Activity className="h-6 w-6 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-600 mt-1">BP</p>
                        <p
                          className={`text-lg font-bold ${getAlertColor(Number.parseFloat(patient.vitals.bp.split("/")[0]) > 140)}`}
                        >
                          {patient.vitals.bp}
                        </p>
                      </div>
                      <div>
                        <Heart className="h-6 w-6 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-600 mt-1">HR</p>
                        <p
                          className={`text-lg font-bold ${getAlertColor(Number.parseInt(patient.vitals.hr.toString()) > 100 || Number.parseInt(patient.vitals.hr.toString()) < 60)}`}
                        >
                          {patient.vitals.hr} bpm
                        </p>
                      </div>
                      <div>
                        <Monitor className="h-6 w-6 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-600 mt-1">SpO₂</p>
                        <p className={`text-lg font-bold ${getAlertColor(Number.parseInt(patient.vitals.spo2) < 95)}`}>
                          {patient.vitals.spo2}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent">
                      {language === "en" ? "Record New Vitals" : "Rekota Dipelo tse Ntsha"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Predictive Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <PredictiveAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
>>>>>>> 3dfe3720b6ac835c6c563c2622e2bbbe02a07cd9
