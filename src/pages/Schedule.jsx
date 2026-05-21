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
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-xl sm:text-3xl font-serif text-green border-b-2 border-gold pb-2 mb-6">
        {title}
      </h1>
      {loading ? (
        <p className="text-muted font-sans text-center py-10">Loading…</p>
      ) : (
        <ScheduleTable rows={rows} />
      )}
    </div>
  )
}
