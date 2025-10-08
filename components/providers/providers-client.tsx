"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Search, User, MapPin, DollarSign, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createBooking } from "@/app/actions/bookings"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface ProvidersClientProps {
  providers: any[]
}

export function ProvidersClient({ providers }: ProvidersClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredProviders = providers.filter(
    (provider) =>
      provider.profile?.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.profile?.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      provider.profile?.location?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createBooking({
        providerId: selectedProvider.id,
        date: new Date(bookingDate),
        time: bookingTime,
        notes,
      })

      toast({
        title: "Booking created",
        description: "Your booking request has been sent to the provider",
      })

      setSelectedProvider(null)
      setBookingDate("")
      setBookingTime("")
      setNotes("")
      router.push("/dashboard/user")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-lg font-bold">Beats Health</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Healthcare Providers</h1>
          <p className="text-gray-600">Browse and book appointments with qualified healthcare professionals</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, specialization, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>{provider.profile?.name || "Provider"}</CardTitle>
                    <CardDescription>{provider.profile?.specialization || "Healthcare Provider"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {provider.profile?.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.profile.location}</span>
                  </div>
                )}

                {provider.profile?.hourlyRate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>P{provider.profile.hourlyRate}/hour</span>
                  </div>
                )}

                {provider.profile?.bio && <p className="text-sm text-gray-600 line-clamp-2">{provider.profile.bio}</p>}

                <div className="pt-3">
                  <Button className="w-full" onClick={() => setSelectedProvider(provider)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Book an appointment with {selectedProvider?.profile?.name || "this provider"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBooking} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific concerns or requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setSelectedProvider(null)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
