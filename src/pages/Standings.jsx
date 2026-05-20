import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Standings() {
  const [links, setLinks] = useState([])

  useEffect(() => {
    supabase
      .from('links')
      .select('*')
      .order('display_order')
      .then(({ data }) => setLinks(data ?? []))
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-xl sm:text-3xl font-serif text-green border-b-2 border-gold pb-2 mb-6">
        Standings
      </h1>
      <div className="bg-card rounded-[var(--radius-card)] shadow-sm p-6 sm:p-10 flex flex-col items-center gap-3">
        {links.length === 0 ? (
          <p className="text-muted font-sans text-sm">Standings links not yet configured.</p>
        ) : (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="w-full max-w-xs text-center bg-green hover:bg-green-light text-white font-sans text-sm sm:text-base px-5 py-2.5 rounded-lg transition-colors no-underline"
            >
              {link.label}
            </a>
          ))
        )}
      </div>
    </div>
  )
}
