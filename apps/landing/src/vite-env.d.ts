/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of your Supabase project, e.g. https://abcd.supabase.co */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon (publishable) key — safe to ship in the client. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
