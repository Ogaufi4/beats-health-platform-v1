"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Plus, Edit, Trash2, MapPin, Users } from "lucide-react"
import { getAllFacilities, createFacility, updateFacility, deleteFacility } from "@/app/actions/admin"
import { useToast } from "@/components/ui/use-toast"

interface FacilitiesManagerProps {
  language: "en" | "tn"
}

export function FacilitiesManager({ language }: FacilitiesManagerProps) {
  const [facilities, setFacilities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    type: "clinic",
    district: "",
    region: "central",
    capacity: 0,
    staffCount: 0,
  })

  useEffect(() => {
    loadFacilities()
  }, [])

  async function loadFacilities() {
    try {
      const data = await getAllFacilities()
      setFacilities(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load facilities",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingFacility) {
        await updateFacility(editingFacility.id, formData)
        toast({ title: "Success", description: "Facility updated successfully" })
      } else {
        await createFacility(formData)
        toast({ title: "Success", description: "Facility created successfully" })
      }
      setIsDialogOpen(false)
      resetForm()
      loadFacilities()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save facility",
        variant: "destructive",
      })
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      type: "clinic",
      district: "",
      region: "central",
      capacity: 0,
      staffCount: 0,
    })
    setEditingFacility(null)
  }

  function handleEdit(facility: any) {
    setEditingFacility(facility)
    setFormData({
      name: facility.name,
      type: facility.type,
      district: facility.district,
      region: facility.region,
      capacity: facility.capacity,
      staffCount: facility.staffCount,
    })
    setIsDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this facility?")) {
      try {
        await deleteFacility(id)
        toast({ title: "Success", description: "Facility deleted successfully" })
        loadFacilities()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete facility",
          variant: "destructive",
        })
      }
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
            <CardTitle>Healthcare Facilities</CardTitle>
            <CardDescription>Manage all healthcare facilities in the system</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingFacility ? "Edit" : "Add"} Facility</DialogTitle>
                <DialogDescription>{editingFacility ? "Update" : "Create a new"} healthcare facility</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Facility Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="clinic">Clinic</option>
                    <option value="hospital">Hospital</option>
                    <option value="health_post">Health Post</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <select
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="central">Central</option>
                    <option value="southern">Southern</option>
                    <option value="northern">Northern</option>
                    <option value="western">Western</option>
                    <option value="eastern">Eastern</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="staffCount">Staff Count</Label>
                  <Input
                    id="staffCount"
                    type="number"
                    value={formData.staffCount}
                    onChange={(e) => setFormData({ ...formData, staffCount: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingFacility ? "Update" : "Create"} Facility
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {facilities.map((facility) => (
            <div key={facility.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <Building2 className="h-8 w-8 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold">{facility.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{facility.type}</Badge>
                    <Badge variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      {facility.district}, {facility.region}
                    </Badge>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>Capacity: {facility.capacity}</span>
                    <span>
                      <Users className="h-3 w-3 inline mr-1" />
                      Staff: {facility.staffCount}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(facility)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(facility.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
