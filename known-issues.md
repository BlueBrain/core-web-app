# Known issues

This document outlines acknowledged issues with SBO Web app, including workarounds if known.

## Routing

### The Link component from `next/link` does not respect basePath leading to a broken navigation and 404s.

This is a known bug in Next.js when using the `app` folder: [#41824](https://github.com/vercel/next.js/issues/41824).

Temporary workaround is to use a wrapper from [@/components/Link](./src/components/Link/index.tsx)
which force adds basePath, the downside: links will appear to have duplicated basePath prefix.
