
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from './cors.ts'
import { checkExistingUser } from './user-check.ts'
import { validateUserData } from './validation.ts'
import { createUserAndProfile } from './user-creation.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    // Create Supabase clients
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const anonClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse request body
    const requestData = await req.json()
    const { userData } = requestData
    console.log("Received user data:", { ...userData, password: '[REDACTED]' })

    // Validate the input data
    const validationErrors = validateUserData(userData)
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Validation failed: ${validationErrors.join(', ')}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Check if user exists
    const existingUser = await checkExistingUser(supabaseAdmin, userData.email)
    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'A user with this email already exists' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409 
        }
      )
    }

    // Create user and profile
    const { authUser, profileData, error, partialSuccess } = await createUserAndProfile(
      supabaseAdmin,
      userData
    )

    if (error && !partialSuccess) {
      console.error("Failed to create user:", error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to create user: ${error.message || 'Unknown error'}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Log the user creation activity
    try {
      if (authUser && userData.created_by) {
        await supabaseAdmin
          .from('activity_logs')
          .insert({
            user_id: userData.created_by, // The admin who created this user
            action: 'USER_CREATED',
            details: {
              timestamp: new Date().toISOString(),
              email: userData.email,
              created_by: userData.created_by ? 'admin' : 'self',
              new_user_id: authUser.id
            }
          })
      }
    } catch (logError) {
      console.error("Error logging user creation:", logError)
      // Don't fail the overall operation if logging fails
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        partialSuccess,
        message: partialSuccess 
          ? 'User created successfully but there were some issues with the profile data' 
          : 'User created successfully',
        authUser,
        data: profileData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
