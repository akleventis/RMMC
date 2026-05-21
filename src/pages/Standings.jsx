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
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-5xl text-green tracking-tight leading-tight mb-3">
          Resources
        </h1>
        <div className="h-[3px] w-14 bg-gold rounded-full" />
      </div>
      <div className="bg-card rounded-xl shadow-sm p-8 sm:p-12 flex flex-col items-center gap-3">
        {links.length === 0 ? (
          <p className="text-muted text-sm">No resources have been added yet.</p>
        ) : (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
className="w-full max-w-xs text-center bg-green hover:bg-green-light text-white font-sans text-sm sm:text-base px-5 py-3 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg no-underline"
            >
              {link.label}
            </a>
          ))
        )}
      </div>
    </div>
  )
}
