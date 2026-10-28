import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Retired: bots called this endpoint directly with no checks. The site contact form now posts
// to the n8n [12 WEB] Contact Form webhook, which filters bots before emailing.
Deno.serve((req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return new Response(JSON.stringify({ error: 'gone' }), {
    status: 410,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
