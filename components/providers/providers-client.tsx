"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, MapPin, User, Calendar } from "lucide-react"
import { createBooking } from "@/app/actions/bookings"
import { toast } from "sonner"

interface Provider {
  id: string
  profile: {
    name: string
    specialization: string | null
    location: string | null
    bio: string | null
    hourlyRate: number | null
  } | null
}

interface ProvidersClientProps {
  providers: Provider[]
}

export function ProvidersClient({ providers }: ProvidersClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    notes: "",
  })
  const [isBooking, setIsBooking] = useState(false)

  const filteredProviders = providers.filter((provider) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      provider.profile?.name.toLowerCase().includes(searchLower) ||
      provider.profile?.specialization?.toLowerCase().includes(searchLower) ||
      provider.profile?.location?.toLowerCase().includes(searchLower)
    )
  })

  const handleBooking = async () => {
    if (!selectedProvider || !bookingData.date || !bookingData.time) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsBooking(true)
    try {
      const result = await createBooking({
        providerId: selectedProvider.id,
        date: new Date(bookingData.date),
        time: bookingData.time,
        notes: bookingData.notes,
      })

      if (result.success) {
        toast.success("Booking created successfully! Awaiting provider confirmation.")
        setSelectedProvider(null)
        setBookingData({ date: "", time: "", notes: "" })
        router.push("/dashboard/user")
      } else {
        toast.error(result.error || "Failed to create booking")
      }
    } catch (error) {
      toast.error("Failed to create booking")
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Healthcare Providers</h1>
        <p className="text-gray-600">Browse and book appointments with healthcare professionals</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by name, specialization, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No providers found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {provider.profile?.name || "Provider"}
                </CardTitle>
                {provider.profile?.specialization && (
                  <CardDescription>{provider.profile.specialization}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {provider.profile?.location && (
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {provider.profile.location}
                    </p>
                  )}
                  {provider.profile?.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{provider.profile.bio}</p>
                  )}
                  {provider.profile?.hourlyRate && (
                    <p className="text-sm font-semibold text-blue-600">P{provider.profile.hourlyRate}/hour</p>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setSelectedProvider(provider)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book Appointment</DialogTitle>
                        <DialogDescription>Schedule an appointment with {provider.profile?.name}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={bookingData.date}
                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={bookingData.time}
                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Any additional information..."
                            value={bookingData.notes}
                            onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <Button onClick={handleBooking} disabled={isBooking} className="w-full">
                          {isBooking ? "Booking..." : "Confirm Booking"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
