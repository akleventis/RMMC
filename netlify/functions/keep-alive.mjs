// Netlify scheduled function: pings Supabase daily so the free-tier project
// never goes idle long enough to be paused. Writes a timestamp via the
// keep_alive() RPC defined in supabase/keep_alive.sql — no effect on the site.

export default async () => {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('keep-alive: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
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
  schedule: '@daily',
}
