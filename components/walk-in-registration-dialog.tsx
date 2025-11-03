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
import { User, Plus, AlertCircle, MessageSquare, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface WalkInRegistrationDialogProps {
  onRegister?: (patient: any) => void
}

export function WalkInRegistrationDialog({ onRegister }: WalkInRegistrationDialogProps) {
  const [open, setOpen] = useState(false)
  const [sendSMS, setSendSMS] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    omang: "",
    phone: "",
    priority: "routine",
    department: "",
    complaint: "",
    age: "",
    gender: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [registeredQueue, setRegisteredQueue] = useState("")

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

    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required"
    }
    if (!formData.omang.trim()) {
      newErrors.omang = "Omang number is required"
    } else if (formData.omang.length !== 9 || !/^\d+$/.test(formData.omang)) {
      newErrors.omang = "Omang must be 9 digits"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^7[0-9]{7}$/.test(formData.phone)) {
      newErrors.phone = "Phone must start with 7 and be 8 digits"
    }
    if (!formData.department) {
      newErrors.department = "Department is required"
    }
    if (!formData.complaint.trim()) {
      newErrors.complaint = "Chief complaint is required"
    }
    if (!formData.age) {
      newErrors.age = "Age is required"
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateWaitTime = (priority: string, department: string) => {
    const baseTimes: Record<string, number> = {
      Emergency: 5,
      "General Medicine": 25,
      Pediatrics: 20,
      Maternity: 15,
      Pharmacy: 10,
      Dental: 30,
      Radiology: 35,
      Laboratory: 15,
    }

    const priorityMultiplier: Record<string, number> = {
      emergency: 0.2,
      urgent: 0.5,
      routine: 1.0,
    }

    const baseTime = baseTimes[department] || 20
    const multiplier = priorityMultiplier[priority] || 1.0
    return Math.round(baseTime * multiplier)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const queueNumber = `Q${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    const estimatedWait = calculateWaitTime(formData.priority, formData.department)

    const newPatient = {
      id: Date.now(),
      queueNumber,
      ...formData,
      checkedInAt: timestamp,
      estimatedWait,
      status: "waiting" as const,
    }

    if (onRegister) {
      onRegister(newPatient)
    }

    setRegisteredQueue(queueNumber)
    setShowSuccess(true)

    // Simulate SMS sending
    if (sendSMS && formData.phone) {
      console.log(
        `SMS sent to ${formData.phone}: Your queue number is ${queueNumber}. Estimated wait time: ${estimatedWait} minutes. Princess Marina Hospital`,
      )
    }

    setTimeout(() => {
      setFormData({
        name: "",
        omang: "",
        phone: "",
        priority: "routine",
        department: "",
        complaint: "",
        age: "",
        gender: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
      })
      setErrors({})
      setShowSuccess(false)
      setOpen(false)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Register Walk-In
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Register Walk-In Patient
          </DialogTitle>
          <DialogDescription>Enter patient details to add them to the queue with SMS notification</DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-600">Patient Registered Successfully!</h3>
              <p className="text-3xl font-bold text-blue-600 my-4">{registeredQueue}</p>
              <p className="text-gray-600">Queue number assigned</p>
            </div>
            {sendSMS && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <MessageSquare className="h-4 w-4" />
                <span>SMS notification sent to {formData.phone}</span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Thabo Mogale"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="omang">
                    Omang Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="omang"
                    placeholder="e.g., 123456789"
                    value={formData.omang}
                    onChange={(e) => handleInputChange("omang", e.target.value)}
                    maxLength={9}
                    className={errors.omang ? "border-red-500" : ""}
                  />
                  {errors.omang && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.omang}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 35"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className={errors.age ? "border-red-500" : ""}
                  />
                  {errors.age && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.age}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.gender}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., 71234567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    maxLength={8}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., Gaborone, Block 8"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="e.g., Mma Lesego"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="e.g., 72345678"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    maxLength={8}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700">Medical Information & Triage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    Priority Level <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            Emergency
                          </Badge>
                          <span className="text-xs text-gray-500">Life-threatening</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-500 text-xs">Urgent</Badge>
                          <span className="text-xs text-gray-500">Needs prompt attention</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="routine">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Routine
                          </Badge>
                          <span className="text-xs text-gray-500">Standard care</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Maternity">Maternity</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint">
                  Chief Complaint <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="complaint"
                  placeholder="Describe the main reason for visit (e.g., Chest pain for 2 hours, difficulty breathing)"
                  value={formData.complaint}
                  onChange={(e) => handleInputChange("complaint", e.target.value)}
                  rows={4}
                  className={errors.complaint ? "border-red-500" : ""}
                />
                {errors.complaint && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.complaint}
                  </p>
                )}
              </div>
            </div>

            {/* SMS Notification Toggle */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                id="sendSMS"
                checked={sendSMS}
                onChange={(e) => setSendSMS(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="sendSMS" className="flex items-center gap-2 cursor-pointer">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span>Send queue number and wait time via SMS</span>
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <User className="h-4 w-4 mr-2" />
                Register & Queue Patient
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
