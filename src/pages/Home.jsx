import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AnnouncementCard from '../components/AnnouncementCard'

export default function Home() {
  const [title, setTitle] = useState('')
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('settings').select('value').eq('key', 'announcements_title').single(),
      supabase.from('announcements').select('*').order('display_order'),
    ]).then(([{ data: t }, { data: a }]) => {
      if (t?.value) setTitle(t.value)
      setAnnouncements(a ?? [])
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
        <div className="flex flex-col gap-5">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} body={a.body} />
          ))}
        </div>
      )}
    </div>
  )
}
