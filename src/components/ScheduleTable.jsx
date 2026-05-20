export default function ScheduleTable({ rows }) {
  return (
    <>
      {/* Mobile: cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {rows.map((row) => (
          <div key={row.id} className="bg-card rounded-lg shadow-sm px-4 py-3 flex gap-3 items-baseline border-l-4 border-green">
            <span className="text-green font-bold text-sm whitespace-nowrap w-24 flex-shrink-0">{row.event_date}</span>
            <span className="text-gray-800 text-sm">{row.event_name}</span>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block rounded-[var(--radius-card)] overflow-hidden shadow-sm">
        <table className="w-full border-collapse bg-card">
          <thead>
            <tr>
              <th className="bg-green text-white px-5 py-3.5 text-left text-xs uppercase tracking-widest font-sans w-36">Date</th>
              <th className="bg-green text-white px-5 py-3.5 text-left text-xs uppercase tracking-widest font-sans">Event</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 1 ? 'bg-amber-50' : 'bg-card'}>
                <td className="px-5 py-3.5 text-green font-bold whitespace-nowrap border-b border-gray-100 text-base">{row.event_date}</td>
                <td className="px-5 py-3.5 border-b border-gray-100 text-base">{row.event_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
