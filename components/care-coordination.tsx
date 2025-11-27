"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Stethoscope, Activity, CheckCircle } from "lucide-react"
import { ActionModal } from "./action-modal"
import { ActionToastContainer, type ActionToast } from "./ui/action-toast"
import { mockActions } from "@/lib/mock-actions"

interface CareCoordinationProps {
  language: "en" | "tn"
}

export function CareCoordination({ language }: CareCoordinationProps) {
  const [selectedSpecialist, setSelectedSpecialist] = useState("")
  const [selectedFacility, setSelectedFacility] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [patientName, setPatientName] = useState("")

  const [toasts, setToasts] = useState<ActionToast[]>([])
  const [actionModal, setActionModal] = useState({
    open: false,
    type: null as "specialist" | "appointment" | "referral" | null,
    isLoading: false,
    result: null as any,
  })

  const content = {
    en: {
      title: "Care Coordination Module",
      subtitle: "Schedule appointments and coordinate patient care",
      patientInfo: "Patient Information",
      patientName: "Patient Name",
      patientId: "Patient ID",
      contactNumber: "Contact Number",
      specialistType: "Specialist Type",
      selectSpecialist: "Select specialist type",
      facility: "Preferred Facility",
      selectFacility: "Select facility",
      appointmentDate: "Preferred Date",
      appointmentTime: "Preferred Time",
      referralReason: "Referral Reason",
      scheduleAppointment: "Schedule Appointment",
      availableSpecialists: "Available Specialists",
      equipmentAvailability: "Equipment Availability",
      checkAvailability: "Check Specialist Availability",
      bookAppointment: "Book Appointment",
      generateReferral: "Generate Referral",
    },
    tn: {
      title: "Motlhala wa Thulaganyo ya Tlhokomelo",
      subtitle: "Rulaganya dikopano le go rulaganya tlhokomelo ya balwetse",
      patientInfo: "Tshedimosetso ya Molwetse",
      patientName: "Leina la Molwetse",
      patientId: "Nomoro ya Molwetse",
      contactNumber: "Nomoro ya Mogala",
      specialistType: "Mofuta wa Ngaka e e Ikgethileng",
      selectSpecialist: "Tlhopha mofuta wa ngaka",
      facility: "Lefelo le le Batlwang",
      selectFacility: "Tlhopha lefelo",
      appointmentDate: "Letsatsi le le Batlwang",
      appointmentTime: "Nako e e Batlwang",
      referralReason: "Lebaka la go Romela",
      scheduleAppointment: "Rulaganya Kopano",
      availableSpecialists: "Dingaka tse di Teng",
      equipmentAvailability: "Didirisiwa tse di Teng",
      checkAvailability: "Lekola Dingaka tse di Teng",
      bookAppointment: "Beela Kopano",
      generateReferral: "Hlakisa Letho la go Romela",
    },
  }

  const t = content[language]

  const specialists = [
    { id: "cardiology", name: language === "en" ? "Cardiology" : "Ngaka ya Pelo", available: 3 },
    { id: "orthopedic", name: language === "en" ? "Orthopedic" : "Ngaka ya Masapo", available: 2 },
    { id: "neurology", name: language === "en" ? "Neurology" : "Ngaka ya Bokoko", available: 1 },
    { id: "oncology", name: language === "en" ? "Oncology" : "Ngaka ya Kankere", available: 2 },
    { id: "pediatric", name: language === "en" ? "Pediatric" : "Ngaka ya Bana", available: 4 },
  ]

  const facilities = [
    { id: "pmh", name: "Princess Marina Hospital", region: "Gaborone" },
    { id: "nyangabgwe", name: "Nyangabgwe Referral Hospital", region: "Francistown" },
    { id: "scottish", name: "Scottish Livingstone Hospital", region: "Molepolole" },
    { id: "maun", name: "Maun General Hospital", region: "Maun" },
  ]

  const equipment = [
    {
      name: "MRI Scanner",
      facility: "Princess Marina Hospital",
      status: "available",
      nextSlot: "2024-01-15 10:00",
      type: "imaging",
    },
    {
      name: "CT Scanner",
      facility: "Nyangabgwe Hospital",
      status: "maintenance",
      nextSlot: "2024-01-16 14:00",
      type: "imaging",
    },
    {
      name: "Ultrasound",
      facility: "Scottish Livingstone Hospital",
      status: "available",
      nextSlot: "2024-01-15 09:00",
      type: "imaging",
    },
    {
      name: "X-Ray Machine",
      facility: "Maun General Hospital",
      status: "available",
      nextSlot: "2024-01-15 08:30",
      type: "imaging",
    },
    {
      name: "ECG Machine",
      facility: "Princess Marina Hospital",
      status: "available",
      nextSlot: "2024-01-15 08:00",
      type: "diagnostic",
    },
    {
      name: "Echocardiogram",
      facility: "Princess Marina Hospital",
      status: "busy",
      nextSlot: "2024-01-15 15:30",
      type: "diagnostic",
    },
    {
      name: "Mammography",
      facility: "Nyangabgwe Hospital",
      status: "available",
      nextSlot: "2024-01-15 11:00",
      type: "imaging",
    },
    {
      name: "Endoscopy Suite",
      facility: "Scottish Livingstone Hospital",
      status: "available",
      nextSlot: "2024-01-15 13:00",
      type: "procedure",
    },
  ]

  const handleAction = async (actionType: string) => {
    try {
      setActionModal({ ...actionModal, open: true, type: actionType as any, isLoading: true })

      let result
      switch (actionType) {
        case "specialist":
          result = await mockActions.checkSpecialistAvailability(specialists[0]?.name || "Cardiology")
          break
        case "appointment":
          result = await mockActions.bookAppointment(patientName || "John Doe", selectedSpecialist, appointmentDate)
          break
        case "referral":
          result = await mockActions.generateReferral(
            patientName || "John Doe",
            facilities[0]?.name || "Princess Marina",
          )
          break
      }

      setActionModal({
        ...actionModal,
        isLoading: false,
        result: {
          success: result.success,
          title: result.success ? "Success!" : "Error",
          details: Object.fromEntries(Object.entries(result).filter(([k]) => k !== "success")),
        },
      })

      // Add success toast
      const id = Math.random().toString()
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: language === "en" ? "Action Completed" : "Kgato e Feleletse",
          message:
            language === "en"
              ? `${actionType} action processed successfully`
              : `Kgato ya ${actionType} e dirwa ka go siame`,
          type: "success",
          duration: 3000,
        },
      ])
    } catch (error) {
      const id = Math.random().toString()
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: language === "en" ? "Error" : "Phoso",
          message: language === "en" ? "Failed to process action" : "Kgato e su phele",
          type: "error",
          duration: 3000,
        },
      ])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointment Scheduling Form */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {language === "en" ? "New Appointment Request" : "Kopo ya Kopano e Ntšha"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">{t.patientName}</Label>
                <Input
                  id="patientName"
                  placeholder="Thabo Mogale"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">{t.patientId}</Label>
                <Input id="patientId" placeholder="BW123456789" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">{t.contactNumber}</Label>
              <Input id="contactNumber" placeholder="+267 71234567" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.specialistType}</Label>
                <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectSpecialist} />
                  </SelectTrigger>
                  <SelectContent>
                    {specialists.map((specialist) => (
                      <SelectItem key={specialist.id} value={specialist.id}>
                        {specialist.name} ({specialist.available} {language === "en" ? "available" : "ba teng"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.facility}</Label>
                <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectFacility} />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name} - {facility.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">{t.appointmentDate}</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointmentTime">{t.appointmentTime}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="09:00" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralReason">{t.referralReason}</Label>
              <Textarea
                id="referralReason"
                placeholder={
                  language === "en" ? "Describe the reason for referral..." : "Tlhalosa lebaka la go romela..."
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                onClick={() => handleAction("specialist")}
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                {t.checkAvailability}
              </Button>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200"
                onClick={() => handleAction("appointment")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t.bookAppointment}
              </Button>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-200"
                onClick={() => handleAction("referral")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t.generateReferral}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Resources */}
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                {t.availableSpecialists}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {specialists.map((specialist) => (
                  <div
                    key={specialist.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-200 cursor-pointer hover:scale-102"
                  >
                    <span className="text-sm font-medium">{specialist.name}</span>
                    <Badge variant={specialist.available > 0 ? "default" : "secondary"}>{specialist.available}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t.equipmentAvailability}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipment.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border hover:border-blue-400 hover:shadow-md transition-all duration-200 hover:scale-102 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{item.name}</span>
                      <Badge variant={item.status === "available" ? "default" : "secondary"}>
                        {item.status === "available"
                          ? language === "en"
                            ? "Available"
                            : "E teng"
                          : language === "en"
                            ? "Maintenance"
                            : "Tokafatso"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{item.facility}</p>
                    <p className="text-xs text-gray-500">
                      {language === "en" ? "Next slot:" : "Nako e e latelang:"} {item.nextSlot}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ActionModal
        open={actionModal.open}
        onOpenChange={(open) => setActionModal({ ...actionModal, open })}
        title={`${actionModal.type} Action`}
        description={language === "en" ? "Processing your request..." : "Go tsamaya le go itumeletsa..."}
        actionLabel="Execute"
        isLoading={actionModal.isLoading}
        result={actionModal.result}
        onAction={() => {}}
        language={language}
      />

      <ActionToastContainer toasts={toasts} onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  )
}
