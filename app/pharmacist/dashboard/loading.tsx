export default function PharmacistDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded" />
              <div>
                <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-36 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 h-24" />
          ))}
        </div>
        <div className="bg-white rounded-lg p-6 h-96" />
      </div>
    </div>
  )
}
