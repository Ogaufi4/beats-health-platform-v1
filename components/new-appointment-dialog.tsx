"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, AlertCircle, Search, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NewAppointmentDialogProps {
  onBook?: (appointment: any) => void
}

export function NewAppointmentDialog({ onBook }: NewAppointmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"search" | "details">("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [formData, setFormData] = useState({
    appointmentType: "",
    department: "",
    preferredDoctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: "",
    isFollowUp: false,
    previousVisitId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mock patient data
  const mockPatients = [
    { id: "1", name: "Thabo Mogale", omang: "123456789", phone: "71234567", lastVisit: "2024-01-10" },
    { id: "2", name: "Keabetswe Tsheko", omang: "234567890", phone: "72345678", lastVisit: "2024-01-08" },
    { id: "3", name: "Naledi Kgomo", omang: "345678901", phone: "73456789", lastVisit: "2024-01-05" },
    { id: "4", name: "Mpho Setlhare", omang: "456789012", phone: "74567890", lastVisit: "2023-12-15" },
  ]

  // Mock doctors by department
  const doctorsByDepartment: Record<string, string[]> = {
    Cardiology: ["Dr. Sekai Moyo", "Dr. Peter Sebego", "Dr. James Kgathi"],
    "General Medicine": ["Dr. Sarah Molefe", "Dr. John Smith", "Dr. Mary Kefilwe"],
    Pediatrics: ["Dr. Alice Thebe", "Dr. David Mma", "Dr. Ruth Kabo"],
    Maternity: ["Dr. Grace Letlhaku", "Dr. Emily Tau", "Dr. Rebecca Dube"],
    Orthopedics: ["Dr. Michael Otsile", "Dr. Susan Modise", "Dr. Patrick Mmusi"],
    Dental: ["Dr. Lisa Motlhagodi", "Dr. Paul Keamogetswe", "Dr. Janet Tshepo"],
  }

  const searchResults = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.omang.includes(searchQuery) ||
      patient.phone.includes(searchQuery),
  )

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient)
    setStep("details")
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.appointmentType) {
      newErrors.appointmentType = "Appointment type is required"
    }
    if (!formData.department) {
      newErrors.department = "Department is required"
    }
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required"
    }
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Appointment time is required"
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for visit is required"
    }

    // Validate that date is not in the past
    if (formData.appointmentDate) {
      const selectedDate = new Date(formData.appointmentDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.appointmentDate = "Cannot book appointments in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    if (!validateForm()) {
      return
    }

    const newAppointment = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientOmang: selectedPatient.omang,
      patientPhone: selectedPatient.phone,
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    if (onBook) {
      onBook(newAppointment)
    }

    // Reset form
    setSelectedPatient(null)
    setSearchQuery("")
    setStep("search")
    setFormData({
      appointmentType: "",
      department: "",
      preferredDoctor: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      notes: "",
      isFollowUp: false,
      previousVisitId: "",
    })
    setErrors({})
    setOpen(false)

    alert(
      `Appointment booked successfully for ${selectedPatient.name} on ${formData.appointmentDate} at ${formData.appointmentTime}`,
    )
  }

  const handleBack = () => {
    setStep("search")
    setSelectedPatient(null)
  }

  return (
    <Dialog open={open} onValueChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {step === "search" ? "Select Patient" : "Book Appointment"}
          </DialogTitle>
          <DialogDescription>
            {step === "search"
              ? "Search for an existing patient or register a new one"
              : `Booking appointment for ${selectedPatient?.name}`}
          </DialogDescription>
        </DialogHeader>

        {step === "search" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Patient</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, Omang, or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {searchQuery && (
              <div className="space-y-2">
                <Label>Search Results ({searchResults.length})</Label>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No patients found</p>
                      <Button variant="link" className="mt-2">
                        Register new patient
                      </Button>
                    </div>
                  ) : (
                    searchResults.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSelectPatient(patient)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{patient.name}</h4>
                            <p className="text-sm text-gray-600">Omang: {patient.omang}</p>
                            <p className="text-sm text-gray-600">Phone: {patient.phone}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">Last visit: {patient.lastVisit}</Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Register New Patient
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Info Display */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Patient Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span> <strong>{selectedPatient?.name}</strong>
                </div>
                <div>
                  <span className="text-gray-600">Omang:</span> <strong>{selectedPatient?.omang}</strong>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span> <strong>{selectedPatient?.phone}</strong>
                </div>
                <div>
                  <span className="text-gray-600">Last Visit:</span> <strong>{selectedPatient?.lastVisit}</strong>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700">Appointment Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentType">
                    Appointment Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.appointmentType}
                    onValueChange={(value) => handleInputChange("appointmentType", value)}
                  >
                    <SelectTrigger className={errors.appointmentType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">General Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                      <SelectItem value="screening">Health Screening</SelectItem>
                      <SelectItem value="procedure">Medical Procedure</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="test">Laboratory Test</SelectItem>
                      <SelectItem value="imaging">Medical Imaging</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.appointmentType && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.appointmentType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => {
                      handleInputChange("department", value)
                      handleInputChange("preferredDoctor", "")
                    }}
                  >
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Maternity">Maternity</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Dental">Dental</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                      <SelectItem value="Laboratory">Laboratory</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.department}
                    </p>
                  )}
                </div>

                {formData.department && (
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="preferredDoctor">Preferred Doctor (Optional)</Label>
                    <Select
                      value={formData.preferredDoctor}
                      onValueChange={(value) => handleInputChange("preferredDoctor", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Available</SelectItem>
                        {doctorsByDepartment[formData.department]?.map((doctor) => (
                          <SelectItem key={doctor} value={doctor}>
                            {doctor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">
                    Appointment Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={errors.appointmentDate ? "border-red-500" : ""}
                  />
                  {errors.appointmentDate && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.appointmentDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentTime">
                    Appointment Time <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.appointmentTime}
                    onValueChange={(value) => handleInputChange("appointmentTime", value)}
                  >
                    <SelectTrigger className={errors.appointmentTime ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00 AM</SelectItem>
                      <SelectItem value="08:30">08:30 AM</SelectItem>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="09:30">09:30 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="10:30">10:30 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="11:30">11:30 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="14:30">02:30 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="15:30">03:30 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.appointmentTime && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.appointmentTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">
                  Reason for Visit <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Please describe the reason for this appointment..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  rows={3}
                  className={errors.reason ? "border-red-500" : ""}
                />
                {errors.reason && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.reason}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or special requirements..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFollowUp"
                  checked={formData.isFollowUp}
                  onChange={(e) => handleInputChange("isFollowUp", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isFollowUp" className="cursor-pointer">
                  This is a follow-up appointment
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Patient Search
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
