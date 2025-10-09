"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Calendar, Building2 } from "lucide-react"
import { getSystemAnalytics } from "@/app/actions/admin"

interface AnalyticsDashboardProps {
  language: "en" | "tn"
}

export function AnalyticsDashboard({ language }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    try {
      const data = await getSystemAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Bookings by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.bookingsByStatus.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="capitalize">{item.status}</span>
                  <span className="font-bold">{item._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.usersByRole.map((item: any) => (
                <div key={item.role} className="flex items-center justify-between">
                  <span className="capitalize">{item.role}</span>
                  <span className="font-bold">{item._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Facilities by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.facilitiesByRegion.map((item: any) => (
                <div key={item.region} className="flex items-center justify-between">
                  <span className="capitalize">{item.region}</span>
                  <span className="font-bold">{item._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-sm text-gray-600">Showing bookings for the last 30 days</p>
              <p className="text-3xl font-bold mt-2">{analytics?.bookingsByMonth?.length || 0}</p>
              <p className="text-sm text-gray-500">Total bookings this month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
