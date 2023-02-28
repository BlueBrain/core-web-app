const { withSentryConfig } = require('@sentry/nextjs');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const SentryWebpackPluginOptions = { silent: true, dryRun: !process.env.NEXT_PUBLIC_SENTRY_DSN };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

/**
 * @returns `1.0.0` in devlopment mode, and `1.0.0 (776dc84)` after CI compiles it.
 */
function getVersion() {
  const version = process.env.npm_package_version;
  const commit = process.env.CI_COMMIT_SHORT_SHA;
  return commit ? `${version} (${commit})` : version;
}

const nextConfig = {
  env: {
    applicationVersion: getVersion(),
  },
  basePath,
  assetPrefix: basePath ?? null,
  reactStrictMode: true,
  swcMinify: true,
  compress: false,
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  sentry: {
    hideSourceMaps: false,
  },
  async redirects() {
    return [
      {
        source: '/brain-factory',
        destination: '/brain-factory/cell-composition/interactive',
        permanent: false,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(withSentryConfig(nextConfig, SentryWebpackPluginOptions));
