# Use Node.js 20 oficial
FROM node:20-alpine

# Instalar dependências do sistema necessárias para o Puppeteer/Chromium
RUN apk add --no-cache \
    ca-certificates \
    chromium \
    freetype \
    freetype-dev \
    harfbuzz \
    nss \
    ttf-freefont

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Configurar Puppeteer para usar o Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Expor porta (Railway pode usar PORT dinâmica)
EXPOSE $PORT
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
