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
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react"

interface NewPatientRegistrationDialogProps {
  onRegister?: (patient: any) => void
}

export function NewPatientRegistrationDialog({ onRegister }: NewPatientRegistrationDialogProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    omang: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Botswana",

    // Contact Information
    phone: "",
    alternatePhone: "",
    email: "",
    physicalAddress: "",
    postalAddress: "",
    village: "",
    district: "",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",

    // Medical Information
    bloodType: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    previousSurgeries: "",

    // Additional Information
    occupation: "",
    employer: "",
    insuranceProvider: "",
    insuranceNumber: "",
    maritalStatus: "",
    nextOfKin: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      // Personal Information validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
      }
      if (!formData.omang.trim()) {
        newErrors.omang = "Omang number is required"
      } else if (formData.omang.length !== 9 || !/^\d+$/.test(formData.omang)) {
        newErrors.omang = "Omang must be 9 digits"
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required"
      }
      if (!formData.gender) {
        newErrors.gender = "Gender is required"
      }
    } else if (step === 2) {
      // Contact Information validation
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      } else if (!/^[0-9]{8}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be 8 digits"
      }
      if (!formData.physicalAddress.trim()) {
        newErrors.physicalAddress = "Physical address is required"
      }
      if (!formData.village.trim()) {
        newErrors.village = "Village/Town is required"
      }
      if (!formData.district) {
        newErrors.district = "District is required"
      }
    } else if (step === 3) {
      // Emergency Contact validation
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = "Emergency contact name is required"
      }
      if (!formData.emergencyContactPhone.trim()) {
        newErrors.emergencyContactPhone = "Emergency contact phone is required"
      }
      if (!formData.emergencyContactRelation.trim()) {
        newErrors.emergencyContactRelation = "Relationship is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    const patientId = `PAT${Date.now()}`
    const newPatient = {
      id: patientId,
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      registrationDate: new Date().toISOString(),
      status: "active",
    }

    if (onRegister) {
      onRegister(newPatient)
    }

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      omang: "",
      dateOfBirth: "",
      gender: "",
      nationality: "Botswana",
      phone: "",
      alternatePhone: "",
      email: "",
      physicalAddress: "",
      postalAddress: "",
      village: "",
      district: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      bloodType: "",
      allergies: "",
      chronicConditions: "",
      currentMedications: "",
      previousSurgeries: "",
      occupation: "",
      employer: "",
      insuranceProvider: "",
      insuranceNumber: "",
      maritalStatus: "",
      nextOfKin: "",
    })
    setErrors({})
    setCurrentStep(1)
    setOpen(false)

    alert(`Patient ${formData.firstName} ${formData.lastName} registered successfully! Patient ID: ${patientId}`)
  }

  const districts = [
    "Central",
    "Ghanzi",
    "Kgalagadi",
    "Kgatleng",
    "Kweneng",
    "North East",
    "North West",
    "South East",
    "Southern",
  ]

  return (
    <Dialog open={open} onValueChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Register New Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New Patient
          </DialogTitle>
          <DialogDescription>Step {currentStep} of 4: Complete patient registration</DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step < currentStep
                    ? "bg-green-500 text-white"
                    : step === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
              {step < 4 && <div className={`flex-1 h-1 mx-2 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="e.g., Thabo"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="e.g., Mogale"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.lastName}
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
                  <Label htmlFor="dateOfBirth">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.dateOfBirth}
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
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => handleInputChange("nationality", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Botswana">Botswana</SelectItem>
                      <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Namibia">Namibia</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => handleInputChange("maritalStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="e.g., Teacher"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700 mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    type="tel"
                    placeholder="e.g., 72345678"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                    maxLength={8}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., thabo@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="physicalAddress">
                    Physical Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="physicalAddress"
                    placeholder="e.g., Plot 123, Block 8, Gaborone"
                    value={formData.physicalAddress}
                    onChange={(e) => handleInputChange("physicalAddress", e.target.value)}
                    rows={2}
                    className={errors.physicalAddress ? "border-red-500" : ""}
                  />
                  {errors.physicalAddress && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.physicalAddress}
                    </p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="postalAddress">Postal Address</Label>
                  <Input
                    id="postalAddress"
                    placeholder="e.g., P.O. Box 1234, Gaborone"
                    value={formData.postalAddress}
                    onChange={(e) => handleInputChange("postalAddress", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="village">
                    Village/Town <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="village"
                    placeholder="e.g., Gaborone"
                    value={formData.village}
                    onChange={(e) => handleInputChange("village", e.target.value)}
                    className={errors.village ? "border-red-500" : ""}
                  />
                  {errors.village && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.village}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">
                    District <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
                    <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.district}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="emergencyContactName">
                    Emergency Contact Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="emergencyContactName"
                    placeholder="e.g., Mma Lesego"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                    className={errors.emergencyContactName ? "border-red-500" : ""}
                  />
                  {errors.emergencyContactName && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.emergencyContactName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelation">
                    Relationship <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.emergencyContactRelation}
                    onValueChange={(value) => handleInputChange("emergencyContactRelation", value)}
                  >
                    <SelectTrigger className={errors.emergencyContactRelation ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="relative">Other Relative</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.emergencyContactRelation && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.emergencyContactRelation}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">
                    Emergency Contact Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    placeholder="e.g., 72345678"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                    maxLength={8}
                    className={errors.emergencyContactPhone ? "border-red-500" : ""}
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.emergencyContactPhone}
                    </p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="nextOfKin">Next of Kin (Full Name and Contact)</Label>
                  <Textarea
                    id="nextOfKin"
                    placeholder="e.g., Rra Kabelo Mogale, 71234567"
                    value={formData.nextOfKin}
                    onChange={(e) => handleInputChange("nextOfKin", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Medical and Insurance Information */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700 mb-4">Medical & Insurance Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    placeholder="e.g., BOMAID"
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="insuranceNumber">Insurance Number</Label>
                  <Input
                    id="insuranceNumber"
                    placeholder="e.g., INS123456"
                    value={formData.insuranceNumber}
                    onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="List any known allergies (e.g., penicillin, peanuts)"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                  <Textarea
                    id="chronicConditions"
                    placeholder="List any chronic conditions (e.g., diabetes, hypertension)"
                    value={formData.chronicConditions}
                    onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    placeholder="List current medications and dosages"
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="previousSurgeries">Previous Surgeries/Procedures</Label>
                  <Textarea
                    id="previousSurgeries"
                    placeholder="List any previous surgeries or major medical procedures"
                    value={formData.previousSurgeries}
                    onChange={(e) => handleInputChange("previousSurgeries", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Previous
              </Button>
            )}
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            ) : (
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Register Patient
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
