import { useState } from 'react'

function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(start, end) {
  if (!start) return ''
  const s = parseLocalDate(start)
  const month = s.toLocaleDateString('en-US', { month: 'short' })
  if (!end) return `${month} ${s.getDate()}`
  const e = parseLocalDate(end)
  if (s.getMonth() === e.getMonth()) return `${month} ${s.getDate()}–${e.getDate()}`
  return `${month} ${s.getDate()} – ${e.toLocaleDateString('en-US', { month: 'short' })} ${e.getDate()}`
}

function fmt(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

function googleCalUrl(eventName, startStr, endStr) {
  const start = parseLocalDate(startStr)
  const last = endStr ? parseLocalDate(endStr) : parseLocalDate(startStr)
  const dtEnd = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
  const dates = `${fmt(start)}/${fmt(dtEnd)}`
  const text = encodeURIComponent(`RMMC – ${eventName}`)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}`
}

function downloadIcs(eventName, startStr, endStr) {
  const start = parseLocalDate(startStr)
  const last = endStr ? parseLocalDate(endStr) : parseLocalDate(startStr)
  const dtEnd = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RMMC//EN',
    'BEGIN:VEVENT',
    `UID:rmmc-${startStr}-${eventName.replace(/\W/g, '')}@ranchomaria`,
    `DTSTART;VALUE=DATE:${fmt(start)}`,
    `DTEND;VALUE=DATE:${fmt(dtEnd)}`,
    `SUMMARY:RMMC – ${eventName}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${eventName.replace(/[^a-z0-9]/gi, '-')}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ScheduleTable({ rows }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="flex flex-col gap-2">
      {openId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenId(null)} />
      )}

      {rows.map((row) => (
        <div key={row.id} className="relative">
          <div
            onClick={() => !row.completed && setOpenId(openId === row.id ? null : row.id)}
            className={`bg-card rounded-xl shadow-sm px-4 sm:px-5 py-4 flex gap-4 items-center border-l-[3px] transition-all duration-150 select-none ${
              row.completed
                ? 'border-gray-200 opacity-50 cursor-default'
                : openId === row.id
                  ? 'border-green shadow-md -translate-y-px cursor-pointer'
                  : 'border-green hover:-translate-y-px hover:shadow-md cursor-pointer group'
            }`}
          >
            <span className={`font-semibold text-sm whitespace-nowrap w-24 sm:w-28 flex-shrink-0 ${row.completed ? 'text-gray-400' : 'text-green'}`}>
              {formatDate(row.event_date, row.event_date_end)}
            </span>
            <span className={`text-sm flex-1 ${row.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
              {row.event_name}
            </span>
            {!row.completed && (
              <svg className={`w-4 h-4 flex-shrink-0 transition-colors ${openId === row.id ? 'text-green' : 'text-muted/40 group-hover:text-muted/70'}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                <path strokeLinecap="round" d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
              </svg>
            )}
          </div>

          {openId === row.id && (
            <div className="absolute right-0 top-full mt-1.5 z-20 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-52">
              <p className="font-sans text-[11px] text-muted uppercase tracking-wider px-4 pt-3 pb-1.5">Add to calendar</p>
              <a
                href={googleCalUrl(row.event_name, row.event_date, row.event_date_end)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors no-underline text-gray-700 font-sans text-sm border-t border-gray-50"
                onClick={() => setOpenId(null)}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2v2M18 2v2M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="#4285F4" strokeWidth={1.75} strokeLinecap="round"/>
                  <path d="M9 14l2 2 4-4" stroke="#34A853" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Google Calendar
              </a>
              <button
                onClick={() => { downloadIcs(row.event_name, row.event_date, row.event_date_end); setOpenId(null) }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 font-sans text-sm border-t border-gray-100"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2v2M18 2v2M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="#555" strokeWidth={1.75} strokeLinecap="round"/>
                  <path d="M12 11v6M9 14l3 3 3-3" stroke="#555" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Apple Calendar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
