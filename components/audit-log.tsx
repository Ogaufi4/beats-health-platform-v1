"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, User, FileEdit, Trash, Plus } from "lucide-react"

interface AuditLogEntry {
  id: string
  user: string
  action: "create" | "update" | "delete" | "view"
  resource: string
  details: string
  timestamp: string
}

interface AuditLogProps {
  language: "en" | "tn"
}

export function AuditLog({ language }: AuditLogProps) {
  const content = {
    en: {
      title: "Audit Log",
      description: "Track all system activities and changes",
      noLogs: "No activities recorded yet",
    },
    tn: {
      title: "Rekoto ya Ditiro",
      description: "Latela ditiro tsotlhe tsa tsamaiso le diphetogo",
      noLogs: "Ga go na ditiro tse di gatisitsweng",
    },
  }

  const t = content[language]

  const mockLogs: AuditLogEntry[] = [
    {
      id: "1",
      user: "Dr. Sarah Molefe",
      action: "create",
      resource: "Appointment",
      details: "Created appointment for Thabo Mogale",
      timestamp: "2024-01-11 09:15:23",
    },
    {
      id: "2",
      user: "Nurse Keabetswe",
      action: "update",
      resource: "Patient Record",
      details: "Updated vital signs for patient BW123456",
      timestamp: "2024-01-11 09:10:15",
    },
    {
      id: "3",
      user: "Pharmacist Mpho",
      action: "view",
      resource: "Medicine Stock",
      details: "Viewed Amlodipine 5mg stock levels",
      timestamp: "2024-01-11 09:05:42",
    },
    {
      id: "4",
      user: "Admin Peter",
      action: "delete",
      resource: "Cancelled Appointment",
      details: "Cancelled appointment for patient BW789012",
      timestamp: "2024-01-11 08:55:18",
    },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Plus className="h-4 w-4 text-green-600" />
      case "update":
        return <FileEdit className="h-4 w-4 text-blue-600" />
      case "delete":
        return <Trash className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-blue-100 text-blue-800"
      case "delete":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {mockLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>{t.noLogs}</p>
              </div>
            ) : (
              mockLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="mt-1">{getActionIcon(log.action)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(log.action)} variant="secondary">
                        {log.action}
                      </Badge>
                      <span className="font-medium text-sm">{log.resource}</span>
                    </div>
                    <p className="text-sm text-gray-600">{log.details}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{log.user}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
