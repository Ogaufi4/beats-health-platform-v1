"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Users, Calendar, Building2, Clock, Heart, Globe, Bell, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { FacilitiesManager } from "./facilities-manager"
import { UsersManager } from "./users-manager"
import { BookingsManager } from "./bookings-manager"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { getAdminStats } from "@/app/actions/admin"

export function AdminDashboardClient() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const data = await getAdminStats()
      setStats(data)
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const content = {
    en: {
      title: "System Administration",
      subtitle: "Beats Health Platform Management",
      overview: "Overview",
      facilities: "Facilities",
      users: "Users",
      bookings: "Bookings",
      analytics: "Analytics",
      stats: {
        totalFacilities: "Total Facilities",
        totalUsers: "Total Users",
        pendingBookings: "Pending Bookings",
        activeProviders: "Active Providers",
      },
      recentActivity: "Recent User Registrations",
      logout: "Sign Out",
    },
    tn: {
      title: "Taolo ya Tsamaiso",
      subtitle: "Taolo ya Beats Health Platform",
      overview: "Kakaretso",
      facilities: "Mafelo",
      users: "Badirisi",
      bookings: "Dikopano",
      analytics: "Tshekatsheko",
      stats: {
        totalFacilities: "Mafelo Otlhe",
        totalUsers: "Badirisi Botlhe",
        pendingBookings: "Dikopano tse di Emetsweng",
        activeProviders: "Batlamedi ba ba Dirang",
      },
      recentActivity: "Dikwadiso tsa Bosheng",
      logout: "Tswa",
    },
  }

  const t = content[language]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Beats Health Admin</h1>
                  <p className="text-sm text-gray-600">{t.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "tn" : "en")}>
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "Setswana" : "English"}
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <Badge variant="secondary" className="mb-4">
            <Activity className="h-4 w-4 mr-1" />
            {language === "en" ? "Live System" : "Tsamaiso ya Mmatota"}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="facilities">{t.facilities}</TabsTrigger>
            <TabsTrigger value="users">{t.users}</TabsTrigger>
            <TabsTrigger value="bookings">{t.bookings}</TabsTrigger>
            <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.totalFacilities}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalFacilities || 0}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Healthcare centers
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.totalUsers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.totalUsers || 0}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Registered users
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.pendingBookings}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats?.pendingBookings || 0}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Awaiting confirmation
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t.stats.activeProviders}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats?.activeProviders || 0}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Healthcare providers
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t.recentActivity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentUsers?.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{user.role}</Badge>
                        <span className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities">
            <FacilitiesManager language={language} />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager language={language} />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsManager language={language} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
