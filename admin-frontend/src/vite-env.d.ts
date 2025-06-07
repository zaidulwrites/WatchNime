/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_API_BASE_URL: string;
  readonly VITE_ADMIN_SECRET_KEY: string; // Add this
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}