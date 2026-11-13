
import { useMemo, useState } from 'react'
import {
  ClipboardList,
  Search,
  RefreshCw,
  Activity,
  CalendarDays,
  Database,
} from 'lucide-react'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function AuditLogs({
  auditLogs = [],
  loading = false,
  error = '',
  onRetry,
}) {
  const [search, setSearch] = useState('')

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim()

    return [...auditLogs]
      .filter((log) => {
        if (!query) return true

        return [
          log.id,
          log.entity_type,
          log.entity_id,
          log.action,
          log.description,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      })
      .sort(
        (a, b) =>
          new Date(b.created_at || b.timestamp || 0) -
          new Date(a.created_at || a.timestamp || 0)
      )
  }, [auditLogs, search])

  const totalLogs = auditLogs.length

  const entityTypes = new Set(
    auditLogs.map((log) => log.entity_type).filter(Boolean)
  ).size

  return (
    <div className="space-y-6 fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          System Monitoring
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Audit Logs
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review recorded activities and changes across TraceSure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Audit Records</p>
            <ClipboardList className="text-blue-600" size={22} />
          </div>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {totalLogs}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Recorded audit entries
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Entity Types</p>
            <Database className="text-violet-600" size={22} />
          </div>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {entityTypes}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Different entity categories recorded
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-slate-900">
              Activity History
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Search and review recorded system events.
            </p>
          </div>

          <button
            onClick={onRetry}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        <div className="relative mt-5">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search action, entity, ID or description..."
            className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {String(error)}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw
              className="mx-auto mb-3 animate-spin text-blue-600"
              size={28}
            />
            <p className="text-sm text-slate-500">
              Loading audit records...
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Record ID</th>
                  <th className="px-4 py-3 font-semibold">Entity</th>
                  <th className="px-4 py-3 font-semibold">Entity ID</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-700">
                      #{log.id}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {log.entity_type || '—'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {log.entity_id ?? '—'}
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-800">
                      {log.action || '—'}
                    </td>

                    <td className="max-w-xs whitespace-normal px-4 py-4 text-slate-500">
                      {log.description || '—'}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                      {formatDate(log.created_at || log.timestamp)}
                    </td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <Activity
                        size={30}
                        className="mx-auto mb-3 text-slate-300"
                      />
                      <p className="font-medium text-slate-700">
                        No audit records found
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {search
                          ? 'Try a different search term.'
                          : 'Audit records will appear here when available.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
            <span>
              Showing {filteredLogs.length} of {totalLogs} records
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              Latest activity first
            </span>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400">
        Audit records are displayed from the TraceSure backend.
      </p>
    </div>
  )
}

export default AuditLogs
