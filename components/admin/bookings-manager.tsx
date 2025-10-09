"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Stethoscope } from "lucide-react"
import { getAllBookings } from "@/app/actions/admin"

interface BookingsManagerProps {
  language: "en" | "tn"
}

export function BookingsManager({ language }: BookingsManagerProps) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    try {
      const data = await getAllBookings()
      setBookings(data)
    } catch (error) {
      console.error("Failed to load bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Overview</CardTitle>
        <CardDescription>View all appointment bookings in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{booking.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{booking.provider.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(booking.appointmentDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {booking.appointmentTime}
                  </div>
                </div>
                {booking.notes && <p className="text-sm text-gray-600">{booking.notes}</p>}
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
                {booking.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
