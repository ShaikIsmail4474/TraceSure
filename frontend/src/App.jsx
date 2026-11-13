
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Truck,
  Factory,
  RotateCcw,
  GitBranch,
  ClipboardList,
  Bell,
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
  Boxes,
  Users,
  AlertTriangle,
  Activity,
  RefreshCw,
} from 'lucide-react'

import { getDashboardData } from './api'
import Products from './Products.jsx'
import Suppliers from './Suppliers.jsx'
import Batches from './Batches.jsx'
import Shipments from './Shipments.jsx'
import Recalls from './Recalls.jsx'
import Traceability from './Traceability.jsx'
import AuditLogs from './AuditLogs.jsx'
import './App.css'

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Products', icon: Package },
  { name: 'Suppliers', icon: Factory },
  { name: 'Batches', icon: Boxes },
  { name: 'Shipments', icon: Truck },
  { name: 'Recalls', icon: RotateCcw },
  { name: 'Traceability', icon: GitBranch },
  { name: 'Audit Logs', icon: ClipboardList },
]

function formatDate(value) {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getStatusStyle(status) {
  const value = String(status || '').toUpperCase()

  if (['ACTIVE', 'DELIVERED', 'RESOLVED', 'COMPLETED'].includes(value)) {
    return 'bg-emerald-50 text-emerald-700'
  }

  if (['OPEN', 'IN_TRANSIT', 'UNDER_REVIEW', 'PENDING'].includes(value)) {
    return 'bg-amber-50 text-amber-700'
  }

  if (['CANCELLED', 'REJECTED', 'FAILED'].includes(value)) {
    return 'bg-red-50 text-red-700'
  }

  return 'bg-slate-100 text-slate-600'
}

function StatCard({ title, value, icon: Icon, color, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  )
}

function Dashboard({ data, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-slate-500">
        <RefreshCw className="mb-3 animate-spin" size={30} />
        <p className="text-sm font-medium">Loading live dashboard data...</p>
        <p className="mt-1 text-xs">Connecting to TraceSure API</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <AlertTriangle className="mx-auto mb-3 text-red-500" size={35} />
        <h3 className="font-semibold text-slate-900">
          Unable to load dashboard
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    )
  }

  const products = data.products || []
  const suppliers = data.suppliers || []
  const batches = data.batches || []
  const shipments = data.shipments || []
  const recalls = data.recalls || []
  const auditLogs = data.auditLogs || []

  const openRecalls = recalls.filter(
    (item) => String(item.status).toUpperCase() === 'OPEN'
  )

  const activeBatches = batches.filter(
    (item) => String(item.status).toUpperCase() === 'ACTIVE'
  )

  const inTransit = shipments.filter(
    (item) => String(item.status).toUpperCase() === 'IN_TRANSIT'
  )

  const recentShipments = [...shipments].slice(-5).reverse()

  const recentActivity = [...auditLogs]
    .sort(
      (a, b) =>
        new Date(b.created_at || b.timestamp) -
        new Date(a.created_at || a.timestamp)
    )
    .slice(0, 5)

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
            Overview
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Supply Chain Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Live overview of your products and supply chain operations.
          </p>
        </div>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw size={15} />
          Refresh data
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
          color="bg-blue-50 text-blue-700"
          description="Registered products"
        />
        <StatCard
          title="Total Suppliers"
          value={suppliers.length}
          icon={Users}
          color="bg-violet-50 text-violet-700"
          description="Registered suppliers"
        />
        <StatCard
          title="Total Batches"
          value={batches.length}
          icon={Boxes}
          color="bg-teal-50 text-teal-700"
          description={`${activeBatches.length} active batches`}
        />
        <StatCard
          title="Total Shipments"
          value={shipments.length}
          icon={Truck}
          color="bg-orange-50 text-orange-700"
          description={`${inTransit.length} currently in transit`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2.5 text-red-600">
              <AlertTriangle size={21} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Open Recalls</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {openRecalls.length}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Recalls requiring attention
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
              <Truck size={21} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Shipments In Transit</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {inTransit.length}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Shipments currently moving
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
              <Activity size={21} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Audit Activities</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {auditLogs.length}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Recorded audit log entries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="font-semibold text-slate-900">Recent Shipments</h3>
              <p className="mt-1 text-xs text-slate-500">
                Latest shipment records
              </p>
            </div>
            <Truck size={19} className="text-slate-400" />
          </div>

          {recentShipments.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">
              No shipment records available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Shipment</th>
                    <th className="px-5 py-3 font-medium">Destination</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentShipments.map((shipment) => (
                    <tr key={shipment.id}>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {shipment.shipment_number || shipment.shipment_code || `SHIP-${shipment.id}`}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {shipment.destination || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="font-semibold text-slate-900">
                Recent Audit Activity
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Recorded system events
              </p>
            </div>
            <Activity size={19} className="text-slate-400" />
          </div>

          {recentActivity.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">
              No audit activity recorded.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3 px-5 py-4">
                  <div className="mt-1 rounded-full bg-blue-50 p-2 text-blue-700">
                    <ClipboardList size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {activity.action} · {activity.entity_type}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(activity.created_at || activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle size={19} className="text-red-500" />
          <h3 className="font-semibold text-slate-900">Recall Monitoring</h3>
        </div>

        {recalls.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No recall records are currently available.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {recalls.slice(0, 5).map((recall) => (
              <div
                key={recall.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {recall.recall_number || recall.recall_code || `RECALL-${recall.id}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{recall.reason}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Initiated: {formatDate(recall.initiated_date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    {recall.severity}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(recall.status)}`}>
                    {recall.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400">
        Dashboard figures are calculated from the current TraceSure API response.
      </p>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const result = await getDashboardData()

        if (isMounted) setData(result)
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.detail ||
            err.message ||
            'Could not connect to the TraceSure backend.'
          )
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [refreshCount])

  const backendStatus = error
    ? 'API unavailable'
    : loading
      ? 'Connecting'
      : 'API connected'

  const handleRetry = () => {
    setRefreshCount((count) => count + 1)
  }

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={25} />
          </div>
          <div>
            <h2>TraceSure</h2>
            <span>SUPPLY CHAIN INTELLIGENCE</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`nav-item ${activePage === item.name ? 'nav-item-active' : ''}`}
                onClick={() => {
                  setActivePage(item.name)
                  setSidebarOpen(false)
                }}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <ShieldCheck size={19} />
            <div>
              <strong>TraceSure Secure</strong>
              <span>Supply chain monitoring</span>
            </div>
          </div>
          <div className="sidebar-version">TRACESURE · MVP 1.0</div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <div className="breadcrumb">Workspace / {activePage}</div>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-right">
            <div className={`system-status ${error ? 'text-red-600' : ''}`}>
              <span className={`status-dot ${error ? 'bg-red-500' : loading ? 'bg-amber-500' : ''}`} />
              {backendStatus}
            </div>

            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>

            <div className="profile">
              <div className="profile-avatar">TS</div>
              <div className="profile-info">
                <strong>Administrator</strong>
                <span>Operations team</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <section className="page-content">
          {activePage === 'Dashboard' && (
            <Dashboard
              data={data || {}}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          )}

          {activePage === 'Products' && (
            <Products
              products={data?.products || []}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          )}

          {activePage === 'Suppliers' && (
            <Suppliers
              suppliers={data?.suppliers || []}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          )}

          {activePage === 'Batches' && (
            <Batches
              batches={data?.batches || []}
              products={data?.products || []}
              suppliers={data?.suppliers || []}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          )}

          {activePage === 'Shipments' && (
            <Shipments
              shipments={data?.shipments || []}
              batches={data?.batches || []}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          )}

          {activePage === 'Recalls' && (
            <Recalls
              recalls={data?.recalls || []}
              batches={data?.batches || []}
              products={data?.products || []}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          )}

          {activePage === 'Traceability' && <Traceability />}

          {activePage === 'Audit Logs' && (
            <AuditLogs
              auditLogs={data?.auditLogs || []}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
