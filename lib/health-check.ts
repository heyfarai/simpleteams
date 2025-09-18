import { client } from "@/lib/sanity/client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function checkSanityConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    await client.fetch('*[_type == "season"][0]', {}, { timeout: 2000 });
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown Sanity error'
    };
  }
}

export async function checkSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('registration_carts').select('id').limit(1);
    if (error) throw error;
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown Supabase error'
    };
  }
}

export async function healthCheck() {
  console.log('🔍 Checking service connections...');

  const [sanityHealth, supabaseHealth] = await Promise.all([
    checkSanityConnection(),
    checkSupabaseConnection()
  ]);

  const issues = [];

  if (!sanityHealth.connected) {
    console.error('❌ Sanity CMS connection failed:', sanityHealth.error);
    issues.push(`Sanity CMS: ${sanityHealth.error}`);
  } else {
    console.log('✅ Sanity CMS connected');
  }

  if (!supabaseHealth.connected) {
    console.error('❌ Supabase connection failed:', supabaseHealth.error);
    issues.push(`Supabase: ${supabaseHealth.error}`);
  } else {
    console.log('✅ Supabase connected');
  }

  if (issues.length > 0) {
    console.error('⚠️  Service connection issues detected:', issues);
    return { healthy: false, issues };
  }

  console.log('✅ All services connected successfully');
  return { healthy: true, issues: [] };
}