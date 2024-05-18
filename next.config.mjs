import NextBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

import { env } from './src/env.mjs';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const SentryWebpackPluginOptions = { silent: true, dryRun: !env.NEXT_PUBLIC_SENTRY_DSN };

const basePath = env.NEXT_PUBLIC_BASE_PATH;

/**
 * @returns `1.0.0` in devlopment mode, and `1.0.0 (776dc84)` after CI compiles it.
 */
function getVersion() {
  const version = env.npm_package_version;
  const commit = env.CI_COMMIT_SHORT_SHA;
  return commit ? `${version} (${commit})` : version;
}

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    /**
     * Using WebGL shaders as modules.
     */
    config.module.rules.push({
      test: /\.(vert|frag)$/i,
      // More information here https://webpack.js.org/guides/asset-modules/
      type: 'asset/source',
    });
    return config;
  },
  env: {
    applicationVersion: getVersion(),
  },
  basePath,
  assetPrefix: basePath ?? undefined,
  reactStrictMode: true,
  swcMinify: true,
  compress: false,
  output: 'standalone',
  sentry: {
    hideSourceMaps: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/build',
        destination: '/build/cell-composition/interactive',
        permanent: false,
      },
      {
        source: '/build/connectome-definition',
        destination: '/build/connectome-definition/configuration',
        permanent: false,
      },
      {
        source: '/build/cell-model-assignment',
        destination: '/build/cell-model-assignment/m-model/configuration',
        permanent: false,
      },
      {
        source: '/experiment-designer',
        destination: '/experiment-designer/experiment-setup',
        permanent: false,
      },
    ];
  },
  transpilePackages: ['jotai-devtools'],
};

export default withBundleAnalyzer(withSentryConfig(nextConfig, SentryWebpackPluginOptions));
