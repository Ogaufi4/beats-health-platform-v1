"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Scan, AlertTriangle, Truck } from "lucide-react"

interface StockManagementProps {
  language: "en" | "tn"
}

export function StockManagement({ language }: StockManagementProps) {
  const [scanMode, setScanMode] = useState(false)

  const content = {
    en: {
      title: "Medicine Stock Management",
      subtitle: "Monitor and manage medicine inventory",
      currentStock: "Current Stock Levels",
      lowStockAlerts: "Low Stock Alerts",
      recentDeliveries: "Recent Deliveries",
      scanBarcode: "Scan Barcode",
      enterManually: "Enter Manually",
      reorderMedicine: "Reorder Medicine",
      stockLevel: "Stock Level",
      minimumLevel: "Minimum Level",
      lastOrdered: "Last Ordered",
      expiryDate: "Expiry Date",
      batchNumber: "Batch Number",
    },
    tn: {
      title: "Taolo ya Stock ya Dihlare",
      subtitle: "Tlhokomela le go laola stock ya dihlare",
      currentStock: "Maemo a Stock a Jaana",
      lowStockAlerts: "Dikitsiso tsa Stock e e Kwa Tlase",
      recentDeliveries: "Diromelo tsa Bosheng",
      scanBarcode: "Scan Barcode",
      enterManually: "Tsenya ka Seatla",
      reorderMedicine: "Odara Dihlare Gape",
      stockLevel: "Seelo sa Stock",
      minimumLevel: "Seelo se se Kwa Tlase",
      lastOrdered: "Ya Bofelo e Odarilwe",
      expiryDate: "Letsatsi la go Fela",
      batchNumber: "Nomoro ya Batch",
    },
  }

  const t = content[language]

  const stockData = [
    {
      medicine: "Amlodipine 5mg",
      current: 45,
      minimum: 100,
      status: "critical",
      lastOrdered: "2024-01-08",
      expiry: "2025-06-15",
      batch: "AMX2024001",
    },
    {
      medicine: "Metformin 500mg",
      current: 230,
      minimum: 200,
      status: "good",
      lastOrdered: "2024-01-05",
      expiry: "2025-03-20",
      batch: "MET2024002",
    },
    {
      medicine: "Paracetamol 500mg",
      current: 89,
      minimum: 150,
      status: "low",
      lastOrdered: "2024-01-10",
      expiry: "2025-08-10",
      batch: "PAR2024003",
    },
    {
      medicine: "Insulin (Rapid Acting)",
      current: 12,
      minimum: 50,
      status: "critical",
      lastOrdered: "2024-01-09",
      expiry: "2024-12-01",
      batch: "INS2024004",
    },
    {
      medicine: "Amoxicillin 250mg",
      current: 180,
      minimum: 120,
      status: "good",
      lastOrdered: "2024-01-07",
      expiry: "2025-04-30",
      batch: "AMO2024005",
    },
  ]

  const recentDeliveries = [
    {
      id: 1,
      medicines: ["Metformin 500mg", "Paracetamol 500mg"],
      quantity: "500 units",
      deliveryDate: "2024-01-10",
      status: "delivered",
      supplier: "Central Medical Stores",
    },
    {
      id: 2,
      medicines: ["Insulin (Rapid Acting)"],
      quantity: "100 units",
      deliveryDate: "2024-01-09",
      status: "in_transit",
      supplier: "Central Medical Stores",
    },
    {
      id: 3,
      medicines: ["Amlodipine 5mg", "Amoxicillin 250mg"],
      quantity: "300 units",
      deliveryDate: "2024-01-08",
      status: "delivered",
      supplier: "Central Medical Stores",
    },
  ]

  const getStockPercentage = (current: number, minimum: number) => {
    return Math.min((current / minimum) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "low":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "good":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setScanMode(!scanMode)}
            className={scanMode ? "bg-blue-50 border-blue-200" : ""}
          >
            <Scan className="h-4 w-4 mr-2" />
            {t.scanBarcode}
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Package className="h-4 w-4 mr-2" />
            {t.reorderMedicine}
          </Button>
        </div>
      </div>

      {scanMode && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Scan className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">
                  {language === "en" ? "Barcode Scanner Active" : "Scanner ya Barcode e Dira"}
                </p>
                <p className="text-sm text-blue-700">
                  {language === "en"
                    ? "Point camera at medicine barcode or enter manually below"
                    : "Lebelela khamera mo barcode kgotsa tsenya ka seatla fa tlase"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setScanMode(false)}>
                {language === "en" ? "Cancel" : "Khansela"}
              </Button>
            </div>
            <div className="mt-4">
              <Input placeholder={language === "en" ? "Enter barcode manually..." : "Tsenya barcode ka seatla..."} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Stock Levels */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t.currentStock}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockData.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${getStatusColor(item.status)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{item.medicine}</h3>
                      <p className="text-sm opacity-75">
                        {t.batchNumber}: {item.batch}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === "critical" ? "destructive" : item.status === "low" ? "secondary" : "default"
                      }
                    >
                      {item.status === "critical"
                        ? language === "en"
                          ? "Critical"
                          : "Botlhokwa"
                        : item.status === "low"
                          ? language === "en"
                            ? "Low"
                            : "Kwa tlase"
                          : language === "en"
                            ? "Good"
                            : "Siame"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm opacity-75">{t.stockLevel}</p>
                      <p className="text-lg font-bold">{item.current}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75">{t.minimumLevel}</p>
                      <p className="text-lg font-bold">{item.minimum}</p>
                    </div>
                  </div>

                  <Progress value={getStockPercentage(item.current, item.minimum)} className="mb-3" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-75">{t.lastOrdered}</p>
                      <p className="font-medium">{item.lastOrdered}</p>
                    </div>
                    <div>
                      <p className="opacity-75">{t.expiryDate}</p>
                      <p className="font-medium">{item.expiry}</p>
                    </div>
                  </div>

                  {(item.status === "critical" || item.status === "low") && (
                    <Button size="sm" className="mt-3 w-full bg-transparent" variant="outline">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {language === "en" ? "Reorder Now" : "Odara Jaanong"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar with alerts and deliveries */}
        <div className="space-y-4">
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                {t.lowStockAlerts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stockData
                  .filter((item) => item.status === "critical" || item.status === "low")
                  .map((item, index) => (
                    <div key={index} className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="font-medium text-red-900">{item.medicine}</p>
                      <p className="text-sm text-red-700">
                        {item.current} {language === "en" ? "units remaining" : "diyuniti di setseng"}
                      </p>
                      <p className="text-xs text-red-600">
                        {language === "en" ? "Below minimum level" : "Fa tlase ga seelo se se kwa tlase"}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t.recentDeliveries}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={delivery.status === "delivered" ? "default" : "secondary"}>
                        {delivery.status === "delivered"
                          ? language === "en"
                            ? "Delivered"
                            : "E isitswe"
                          : language === "en"
                            ? "In Transit"
                            : "E tsamaya"}
                      </Badge>
                      <span className="text-xs text-gray-500">{delivery.deliveryDate}</span>
                    </div>
                    <div className="space-y-1">
                      {delivery.medicines.map((medicine, idx) => (
                        <p key={idx} className="text-sm font-medium">
                          {medicine}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{delivery.quantity}</p>
                    <p className="text-xs text-gray-500">{delivery.supplier}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
