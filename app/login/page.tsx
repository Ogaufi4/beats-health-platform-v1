"use client"

import type React from "react"
import BeatsLogo from "@/components/BeatsLogo"
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
        sedilega: "Sedilega Private Hospital",
        skmth: "Sir Ketumile Masire Teaching Hospital",
        athlone: "Athlone District Hospital",
        bamalete: "Bamalete Lutheran Hospital",
        mahalapye: "Mahalapye District Hospital",
        letsholathebe: "Letsholathebe II Memorial Hospital",
        deborah_retief: "Deborah Retief Memorial Hospital",
        rakops: "Rakops Primary Hospital",
        gph: "Gaborone Private Hospital",
        bdf_glen_valley: "BDF Clinic (Glen Valley)",
        bdf_sskb: "BDF Clinic (SSKB)",
        bdf_thebephatshwa: "BDF Clinic (Thebephatshwa)",
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
        sedilega: "Sepetlele sa Sedilega",
        skmth: "Sepetlele sa Thuto sa Sir Ketumile Masire",
        athlone: "Sepetlele sa Kgaolo sa Athlone",
        bamalete: "Sepetlele sa Bamalete Lutheran",
        mahalapye: "Sepetlele sa Kgaolo sa Mahalapye",
        letsholathebe: "Sepetlele sa Segopotso sa Letsholathebe II",
        deborah_retief: "Sepetlele sa Segopotso sa Deborah Retief",
        rakops: "Sepetlele sa Kotlhao sa Rakops",
        gph: "Sepetlele sa Segolo sa Gaborone",
        bdf_glen_valley: "Kliniki ya BDF (Glen Valley)",
        bdf_sskb: "Kliniki ya BDF (SSKB)",
        bdf_thebephatshwa: "Kliniki ya BDF (Thebephatshwa)",
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
            <BeatsLogo size={44} />
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
                    <SelectItem value="sedilega">{t.facilities.sedilega}</SelectItem>
                    <SelectItem value="skmth">{t.facilities.skmth}</SelectItem>
                    <SelectItem value="athlone">{t.facilities.athlone}</SelectItem>
                    <SelectItem value="bamalete">{t.facilities.bamalete}</SelectItem>
                    <SelectItem value="mahalapye">{t.facilities.mahalapye}</SelectItem>
                    <SelectItem value="letsholathebe">{t.facilities.letsholathebe}</SelectItem>
                    <SelectItem value="deborah_retief">{t.facilities.deborah_retief}</SelectItem>
                    <SelectItem value="rakops">{t.facilities.rakops}</SelectItem>
                    <SelectItem value="gph">{t.facilities.gph}</SelectItem>
                    <SelectItem value="bdf_glen_valley">{t.facilities.bdf_glen_valley}</SelectItem>
                    <SelectItem value="bdf_sskb">{t.facilities.bdf_sskb}</SelectItem>
                    <SelectItem value="bdf_thebephatshwa">{t.facilities.bdf_thebephatshwa}</SelectItem>
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
