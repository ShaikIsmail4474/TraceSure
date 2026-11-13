
import { useMemo, useState } from 'react'
import { Boxes, Search, Package, Factory, CalendarDays } from 'lucide-react'

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

  if (value === 'ACTIVE') return 'bg-emerald-50 text-emerald-700'
  if (value === 'EXPIRED') return 'bg-red-50 text-red-700'
  if (value === 'RECALLED') return 'bg-red-50 text-red-700'
  if (value === 'UNDER_REVIEW') return 'bg-amber-50 text-amber-700'

  return 'bg-slate-100 text-slate-600'
}

function Batches({
  batches = [],
  products = [],
  suppliers = [],
  loading,
  error,
  onRetry,
}) {
  const [search, setSearch] = useState('')

  const filteredBatches = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return batches

    return batches.filter((batch) => {
      const product = products.find(
        (item) => item.id === batch.product_id
      )

      const supplier = suppliers.find(
        (item) => item.id === batch.supplier_id
      )

      const searchableValues = [
        batch.batch_number,
        batch.batch_code,
        batch.id,
        batch.status,
        batch.quantity,
        product?.name,
        supplier?.name,
        batch.manufacturing_date,
        batch.expiry_date,
      ]

      return searchableValues
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    })
  }, [batches, products, suppliers, search])

  if (loading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-slate-500">
        <Boxes className="mb-3 animate-pulse" size={32} />
        <p className="text-sm">Loading batches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          Unable to load batches
        </p>

        <p className="mt-2 text-sm text-slate-500">{error}</p>

        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
            Inventory management
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Batches
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor product batches and their manufacturing details.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5">
          <p className="text-xs text-slate-500">Total batches</p>
          <p className="text-xl font-bold text-slate-900">
            {batches.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total batches</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {batches.length}
              </h3>
            </div>

            <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
              <Boxes size={26} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active batches</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {
                  batches.filter(
                    (batch) =>
                      String(batch.status).toUpperCase() === 'ACTIVE'
                  ).length
                }
              </h3>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Package size={26} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h3 className="font-semibold text-slate-900">
              Batch directory
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {filteredBatches.length} of {batches.length} batches
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search batches..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {filteredBatches.length === 0 ? (
          <div className="p-10 text-center">
            <Boxes className="mx-auto mb-3 text-slate-300" size={36} />

            <p className="font-medium text-slate-700">
              No batches found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try another search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Batch</th>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Supplier</th>
                  <th className="px-5 py-4 font-semibold">Quantity</th>
                  <th className="px-5 py-4 font-semibold">Manufactured</th>
                  <th className="px-5 py-4 font-semibold">Expiry</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredBatches.map((batch) => {
                  const product = products.find(
                    (item) => item.id === batch.product_id
                  )

                  const supplier = suppliers.find(
                    (item) => item.id === batch.supplier_id
                  )

                  return (
                    <tr key={batch.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {batch.batch_number ||
                            batch.batch_code ||
                            `Batch ${batch.id}`}
                        </p>

                        <p className="text-xs text-slate-400">
                          ID: {batch.id}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <Package size={15} className="text-blue-600" />
                          {product?.name || `Product #${batch.product_id}`}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <Factory size={15} className="text-violet-600" />
                          {supplier?.name || `Supplier #${batch.supplier_id}`}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {batch.quantity ?? '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={14} />
                          {formatDate(batch.manufacturing_date)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(batch.expiry_date)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(batch.status)}`}
                        >
                          {batch.status || 'UNKNOWN'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Batches
