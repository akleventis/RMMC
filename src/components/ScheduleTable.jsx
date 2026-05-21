export default function ScheduleTable({ rows }) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div
          key={row.id}
          className={`bg-card rounded-xl shadow-sm px-4 sm:px-5 py-4 flex gap-4 items-center border-l-[3px] ${
            row.completed ? 'border-gray-200 opacity-50' : 'border-green'
          }`}
        >
          <span className={`font-semibold text-sm whitespace-nowrap w-24 sm:w-28 flex-shrink-0 ${row.completed ? 'text-gray-400' : 'text-green'}`}>
            {row.event_date}
          </span>
          <span className={`text-sm ${row.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
            {row.event_name}
          </span>
        </div>
      ))}
    </div>
  )
}
