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
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-5xl text-green tracking-tight leading-tight mb-3">
          {title}
        </h1>
        <div className="h-[3px] w-14 bg-gold rounded-full" />
      </div>
      {loading ? (
        <div className="flex flex-col gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl h-24 animate-pulse opacity-60" />
          ))}
        </div>
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
