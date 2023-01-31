const { withSentryConfig } = require('@sentry/nextjs');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const SentryWebpackPluginOptions = { silent: true, dryRun: !process.env.NEXT_PUBLIC_SENTRY_DSN };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig = {
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
