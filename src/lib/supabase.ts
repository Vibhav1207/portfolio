import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const isPlaceholder = 
  !supabaseUrl || 
  supabaseUrl.includes('placeholder-project') || 
  supabaseUrl.includes('YOUR_SUPABASE_URL');

export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) || 'placeholder-key'
);