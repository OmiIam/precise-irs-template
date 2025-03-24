
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key for full access
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }
    
    // Create the bucket if it doesn't exist
    const bucketExists = buckets.some(bucket => bucket.name === 'user-documents');
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket('user-documents', {
        public: false
      });
      
      if (createError) {
        throw createError;
      }

      console.log("Created user-documents bucket");
      
      // Create RLS policies for the bucket to allow authenticated users to upload
      // These are now handled by the SQL migration
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: bucketExists ? "user-documents bucket already exists" : "user-documents bucket created successfully" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating user-documents bucket:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
