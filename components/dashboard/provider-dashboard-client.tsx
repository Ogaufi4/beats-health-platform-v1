"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Heart, Globe, Bell, Settings, LogOut, User, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { format } from "date-fns"
import { updateBookingStatus } from "@/app/actions/bookings"
import { toast } from "@/components/ui/use-toast"
import type { Session } from "next-auth"

interface ProviderDashboardClientProps {
  bookings: any[]
  profile: any
  session: Session
}

export function ProviderDashboardClient({ bookings, profile, session }: ProviderDashboardClientProps) {
  const [language, setLanguage] = useState<"en" | "tn">("en")
  const [loading, setLoading] = useState<string | null>(null)

  const content = {
    en: {
      title: "Provider Dashboard",
      welcome: "Welcome back",
      bookingRequests: "Booking Requests",
      confirmed: "Confirmed",
      all: "All",
      noBookings: "No booking requests",
      confirm: "Confirm",
      decline: "Decline",
      status: {
        pending: "Pending",
        confirmed: "Confirmed",
        declined: "Declined",
        cancelled: "Cancelled",
      },
    },
    tn: {
      title: "Dashboard ya Mofani",
      welcome: "Re go amogetse gape",
      bookingRequests: "Dikopo tsa Dikopano",
      confirmed: "Di Netefaditswe",
      all: "Tsotlhe",
      noBookings: "Ga go na dikopo",
      confirm: "Netefatsa",
      decline: "Gana",
      status: {
        pending: "E emetse",
        confirmed: "E netefatsitswe",
        declined: "E ganne",
        cancelled: "E khanseletse",
      },
    },
  }

  const t = content[language]

  const handleBookingAction = async (bookingId: string, action: "confirmed" | "declined") => {
    setLoading(bookingId)
    try {
      await updateBookingStatus(bookingId, action)
      toast({
        title: language === "en" ? "Booking updated" : "Kopano e ntšhwafaditswe",
        description:
          language === "en"
            ? `Booking ${action === "confirmed" ? "confirmed" : "declined"} successfully`
            : `Kopano e ${action === "confirmed" ? "netefatsitswe" : "ganne"} ka katleho`,
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

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")

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
            {language === "en" ? "Manage your bookings and schedule" : "Laola dikopano tsa gago le lenaneo"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{pendingBookings.length}</p>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{confirmedBookings.length}</p>
                  <p className="text-sm text-gray-600">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              {t.bookingRequests} ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">{t.confirmed}</TabsTrigger>
            <TabsTrigger value="all">{t.all}</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noBookings}</h3>
                  <p className="text-gray-600">New booking requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pendingBookings.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.user.profile?.name || booking.user.email}</h3>
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
                          {booking.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                          onClick={() => handleBookingAction(booking.id, "confirmed")}
                          disabled={loading === booking.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t.confirm}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookingAction(booking.id, "declined")}
                          disabled={loading === booking.id}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {t.decline}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {confirmedBookings.map((booking) => (
              <Card key={booking.id} className="border-l-4 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{booking.user.profile?.name || booking.user.email}</h3>
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
                    <Badge className="bg-green-100 text-green-800">{t.status.confirmed}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{booking.user.profile?.name || booking.user.email}</h3>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
