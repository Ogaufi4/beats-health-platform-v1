"use client"

import { useState } from "react"
import BeatsLogo from "@/components/BeatsLogo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Calendar,
  Package,
  Smartphone,
  Shield,
  Globe,
  Users,
  Activity,
  MapPin,
  Stethoscope,
  Pill,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "tn">("en")

  const content = {
    en: {
      title: "Beats Health",
      subtitle: "Centralizing Healthcare Access Across Botswana",
      description:
        "Secure, multilingual platform for real-time scheduling of medical specialists and diagnostic equipment, with automated medicine stock monitoring.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      features: {
        coordination: {
          title: "Care Coordination",
          description:
            "Real-time scheduling of specialists and diagnostic equipment across all public health facilities",
        },
        stock: {
          title: "Stock Management",
          description:
            "Automated medicine inventory tracking with smart replenishment alerts to Central Medical Stores",
        },
        accessibility: {
          title: "Rural Access",
          description: "SMS/USSD support for low-connectivity areas with Community Health Worker assistance",
        },
        security: {
          title: "Secure & Compliant",
          description: "End-to-end encryption, audit logs, and role-based access for healthcare data protection",
        },
      },
      stats: {
        facilities: "200+ Health Facilities",
        specialists: "500+ Medical Specialists",
        coverage: "Rural & Urban Coverage",
        languages: "English & Setswana",
      },
    },
    tn: {
      title: "Beats Health",
      subtitle: "Go kopanya phitlhelelo ya kalafi mo Botswana yotlhe",
      description:
        "Setheo se se sireletsegileng, se se buang dipuo tse pedi sa go rulaganya nako ya dingaka tse di ikgethileng le didirisiwa tsa tlhatlhobo ka nako ya mmatota.",
      getStarted: "Simolola",
      learnMore: "Ithute go le gontsi",
      features: {
        coordination: {
          title: "Thulaganyo ya Tlhokomelo",
          description:
            "Go rulaganya nako ya dingaka tse di ikgethileng le didirisiwa tsa tlhatlhobo ka nako ya mmatota",
        },
        stock: {
          title: "Taolo ya Stock",
          description: "Go latela stock ya dihlare ka go itiragalela le dikitsiso tse di botlhale tsa go tlatsa",
        },
        accessibility: {
          title: "Phitlhelelo ya Magae",
          description: "Tshegetso ya SMS/USSD mo mafelong a a kwa kgakala le thuso ya badiri ba boitekanelo",
        },
        security: {
          title: "Sireletso le Tshwaragano",
          description: "Sireletso ya data ya boitekanelo ka encryption le audit logs",
        },
      },
      stats: {
        facilities: "200+ Mafelo a Boitekanelo",
        specialists: "500+ Dingaka tse di Ikgethileng",
        coverage: "Magae le Matoropo",
        languages: "Sekgoa le Setswana",
      },
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BeatsLogo size={40} />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "tn" : "en")}>
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "Setswana" : "English"}
            </Button>
            <Link href="/login">
              <Button>{t.getStarted}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            <MapPin className="h-4 w-4 mr-1" />
            Botswana Ministry of Health
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">{t.subtitle}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t.description}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Activity className="h-5 w-5 mr-2" />
                {t.getStarted}
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              {t.learnMore}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">{t.stats.facilities}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">{t.stats.specialists}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">{t.stats.coverage}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">2</div>
              <div className="text-gray-600">{t.stats.languages}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Core Features" : "Dikarolo tse di Botlhokwa"}
            </h2>
            <p className="text-xl text-gray-600">
              {language === "en"
                ? "Comprehensive healthcare coordination for all of Botswana"
                : "Thulaganyo e e feletseng ya boitekanelo mo Botswana yotlhe"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>{t.features.coordination.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.coordination.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <Package className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>{t.features.stock.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.stock.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>{t.features.accessibility.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.accessibility.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>{t.features.security.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.security.description}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            {language === "en" ? "Real-World Impact" : "Tshusumetso ya Mmatota"}
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {language === "en" ? "Tinashe's Specialist Appointment" : "Kopano ya ga Tinashe le Ngaka"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en" ? "Rural clinic to specialist referral" : "Go romela mo ngakeng e e ikgethileng"}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>
                    {language === "en" ? "Rural clinic checks MRI availability" : "Kliniki ya magae e tlhola MRI"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>{language === "en" ? "Books appointment with specialist" : "E beela kopano le ngaka"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>
                    {language === "en" ? "Referral record created automatically" : "Rekoto ya go romela e dirwa"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>{language === "en" ? "Patient receives SMS confirmation" : "Molwetse o amogela SMS"}</span>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Pill className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {language === "en" ? "Mavis's Medicine Alert" : "Kitsiso ya dihlare ya ga Mavis"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en" ? "Automated stock replenishment" : "Go tlatsa stock ka go itiragalela"}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>{language === "en" ? "Amlodipine stock runs low" : "Stock ya Amlodipine e fela"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>{language === "en" ? "Barcode scan triggers auto-alert" : "Barcode e kgonsa kitsiso"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>{language === "en" ? "CMS sees regional demand" : "CMS e bona tlhokego ya kgaolo"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>{language === "en" ? "Bundled delivery dispatched" : "Dihlare di romelwa"}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {language === "en"
              ? "Ready to Transform Healthcare in Botswana?"
              : "O ipaakanyeditse go fetola boitekanelo mo Botswana?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {language === "en"
              ? "Join healthcare facilities across the country in providing better patient care."
              : "Nna karolo ya mafelo a boitekanelo mo nageng go neela tlhokomelo e e botoka."}
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Users className="h-5 w-5 mr-2" />
              {t.getStarted}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">{t.title}</span>
            </div>
            <div className="text-sm text-gray-400">
              {language === "en"
                ? "© 2024 Ministry of Health, Botswana. All rights reserved."
                : "© 2024 Lefapha la Boitekanelo, Botswana. Ditshwanelo tsotlhe di sireletsegile."}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
