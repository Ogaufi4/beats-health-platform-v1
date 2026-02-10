"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, Users, Activity, Package, AlertTriangle } from "lucide-react"

export function PredictiveAnalytics() {
  const hourlyForecast = [
    { hour: "10:00", predicted: 12, actual: 11, department: "General Medicine" },
    { hour: "11:00", predicted: 15, actual: null, department: "General Medicine" },
    { hour: "12:00", predicted: 18, actual: null, department: "General Medicine" },
    { hour: "13:00", predicted: 14, actual: null, department: "General Medicine" },
  ]

  const departmentLoad = [
    { department: "Emergency", current: 8, capacity: 10, forecast: 12, status: "high" },
    { department: "General Medicine", current: 15, capacity: 20, forecast: 18, status: "medium" },
    { department: "Maternity", current: 5, capacity: 15, forecast: 7, status: "low" },
    { department: "Pediatrics", current: 12, capacity: 15, forecast: 14, status: "medium" },
    { department: "Pharmacy", current: 6, capacity: 10, forecast: 8, status: "medium" },
  ]

  const stockPredictions = [
    {
      medicine: "Amlodipine 5mg",
      current: 45,
      dailyUsage: 15,
      daysLeft: 3,
      status: "critical",
      reorderRecommended: true,
    },
    {
      medicine: "Metformin 500mg",
      current: 230,
      dailyUsage: 25,
      daysLeft: 9,
      status: "good",
      reorderRecommended: false,
    },
    {
      medicine: "Paracetamol 500mg",
      current: 89,
      dailyUsage: 18,
      daysLeft: 5,
      status: "low",
      reorderRecommended: true,
    },
  ]

  const weeklyPatterns = [
    { day: "Monday", avgPatients: 45, peakHour: "10:00", commonDepartment: "General Medicine" },
    { day: "Tuesday", avgPatients: 38, peakHour: "09:00", commonDepartment: "Maternity" },
    { day: "Wednesday", avgPatients: 42, peakHour: "11:00", commonDepartment: "General Medicine" },
    { day: "Thursday", avgPatients: 40, peakHour: "10:00", commonDepartment: "Pediatrics" },
    { day: "Friday", avgPatients: 48, peakHour: "09:00", commonDepartment: "General Medicine" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Predictive Analytics Dashboard</h2>
          <p className="text-sm text-gray-600">AI-powered insights for proactive resource planning</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
          <Activity className="h-3 w-3 mr-1" />
          Real-time Analysis
        </Badge>
      </div>

      {/* Hourly Demand Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Hourly Demand Forecast
          </CardTitle>
          <CardDescription>Predicted patient flow for the next 4 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hourlyForecast.map((forecast, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className="text-center min-w-[60px]">
                  <div className="text-lg font-bold text-blue-600">{forecast.hour}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Predicted:</span>
                    <span className="text-lg font-bold text-gray-900">{forecast.predicted} patients</span>
                    {forecast.actual && (
                      <>
                        <span className="text-sm text-gray-500">vs</span>
                        <span className="text-sm font-medium">Actual: {forecast.actual}</span>
                        <Badge variant="outline" className="text-xs">
                          {forecast.predicted > forecast.actual ? (
                            <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
                          ) : (
                            <TrendingUp className="h-3 w-3 mr-1 text-red-600" />
                          )}
                          {Math.abs(forecast.predicted - forecast.actual)} diff
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(forecast.predicted / 20) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{forecast.department}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Capacity Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Department Capacity & Load Forecast
          </CardTitle>
          <CardDescription>Current utilization and predicted load</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentLoad.map((dept, index) => {
              const utilization = Math.round((dept.current / dept.capacity) * 100)
              const forecastUtilization = Math.round((dept.forecast / dept.capacity) * 100)

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{dept.department}</h4>
                      <Badge
                        variant={
                          dept.status === "high" ? "destructive" : dept.status === "medium" ? "secondary" : "default"
                        }
                      >
                        {dept.status === "high" ? "High Load" : dept.status === "medium" ? "Moderate" : "Low Load"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{dept.current}</span> / {dept.capacity} capacity
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Current: {utilization}%</span>
                      <span>Forecast: {forecastUtilization}%</span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`absolute h-3 rounded-full transition-all ${
                          utilization > 80 ? "bg-red-500" : utilization > 60 ? "bg-orange-500" : "bg-green-500"
                        }`}
                        style={{ width: `${utilization}%` }}
                      />
                      <div
                        className="absolute h-3 border-2 border-blue-500 border-dashed rounded-full"
                        style={{ width: `${forecastUtilization}%` }}
                      />
                    </div>
                  </div>
                  {forecastUtilization > 90 && (
                    <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Alert: Predicted to exceed 90% capacity. Consider staff reallocation.</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Medicine Stock Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Medicine Stock Depletion Forecast
          </CardTitle>
          <CardDescription>Predicted stock-out dates based on current usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stockPredictions.map((stock, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  stock.status === "critical"
                    ? "bg-red-50 border-red-500"
                    : stock.status === "low"
                      ? "bg-orange-50 border-orange-500"
                      : "bg-green-50 border-green-500"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{stock.medicine}</h4>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">Current Stock:</span>
                        <div className="font-bold">{stock.current} units</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Daily Usage:</span>
                        <div className="font-bold">{stock.dailyUsage} units/day</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Days Remaining:</span>
                        <div
                          className={`font-bold ${
                            stock.daysLeft <= 3
                              ? "text-red-600"
                              : stock.daysLeft <= 7
                                ? "text-orange-600"
                                : "text-green-600"
                          }`}
                        >
                          {stock.daysLeft} days
                        </div>
                      </div>
                    </div>
                  </div>
                  {stock.reorderRecommended && (
                    <Badge variant="destructive" className="ml-4">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Reorder Now
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Patient Flow Patterns
          </CardTitle>
          <CardDescription>Historical patterns to optimize staffing schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyPatterns.map((pattern, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className="min-w-[100px]">
                  <div className="font-semibold">{pattern.day}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Avg Patients:</span>
                      <span className="ml-2 font-bold">{pattern.avgPatients}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Peak Hour:</span>
                      <span className="ml-2 font-bold">{pattern.peakHour}</span>
                    </div>
                    <div>
                      <Badge variant="outline">{pattern.commonDepartment}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
