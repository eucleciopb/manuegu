import { supabase, isSupabaseConfigured } from './supabase';

export interface SupabaseHealth {
  configured: boolean;
  connected: boolean;
  tablesOk: boolean;
  giftCount: number;
  error: string | null;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      connected: false,
      tablesOk: false,
      giftCount: 0,
      error: 'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas.',
    };
  }

  try {
    const { count, error: giftsError } = await supabase
      .from('gifts')
      .select('*', { count: 'exact', head: true });

    if (giftsError) {
      return {
        configured: true,
        connected: false,
        tablesOk: false,
        giftCount: 0,
        error: giftsError.message,
      };
    }

    const { error: guestsError } = await supabase
      .from('guests')
      .select('id', { count: 'exact', head: true });

    if (guestsError) {
      return {
        configured: true,
        connected: true,
        tablesOk: false,
        giftCount: count ?? 0,
        error: `Tabela guests: ${guestsError.message}`,
      };
    }

    return {
      configured: true,
      connected: true,
      tablesOk: true,
      giftCount: count ?? 0,
      error: null,
    };
  } catch (err) {
    return {
      configured: true,
      connected: false,
      tablesOk: false,
      giftCount: 0,
      error: err instanceof Error ? err.message : 'Erro de conexão com Supabase',
    };
  }
}
