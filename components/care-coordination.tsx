"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Stethoscope, Activity } from "lucide-react"

interface CareCoordinationProps {
  language: "en" | "tn"
}

export function CareCoordination({ language }: CareCoordinationProps) {
  const [selectedSpecialist, setSelectedSpecialist] = useState("")
  const [selectedFacility, setSelectedFacility] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointment Scheduling Form */}
        <Card className="lg:col-span-2">
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
                <Input id="patientName" placeholder="Thabo Mogale" />
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

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              {t.scheduleAppointment}
            </Button>
          </CardContent>
        </Card>

        {/* Available Resources */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                {t.availableSpecialists}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {specialists.map((specialist) => (
                  <div key={specialist.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium">{specialist.name}</span>
                    <Badge variant={specialist.available > 0 ? "default" : "secondary"}>{specialist.available}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t.equipmentAvailability}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipment.map((item, index) => (
                  <div key={index} className="p-3 rounded-lg border">
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
    </div>
  )
}
