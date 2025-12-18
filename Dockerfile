# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Instala apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copia o build da stage anterior
COPY --from=builder /app/dist ./dist

# Cria usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

# Expõe a porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/main"]
