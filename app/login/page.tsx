"use client"

import type React from "react"
import BeatsLogo from "@/components/BeatsLogo"
import { useEffect, useState } from "react"
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
        sedilega: "Sedilega Private Hospital",
        skmth: "Sir Ketumile Masire Teaching Hospital",
        athlone: "Athlone District Hospital",
        bamalete: "Bamalete Lutheran Hospital",
        mahalapye: "Mahalapye District Hospital",
        letsholathebe: "Letsholathebe II Memorial Hospital",
        deborah_retief: "Deborah Retief Memorial Hospital",
        rakops: "Rakops Primary Hospital",
        gph: "Gaborone Private Hospital",
        ub_clinic: "UB Clinic",
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
        pmh: "Sepetlele sa Princess Marina",
        sedilega: "Sepetlele sa Sedilega",
        skmth: "Sepetlele sa Thuto sa Sir Ketumile Masire",
        athlone: "Sepetlele sa Kgaolo sa Athlone",
        bamalete: "Sepetlele sa Bamalete Lutheran",
        mahalapye: "Sepetlele sa Kgaolo sa Mahalapye",
        letsholathebe: "Sepetlele sa Segopotso sa Letsholathebe II",
        deborah_retief: "Sepetlele sa Segopotso sa Deborah Retief",
        rakops: "Sepetlele sa Kotlhao sa Rakops",
        gph: "Sepetlele sa Segolo sa Gaborone",
        ub_clinic: "Kliniki ya UB",
        bdf_glen_valley: "Kliniki ya BDF (Glen Valley)",
        bdf_sskb: "Kliniki ya BDF (SSKB)",
        bdf_thebephatshwa: "Kliniki ya BDF (Thebephatshwa)",
      },
    },
  }

  const t = content[language]

  const isNationalRole = userType === "admin" || userType === "cms"

  useEffect(() => {
    if (isNationalRole) setFacility("")
  }, [isNationalRole])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Save selected facility info for the dashboard to display
    if (facility && userType && !isNationalRole) {
      const facilityNameEn = content.en.facilities[facility as keyof typeof content.en.facilities]
      const facilityNameTn = content.tn.facilities[facility as keyof typeof content.tn.facilities]
      
      localStorage.setItem("userFacilityKey", facility)
      localStorage.setItem("userFacilityNameEn", facilityNameEn || "")
      localStorage.setItem("userFacilityNameTn", facilityNameTn || "")
    }
    if (userType) {
      localStorage.setItem("userRole", userType)
    }

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Logo Watermark - Professional Branding */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none select-none">
        <BeatsLogo size={1500} />
      </div>

      {/* Subtle Floating Decorative Elements */}
      <div className="absolute top-10 left-10 animate-float opacity-10 pointer-events-none">
        <Heart className="h-20 w-20 text-blue-400" />
      </div>
      <div className="absolute bottom-20 right-[15%] animate-float opacity-[0.08] pointer-events-none" style={{ animationDelay: "1.5s" }}>
        <Shield className="h-32 w-32 text-green-400" />
      </div>
      <div className="absolute top-1/3 right-10 animate-float opacity-[0.05] pointer-events-none" style={{ animationDelay: "2s" }}>
        <Globe className="h-16 w-16 text-blue-300" />
      </div>

      <div className="w-full max-w-md z-10 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-transform hover:-translate-x-1">
            <ArrowLeft className="h-4 w-4" />
            {t.backHome}
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4 group">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-all duration-500 group-hover:shadow-md group-hover:scale-105">
              <BeatsLogo size={64} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "tn" : "en")}
            className="mb-4 hover:bg-white/50 backdrop-blur-sm"
          >
            <Globe className="h-4 w-4 mr-2" />
            {language === "en" ? "Setswana" : "English"}
          </Button>
        </div>

        <Card className="border-white/20 backdrop-blur-xl bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100/50 p-2 rounded-full backdrop-blur-sm">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">{t.title}</CardTitle>
            <CardDescription className="text-slate-600">{t.description}</CardDescription>
            <Badge variant="secondary" className="w-fit mx-auto mt-2 bg-blue-50 text-blue-700 border-blue-100 px-3 py-0.5">
              {t.subtitle}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-sm font-semibold text-slate-700">{t.userType}</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger className="bg-white/50 border-slate-200 focus:ring-blue-500 transition-all">
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
                <Label htmlFor="facility" className="text-sm font-semibold text-slate-700">{t.facility}</Label>
                <Select value={facility} onValueChange={setFacility} required={!isNationalRole} disabled={isNationalRole}>
                  <SelectTrigger className="bg-white/50 border-slate-200 focus:ring-blue-500 transition-all">
                    <SelectValue placeholder={t.selectFacility} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pmh">{t.facilities.pmh}</SelectItem>
                    <SelectItem value="sedilega">{t.facilities.sedilega}</SelectItem>
                    <SelectItem value="skmth">{t.facilities.skmth}</SelectItem>
                    <SelectItem value="athlone">{t.facilities.athlone}</SelectItem>
                    <SelectItem value="bamalete">{t.facilities.bamalete}</SelectItem>
                    <SelectItem value="mahalapye">{t.facilities.mahalapye}</SelectItem>
                    <SelectItem value="letsholathebe">{t.facilities.letsholathebe}</SelectItem>
                    <SelectItem value="deborah_retief">{t.facilities.deborah_retief}</SelectItem>
                    <SelectItem value="rakops">{t.facilities.rakops}</SelectItem>
                    <SelectItem value="gph">{t.facilities.gph}</SelectItem>
                    <SelectItem value="ub_clinic">{t.facilities.ub_clinic}</SelectItem>
                    <SelectItem value="bdf_glen_valley">{t.facilities.bdf_glen_valley}</SelectItem>
                    <SelectItem value="bdf_sskb">{t.facilities.bdf_sskb}</SelectItem>
                    <SelectItem value="bdf_thebephatshwa">{t.facilities.bdf_thebephatshwa}</SelectItem>
                  </SelectContent>
                </Select>
                {isNationalRole && (
                  <p className="text-xs text-slate-500 italic">Facility selection not required for this role.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="staffId" className="text-sm font-semibold text-slate-700">{t.staffId}</Label>
                <Input 
                  id="staffId" 
                  type="text" 
                  placeholder="BW001234" 
                  required 
                  className="bg-white/50 border-slate-200 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">{t.password}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-white/50 border-slate-200 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 py-6 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]">
                  <Shield className="h-5 w-5 mr-2" />
                  {t.login}
                </Button>
              </div>

              <div className="text-center">
                <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {t.forgotPassword}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 text-center text-sm text-slate-500 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-[1px] w-8 bg-slate-200"></div>
            <div className="flex items-center gap-1.5 px-2">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                {language === "en" ? "Secure Authentication" : "Netefatso e e Sireletsegileng"}
              </span>
            </div>
            <div className="h-[1px] w-8 bg-slate-200"></div>
          </div>
          <p className="leading-relaxed">
            {language === "en"
              ? "All data is encrypted and compliant with healthcare privacy standards."
              : "Data yotlhe e sireletsegile e bile e latela melawana ya sephiri sa boitekanelo."}
          </p>
        </div>
      </div>
    </div>
  )
}
