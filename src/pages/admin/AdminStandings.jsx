import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import StatusMsg from '../../components/StatusMsg'

export default function AdminStandings() {
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(null)
  const [tick, setTick] = useState(0)
  const flashTimer = useRef(null)

  const refresh = () => setTick((t) => t + 1)

  useEffect(() => {
    let cancelled = false
    supabase.from('links').select('*').order('display_order').then(({ data }) => {
      if (!cancelled) setLinks(data ?? [])
    })
    return () => { cancelled = true }
  }, [tick])

  function flash(type, text) {
    clearTimeout(flashTimer.current)
    setStatus({ type, text })
    flashTimer.current = setTimeout(() => setStatus(null), 5000)
  }

  function handleChange(id, field, value) {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l))
  }

  async function handleSave(id) {
    const link = links.find((l) => l.id === id)
    setSaving(id)
    const { error } = await supabase
      .from('links')
      .update({ label: link.label, url: link.url })
      .eq('id', id)
    setSaving(null)
    if (error) flash('error', 'Error saving — try again.')
    else flash('success', 'Link saved!')
  }

  async function handleAdd() {
    const maxOrder = links.length ? Math.max(...links.map((l) => l.display_order)) : 0
    const { error } = await supabase
      .from('links')
      .insert({ label: 'New Link', url: '', display_order: maxOrder + 1 })
    if (error) flash('error', 'Error adding link — try again.')
    else refresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this link?')) return
    const { error } = await supabase.from('links').delete().eq('id', id)
    if (error) flash('error', 'Error deleting — try again.')
    else { flash('success', 'Link deleted.'); load() }
  }

  async function handleReorder(id, direction) {
    const idx = links.findIndex((l) => l.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= links.length) return
    const a = links[idx]
    const b = links[swapIdx]
    await supabase.from('links').update({ display_order: b.display_order }).eq('id', a.id)
    await supabase.from('links').update({ display_order: a.display_order }).eq('id', b.id)
    refresh()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="font-sans text-lg sm:text-2xl text-gray-800 border-b border-gray-200 pb-3 mb-2">
        Standings Links
      </h2>
      <p className="font-sans text-sm text-muted mb-6">
        Each link appears as a button on the public Standings page.
      </p>

      <StatusMsg msg={status} />

      <div className="flex flex-col gap-4">
        {links.map((link, i) => (
          <div key={link.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4">
            <div className="flex flex-col gap-1 mt-1 flex-shrink-0">
              <button onClick={() => handleReorder(link.id, 'up')} disabled={i === 0}
                className="font-sans text-sm bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded disabled:opacity-30 disabled:cursor-default">▲</button>
              <button onClick={() => handleReorder(link.id, 'down')} disabled={i === links.length - 1}
                className="font-sans text-sm bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded disabled:opacity-30 disabled:cursor-default">▼</button>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div>
                <label className="block font-sans text-sm font-medium text-gray-700 mb-1.5">Button Label</label>
                <input type="text" value={link.label}
                  onChange={(e) => handleChange(link.id, 'label', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 font-serif text-base focus:outline-none focus:border-green" />
              </div>
              <div>
                <label className="block font-sans text-sm font-medium text-gray-700 mb-1.5">Google Sheets Link</label>
                <p className="font-sans text-xs text-muted mb-1.5">Copy the link from Google Sheets and paste it here.</p>
                <input type="url" value={link.url}
                  onChange={(e) => handleChange(link.id, 'url', e.target.value)}
                  placeholder="Paste Google Sheets link here"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-green" />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleSave(link.id)}
                  disabled={saving === link.id}
                  className="bg-green hover:bg-green-light text-white font-sans text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving === link.id ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => handleDelete(link.id)}
                  className="bg-danger hover:bg-danger-dark text-white font-sans text-sm px-5 py-2 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleAdd}
        className="mt-4 w-full border border-dashed border-green text-green hover:bg-green/5 font-sans text-sm py-2 rounded-lg transition-colors">
        + Add Link
      </button>
    </div>
  )
}
