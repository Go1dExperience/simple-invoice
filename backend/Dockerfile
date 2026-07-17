FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 3000
# migrate + seed + start (seed is idempotent)
CMD npx prisma migrate deploy && npm run seed && node dist/main
