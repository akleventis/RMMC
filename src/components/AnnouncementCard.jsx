export default function AnnouncementCard({ body }) {
  // Split on blank lines for intentional paragraphs.
  // Single newlines (e.g. from pasting wrapped text) become spaces.
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean)

  return (
    <div className="bg-card rounded-xl shadow border-l-[3px] border-gold px-6 sm:px-8 py-6 transition-all duration-200 hover:-translate-y-px hover:shadow-md" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)' }}>
      {paragraphs.map((p, i) => (
        <p key={i} className={`text-gray-700 leading-relaxed text-base${i > 0 ? ' mt-4' : ''}`}>
          {p}
        </p>
      ))}
    </div>
  )
}
