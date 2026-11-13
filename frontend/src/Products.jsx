
import { useMemo, useState } from 'react'
import { Package, Search, Boxes, Tag } from 'lucide-react'

function Products({ products = [], loading, error, onRetry }) {
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return products

    return products.filter((product) =>
      [
        product.name,
        product.sku,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [products, search])

  if (loading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-slate-500">
        <Package className="mb-3 animate-pulse" size={32} />
        <p className="text-sm">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          Unable to load products
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
            Products
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and search products registered in TraceSure.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5">
          <p className="text-xs text-slate-500">Total products</p>
          <p className="text-xl font-bold text-slate-900">
            {products.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Registered products
            </p>
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
              <Package size={20} />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {products.length}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Products in the database
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Categories
            </p>
            <div className="rounded-lg bg-violet-50 p-2.5 text-violet-700">
              <Tag size={20} />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {new Set(products.map((p) => p.category).filter(Boolean)).size}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Unique product categories
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h3 className="font-semibold text-slate-900">
              Product inventory
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredProducts.length} of {products.length} products
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
              placeholder="Search products..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center">
            <Boxes className="mx-auto mb-3 text-slate-300" size={36} />
            <p className="font-medium text-slate-700">
              No products found
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
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">SKU</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Description</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {product.name || 'Unnamed product'}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {product.sku || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-slate-500">
                      {product.description || '—'}
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

export default Products
