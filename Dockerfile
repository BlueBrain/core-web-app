# Install dependencies only when needed
FROM node:21-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci


# Rebuild the source code only when needed
FROM node:21-alpine AS builder

ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_BASE_PATH
ARG NEXT_PUBLIC_NEXUS_URL
ARG NEXT_PUBLIC_BBS_ML_URL
ARG NEXT_PUBLIC_ATLAS_ES_VIEW_ID
ARG NEXT_PUBLIC_THUMBNAIL_GENERATION_BASE_URL
ARG NEXT_PUBLIC_KG_INFERENCE_BASE_URL
ARG NEXT_PUBLIC_ENVIRONMENT
ARG CI_COMMIT_SHORT_SHA
ARG NEXT_PUBLIC_VIRTUAL_LAB_API_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BBS_ML_PRIVATE_BASE_URL
ARG NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_TAG
ARG NEXT_PUBLIC_CELL_COMPOSITION_TAG
ARG NEXT_PUBLIC_CELL_SVC_BASE_URL
ARG NEXT_PUBLIC_BLUE_NAAS_URL
ENV NODE_OPTIONS="--max_old_space_size=7168"

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Add root CA certificate
COPY root-ca.crt /usr/local/share/ca-certificates/root-ca.crt
RUN cat /usr/local/share/ca-certificates/root-ca.crt >> /etc/ssl/certs/ca-certificates.crt
ENV NODE_EXTRA_CA_CERTS /usr/local/share/ca-certificates/root-ca.crt

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000

ENV PORT 8000

CMD ["node", "server.js"]
