import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NurseDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")
  if (session.user.role !== "nurse" && session.user.role !== "facility_admin") redirect("/dashboard")

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Nurse Dashboard</h1>
      <Tabs defaultValue="intake">
        <TabsList>
          <TabsTrigger value="intake">Patient Intake</TabsTrigger>
          <TabsTrigger value="triage">Triage</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="intake">
          <Card>
            <CardHeader>
              <CardTitle>New Patient Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Form coming soon.</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="triage">
          <Card>
            <CardHeader>
              <CardTitle>Triage Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Queue and vitals capture coming soon.</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Appointment list coming soon.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
