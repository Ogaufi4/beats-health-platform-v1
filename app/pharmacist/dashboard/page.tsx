import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function PharmacistDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")
  // Type guard to ensure session.user exists and has a role property
  const user = (session as { user?: { role?: string } }).user
  if (!user || (user.role !== "pharmacist" && user.role !== "facility_admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Pharmacist Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Stock table coming soon.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Alerts and reorder suggestions coming soon.</div>
          </CardContent>
        </Card>
      </div>
      <Button variant="default">Scan Barcode</Button>
    </div>
  )
}

