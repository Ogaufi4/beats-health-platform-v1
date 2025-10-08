"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Globe, Activity } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "tn">("en")

  const content = {
    en: {
      title: "Beats Health",
      subtitle: "Centralizing Healthcare Access Across Botswana",
      getStarted: "Get Started",
      signIn: "Sign In",
    },
    tn: {
      title: "Beats Health",
      subtitle: "Go kopanya phitlhelelo ya kalafi mo Botswana yotlhe",
      getStarted: "Simolola",
      signIn: "Tsena",
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">{t.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "tn" : "en")}>
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "Setswana" : "English"}
            </Button>
            <Link href="/auth/signin">
              <Button variant="outline">{t.signIn}</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>{t.getStarted}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">{t.subtitle}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {language === "en"
              ? "Book appointments with healthcare providers and manage your health journey"
              : "Beela dikopano le bafani ba boitekanelo le go laola leeto la gago la boitekanelo"}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Activity className="h-5 w-5 mr-2" />
                {t.getStarted}
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline">
                {t.signIn}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
