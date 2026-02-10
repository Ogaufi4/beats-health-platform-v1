"use client"
import { useEffect, useState } from "react"

type FacilityMock = {
  id: string
  facility: string
  location?: string
  distance?: number
  stock: number
  stockLevel: "high" | "medium" | "low" | "out"
  medicines: string[]
  mapUrl?: string
}

export default function DoctorAvailabilitySuggestion({
  medicine,
  language = "en",
  forceLive = false, // pass true to prefer live API if NEXT_PUBLIC_API_BASE is set
}: {
  medicine: string
  language?: "en" | "tn"
  forceLive?: boolean
}) {
  const [suggestion, setSuggestion] = useState<FacilityMock | null>(null)
  const [loading, setLoading] = useState(false)
  const [useLive, setUseLive] = useState<boolean>(!!forceLive && !!process.env.NEXT_PUBLIC_API_BASE)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

  // Local mock dataset - extend as needed
  const MOCK_DATA: FacilityMock[] = [
    {
      id: "pmh",
      facility: "Princess Marina Hospital",
      location: "Gaborone",
      distance: 2.1,
      stock: 12,
      stockLevel: "high",
      medicines: ["paracetamol", "amoxicillin", "ibuprofen"],
      mapUrl: "https://maps.google.com/?q=Princess+Marina+Hospital",
    },
    {
      id: "nyg",
      facility: "Nyangabwe Referral Hospital",
      location: "Francistown",
      distance: 430,
      stock: 3,
      stockLevel: "low",
      medicines: ["amoxicillin", "ceftriaxone"],
      mapUrl: "https://maps.google.com/?q=Nyangabwe+Referral+Hospital",
    },
    {
      id: "maun",
      facility: "Maun General Hospital",
      location: "Maun",
      distance: 600,
      stock: 0,
      stockLevel: "out",
      medicines: ["ciprofloxacin"],
      mapUrl: "https://maps.google.com/?q=Maun+General+Hospital",
    },
  ]

  useEffect(() => {
    if (!medicine) {
      setSuggestion(null)
      return
    }

    let mounted = true
    const q = medicine.trim().toLowerCase()
    setLoading(true)

    async function fetchLive() {
      try {
        const res = await fetch(`${API_BASE}/api/availability/?q=${encodeURIComponent(q)}&limit=1`)
        if (!mounted) return
        if (!res.ok) throw new Error("Live API returned error")
        const data = await res.json()
        // Expecting array-like response; adapt when backend contract established
        setSuggestion((data && data[0]) || null)
      } catch (err) {
        // Fall back to mock if live fails
        setSuggestion(findFromMock(q))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    function findFromMock(query: string) {
      const found = MOCK_DATA.find((f) => f.medicines.some((m) => m.includes(query)) || f.facility.toLowerCase().includes(query))
      return found || null
    }

    if (useLive && process.env.NEXT_PUBLIC_API_BASE) {
      fetchLive()
    } else {
      // Simulate latency for mock path
      const t = setTimeout(() => {
        if (!mounted) return
        setSuggestion(findFromMock(q))
        setLoading(false)
      }, 450 + Math.random() * 300)
      return () => {
        mounted = false
        clearTimeout(t)
      }
    }

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicine, useLive])

  if (!medicine) return null

  const onPrintSlip = (fac: FacilityMock | null) => {
    if (!fac) return
    const slip = [
      language === "en" ? "Referral Slip" : "SLOPE ya phatlhaletseng",
      `Medicine: ${medicine}`,
      `Facility: ${fac.facility}`,
      `Location: ${fac.location ?? "-"}`,
      `Stock: ${fac.stock}`,
      `Note: This is a mock slip — replace with server PDF endpoint.`,
    ].join("\n\n")
    const w = window.open("", "_blank")
    if (w) {
      w.document.write("<pre style='font-family:monospace'>" + slip + "</pre>")
      w.document.title = "Referral Slip"
      w.focus()
      // keep print optional for local testing
      // w.print()
    }
  }

  return (
    <div className="bg-white p-3 rounded shadow text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium mb-1">{language === "en" ? "Availability suggestion" : "Kgopolo ya phitlhelelo"}</div>
          <div className="text-xs text-gray-500 mb-2">
            {language === "en"
              ? "Mock mode: using local sample data"
              : "Mo mokgweng wa mock: dirisa data ya sampole ya lokwalo"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Live</label>
          <input type="checkbox" checked={useLive} onChange={() => setUseLive((s) => !s)} />
        </div>
      </div>

      <div className="mt-2">
        {loading ? (
          <div className="text-gray-500">{language === "en" ? "Searching..." : "Go batla..."}</div>
        ) : suggestion ? (
          <div className="p-2 border rounded">
            <div className="font-semibold">{suggestion.facility}</div>
            <div className="text-xs text-gray-500">
              {suggestion.location} {suggestion.distance ? `• ${suggestion.distance} km` : ""}
            </div>
            <div className="mt-2 text-xs">
              <strong>{language === "en" ? "Stock:" : "Stock:"}</strong> {suggestion.stock} •{" "}
              <span className="capitalize">{suggestion.stockLevel}</span>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onPrintSlip(suggestion)}
                className="px-2 py-1 text-xs border rounded bg-white"
              >
                {language === "en" ? "Generate Slip" : "Tlhamela Slip"}
              </button>
              {suggestion.mapUrl && (
                <a href={suggestion.mapUrl} target="_blank" rel="noreferrer" className="px-2 py-1 text-xs border rounded bg-white">
                  {language === "en" ? "Directions" : "Dikgato"}
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">{language === "en" ? "No nearby alternatives found" : "Ga go mafelo a a fitlhegileng"}</div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        {language === "en"
          ? "This view is mock-only by default. Toggle 'Live' to attempt real API (requires NEXT_PUBLIC_API_BASE)."
          : "Ponelopele eno e mock fela ka tsela ya ntlha. Fetola 'Live' go leka API ya nnete (e batla NEXT_PUBLIC_API_BASE)."}
      </div>
    </div>
  )
}