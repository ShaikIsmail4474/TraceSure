
import { useMemo, useState } from 'react'
import { Factory, Search, Users, Mail, Phone } from 'lucide-react'

function Suppliers({ suppliers = [], loading, error, onRetry }) {
  const [search, setSearch] = useState('')

  const filteredSuppliers = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return suppliers

    return suppliers.filter((supplier) =>
      [
        supplier.name,
        supplier.contact_person,
        supplier.email,
        supplier.phone,
        supplier.address,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [suppliers, search])

  if (loading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-slate-500">
        <Factory className="mb-3 animate-pulse" size={32} />
        <p className="text-sm">Loading suppliers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          Unable to load suppliers
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
            Supply chain management
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Suppliers
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and search registered supply chain partners.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5">
          <p className="text-xs text-slate-500">Total suppliers</p>
          <p className="text-xl font-bold text-slate-900">
            {suppliers.length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Registered suppliers
            </p>
            <h3 className="mt-3 text-3xl font-bold text-slate-900">
              {suppliers.length}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Supply chain partners in the database
            </p>
          </div>

          <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
            <Users size={26} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h3 className="font-semibold text-slate-900">
              Supplier directory
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredSuppliers.length} of {suppliers.length} suppliers
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
              placeholder="Search suppliers..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="p-10 text-center">
            <Factory className="mx-auto mb-3 text-slate-300" size={36} />
            <p className="font-medium text-slate-700">
              No suppliers found
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
                  <th className="px-5 py-4 font-semibold">Supplier</th>
                  <th className="px-5 py-4 font-semibold">Contact Person</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Address</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-violet-50 p-2 text-violet-700">
                          <Factory size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {supplier.name || 'Unnamed supplier'}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {supplier.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {supplier.contact_person || '—'}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Mail size={15} />
                        {supplier.email || '—'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Phone size={15} />
                        {supplier.phone || '—'}
                      </span>
                    </td>

                    <td className="max-w-xs px-5 py-4 text-slate-500">
                      {supplier.address || '—'}
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

export default Suppliers
