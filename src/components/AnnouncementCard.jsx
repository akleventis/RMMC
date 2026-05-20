export default function AnnouncementCard({ body }) {
  // Split on blank lines for intentional paragraphs.
  // Single newlines (e.g. from pasting wrapped text) become spaces.
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean)

  return (
    <div className="bg-card rounded-[var(--radius-card)] shadow-sm border-l-4 border-gold px-5 sm:px-7 py-5">
      {paragraphs.map((p, i) => (
        <p key={i} className={`text-gray-800 leading-relaxed${i > 0 ? ' mt-3' : ''}`}>
          {p}
        </p>
      ))}
    </div>
  )
}
