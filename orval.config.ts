import { defineConfig } from 'orval';

// Generates the React Query client in src/api/generated from the backend's OpenAPI document.
// Regenerate after any API change: npm run api:generate
export default defineConfig({
  globe: {
    input: './backend/openapi.json',
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      override: {
        mutator: { path: './src/api/httpClient.ts', name: 'httpClient' },
        fetch: { includeHttpResponseReturnType: false },
        enumGenerationType: 'enum',
      },
    },
  },
});
