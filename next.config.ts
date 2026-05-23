import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (no node_modules in the runner stage).
  output: 'standalone',
  // Pin the file-tracing root to this project — a stray lockfile elsewhere otherwise
  // misleads Next into tracing the wrong root for the standalone output.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  // ioredis is a server-only dependency — never bundle it for the client/edge.
  serverExternalPackages: ['ioredis'],
};

export default nextConfig;
