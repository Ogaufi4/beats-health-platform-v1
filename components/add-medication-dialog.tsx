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
import { Droplet, Plus, AlertCircle } from "lucide-react"

interface AddMedicationDialogProps {
  onAdd?: (medication: any) => void
}

export function AddMedicationDialog({ onAdd }: AddMedicationDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    patientOmang: "",
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    route: "oral",
    indication: "",
    prescribedBy: "",
    refills: "0",
    specialInstructions: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const medications = [
    "Amlodipine",
    "Aspirin",
    "Metformin",
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
    "Lisinopril",
    "Furosemide",
    "Metoprolol",
    "Insulin",
    "Atorvastatin",
    "Omeprazole",
  ]

  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 6 hours",
    "Every 8 hours",
    "As needed",
  ]
  const routes = ["Oral", "Intravenous", "Intramuscular", "Subcutaneous", "Topical", "Inhalation", "Rectal"]

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

    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required"
    if (!formData.patientOmang.trim()) newErrors.patientOmang = "Patient Omang is required"
    if (!formData.medicationName) newErrors.medicationName = "Medication name is required"
    if (!formData.dosage.trim()) newErrors.dosage = "Dosage is required"
    if (!formData.frequency) newErrors.frequency = "Frequency is required"
    if (!formData.duration.trim()) newErrors.duration = "Duration is required"
    if (!formData.indication.trim()) newErrors.indication = "Indication is required"
    if (!formData.prescribedBy.trim()) newErrors.prescribedBy = "Prescribed by is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const medication = {
      id: `MED-${Date.now()}`,
      ...formData,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    if (onAdd) onAdd(medication)

    alert(`Medication added: ${formData.medicationName} for ${formData.patientName}`)

    setFormData({
      patientName: "",
      patientOmang: "",
      medicationName: "",
      dosage: "",
      frequency: "",
      duration: "",
      route: "oral",
      indication: "",
      prescribedBy: "",
      refills: "0",
      specialInstructions: "",
    })
    setErrors({})
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5" />
            Add New Medication
          </DialogTitle>
          <DialogDescription>Prescribe medication to a patient with detailed dosage information</DialogDescription>
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
            <h3 className="font-semibold text-sm text-gray-700">Medication Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">
                  Medication Name <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.medicationName}
                  onValueChange={(value) => handleInputChange("medicationName", value)}
                >
                  <SelectTrigger className={errors.medicationName ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {medications.map((med) => (
                      <SelectItem key={med} value={med}>
                        {med}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.medicationName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.medicationName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">
                  Dosage <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 500mg"
                  value={formData.dosage}
                  onChange={(e) => handleInputChange("dosage", e.target.value)}
                  className={errors.dosage ? "border-red-500" : ""}
                />
                {errors.dosage && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.dosage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">
                  Frequency <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                  <SelectTrigger className={errors.frequency ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.frequency && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.frequency}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g., 5 days"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  className={errors.duration ? "border-red-500" : ""}
                />
                {errors.duration && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.duration}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route of Administration</Label>
                <Select value={formData.route} onValueChange={(value) => handleInputChange("route", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route} value={route.toLowerCase()}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refills">Number of Refills</Label>
                <Input
                  id="refills"
                  type="number"
                  value={formData.refills}
                  onChange={(e) => handleInputChange("refills", e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Prescription Details</h3>

            <div className="space-y-2">
              <Label htmlFor="indication">
                Indication/Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="indication"
                placeholder="Clinical indication for this medication..."
                value={formData.indication}
                onChange={(e) => handleInputChange("indication", e.target.value)}
                rows={2}
                className={errors.indication ? "border-red-500" : ""}
              />
              {errors.indication && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.indication}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prescribedBy">
                  Prescribed By <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prescribedBy"
                  placeholder="Doctor/Clinician name"
                  value={formData.prescribedBy}
                  onChange={(e) => handleInputChange("prescribedBy", e.target.value)}
                  className={errors.prescribedBy ? "border-red-500" : ""}
                />
                {errors.prescribedBy && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.prescribedBy}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
            <Textarea
              id="specialInstructions"
              placeholder="e.g., Take with food, avoid dairy products..."
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              <Droplet className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
