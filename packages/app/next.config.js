const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withBundleAnalyzer({
  // swcMinify: true,
  trailingSlash: process.env.NODE_ENV === 'production',
});
