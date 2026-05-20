import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ScheduleTable from '../components/ScheduleTable'

export default function Schedule() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('schedule')
      .select('*')
      .order('display_order')
      .then(({ data }) => {
        setRows(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-xl sm:text-3xl font-serif text-green border-b-2 border-gold pb-2 mb-6">
        2026 Tournament Schedule
      </h1>
      {loading ? (
        <p className="text-muted font-sans text-center py-10">Loading…</p>
      ) : (
        <ScheduleTable rows={rows} />
      )}
    </div>
  )
}
