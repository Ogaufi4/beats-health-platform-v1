"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [userType, setUserType] = useState<string>("")
  const [facility, setFacility] = useState<string>("")
  const router = useRouter()

  const content = {
    en: {
      title: "Secure Login",
      subtitle: "Access Beats Health Platform",
      description: "Authenticate to access healthcare coordination tools",
      userType: "User Type",
      selectUserType: "Select your role",
      facility: "Health Facility",
      selectFacility: "Select your facility",
      staffId: "Staff ID",
      password: "Password",
      login: "Login",
      forgotPassword: "Forgot Password?",
      backHome: "Back to Home",
      roles: {
        admin: "MoH Administrator",
        facility_admin: "Facility Administrator",
        doctor: "Medical Doctor",
        nurse: "Nurse",
        pharmacist: "Pharmacist",
        chw: "Community Health Worker",
        cms: "Central Medical Stores",
      },
      facilities: {
        pmh: "Princess Marina Hospital",
        nyangabgwe: "Nyangabgwe Referral Hospital",
        scottish: "Scottish Livingstone Hospital",
        gaborone_clinic: "Gaborone Main Clinic",
        maun_clinic: "Maun General Hospital",
        francistown_clinic: "Francistown Clinic",
      },
    },
    tn: {
      title: "Tseno e e Sireletsegileng",
      subtitle: "Tsena mo Beats Health Platform",
      description: "Netefatsa gore o tsene mo didirisiwa tsa thulaganyo ya boitekanelo",
      userType: "Mofuta wa Modirisi",
      selectUserType: "Tlhopha seabe sa gago",
      facility: "Lefelo la Boitekanelo",
      selectFacility: "Tlhopha lefelo la gago",
      staffId: "Nomoro ya Modiri",
      password: "Password",
      login: "Tsena",
      forgotPassword: "O lebetse Password?",
      backHome: "Boela Gae",
      roles: {
        admin: "Motsamaisi wa MoH",
        facility_admin: "Motsamaisi wa Lefelo",
        doctor: "Ngaka",
        nurse: "Mooki",
        pharmacist: "Mooki wa Dihlare",
        chw: "Modiri wa Boitekanelo wa Motse",
        cms: "Central Medical Stores",
      },
      facilities: {
        pmh: "Sepetlele sa Princess Marina",
        nyangabgwe: "Sepetlele sa Nyangabgwe",
        scottish: "Sepetlele sa Scottish Livingstone",
        gaborone_clinic: "Kliniki Kgolo ya Gaborone",
        maun_clinic: "Sepetlele sa Maun",
        francistown_clinic: "Kliniki ya Francistown",
      },
    },
  }

  const t = content[language]

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault()

  switch (userType) {
    case "admin":
      router.push("/admin/dashboard")
      break
    case "facility_admin":
      router.push("/facility/dashboard")
      break
    case "doctor":
      router.push("/doctor/dashboard")
      break
    case "nurse":
      router.push("/nurse/dashboard")
      break
    case "pharmacist":
      router.push("/pharmacist/dashboard")
      break
    case "chw":
      router.push("/chw/dashboard")
      break
    case "cms":
      router.push("/cms/dashboard")
      break
    default:
      alert("Please select a valid user role.")
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            {t.backHome}
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">Beats Health</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "tn" : "en")}
            className="mb-4"
          >
            <Globe className="h-4 w-4 mr-2" />
            {language === "en" ? "Setswana" : "English"}
          </Button>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
            <Badge variant="secondary" className="w-fit mx-auto">
              {t.subtitle}
            </Badge>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">{t.userType}</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectUserType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t.roles.admin}</SelectItem>
                    <SelectItem value="facility_admin">{t.roles.facility_admin}</SelectItem>
                    <SelectItem value="doctor">{t.roles.doctor}</SelectItem>
                    <SelectItem value="nurse">{t.roles.nurse}</SelectItem>
                    <SelectItem value="pharmacist">{t.roles.pharmacist}</SelectItem>
                    <SelectItem value="chw">{t.roles.chw}</SelectItem>
                    <SelectItem value="cms">{t.roles.cms}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facility">{t.facility}</Label>
                <Select value={facility} onValueChange={setFacility} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectFacility} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pmh">{t.facilities.pmh}</SelectItem>
                    <SelectItem value="nyangabgwe">{t.facilities.nyangabgwe}</SelectItem>
                    <SelectItem value="scottish">{t.facilities.scottish}</SelectItem>
                    <SelectItem value="gaborone_clinic">{t.facilities.gaborone_clinic}</SelectItem>
                    <SelectItem value="maun_clinic">{t.facilities.maun_clinic}</SelectItem>
                    <SelectItem value="francistown_clinic">{t.facilities.francistown_clinic}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staffId">{t.staffId}</Label>
                <Input id="staffId" type="text" placeholder="BW001234" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input id="password" type="password" required />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Shield className="h-4 w-4 mr-2" />
                {t.login}
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm text-blue-600">
                  {t.forgotPassword}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="font-medium">
              {language === "en" ? "Secure Authentication" : "Netefatso e e Sireletsegileng"}
            </span>
          </div>
          <p>
            {language === "en"
              ? "All data is encrypted and compliant with healthcare privacy standards."
              : "Data yotlhe e sireletsegile e bile e latela melawana ya sephiri sa boitekanelo."}
          </p>
        </div>
      </div>
    </div>
  )
}
