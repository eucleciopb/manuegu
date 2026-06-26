import { useEffect, useState } from 'react';
import { checkSupabaseHealth, type SupabaseHealth } from '../../lib/supabaseHealth';

export function SupabaseStatusBanner() {
  const [health, setHealth] = useState<SupabaseHealth | null>(null);

  useEffect(() => {
    checkSupabaseHealth().then(setHealth);
  }, []);

  if (!health) return null;

  if (!health.configured) {
    return (
      <div className="supabase-banner supabase-banner-warning">
        <strong>Modo local (mock)</strong> — dados não são salvos permanentemente.
        Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env</code> e reinicie o servidor.
      </div>
    );
  }

  if (!health.connected || !health.tablesOk) {
    return (
      <div className="supabase-banner supabase-banner-error">
        <strong>Supabase com erro:</strong> {health.error}
        <br />
        Execute o script <code>supabase/schema.sql</code> no SQL Editor do Supabase.
      </div>
    );
  }

  return (
    <div className="supabase-banner supabase-banner-success">
      <strong>Supabase conectado</strong> — {health.giftCount} presente(s) no banco. Todos os dados estão sendo salvos na nuvem.
    </div>
  );
}
