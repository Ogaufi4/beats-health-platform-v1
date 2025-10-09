"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CHWDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-yellow-600" />
            Community Health Worker Dashboard
          </h1>
          <Button variant="outline" onClick={() => router.push("/")}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Household Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Record data from household visits and community outreach activities.
            </p>
            <Button className="mt-4 bg-yellow-600 hover:bg-yellow-700">
              <MapPin className="h-4 w-4 mr-2" />
              Log Visit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Submit health reports and feedback from your community assignments.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
