const { withSentryConfig } = require('@sentry/nextjs');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const SentryWebpackPluginOptions = { silent: true, dryRun: !!process.env.SKIP_SENTRY_RELEASE };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig = {
  basePath,
  assetPrefix: `${basePath}/`,
  reactStrictMode: true,
  swcMinify: true,
  compress: false,
  output: 'standalone',
  sentry: {
    hideSourceMaps: false,
  },
};

module.exports = withBundleAnalyzer(withSentryConfig(nextConfig, SentryWebpackPluginOptions));
