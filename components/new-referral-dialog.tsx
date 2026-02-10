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
import { Send, Plus, AlertCircle } from "lucide-react"

interface NewReferralDialogProps {
  onCreate?: (referral: any) => void
}

export function NewReferralDialog({ onCreate }: NewReferralDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    patientOmang: "",
    referralFrom: "",
    referralTo: "",
    specialty: "",
    priority: "routine",
    reason: "",
    clinicalHistory: "",
    attachments: "",
    referredBy: "",
    contactPhone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const specialties = [
    "Cardiology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Gastroenterology",
    "Pulmonology",
    "Nephrology",
    "Endocrinology",
    "Rheumatology",
    "Urology",
    "Psychiatry",
    "Dermatology",
  ]

  const facilities = [
    "Princess Marina Hospital",
    "National TB Hospital",
    "Motopi Hospital",
    "Athlone Hospital",
    "Francistown Hospital",
    "Gaborone Private Hospital",
  ]

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
    if (!formData.referralFrom) newErrors.referralFrom = "Referring facility is required"
    if (!formData.referralTo) newErrors.referralTo = "Referral facility is required"
    if (!formData.specialty) newErrors.specialty = "Specialty is required"
    if (!formData.reason.trim()) newErrors.reason = "Reason for referral is required"
    if (!formData.referredBy.trim()) newErrors.referredBy = "Referred by is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const referral = {
      id: `REF-${Date.now()}`,
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    if (onCreate) onCreate(referral)

    alert(`Referral created: ${formData.patientName} to ${formData.referralTo}`)

    setFormData({
      patientName: "",
      patientOmang: "",
      referralFrom: "",
      referralTo: "",
      specialty: "",
      priority: "routine",
      reason: "",
      clinicalHistory: "",
      attachments: "",
      referredBy: "",
      contactPhone: "",
    })
    setErrors({})
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 w-full">
          <Plus className="h-4 w-4 mr-2" />
          New Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Create Referral
          </DialogTitle>
          <DialogDescription>Refer a patient to a specialist or another facility</DialogDescription>
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
            <h3 className="font-semibold text-sm text-gray-700">Referral Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referralFrom">
                  Referring From <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.referralFrom}
                  onValueChange={(value) => handleInputChange("referralFrom", value)}
                >
                  <SelectTrigger className={errors.referralFrom ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility} value={facility}>
                        {facility}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.referralFrom && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.referralFrom}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralTo">
                  Referring To <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.referralTo} onValueChange={(value) => handleInputChange("referralTo", value)}>
                  <SelectTrigger className={errors.referralTo ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility} value={facility}>
                        {facility}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.referralTo && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.referralTo}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">
                  Specialty <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
                  <SelectTrigger className={errors.specialty ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialty && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.specialty}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
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
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for Referral <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Clinical reason for referral..."
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
              <Label htmlFor="clinicalHistory">Clinical History (Optional)</Label>
              <Textarea
                id="clinicalHistory"
                placeholder="Relevant clinical background..."
                value={formData.clinicalHistory}
                onChange={(e) => handleInputChange("clinicalHistory", e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referredBy">
                Referred By <span className="text-red-500">*</span>
              </Label>
              <Input
                id="referredBy"
                placeholder="Doctor/Clinician name"
                value={formData.referredBy}
                onChange={(e) => handleInputChange("referredBy", e.target.value)}
                className={errors.referredBy ? "border-red-500" : ""}
              />
              {errors.referredBy && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.referredBy}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="Contact number"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Create Referral
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
