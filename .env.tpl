# Secrets live in 1Password (Dev vault, item "rmmc").
# Run with:   op run --env-file=.env.tpl -- <command>
# Or write a .env once:   op inject -i .env.tpl -o .env
VITE_SUPABASE_URL=op://Dev/rmmc/VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=op://Dev/rmmc/VITE_SUPABASE_ANON_KEY
