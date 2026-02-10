"use client"
import { useEffect, useState } from "react"

type Role = "pharmacist" | "nurse" | "doctor"
type Lang = "en" | "tn"

export default function MedicineAvailabilityLookup({ role = "pharmacist", language = "en" }: { role?: Role; language?: Lang }) {
  const [q, setQ] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

  async function search(query?: string) {
    const searchQ = (query ?? q).trim()
    if (!searchQ) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/availability/?q=${encodeURIComponent(searchQ)}`)
      if (!res.ok) throw new Error("fetch failed")
      const data = await res.json()
      setResults(data)
    } catch (e) {
      console.error(e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // optional: prefetch suggestions on mount
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center gap-2 mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder={language === "en" ? "Search medicine name (e.g. Paracetamol)" : "Batla leina la dihlare"}
            className="flex-1 border rounded px-3 py-2"
          />
          <button onClick={() => search()} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? (language === "en" ? "Searching..." : "Go batlile") : language === "en" ? "Search" : "Batla"}
          </button>
        </div>

        <div className="space-y-2">
          {results.length === 0 && !loading && <div className="text-sm text-gray-500">{language === "en" ? "No results" : "Ga go diphetho"}</div>}

          {results.map((f: any) => (
            <div key={f.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-semibold">{f.facility}</div>
                <div className="text-sm text-gray-500">{f.location ?? ""} {f.distance ? `• ${f.distance} km` : ""}</div>
              </div>

              <div className="text-right">
                <div
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    f.stockLevel === "high" ? "bg-green-100 text-green-800" : f.stockLevel === "medium" ? "bg-yellow-100 text-yellow-800" : f.stockLevel === "low" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {f.stock ?? 0} {language === "en" ? "units" : "dikgolo"}
                </div>

                <div className="mt-2 flex gap-2 justify-end">
                  {role === "pharmacist" && (
                    <button
                      onClick={() => {
                        // placeholder slip action — replace with PDF endpoint / server-side slip generator
                        const slip = `Referral slip\nMedicine: ${q}\nFacility: ${f.facility}\nLocation: ${f.location}\nStock: ${f.stock}`
                        const w = window.open("", "_blank")
                        if (w) {
                          w.document.write("<pre>" + slip + "</pre>")
                          w.print()
                        }
                      }}
                      className="text-xs px-2 py-1 border rounded bg-white"
                    >
                      {language === "en" ? "Print Slip" : "Printa Slip"}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      // quick view / directions placeholder
                      if (f.mapUrl) window.open(f.mapUrl, "_blank")
                    }}
                    className="text-xs px-2 py-1 border rounded bg-white"
                  >
                    {language === "en" ? "Directions" : "Dikgato"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs text-gray-400">
          {language === "en"
            ? "Note: frontend expects a Django API at /api/availability/?q=<name>. Use NEXT_PUBLIC_API_BASE to change host."
            : "Tlhokomelo: frontend e lebeletse API ya Django mo /api/availability/?q=<name>."}
        </div>
      </div>
    </div>
  )
}