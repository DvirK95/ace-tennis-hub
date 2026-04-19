import { defineConfig } from 'orval';
import { loadEnv } from 'vite';

// Load env vars the same way Vite does (reads .env.dev, .env.local, etc.)
const env = loadEnv('dev', process.cwd(), '');
const backendUrl = env.VITE_API_URL;

export default defineConfig({
  aceclub: {
    input: {
      // The backend must be running when you execute `npm run codegen`
      target: `${backendUrl}/api-json`,
    },
    output: {
      // One file per OpenAPI tag (e.g. Users → src/api/users.ts)
      mode: 'tags-split',
      target: 'src/api',
      schemas: 'src/api/models',
      client: 'react-query',
      override: {
        // Route every generated HTTP call through the shared Axios instance
        mutator: {
          path: 'src/lib/orvalMutator.ts',
          name: 'customInstance',
        },
        query: {
          // Use the v5 React Query API (useQuery, useMutation, etc.)
          version: 5,
        },
      },
    },
  },
});
