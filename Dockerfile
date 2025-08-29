FROM node:18-alpine AS base
 
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
 
COPY package.json package-lock.json* ./
RUN npm ci
  
RUN npx prisma generate
 
RUN npm run build
 
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]