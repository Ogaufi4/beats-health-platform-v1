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
import { Package, Plus, AlertCircle } from "lucide-react"

interface MedicalEquipmentBookingDialogProps {
  onBook?: (booking: any) => void
}

export function MedicalEquipmentBookingDialog({ onBook }: MedicalEquipmentBookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    equipmentType: "",
    patientName: "",
    patientOmang: "",
    department: "",
    requestedDate: "",
    requestedTime: "",
    reason: "",
    priority: "routine",
    estimatedDuration: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const equipment = [
    "MRI Scanner",
    "CT Scanner",
    "X-Ray Machine",
    "Ultrasound",
    "ECG Machine",
    "Defibrillator",
    "Ventilator",
    "Patient Monitor",
  ]

  const departments = ["Cardiology", "Radiology", "General Medicine", "Surgery", "Emergency", "Pediatrics", "ICU"]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.equipmentType) newErrors.equipmentType = "Equipment type is required"
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required"
    if (!formData.patientOmang.trim()) newErrors.patientOmang = "Patient Omang is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.requestedDate) newErrors.requestedDate = "Date is required"
    if (!formData.requestedTime) newErrors.requestedTime = "Time is required"
    if (!formData.reason.trim()) newErrors.reason = "Reason is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const booking = {
      id: `EQP-${Date.now()}`,
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    if (onBook) onBook(booking)

    alert(`Equipment booking confirmed: ${formData.equipmentType} for ${formData.patientName}`)

    setFormData({
      equipmentType: "",
      patientName: "",
      patientOmang: "",
      department: "",
      requestedDate: "",
      requestedTime: "",
      reason: "",
      priority: "routine",
      estimatedDuration: "",
      notes: "",
    })
    setErrors({})
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full">
          <Plus className="h-4 w-4 mr-2" />
          Book Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Book Medical Equipment
          </DialogTitle>
          <DialogDescription>Schedule medical equipment for patient diagnosis and treatment</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Patient Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">
                  Patient Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient name"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  className={errors.patientName ? "border-red-500" : ""}
                />
                {errors.patientName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.patientName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientOmang">
                  Patient Omang <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="patientOmang"
                  placeholder="Enter Omang number"
                  value={formData.patientOmang}
                  onChange={(e) => handleInputChange("patientOmang", e.target.value)}
                  className={errors.patientOmang ? "border-red-500" : ""}
                />
                {errors.patientOmang && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.patientOmang}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Equipment Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentType">
                  Equipment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.equipmentType}
                  onValueChange={(value) => handleInputChange("equipmentType", value)}
                >
                  <SelectTrigger className={errors.equipmentType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map((equip) => (
                      <SelectItem key={equip} value={equip}>
                        {equip}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.equipmentType && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.equipmentType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.department}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedDate">
                  Requested Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="requestedDate"
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => handleInputChange("requestedDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={errors.requestedDate ? "border-red-500" : ""}
                />
                {errors.requestedDate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.requestedDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedTime">
                  Requested Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="requestedTime"
                  type="time"
                  value={formData.requestedTime}
                  onChange={(e) => handleInputChange("requestedTime", e.target.value)}
                  className={errors.requestedTime ? "border-red-500" : ""}
                />
                {errors.requestedTime && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.requestedTime}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                <Input
                  id="estimatedDuration"
                  type="number"
                  placeholder="e.g., 60"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Equipment <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Describe the clinical reason..."
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
              placeholder="Any special requirements..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Package className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
