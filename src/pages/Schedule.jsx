import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ScheduleTable from '../components/ScheduleTable'

export default function Schedule() {
  const [rows, setRows] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('settings').select('value').eq('key', 'schedule_title').single(),
      supabase.from('schedule').select('*').order('display_order'),
    ]).then(([{ data: t }, { data: s }]) => {
      if (t?.value) setTitle(t.value)
      setRows(s ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-5xl text-green tracking-tight leading-tight mb-3">
          {title}
        </h1>
        <div className="h-[3px] w-14 bg-gold rounded-full" />
      </div>
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card rounded-xl h-14 animate-pulse opacity-60" />
          ))}
        </div>
      ) : (
        <ScheduleTable rows={rows} />
      )}
    </div>
  )
}
