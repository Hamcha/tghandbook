/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_REVISION: string;
  readonly VITE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly CHANGELOG: unknown;
}
