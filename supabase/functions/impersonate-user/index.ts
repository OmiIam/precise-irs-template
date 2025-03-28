
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get an access token for the user (impersonation)
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: 'placeholder@example.com', // This is required but not used
      options: {
        data: { impersonator_id: req.headers.get('x-user-id') },
      }
    })

    if (error) {
      throw error
    }

    // Return the access token
    return new Response(
      JSON.stringify({ token: data.properties.access_token }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error impersonating user:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
