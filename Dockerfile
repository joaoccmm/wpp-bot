FROM node:20-slim 
RUN apt-get update && apt-get install -y ca-certificates chromium --no-install-recommends && rm -rf /var/lib/apt/lists/* 
WORKDIR /app 
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true 
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium 
COPY package*.json ./ 
RUN npm ci --only=production 
COPY . . 
EXPOSE 3000 
CMD ["npm", "start"]
