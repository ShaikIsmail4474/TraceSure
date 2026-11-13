
import { useState } from 'react'
import {
  Search,
  GitBranch,
  Package,
  Factory,
  Truck,
  AlertTriangle,
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react'
import api from './api'

function formatDate(value) {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }) {
  const value = String(status || '').toUpperCase()

  let style = 'bg-slate-100 text-slate-700'

  if (['ACTIVE', 'DELIVERED', 'RESOLVED', 'COMPLETED'].includes(value)) {
    style = 'bg-emerald-50 text-emerald-700'
  } else if (['OPEN', 'IN_TRANSIT', 'UNDER_REVIEW'].includes(value)) {
    style = 'bg-amber-50 text-amber-700'
  } else if (['CANCELLED', 'REJECTED', 'FAILED'].includes(value)) {
    style = 'bg-red-50 text-red-700'
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {status || 'Unknown'}
    </span>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || '—'}
      </p>
    </div>
  )
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
          <Icon size={20} />
        </div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Traceability() {
  const [batchId, setBatchId] = useState('1')
  const [traceData, setTraceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (event) => {
    event.preventDefault()

    if (!batchId.trim() || !/^\d+$/.test(batchId.trim())) {
      setError('Please enter a valid numeric batch ID.')
      setTraceData(null)
      return
    }

    setLoading(true)
    setError('')
    setTraceData(null)

    try {
      const response = await api.get(
        `/traceability/batches/${batchId.trim()}`
      )

      setTraceData(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to find this batch. Please check the batch ID and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const batch = traceData?.batch
  const product = traceData?.product
  const supplier = traceData?.supplier
  const shipments = traceData?.shipments || []
  const recalls = traceData?.recalls || []

  return (
    <div className="space-y-6 fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          Supply Chain Tracking
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Product Traceability
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Trace a batch from its product and supplier to shipments and recalls.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1">
            <label
              htmlFor="batchId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Enter Batch ID
            </label>
            <input
              id="batchId"
              type="text"
              value={batchId}
              onChange={(event) => setBatchId(event.target.value)}
              placeholder="Example: 1"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : (
                <Search size={17} />
              )}
              {loading ? 'Searching...' : 'Trace Batch'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            {String(error)}
          </div>
        )}
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <RefreshCw className="mx-auto mb-3 animate-spin text-blue-600" size={28} />
          <p className="text-sm text-slate-500">
            Retrieving batch traceability information...
          </p>
        </div>
      )}

      {!loading && !traceData && !error && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <GitBranch className="mx-auto mb-3 text-slate-400" size={35} />
          <h3 className="font-semibold text-slate-800">
            Ready to trace your batch
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Enter a batch ID and select Trace Batch to view its supply chain.
            Try batch ID 1.
          </p>
        </div>
      )}

      {!loading && traceData && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={22} />
              <div>
                <p className="font-semibold text-emerald-900">
                  Traceability record found
                </p>
                <p className="text-xs text-emerald-700">
                  Batch {batch?.batch_number || batch?.id}
                </p>
              </div>
            </div>
            <StatusBadge status={batch?.status} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SectionCard icon={Package} title="Batch & Product Details">
              <div className="grid grid-cols-2 gap-5">
                <InfoItem label="Batch Number" value={batch?.batch_number} />
                <InfoItem label="Batch ID" value={batch?.id} />
                <InfoItem label="Product Name" value={product?.name} />
                <InfoItem label="SKU" value={product?.sku} />
                <InfoItem label="Category" value={product?.category} />
                <InfoItem label="Quantity" value={batch?.quantity} />
                <InfoItem
                  label="Manufacturing Date"
                  value={formatDate(batch?.manufacturing_date)}
                />
                <InfoItem
                  label="Expiry Date"
                  value={formatDate(batch?.expiry_date)}
                />
              </div>
            </SectionCard>

            <SectionCard icon={Factory} title="Supplier Information">
              <div className="space-y-4">
                <InfoItem label="Supplier Name" value={supplier?.name} />
                <InfoItem label="Contact Person" value={supplier?.contact_person} />

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span>{supplier?.email || '—'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span>{supplier?.phone || '—'}</span>
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard icon={Truck} title="Shipment History">
            {shipments.length === 0 ? (
              <p className="text-sm text-slate-500">
                No shipments are associated with this batch.
              </p>
            ) : (
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {shipment.shipment_number}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500">
                          Tracking: {shipment.tracking_number || '—'}
                        </p>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <MapPin size={17} className="mt-0.5 text-blue-600" />
                        <div>
                          <p className="text-xs text-slate-400">Origin</p>
                          <p className="text-sm font-medium text-slate-800">
                            {shipment.origin || '—'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin size={17} className="mt-0.5 text-emerald-600" />
                        <div>
                          <p className="text-xs text-slate-400">Destination</p>
                          <p className="text-sm font-medium text-slate-800">
                            {shipment.destination || '—'}
                          </p>
                        </div>
                      </div>

                      <InfoItem label="Carrier" value={shipment.carrier} />
                      <InfoItem
                        label="Shipped Date"
                        value={formatDate(shipment.shipped_date)}
                      />
                      <InfoItem
                        label="Expected Delivery"
                        value={formatDate(shipment.expected_delivery_date)}
                      />
                      <InfoItem
                        label="Actual Delivery"
                        value={formatDate(shipment.actual_delivery_date)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard icon={AlertTriangle} title="Recall Information">
            {recalls.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 size={19} />
                No recalls are associated with this batch.
              </div>
            ) : (
              <div className="space-y-4">
                {recalls.map((recall) => (
                  <div
                    key={recall.id}
                    className="rounded-lg border border-red-100 bg-red-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-red-900">
                          {recall.recall_number}
                        </h4>
                        <p className="mt-1 text-xs text-red-700">
                          Recall ID: {recall.id}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                          {recall.severity || 'Unknown severity'}
                        </span>
                        <StatusBadge status={recall.status} />
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-red-900">
                      {recall.reason || 'No reason provided.'}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-red-800">
                        <CalendarDays size={16} />
                        <span>
                          Initiated: {formatDate(recall.initiated_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-800">
                        <CalendarDays size={16} />
                        <span>
                          Resolved: {formatDate(recall.resolved_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <p className="text-center text-xs text-slate-400">
            Traceability information is retrieved from the TraceSure backend.
          </p>
        </>
      )}
    </div>
  )
}

export default Traceability
