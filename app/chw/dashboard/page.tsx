"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Users,
  MapPin,
  Phone,
  Globe,
  Bell,
  Settings,
  LogOut,
  Plus,
  Activity,
  FileText,
  Home,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react"
import BeatsLogo from "@/components/BeatsLogo"
import Link from "next/link"

export default function CHWDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [showHomeVisitForm, setShowHomeVisitForm] = useState(false)

  const content = {
    en: {
      title: "Community Health Worker",
      subtitle: "Molepolole Village",
      homeVisits: "Home Visits",
      preRegistration: "Pre-Registration",
      referrals: "Referrals",
      healthEducation: "Health Education",
      myPatients: "My Patients",
      todayVisits: "Today's Home Visits",
      scheduledVisits: "Scheduled Visits",
      completedVisits: "Completed Visits",
      pendingReferrals: "Pending Referrals",
      preRegisterPatient: "Pre-Register for Hospital",
      newHomeVisit: "New Home Visit",
      viewPatient: "View Patient",
      newReferral: "New Referral",
      urgent: "Urgent",
      routine: "Routine",
      completed: "Completed",
      scheduleVisit: "Schedule Visit",
      stats: {
        todayVisits: "Today's Visits",
        activePatients: "Active Patients",
        pendingReferrals: "Pending Referrals",
        healthScreenings: "Health Screenings",
      },
    },
    tn: {
      title: "Modiri wa Boitekanelo wa Setshaba",
      subtitle: "Motse wa Molepolole",
      homeVisits: "Ditetelo tsa Gae",
      preRegistration: "Kwadiso ya Pele",
      referrals: "Ditshupiso",
      healthEducation: "Thuto ya Boitekanelo",
      myPatients: "Balwetse ba Me",
      todayVisits: "Ditetelo tsa Gae tsa Gompieno",
      scheduledVisits: "Ditetelo tse di Rulagantsweng",
      completedVisits: "Ditetelo tse di Fediletsweng",
      pendingReferrals: "Ditshupiso tse di Emetsweng",
      preRegisterPatient: "Kwadisa Pele ya Sepetlele",
      newHomeVisit: "Tetelo e Ntšha ya Gae",
      viewPatient: "Bona Molwetse",
      newReferral: "Tshupiso e Ntšha",
      urgent: "Ya Potlako",
      routine: "Ya Tlwaelo",
      completed: "E Fedile",
      scheduleVisit: "Rulaganya Tetelo",
      stats: {
        todayVisits: "Ditetelo tsa Gompieno",
        activePatients: "Balwetse ba ba Ntseng",
        pendingReferrals: "Ditshupiso tse di Emetsweng",
        healthScreenings: "Ditlhatlhobo tsa Boitekanelo",
      },
    },
  }

  const [displayArea, setDisplayArea] = useState({ en: content.en.subtitle, tn: content.tn.subtitle })

  useEffect(() => {
    const savedEn = localStorage.getItem("userFacilityNameEn")
    const savedTn = localStorage.getItem("userFacilityNameTn")
    if (savedEn && savedTn) {
      setDisplayArea({ en: savedEn, tn: savedTn })
    }
  }, [])

  const t = {
    ...content[language],
    subtitle: language === "en" ? displayArea.en : displayArea.tn
  }

  const myPatients = [
    {
      id: 1,
      name: "Mma Kgomotso Tau",
      omang: "BW123456",
      address: "Plot 234, Block 8",
      lastVisit: "2024-01-15",
      condition: "Hypertension - Monitoring",
      status: "active",
      nextVisit: "2024-01-22",
      phone: "72345678",
    },
    {
      id: 2,
      name: "Rra Thabo Mokone",
      omang: "BW789012",
      address: "Plot 567, Block 3",
      lastVisit: "2024-01-14",
      condition: "Diabetes - Medication adherence",
      status: "active",
      nextVisit: "2024-01-21",
      phone: "73456789",
    },
    {
      id: 3,
      name: "Mma Naledi Setlhare",
      omang: "BW345678",
      address: "Plot 890, Block 5",
      lastVisit: "2024-01-13",
      condition: "Pregnancy - Antenatal care",
      status: "active",
      nextVisit: "2024-01-20",
      phone: "74567890",
    },
  ]

  const todayHomeVisits = [
    {
      id: 1,
      patient: "Mma Kgomotso Tau",
      address: "Plot 234, Block 8",
      time: "09:00 AM",
      purpose: "Blood pressure check & medication review",
      status: "scheduled",
      priority: "routine",
    },
    {
      id: 2,
      patient: "Rra Kabelo Moeng",
      address: "Plot 123, Block 2",
      time: "11:00 AM",
      purpose: "Follow-up on chest pain complaint",
      status: "scheduled",
      priority: "urgent",
    },
    {
      id: 3,
      patient: "Mma Lesego Kgang",
      address: "Plot 456, Block 6",
      time: "02:00 PM",
      purpose: "Diabetes education and glucose monitoring",
      status: "completed",
      priority: "routine",
    },
  ]

  const preRegistrations = [
    {
      id: 1,
      patient: "Rra Kabelo Moeng",
      omang: "BW456789",
      complaint: "Chest pain for 2 days - needs cardiologist",
      priority: "urgent",
      facility: "Sir Ketumile Masire Hospital",
      department: "Cardiology",
      registeredAt: "2024-01-16 08:30",
      status: "pending",
      estimatedDate: "2024-01-17",
    },
    {
      id: 2,
      patient: "Mma Lesego Kgang",
      omang: "BW234567",
      complaint: "Routine diabetes check-up",
      priority: "routine",
      facility: "Molepolole Clinic",
      department: "General Medicine",
      registeredAt: "2024-01-16 09:15",
      status: "confirmed",
      estimatedDate: "2024-01-18",
    },
  ]

  const referralCases = [
    {
      id: 1,
      patient: "Mma Boitumelo Seele",
      from: "Home Visit",
      to: "Athlone District Hospital",
      reason: "Suspected TB - persistent cough, weight loss",
      status: "pending",
      date: "2024-01-15",
      priority: "urgent",
      followUpRequired: true,
    },
    {
      id: 2,
      patient: "Rra Gorata Mmusi",
      from: "Home Visit",
      to: "Scottish Livingstone Hospital",
      reason: "Wound care - diabetic foot ulcer",
      status: "completed",
      date: "2024-01-14",
      priority: "routine",
      followUpRequired: true,
    },
  ]

  const healthEducationActivities = [
    {
      id: 1,
      topic: "Hypertension Management",
      date: "2024-01-16",
      participants: 12,
      location: "Kgotla - Block 5",
      status: "completed",
    },
    {
      id: 2,
      topic: "Maternal Health & Nutrition",
      date: "2024-01-18",
      participants: 0,
      location: "Community Hall",
      status: "scheduled",
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
                <BeatsLogo size={52} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.title}</h1>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.todayVisits}</p>
                  <p className="text-2xl font-bold text-blue-600">{todayHomeVisits.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.activePatients}</p>
                  <p className="text-2xl font-bold text-green-600">{myPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.pendingReferrals}</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {referralCases.filter((r) => r.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.stats.healthScreenings}</p>
                  <p className="text-2xl font-bold text-purple-600">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="homevisits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="homevisits">{t.homeVisits}</TabsTrigger>
            <TabsTrigger value="preregistration">{t.preRegistration}</TabsTrigger>
            <TabsTrigger value="referrals">{t.referrals}</TabsTrigger>
            <TabsTrigger value="education">{t.healthEducation}</TabsTrigger>
          </TabsList>

          {/* Home Visits Tab */}
          <TabsContent value="homevisits" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{t.todayVisits}</h2>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Schedule and track home visits to patients"
                    : "Rulaganya le latela ditetelo tsa gae go balwetse"}
                </p>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowHomeVisitForm(!showHomeVisitForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.newHomeVisit}
              </Button>
            </div>

            {showHomeVisitForm && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Schedule New Home Visit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient Name</Label>
                      <Input placeholder="Search or enter name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input placeholder="72345678" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Address</Label>
                      <Input placeholder="Plot number, Block" />
                    </div>
                    <div className="space-y-2">
                      <Label>Visit Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Visit Time</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="routine">Routine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Visit Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assessment">Health Assessment</SelectItem>
                          <SelectItem value="followup">Follow-up Visit</SelectItem>
                          <SelectItem value="medication">Medication Review</SelectItem>
                          <SelectItem value="education">Health Education</SelectItem>
                          <SelectItem value="screening">Health Screening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Purpose of Visit</Label>
                      <Textarea placeholder="Describe the reason for this home visit" rows={3} />
                    </div>
                    <div className="col-span-2 flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowHomeVisitForm(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">Schedule Visit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {todayHomeVisits.map((visit) => (
                <Card
                  key={visit.id}
                  className={`border-l-4 ${visit.priority === "urgent" ? "border-red-500" : "border-blue-500"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <h3 className="font-semibold">{visit.patient}</h3>
                          <Badge variant={visit.priority === "urgent" ? "destructive" : "default"}>
                            {visit.priority === "urgent" ? t.urgent : t.routine}
                          </Badge>
                          <Badge variant={visit.status === "completed" ? "default" : "secondary"}>
                            {visit.status === "completed"
                              ? t.completed
                              : language === "en"
                                ? "Scheduled"
                                : "E Rulagantsweng"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          {visit.address}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>{language === "en" ? "Time:" : "Nako:"}</strong> {visit.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>{language === "en" ? "Purpose:" : "Maikemisetso:"}</strong> {visit.purpose}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {visit.status === "scheduled" && (
                          <>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              {language === "en" ? "Call" : "Letsa"}
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              {language === "en" ? "Start Visit" : "Simolola Tetelo"}
                            </Button>
                          </>
                        )}
                        {visit.status === "completed" && (
                          <Button variant="outline" size="sm">
                            {language === "en" ? "View Report" : "Bona Pego"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* My Patients Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">{t.myPatients}</h3>
              <div className="grid gap-4">
                {myPatients.map((patient) => (
                  <Card key={patient.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-gray-600">
                              {patient.omang} • {patient.condition}
                            </p>
                            <p className="text-sm text-gray-500">
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {patient.address}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">{language === "en" ? "Active" : "E ntseng"}</Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {language === "en" ? "Next visit:" : "Tetelo e e latelang:"} {patient.nextVisit}
                          </p>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            {t.viewPatient}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Pre-Registration Tab */}
          <TabsContent value="preregistration" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{t.preRegistration}</h2>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Pre-register patients for hospital visits to reduce wait times"
                    : "Kwadisa balwetse pele ya ditetelo tsa sepetlele go fokotsa nako ya go leta"}
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t.preRegisterPatient}
              </Button>
            </div>

            <div className="grid gap-4">
              {preRegistrations.map((reg) => (
                <Card
                  key={reg.id}
                  className={`border-l-4 ${reg.priority === "urgent" ? "border-red-500" : "border-blue-500"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{reg.patient}</h3>
                          <Badge variant={reg.priority === "urgent" ? "destructive" : "default"}>
                            {reg.priority === "urgent" ? t.urgent : t.routine}
                          </Badge>
                          <Badge variant={reg.status === "confirmed" ? "default" : "secondary"}>
                            {reg.status === "confirmed"
                              ? language === "en"
                                ? "Confirmed"
                                : "E netefatsitswe"
                              : language === "en"
                                ? "Pending"
                                : "E emetse"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>{language === "en" ? "Complaint:" : "Bothata:"}</strong> {reg.complaint}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          {reg.facility} - {reg.department}
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "Estimated appointment:" : "Kopano e e lebeleletsweng:"}{" "}
                          {reg.estimatedDate}
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "Registered:" : "E kwadisitswe:"} {reg.registeredAt}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          {language === "en" ? "Call Patient" : "Letsa Molwetse"}
                        </Button>
                        <Button variant="outline" size="sm">
                          {language === "en" ? "Edit" : "Baakanya"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.referrals}</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                {t.newReferral}
              </Button>
            </div>

            <div className="grid gap-4">
              {referralCases.map((referral) => (
                <Card
                  key={referral.id}
                  className={`border-l-4 ${referral.priority === "urgent" ? "border-red-500" : "border-orange-500"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{referral.patient}</h3>
                          <Badge variant={referral.priority === "urgent" ? "destructive" : "secondary"}>
                            {referral.priority === "urgent" ? t.urgent : t.routine}
                          </Badge>
                          <Badge variant={referral.status === "completed" ? "default" : "secondary"}>
                            {referral.status === "completed" ? t.completed : language === "en" ? "Pending" : "E emetse"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>{language === "en" ? "Reason:" : "Lebaka:"}</strong> {referral.reason}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Activity className="inline h-4 w-4 mr-1" />
                          {referral.from} → {referral.to}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {language === "en" ? "Date:" : "Letlha:"} {referral.date}
                        </p>
                        {referral.followUpRequired && (
                          <Badge variant="outline" className="mt-2">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {language === "en" ? "Follow-up Required" : "Go Latela go a Tlhokega"}
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        {language === "en" ? "Track Referral" : "Sala Tshupiso Morago"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Health Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{t.healthEducation}</h2>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Community health education sessions and activities"
                    : "Dithuto tsa boitekanelo tsa setshaba le ditiro"}
                </p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                {language === "en" ? "New Session" : "Kopano e Ntšha"}
              </Button>
            </div>

            <div className="grid gap-4">
              {healthEducationActivities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{activity.topic}</h3>
                        <p className="text-sm text-gray-600">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          {activity.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === "en" ? "Date:" : "Letlha:"} {activity.date}
                        </p>
                        {activity.status === "completed" && (
                          <p className="text-sm text-gray-500">
                            {language === "en" ? "Participants:" : "Bakopi:"} {activity.participants}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                          {activity.status === "completed"
                            ? language === "en"
                              ? "Completed"
                              : "E Fedile"
                            : language === "en"
                              ? "Scheduled"
                              : "E Rulagantsweng"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {activity.status === "completed"
                            ? language === "en"
                              ? "View Report"
                              : "Bona Pego"
                            : language === "en"
                              ? "View Details"
                              : "Bona Dintlha"}
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
