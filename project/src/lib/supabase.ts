import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

let client: SupabaseClient | null = null;
let configurationError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVariables = [
    !supabaseUrl && 'VITE_SUPABASE_URL',
    !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
  ].filter(Boolean);
  configurationError = `Supabase authentication is not configured. Set ${missingVariables.join(' and ')} in the project environment.`;
} else {
  try {
    const parsedUrl = new URL(supabaseUrl);
    const isLocalHttp =
      parsedUrl.protocol === 'http:' && parsedUrl.hostname === 'localhost';
    if (parsedUrl.protocol !== 'https:' && !isLocalHttp) {
      throw new Error('Supabase URL must use HTTPS.');
    }

    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch {
    configurationError = 'Supabase configuration is invalid. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  }
}

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    throw new Error(
      configurationError ?? 'Supabase authentication is unavailable.',
    );
  }

  return client;
}

export function getSupabaseConfigurationError(): string | null {
  return configurationError;
}
