"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Calendar } from "lucide-react"
import { getAllUsers } from "@/app/actions/admin"

interface UsersManagerProps {
  language: "en" | "tn"
}

export function UsersManager({ language }: UsersManagerProps) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | undefined>(undefined)

  useEffect(() => {
    loadUsers()
  }, [filter])

  async function loadUsers() {
    try {
      const data = await getAllUsers(filter)
      setUsers(data)
    } catch (error) {
      console.error("Failed to load users:", error)
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(undefined)}
            >
              All
            </Button>
            <Button variant={filter === "user" ? "default" : "outline"} size="sm" onClick={() => setFilter("user")}>
              Patients
            </Button>
            <Button
              variant={filter === "provider" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("provider")}
            >
              Providers
            </Button>
            <Button variant={filter === "admin" ? "default" : "outline"} size="sm" onClick={() => setFilter("admin")}>
              Admins
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge>{user.role}</Badge>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
