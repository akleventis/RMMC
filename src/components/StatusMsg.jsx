export default function StatusMsg({ msg }) {
  if (!msg) return null
  return (
    <div className={`font-sans text-sm px-4 py-3 rounded mb-5 ${
      msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {msg.text}
    </div>
  )
}
