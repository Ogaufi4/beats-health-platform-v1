// Mock action handlers for all interactive features
export const mockActions = {
  // Care Coordination Actions
  checkSpecialistAvailability: async (specialist: string) => {
    console.log(`[v0] Checking specialist availability for: ${specialist}`)
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      specialist,
      available: Math.floor(Math.random() * 5) + 1,
      nextSlot: new Date(Date.now() + 86400000).toLocaleString(),
      success: true,
    }
  },

  bookAppointment: async (patientName: string, specialist: string, date: string) => {
    console.log(`[v0] Booking appointment for ${patientName} with ${specialist} on ${date}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      appointmentId: `APT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientName,
      specialist,
      date,
      status: "confirmed",
      success: true,
    }
  },

  generateReferral: async (patientName: string, facility: string) => {
    console.log(`[v0] Generating referral for ${patientName} to ${facility}`)
    await new Promise((resolve) => setTimeout(resolve, 900))
    return {
      referralId: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientName,
      facility,
      createdDate: new Date().toLocaleString(),
      status: "generated",
      success: true,
    }
  },

  // Stock Management Actions
  scanMedicine: async (barcode: string) => {
    console.log(`[v0] Scanning medicine barcode: ${barcode}`)
    await new Promise((resolve) => setTimeout(resolve, 600))
    const medicines = [
      { name: "Amlodipine 5mg", stock: 45, status: "critical" },
      { name: "Metformin 500mg", stock: 230, status: "good" },
      { name: "Paracetamol 500mg", stock: 89, status: "low" },
    ]
    return medicines[Math.floor(Math.random() * medicines.length)]
  },

  updateStockLevel: async (medicine: string, newLevel: number) => {
    console.log(`[v0] Stock updated: ${medicine} -> ${newLevel} units`)
    await new Promise((resolve) => setTimeout(resolve, 700))
    return {
      medicine,
      newLevel,
      updatedAt: new Date().toLocaleString(),
      status: "updated",
      success: true,
    }
  },

  triggerAutoReorder: async (medicine: string) => {
    console.log(`[v0] Reorder sent to CMS for: ${medicine}`)
    await new Promise((resolve) => setTimeout(resolve, 850))
    return {
      medicine,
      orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      quantity: Math.floor(Math.random() * 200) + 100,
      estimatedDelivery: "2024-01-15",
      status: "sent",
      success: true,
    }
  },

  // CMS Panel Actions
  viewNationalStock: async () => {
    console.log("[v0] Fetching national stock overview")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      totalFacilities: 200,
      criticalAlerts: 12,
      lowStockItems: 47,
      totalValue: "P2,450,000",
      lastUpdated: new Date().toLocaleString(),
      success: true,
    }
  },

  approveReorderRequest: async (requestId: string) => {
    console.log(`[v0] Approving reorder request: ${requestId}`)
    await new Promise((resolve) => setTimeout(resolve, 750))
    return {
      requestId,
      approvedAt: new Date().toLocaleString(),
      dispatchDate: "2024-01-13",
      status: "approved",
      success: true,
    }
  },

  previewRouteOptimization: async () => {
    console.log("[v0] Generating delivery route optimization")
    await new Promise((resolve) => setTimeout(resolve, 1200))
    return {
      optimizedRoutes: 8,
      estimatedSavings: "15%",
      fuelSaved: "247 liters",
      timeReduced: "4.5 hours",
      success: true,
    }
  },
}

export const mockStatistics = {
  careCoordination: {
    appointmentsScheduled: 342,
    specialistsAvailable: 48,
    equipmentUtilization: 78,
    patientSatisfaction: 92,
  },
  stockManagement: {
    medicinesTracked: 156,
    criticalAlerts: 8,
    reordersProcessed: 23,
    stockAccuracy: 97,
  },
  cmsPanel: {
    facilities: 200,
    activeOrders: 45,
    deliveriesCompleted: 1203,
    costSavings: "P380,000",
  },
}
