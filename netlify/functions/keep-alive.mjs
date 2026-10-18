// Pings Supabase so the free-tier project never idles long enough to pause.
// Days are grouped into fixed 3-day windows, and one pseudo-random day in
// each window gets the ping. That averages ~2.3 pings/week at irregular
// times, but the gap between pings never exceeds 5 days.
const WINDOW_DAYS = 3

// mulberry32-style integer hash -> [0, 1)
function hash(n) {
  let t = (n + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export default async () => {
  const day = Math.floor(Date.now() / 86_400_000)
  const window = Math.floor(day / WINDOW_DAYS)
  const pingOffset = Math.floor(hash(window) * WINDOW_DAYS)

  if (day % WINDOW_DAYS !== pingOffset) {
    console.log('keep-alive: skipped')
    return new Response('skipped')
  }

  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('keep-alive: missing env')
    return new Response('missing env', { status: 500 })
  }

  const res = await fetch(`${url}/rest/v1/rpc/keep_alive`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  })

  const text = await res.text()
  if (!res.ok) {
    console.error(`keep-alive: ${res.status} ${text}`)
    return new Response(text, { status: 502 })
  }

  console.log(`keep-alive: pinged at ${text}`)
  return new Response(text)
}

export const config = {
  schedule: '0 12 * * *', // every day at 12:00 UTC
}
