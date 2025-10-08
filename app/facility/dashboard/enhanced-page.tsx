"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Package,
  Users,
  Heart,
  Globe,
  Bell,
  LogOut,
  Plus,
  Phone,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  X,
  Edit,
  Trash,
} from "lucide-react"
import Link from "next/link"
import { DashboardSearch } from "@/components/dashboard-search"
import { DataExport } from "@/components/data-export"
import { RefreshIndicator } from "@/components/refresh-indicator"
import { UserSettings } from "@/components/user-settings"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { AuditLog } from "@/components/audit-log"
import { toast } from "@/components/ui/use-toast"

export default function EnhancedFacilityDashboard() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [selectedDate, setSelectedDate] = useState("2024-01-11")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const itemsPerPage = 5

  const content = {
    en: {
      title: "Princess Marina Hospital",
      subtitle: "Facility Dashboard - Enhanced",
      appointments: "Appointments",
      stock: "Medicine Stock",
      patients: "Patients",
      auditLog: "Audit Log",
      todayAppointments: "Today's Appointments",
      filters: "Filters",
      department: "Department",
      status: "Status",
      all: "All",
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
      cardiology: "Cardiology",
      orthopedic: "Orthopedic",
      general: "General",
      clearFilters: "Clear Filters",
      noAppointments: "No appointments found",
      noAppointmentsDesc: "There are no appointments matching your current filters",
      previousPage: "Previous",
      nextPage: "Next",
      edit: "Edit",
      delete: "Delete",
      deleteConfirmTitle: "Delete Appointment",
      deleteConfirmDesc: "Are you sure you want to delete this appointment? This action cannot be undone.",
      confirm: "Confirm",
      cancel: "Cancel",
      trends: "Trends (7 days)",
    },
    tn: {
      title: "Sepetlele sa Princess Marina",
      subtitle: "Dashboard ya Lefelo - E Tokafaditsweng",
      appointments: "Dikopano",
      stock: "Stock ya Dihlare",
      patients: "Balwetse",
      auditLog: "Rekoto ya Ditiro",
      todayAppointments: "Dikopano tsa Gompieno",
      filters: "Ditshupo",
      department: "Lefapha",
      status: "Maemo",
      all: "Tsotlhe",
      confirmed: "E Netefatsitswe",
      pending: "E Emetse",
      cancelled: "E Khanseletse",
      cardiology: "Ngaka ya Pelo",
      orthopedic: "Ngaka ya Masapo",
      general: "Kakaretso",
      clearFilters: "Tlosa Ditshupo",
      noAppointments: "Ga go na dikopano",
      noAppointmentsDesc: "Ga go na dikopano tse di tshwanang le ditshupo tsa gago",
      previousPage: "E Fetileng",
      nextPage: "E Latelang",
      edit: "Fetola",
      delete: "Tlosa",
      deleteConfirmTitle: "Tlosa Kopano",
      deleteConfirmDesc: "A o tlhomamisegile gore o batla go tlosa kopano eno? Tiro eno ga e ka e boelwa morago.",
      confirm: "Netefatsa",
      cancel: "Khansela",
      trends: "Mekgwa (Malatsi a 7)",
    },
  }

  const t = content[language]

  const allAppointments = [
    {
      id: "1",
      time: "08:00",
      patient: "Thabo Mogale",
      type: "Cardiology Consultation",
      doctor: "Dr. Sekai Moyo",
      status: "confirmed",
      department: "cardiology",
      location: "Room 204",
    },
    {
      id: "2",
      time: "09:00",
      patient: "Keabetswe Tsheko",
      type: "General Check-up",
      doctor: "Dr. James Kgathi",
      status: "pending",
      department: "general",
      location: "Room 101",
    },
    {
      id: "3",
      time: "10:00",
      patient: "Mpho Setlhare",
      type: "Orthopedic Follow-up",
      doctor: "Dr. Sarah Molefe",
      status: "confirmed",
      department: "orthopedic",
      location: "Room 301",
    },
    {
      id: "4",
      time: "11:00",
      patient: "Gorata Mmusi",
      type: "Cardiology Consultation",
      doctor: "Dr. Peter Sebego",
      status: "confirmed",
      department: "cardiology",
      location: "Room 204",
    },
    {
      id: "5",
      time: "14:00",
      patient: "Naledi Kgosi",
      type: "General Check-up",
      doctor: "Dr. James Kgathi",
      status: "pending",
      department: "general",
      location: "Room 102",
    },
    {
      id: "6",
      time: "15:00",
      patient: "Boitumelo Tau",
      type: "Orthopedic Surgery",
      doctor: "Dr. Sarah Molefe",
      status: "cancelled",
      department: "orthopedic",
      location: "Surgery 1",
    },
    {
      id: "7",
      time: "16:00",
      patient: "Kagiso Moeng",
      type: "Cardiology Follow-up",
      doctor: "Dr. Sekai Moyo",
      status: "confirmed",
      department: "cardiology",
      location: "Room 204",
    },
  ]

  const filteredAppointments = allAppointments.filter((apt) => {
    const departmentMatch = departmentFilter === "all" || apt.department === departmentFilter
    const statusMatch = statusFilter === "all" || apt.status === statusFilter
    return departmentMatch && statusMatch
  })

  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleDelete = (id: string) => {
    setSelectedAppointment(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    toast({
      title: language === "en" ? "Appointment deleted" : "Kopano e tlositswe",
      description: language === "en" ? "The appointment has been removed" : "Kopano e tlositswe",
    })
    setShowDeleteModal(false)
    setSelectedAppointment(null)
  }

  const clearFilters = () => {
    setDepartmentFilter("all")
    setStatusFilter("all")
    setCurrentPage(1)
  }

  const hasActiveFilters = departmentFilter !== "all" || statusFilter !== "all"

  const weeklyStats = [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 15 },
    { day: "Wed", count: 18 },
    { day: "Thu", count: 14 },
    { day: "Fri", count: 16 },
    { day: "Sat", count: 8 },
    { day: "Sun", count: 5 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
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
              <RefreshIndicator onRefresh={handleRefresh} language={language} autoRefreshInterval={30000} />
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "tn" : "en")}>
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "Setswana" : "English"}
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <UserSettings language={language} onLanguageChange={setLanguage} />
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <DashboardSearch language={language} />
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats with Trends */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Today's Appointments</p>
                    <p className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 h-8">
                {weeklyStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-blue-200 rounded-sm"
                    style={{ height: `${(stat.count / 20) * 100}%` }}
                    title={`${stat.day}: ${stat.count}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.trends}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Stock Alerts</p>
                  <p className="text-2xl font-bold text-red-600">4</p>
                  <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>2 critical</span>
                  </div>
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
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+5 today</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Notifications</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <div className="flex items-center gap-1 text-xs text-purple-600 mt-1">
                    <span>3 unread</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appointments">{t.appointments}</TabsTrigger>
            <TabsTrigger value="stock">{t.stock}</TabsTrigger>
            <TabsTrigger value="patients">{t.patients}</TabsTrigger>
            <TabsTrigger value="audit">{t.auditLog}</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.todayAppointments}</h2>
              <div className="flex items-center gap-2">
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                <DataExport
                  data={filteredAppointments.map((apt) => ({
                    time: apt.time,
                    patient: apt.patient,
                    type: apt.type,
                    doctor: apt.doctor,
                    status: apt.status,
                    location: apt.location,
                  }))}
                  filename="appointments"
                  language={language}
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "New" : "Ntšha"}
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <CardTitle className="text-base">{t.filters}</CardTitle>
                  </div>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      {t.clearFilters}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t.department}</label>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t.all}</SelectItem>
                        <SelectItem value="cardiology">{t.cardiology}</SelectItem>
                        <SelectItem value="orthopedic">{t.orthopedic}</SelectItem>
                        <SelectItem value="general">{t.general}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t.status}</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t.all}</SelectItem>
                        <SelectItem value="confirmed">{t.confirmed}</SelectItem>
                        <SelectItem value="pending">{t.pending}</SelectItem>
                        <SelectItem value="cancelled">{t.cancelled}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            {paginatedAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noAppointments}</h3>
                  <p className="text-gray-600">{t.noAppointmentsDesc}</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4">
                  {paginatedAppointments.map((appointment) => (
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
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : appointment.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {appointment.status === "confirmed"
                                ? t.confirmed
                                : appointment.status === "pending"
                                  ? t.pending
                                  : t.cancelled}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(appointment.id)}>
                              <Trash className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Page" : "Tsebe"} {currentPage} {language === "en" ? "of" : "ya"}{" "}
                      {totalPages} ({filteredAppointments.length} {language === "en" ? "total" : "tsotlhe"})
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        {t.previousPage}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        {t.nextPage}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Medicine Stock Management</CardTitle>
                <CardDescription>Monitor and manage medicine inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Stock management interface with filters and export options...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>Search and manage patient information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Patient management interface with search and filters...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <AuditLog language={language} />
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title={t.deleteConfirmTitle}
        description={t.deleteConfirmDesc}
        confirmLabel={t.confirm}
        cancelLabel={t.cancel}
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  )
}
