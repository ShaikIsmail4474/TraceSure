
import { useMemo, useState } from 'react'
import { Truck, Search, MapPin, CalendarDays, Package } from 'lucide-react'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getStatusStyle(status) {
  const value = String(status || '').toUpperCase()

  if (value === 'DELIVERED') {
    return 'bg-emerald-50 text-emerald-700'
  }

  if (value === 'IN_TRANSIT') {
    return 'bg-blue-50 text-blue-700'
  }

  if (value === 'PENDING') {
    return 'bg-amber-50 text-amber-700'
  }

  if (value === 'CANCELLED' || value === 'FAILED') {
    return 'bg-red-50 text-red-700'
  }

  return 'bg-slate-100 text-slate-600'
}

export default function Shipments({
  shipments = [],
  batches = [],
  loading,
  error,
  onRetry,
}) {
  const [search, setSearch] = useState('')

  const filteredShipments = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return shipments

    return shipments.filter((shipment) => {
      const batch = batches.find(
        (item) => item.id === shipment.batch_id
      )

      return [
        shipment.shipment_number,
        shipment.shipment_code,
        shipment.id,
        shipment.batch_id,
        batch?.batch_number,
        batch?.batch_code,
        shipment.origin,
        shipment.destination,
        shipment.carrier,
        shipment.tracking_number,
        shipment.status,
      ].some((value) =>
        String(value || '').toLowerCase().includes(query)
      )
    })
  }, [shipments, batches, search])

  const inTransit = shipments.filter(
    (item) => String(item.status).toUpperCase() === 'IN_TRANSIT'
  ).length

  const delivered = shipments.filter(
    (item) => String(item.status).toUpperCase() === 'DELIVERED'
  ).length

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center text-slate-500">
        <Truck className="mb-3 animate-pulse" size={32} />
        <p className="text-sm font-medium">Loading shipments...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          Unable to load shipment records
        </p>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          Logistics Management
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Shipment Management
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Monitor shipment movement, carriers and delivery information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Shipments</p>
            <Truck className="text-blue-700" size={21} />
          </div>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {shipments.length}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">In Transit</p>
            <MapPin className="text-blue-600" size={21} />
          </div>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {inTransit}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Delivered</p>
            <Package className="text-emerald-600" size={21} />
          </div>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {delivered}
          </h3>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h3 className="font-semibold text-slate-900">
              All Shipments
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredShipments.length} shipment records
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search shipments..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {filteredShipments.length === 0 ? (
          <div className="p-12 text-center">
            <Truck className="mx-auto mb-3 text-slate-300" size={36} />
            <p className="font-medium text-slate-700">
              No shipments found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? 'Try a different search term.'
                : 'Shipment records will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Shipment</th>
                  <th className="px-5 py-4 font-semibold">Batch ID</th>
                  <th className="px-5 py-4 font-semibold">Route</th>
                  <th className="px-5 py-4 font-semibold">Carrier</th>
                  <th className="px-5 py-4 font-semibold">Tracking Number</th>
                  <th className="px-5 py-4 font-semibold">Shipped Date</th>
                  <th className="px-5 py-4 font-semibold">Expected Delivery</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {shipment.shipment_number ||
                        shipment.shipment_code ||
                        `SHIP-${shipment.id}`}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {shipment.batch_id ?? '—'}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span>{shipment.origin || '—'}</span>
                        <span className="text-slate-400">→</span>
                        <span>{shipment.destination || '—'}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {shipment.carrier || '—'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {shipment.tracking_number || '—'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(shipment.shipped_date)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(shipment.expected_delivery)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(shipment.status)}`}
                      >
                        {shipment.status || 'UNKNOWN'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
