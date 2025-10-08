"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Heart, Globe, Bell, Settings, LogOut, Plus, User, Clock } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { format } from "date-fns"
import { updateBookingStatus } from "@/app/actions/bookings"
import { toast } from "@/components/ui/use-toast"
import type { Session } from "next-auth"

interface UserDashboardClientProps {
  bookings: any[]
  profile: any
  session: Session
}

export function UserDashboardClient({ bookings, profile, session }: UserDashboardClientProps) {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [loading, setLoading] = useState<string | null>(null)

  const content = {
    en: {
      title: "My Dashboard",
      welcome: "Welcome back",
      myBookings: "My Bookings",
      findProviders: "Find Providers",
      profile: "Profile",
      upcoming: "Upcoming",
      past: "Past",
      noBookings: "No bookings yet",
      bookProvider: "Book a Provider",
      viewProvider: "View Provider",
      cancelBooking: "Cancel",
      status: {
        pending: "Pending",
        confirmed: "Confirmed",
        declined: "Declined",
        cancelled: "Cancelled",
      },
    },
    tn: {
      title: "Dashboard ya Me",
      welcome: "Re go amogetse gape",
      myBookings: "Dikopano tsa Me",
      findProviders: "Batla Bafani",
      profile: "Profaele",
      upcoming: "Tse di Tlang",
      past: "Tse di Fetileng",
      noBookings: "Ga go na dikopano",
      bookProvider: "Beela Mofani",
      viewProvider: "Bona Mofani",
      cancelBooking: "Khansela",
      status: {
        pending: "E emetse",
        confirmed: "E netefatsitswe",
        declined: "E ganne",
        cancelled: "E khanseletse",
      },
    },
  }

  const t = content[language]

  const handleCancelBooking = async (bookingId: string) => {
    setLoading(bookingId)
    try {
      await updateBookingStatus(bookingId, "cancelled")
      toast({
        title: language === "en" ? "Booking cancelled" : "Kopano e khanseletse",
        description: language === "en" ? "Your booking has been cancelled" : "Kopano ya gago e khanseletse",
      })
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const upcomingBookings = bookings.filter((b) => new Date(b.date) >= new Date() && b.status !== "cancelled")
  const pastBookings = bookings.filter((b) => new Date(b.date) < new Date() || b.status === "cancelled")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Beats Health</h1>
                <p className="text-sm text-gray-600">{t.title}</p>
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
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t.welcome}, {profile?.name || session.user.email}!
          </h2>
          <p className="text-gray-600">
            {language === "en"
              ? "Manage your bookings and find healthcare providers"
              : "Laola dikopano tsa gago le go batla bafani ba boitekanelo"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</p>
                  <p className="text-sm text-gray-600">{t.upcoming} Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </p>
                  <p className="text-sm text-gray-600">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {bookings.filter((b) => b.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="upcoming">{t.upcoming}</TabsTrigger>
              <TabsTrigger value="past">{t.past}</TabsTrigger>
            </TabsList>
            <Link href="/providers">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t.findProviders}
              </Button>
            </Link>
          </div>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noBookings}</h3>
                  <p className="text-gray-600 mb-4">
                    {language === "en"
                      ? "Start by finding and booking a healthcare provider"
                      : "Simolola ka go batla le go beela mofani wa boitekanelo"}
                  </p>
                  <Link href="/providers">
                    <Button>{t.bookProvider}</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {booking.provider.profile?.name || booking.provider.email}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {booking.provider.profile?.specialization || "Healthcare Provider"}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {format(new Date(booking.date), "MMM dd, yyyy")}
                            </p>
                            <p className="text-sm text-gray-500">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {booking.time}
                            </p>
                          </div>
                          {booking.notes && <p className="text-sm text-gray-600 mt-1">{booking.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {t.status[booking.status as keyof typeof t.status]}
                        </Badge>
                        {booking.status !== "cancelled" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={loading === booking.id}
                          >
                            {t.cancelBooking}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No past bookings</h3>
                  <p className="text-gray-600">Your completed bookings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map((booking) => (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{booking.provider.profile?.name || booking.provider.email}</h3>
                          <p className="text-sm text-gray-600">
                            {booking.provider.profile?.specialization || "Healthcare Provider"}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {format(new Date(booking.date), "MMM dd, yyyy")}
                            </p>
                            <p className="text-sm text-gray-500">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {booking.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{t.status[booking.status as keyof typeof t.status]}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
