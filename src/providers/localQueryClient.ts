import { QueryClient } from '@tanstack/react-query';
/** SQLite reads must execute even when the OS/network manager reports offline. */
export function createLocalQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 1, networkMode: 'always' },
      mutations: { retry: false, networkMode: 'always' },
    },
  });
}
