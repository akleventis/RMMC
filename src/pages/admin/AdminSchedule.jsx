import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import StatusMsg from '../../components/StatusMsg'

export default function AdminSchedule() {
  const [rows, setRows] = useState([])
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState(null)
  const [tick, setTick] = useState(0)
  const saveTimers = useRef({})
  const titleTimer = useRef(null)
  const flashTimer = useRef(null)

  const refresh = () => setTick((t) => t + 1)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('settings').select('value').eq('key', 'schedule_title').single(),
      supabase.from('schedule').select('*').order('display_order'),
    ]).then(([{ data: t }, { data: s }]) => {
      if (!cancelled) {
        if (t?.value) setTitle(t.value)
        setRows(s ?? [])
      }
    })
    return () => { cancelled = true }
  }, [tick])

  function flash(type, text) {
    clearTimeout(flashTimer.current)
    setStatus({ type, text })
    flashTimer.current = setTimeout(() => setStatus(null), 5000)
  }

  function handleTitleChange(value) {
    setTitle(value)
    clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(async () => {
      const { error } = await supabase.from('settings').update({ value }).eq('key', 'schedule_title')
      if (error) flash('error', 'Error saving title — try again.')
      else flash('success', 'Saved!')
    }, 800)
  }

  function handleChange(id, field, value) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r))
    clearTimeout(saveTimers.current[id + field])
    saveTimers.current[id + field] = setTimeout(() => autoSave(id, field, value), 800)
  }

  async function autoSave(id, field, value) {
    const saveValue = value === '' ? null : value
    const { error } = await supabase.from('schedule').update({ [field]: saveValue }).eq('id', id)
    if (error) flash('error', 'Error saving — try again.')
    else flash('success', 'Saved!')
  }

  async function handleAddRow() {
    const maxOrder = rows.length ? Math.max(...rows.map((r) => r.display_order)) : 0
    const { error } = await supabase.from('schedule').insert({
      event_date: '',
      event_name: '',
      display_order: maxOrder + 1,
    })
    if (error) flash('error', 'Error adding row — try again.')
    else refresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this row?')) return
    const { error } = await supabase.from('schedule').delete().eq('id', id)
    if (error) flash('error', 'Error deleting — try again.')
    else { flash('success', 'Row deleted.'); refresh() }
  }

  async function handleReorder(id, direction) {
    const idx = rows.findIndex((r) => r.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= rows.length) return
    const a = rows[idx]
    const b = rows[swapIdx]
    await supabase.from('schedule').update({ display_order: b.display_order }).eq('id', a.id)
    await supabase.from('schedule').update({ display_order: a.display_order }).eq('id', b.id)
    refresh()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="font-sans text-lg sm:text-2xl text-gray-800 border-b border-gray-200 pb-3 mb-2">
        Schedule
      </h2>
      <p className="font-sans text-sm text-muted mb-4">Click any field to edit. Changes save automatically.</p>

      <div className="mb-6">
        <label className="block font-sans text-xs text-muted mb-1">Page Title</label>
        <input value={title} onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g. 2026 Tournament Schedule"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-sans text-base focus:outline-none focus:border-green" />
      </div>

      <StatusMsg msg={status} />

      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={row.id} className={`bg-white border border-gray-200 rounded-lg p-4 ${row.completed ? 'opacity-60' : ''}`}>
            <div className="flex gap-2 mb-3">
              <button onClick={() => handleReorder(row.id, 'up')} disabled={i === 0}
                className="font-sans text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded disabled:opacity-30">▲</button>
              <button onClick={() => handleReorder(row.id, 'down')} disabled={i === rows.length - 1}
                className="font-sans text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded disabled:opacity-30">▼</button>
              <label className="ml-auto flex items-center gap-1.5 font-sans text-xs text-muted cursor-pointer">
                <input type="checkbox" checked={!!row.completed}
                  onChange={(e) => handleChange(row.id, 'completed', e.target.checked)}
                  className="accent-green w-4 h-4" />
                Done
              </label>
              <button onClick={() => handleDelete(row.id)}
                className="bg-danger hover:bg-danger-dark text-white font-sans text-sm px-4 py-1.5 rounded-lg">Delete</button>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="block font-sans text-xs text-muted mb-1">Start Date</label>
                <input type="date" value={row.event_date || ''} onChange={(e) => handleChange(row.id, 'event_date', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-green" />
              </div>
              <div className="flex-1">
                <label className="block font-sans text-xs text-muted mb-1">End Date <span className="text-muted/50">(optional)</span></label>
                <input type="date" value={row.event_date_end || ''} onChange={(e) => handleChange(row.id, 'event_date_end', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-green" />
              </div>
            </div>
            <label className="block font-sans text-xs text-muted mb-1">Event</label>
            <input value={row.event_name} onChange={(e) => handleChange(row.id, 'event_name', e.target.value)}
              placeholder="Event name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-sans text-base focus:outline-none focus:border-green" />
          </div>
        ))}
      </div>

      <button onClick={handleAddRow}
        className="mt-4 w-full border border-dashed border-green text-green hover:bg-green/5 font-sans text-sm py-2 rounded-lg transition-colors">
        + Add Row
      </button>
    </div>
  )
}
