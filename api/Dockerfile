FROM node:20-alpine

WORKDIR /app

# Install dependencies dulu (layer cache)
COPY package.json .
RUN npm install --production

# Copy source code
COPY src/ ./src/

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "src/index.js"]
