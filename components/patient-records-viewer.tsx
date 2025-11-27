"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Download, Printer } from "lucide-react"
import mockRecords from "@/lib/mock-records.json"

interface PatientRecordsViewerProps {
  patientId?: string
}

export function PatientRecordsViewer({ patientId }: PatientRecordsViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [showRecordDetail, setShowRecordDetail] = useState(false)

  const filteredRecords = mockRecords.records.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.omang.includes(searchQuery) ||
      record.patientId === patientId,
  )

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "visit":
        return "bg-blue-100 text-blue-800"
      case "lab":
        return "bg-green-100 text-green-800"
      case "prescription":
        return "bg-purple-100 text-purple-800"
      case "imaging":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Patient Medical Records</h2>
        <div className="relative w-64">
          <Input
            placeholder="Search by patient name or Omang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4"
          />
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No records found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <FileText className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{record.patientName}</h3>
                        <Badge className={getRecordTypeColor(record.recordType)}>
                          {record.recordType === "visit"
                            ? "Clinical Visit"
                            : record.recordType === "lab"
                              ? "Lab Test"
                              : record.recordType === "prescription"
                                ? "Prescription"
                                : "Imaging"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Omang: {record.omang} • ID: {record.id}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {record.date} •{" "}
                        {record.recordType === "visit"
                          ? `${record.department} - ${record.diagnosis}`
                          : record.recordType === "lab"
                            ? `Lab Test: ${record.testType}`
                            : record.recordType === "prescription"
                              ? `${record.medication} ${record.dosage}`
                              : record.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={showRecordDetail} onOpenChange={setShowRecordDetail}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Medical Record Details</DialogTitle>
                          <DialogDescription>
                            {selectedRecord?.patientName} - {selectedRecord?.omang}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedRecord && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Patient Name</p>
                                <p className="font-semibold">{selectedRecord.patientName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Omang</p>
                                <p className="font-semibold">{selectedRecord.omang}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Record ID</p>
                                <p className="font-semibold">{selectedRecord.id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-semibold">{selectedRecord.date}</p>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              {selectedRecord.recordType === "visit" && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-600">Department</p>
                                      <p className="font-semibold">{selectedRecord.department}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Doctor</p>
                                      <p className="font-semibold">{selectedRecord.doctor}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Diagnosis</p>
                                      <p className="font-semibold">{selectedRecord.diagnosis}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Treatment</p>
                                      <p className="font-semibold">{selectedRecord.treatment}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Vitals</p>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                      <div className="p-2 bg-gray-50 rounded">
                                        <p className="text-xs text-gray-600">Temperature</p>
                                        <p className="font-semibold">{selectedRecord.vitals.temperature}</p>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded">
                                        <p className="text-xs text-gray-600">BP</p>
                                        <p className="font-semibold">{selectedRecord.vitals.bloodPressure}</p>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded">
                                        <p className="text-xs text-gray-600">Pulse</p>
                                        <p className="font-semibold">{selectedRecord.vitals.pulse}</p>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded">
                                        <p className="text-xs text-gray-600">Respiratory</p>
                                        <p className="font-semibold">{selectedRecord.vitals.respiratory}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Notes</p>
                                    <p className="text-sm">{selectedRecord.notes}</p>
                                  </div>
                                </div>
                              )}

                              {selectedRecord.recordType === "lab" && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-600">Test Type</p>
                                      <p className="font-semibold">{selectedRecord.testType}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Department</p>
                                      <p className="font-semibold">{selectedRecord.department}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Results</p>
                                    <p className="text-sm">{selectedRecord.results}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Notes</p>
                                    <p className="text-sm">{selectedRecord.notes}</p>
                                  </div>
                                </div>
                              )}

                              {selectedRecord.recordType === "prescription" && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-600">Medication</p>
                                      <p className="font-semibold">{selectedRecord.medication}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Dosage</p>
                                      <p className="font-semibold">{selectedRecord.dosage}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Frequency</p>
                                      <p className="font-semibold">{selectedRecord.frequency}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Duration</p>
                                      <p className="font-semibold">{selectedRecord.duration}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Indication</p>
                                      <p className="font-semibold">{selectedRecord.indication}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Doctor</p>
                                      <p className="font-semibold">{selectedRecord.doctor}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <DialogFooter>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
