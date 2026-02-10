"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, AlertCircle, CheckCircle, Users, Activity, MessageSquare } from "lucide-react"
import { WalkInRegistrationDialog } from "./walk-in-registration-dialog"

interface WalkInPatient {
  id: number
  queueNumber: string
  name: string
  omang: string
  priority: "emergency" | "urgent" | "routine"
  department: string
  complaint: string
  checkedInAt: string
  estimatedWait: number
  status: "waiting" | "in-progress" | "completed"
  assignedTo?: string
  age?: string
  gender?: string
  phone?: string
}

export function WalkInQueue() {
  const [filter, setFilter] = useState<"all" | "waiting" | "in-progress" | "completed">("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [patients, setPatients] = useState<WalkInPatient[]>([
    {
      id: 1,
      queueNumber: "Q001",
      name: "Rra Thabo Motsepe",
      omang: "BW123456",
      priority: "urgent",
      department: "Emergency",
      complaint: "Chest pain, difficulty breathing",
      checkedInAt: "08:15",
      estimatedWait: 5,
      status: "in-progress",
      assignedTo: "Dr. Sarah Molefe",
      age: "45",
      gender: "male",
      phone: "71234567",
    },
    {
      id: 2,
      queueNumber: "Q002",
      name: "Mma Keabetswe Tau",
      omang: "BW789012",
      priority: "routine",
      department: "General Medicine",
      complaint: "Regular check-up for hypertension",
      checkedInAt: "08:30",
      estimatedWait: 25,
      status: "waiting",
      age: "52",
      gender: "female",
      phone: "72345678",
    },
    {
      id: 3,
      queueNumber: "Q003",
      name: "Mma Naledi Kgomo",
      omang: "BW345678",
      priority: "urgent",
      department: "Maternity",
      complaint: "Labor pains, 39 weeks pregnant",
      checkedInAt: "08:45",
      estimatedWait: 10,
      status: "waiting",
      age: "28",
      gender: "female",
      phone: "73456789",
    },
    {
      id: 4,
      queueNumber: "Q004",
      name: "Rra Kabelo Seele",
      omang: "BW901234",
      priority: "routine",
      department: "Pharmacy",
      complaint: "Prescription collection",
      checkedInAt: "09:00",
      estimatedWait: 15,
      status: "waiting",
      age: "35",
      gender: "male",
      phone: "74567890",
    },
  ])

  const handleRegisterPatient = (newPatient: any) => {
    setPatients((prev) => [...prev, newPatient])
  }

  const handleCallPatient = (patientId: number) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: "in-progress" as const, assignedTo: "Dr. Smith" } : p)),
    )
  }

  const handleCompleteVisit = (patientId: number) => {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, status: "completed" as const } : p)))
  }

  const filteredPatients = patients.filter((patient) => {
    const statusMatch = filter === "all" || patient.status === filter
    const departmentMatch = departmentFilter === "all" || patient.department === departmentFilter
    return statusMatch && departmentMatch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800 border-red-500"
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-500"
      default:
        return "bg-blue-100 text-blue-800 border-blue-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Activity className="h-4 w-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const totalWalkIns = patients.length
  const waitingCount = patients.filter((p) => p.status === "waiting").length
  const inProgressCount = patients.filter((p) => p.status === "in-progress").length
  const emergencyCount = patients.filter((p) => p.priority === "emergency").length
  const avgWaitTime = Math.round(patients.reduce((sum, p) => sum + p.estimatedWait, 0) / (patients.length || 1))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Walk-In Queue Management
          </CardTitle>
          <CardDescription>Real-time walk-in patient queue with smart triage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients ({patients.length})</SelectItem>
                  <SelectItem value="waiting">Waiting ({waitingCount})</SelectItem>
                  <SelectItem value="in-progress">In Progress ({inProgressCount})</SelectItem>
                  <SelectItem value="completed">
                    Completed ({patients.filter((p) => p.status === "completed").length})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                  <SelectItem value="Maternity">Maternity</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Dental">Dental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <WalkInRegistrationDialog onRegister={handleRegisterPatient} />
          </div>

          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No patients in queue</p>
              <p className="text-sm text-gray-400">Register a walk-in patient to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className={`border-l-4 ${
                    patient.priority === "emergency"
                      ? "border-red-500"
                      : patient.priority === "urgent"
                        ? "border-orange-500"
                        : "border-blue-500"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                            <span className="text-lg font-bold text-blue-600">{patient.queueNumber}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <p className="text-sm text-gray-600">
                              {patient.omang} • {patient.age} years • {patient.gender}
                            </p>
                          </div>
                          <Badge variant="outline" className={getPriorityColor(patient.priority)}>
                            {patient.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">
                            {getStatusIcon(patient.status)}
                            <span className="ml-1 capitalize">{patient.status.replace("-", " ")}</span>
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Department:</strong> {patient.department}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Complaint:</strong> {patient.complaint}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Checked In:</strong> {patient.checkedInAt}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Est. Wait: <strong>{patient.estimatedWait} mins</strong>
                              </span>
                            </div>
                            {patient.assignedTo && (
                              <p className="text-sm text-gray-600">
                                <strong>Assigned to:</strong> {patient.assignedTo}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              <strong>Phone:</strong> {patient.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {patient.status === "waiting" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleCallPatient(patient.id)}
                            >
                              Call Patient
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send SMS
                            </Button>
                          </>
                        )}
                        {patient.status === "in-progress" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCompleteVisit(patient.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queue Analytics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Walk-Ins Today</p>
                <p className="text-2xl font-bold text-blue-600">{totalWalkIns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Wait Time</p>
                <p className="text-2xl font-bold text-orange-600">{avgWaitTime} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Currently Active</p>
                <p className="text-2xl font-bold text-green-600">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Emergency Cases</p>
                <p className="text-2xl font-bold text-red-600">{emergencyCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
