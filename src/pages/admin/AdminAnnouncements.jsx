import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import StatusMsg from '../../components/StatusMsg'

const emptyForm = { body: '' }

export default function AdminAnnouncements() {
  const [pageTitle, setPageTitle] = useState('')
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState(null)
  const [tick, setTick] = useState(0)
  const titleTimer = useRef(null)
  const flashTimer = useRef(null)

  const refresh = () => setTick((t) => t + 1)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('settings').select('value').eq('key', 'announcements_title').single(),
      supabase.from('announcements').select('*').order('display_order'),
    ]).then(([{ data: t }, { data: a }]) => {
      if (!cancelled) {
        setPageTitle(t?.value ?? 'From The Board Members')
        setItems(a ?? [])
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
    setPageTitle(value)
    clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(async () => {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'announcements_title', value })
      if (error) flash('error', 'Error saving title — try again.')
      else flash('success', 'Page title saved!')
    }, 800)
  }

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(item) {
    setEditing(item.id)
    setForm({ body: item.body })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.body.trim()) return flash('error', 'Please enter some text for the announcement.')
    const maxOrder = items.length ? Math.max(...items.map((i) => i.display_order)) : 0

    if (editing) {
      const { error } = await supabase
        .from('announcements')
        .update({ body: form.body })
        .eq('id', editing)
      if (error) return flash('error', 'Error saving — try again.')
    } else {
      const { error } = await supabase
        .from('announcements')
        .insert({ body: form.body, display_order: maxOrder + 1 })
      if (error) return flash('error', 'Error saving — try again.')
    }

    flash('success', 'Announcement saved!')
    setShowForm(false)
    refresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) return flash('error', 'Error deleting — try again.')
    flash('success', 'Announcement deleted.')
    refresh()
  }

  async function handleReorder(id, direction) {
    const idx = items.findIndex((i) => i.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= items.length) return
    const a = items[idx]
    const b = items[swapIdx]
    await supabase.from('announcements').update({ display_order: b.display_order }).eq('id', a.id)
    await supabase.from('announcements').update({ display_order: a.display_order }).eq('id', b.id)
    refresh()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="font-sans text-lg sm:text-2xl text-gray-800 border-b border-gray-200 pb-3 mb-6">
        Announcements
      </h2>

      <StatusMsg msg={status} />

      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <label className="block font-sans text-sm font-medium text-gray-700 mb-1.5">
          Page Title
        </label>
        <p className="font-sans text-xs text-muted mb-2">This is the heading shown at the top of the announcements page.</p>
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 font-sans text-base focus:outline-none focus:border-green"
        />
      </div>

      {showForm && (
        <div className="bg-white border-2 border-green rounded-lg p-6 mb-6">
          <h3 className="font-sans font-semibold text-base text-gray-800 mb-4">
            {editing ? 'Edit Announcement' : 'New Announcement'}
          </h3>
          <div className="mb-5">
            <label className="block font-sans text-sm font-medium text-gray-700 mb-1.5">
              Announcement Text
            </label>
            <p className="font-sans text-xs text-muted mb-2">Press Enter twice to start a new paragraph.</p>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={6}
              placeholder="Type the announcement here…"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 font-serif text-base resize-y focus:outline-none focus:border-green"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green hover:bg-green-light text-white font-sans text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Save Announcement
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={openAdd}
        className="bg-green hover:bg-green-light text-white font-sans text-sm px-5 py-2 rounded-lg transition-colors mb-5 w-full sm:w-auto"
      >
        + Add Announcement
      </button>

      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg px-4 sm:px-5 py-4 flex items-start gap-3">
            <div className="flex flex-col gap-1 pt-0.5 flex-shrink-0">
              <button
                onClick={() => handleReorder(item.id, 'up')}
                disabled={i === 0}
                className="font-sans text-sm bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded disabled:opacity-30 disabled:cursor-default"
                title="Move up"
              >▲</button>
              <button
                onClick={() => handleReorder(item.id, 'down')}
                disabled={i === items.length - 1}
                className="font-sans text-sm bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded disabled:opacity-30 disabled:cursor-default"
                title="Move down"
              >▼</button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted font-sans line-clamp-2">{item.body}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-sans text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-danger hover:bg-danger-dark text-white font-sans text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
