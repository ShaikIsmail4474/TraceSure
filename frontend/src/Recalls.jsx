
import { useMemo, useState } from 'react'
import {
  RotateCcw,
  Search,
  AlertTriangle,
  Package,
  CalendarDays,
} from 'lucide-react'

const formatDate = (date) => {
  if (!date) return '—'

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusStyle = (status) => {
  const styles = {
    OPEN: 'bg-red-50 text-red-700',
    IN_PROGRESS: 'bg-amber-50 text-amber-700',
    CLOSED: 'bg-emerald-50 text-emerald-700',
    COMPLETED: 'bg-emerald-50 text-emerald-700',
  }

  return styles[status?.toUpperCase()] || 'bg-gray-100 text-gray-700'
}

const getSeverityStyle = (severity) => {
  const styles = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-amber-100 text-amber-800',
    LOW: 'bg-blue-100 text-blue-800',
  }

  return styles[severity?.toUpperCase()] || 'bg-gray-100 text-gray-700'
}

function Recalls({
  recalls = [],
  batches = [],
  products = [],
  loading = false,
  error = null,
  onRetry,
}) {
  const [search, setSearch] = useState('')

  const filteredRecalls = useMemo(() => {
    const term = search.toLowerCase()

    return recalls.filter((recall) => {
      const batch = batches.find(
        (item) => item.id === recall.batch_id
      )

      const product = products.find(
        (item) => item.id === batch?.product_id
      )

      return [
        recall.recall_number,
        recall.recall_code,
        recall.id,
        recall.batch_id,
        batch?.batch_number,
        batch?.batch_code,
        product?.name,
        recall.severity,
        recall.status,
        recall.reason,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(term)
        )
    })
  }, [recalls, batches, products, search])

  const openCount = recalls.filter(
    (item) => item.status?.toUpperCase() === 'OPEN'
  ).length

  const highSeverityCount = recalls.filter(
    (item) =>
      ['HIGH', 'CRITICAL'].includes(item.severity?.toUpperCase())
  ).length

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <RotateCcw className="mx-auto mb-3 animate-spin text-purple-600" size={28} />
        <p className="text-gray-600">Loading recalls...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <AlertTriangle className="mx-auto mb-3 text-red-500" size={30} />
        <p className="mb-4 text-red-600">{String(error)}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-purple-600 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Recalls</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor recalled products, affected batches and recall status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <RotateCcw className="text-purple-600" size={22} />
            <span className="text-sm text-gray-500">Total Recalls</span>
          </div>
          <p className="mt-3 text-2xl font-bold">{recalls.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={22} />
            <span className="text-sm text-gray-500">Open Recalls</span>
          </div>
          <p className="mt-3 text-2xl font-bold">{openCount}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <Package className="text-orange-600" size={22} />
            <span className="text-sm text-gray-500">High / Critical</span>
          </div>
          <p className="mt-3 text-2xl font-bold">{highSeverityCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">Recall Records</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredRecalls.length} records found
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search recalls..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">Recall</th>
                <th className="px-5 py-4 font-medium">Batch</th>
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">Severity</th>
                <th className="px-5 py-4 font-medium">Reason</th>
                <th className="px-5 py-4 font-medium">Initiated</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRecalls.map((recall) => {
                const batch = batches.find(
                  (item) => item.id === recall.batch_id
                )

                const product = products.find(
                  (item) => item.id === batch?.product_id
                )

                return (
                  <tr key={recall.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {recall.recall_number || recall.recall_code || `#${recall.id}`}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {batch?.batch_number || batch?.batch_code || recall.batch_id || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {product?.name || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getSeverityStyle(recall.severity)}`}>
                        {recall.severity || '—'}
                      </span>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-gray-600">
                      {recall.reason || '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {formatDate(recall.initiated_date || recall.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(recall.status)}`}>
                        {recall.status || '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}

              {filteredRecalls.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-gray-500">
                    No recall records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Recalls
