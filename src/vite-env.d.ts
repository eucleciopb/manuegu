/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ADMIN_PASSWORD: string;
  readonly VITE_PIX_KEY: string;
  readonly VITE_PIX_NAME: string;
  readonly VITE_PIX_CITY: string;
  readonly VITE_HERO_PHOTO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
