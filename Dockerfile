# Stage 1
FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
RUN npm install --omit=dev --production=true

# Stage 2
FROM node:alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG HOST_API
ENV NEXT_PUBLIC_HOST_API=${HOST_API}
RUN NODE_ENV=production npm run build && npm prune --production

# Stage 3
FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3055
ENV PORT 3055
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["node", "server.js"]