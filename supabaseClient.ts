
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// These should be configured in your environment
const supabaseUrl = (window as any).process?.env?.SUPABASE_URL || 'https://vqauhmzmcjeapfvnetsx.supabase.co';
const supabaseAnonKey = (window as any).process?.env?.SUPABASE_ANON_KEY || 'sb_publishable_HtcY85bJ0W7-w5SsLD2ClQ_adZi6Uo5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
