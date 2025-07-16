# 🤖 Chatbot WhatsApp

Chatbot para WhatsApp com integração ao Google Sheets para cadastro de usuários.

## 🚀 Deploy no Railway

### 1. Preparar o repositório

```bash
git add .
git commit -m "Preparar para deploy Railway"
git push origin master
```

### 2. Configurar no Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha o repositório `wpp-bot`

### 3. Configurar variáveis de ambiente

No painel do Railway, vá em Variables e adicione:

```
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"botcadastrowhatsapp",...}
```

### 4. Health Check

O bot estará disponível em: `https://seu-app.railway.app`
Health check: `https://seu-app.railway.app/health`

## 📦 Estrutura do Projeto

```
├── bot/              # Lógica do WhatsApp
├── flows/            # Fluxos de conversa
├── google/           # Integração Google Sheets
├── utils/            # Utilitários
├── index.js          # Arquivo principal
├── package.json      # Dependências
├── Dockerfile        # Container Docker
└── railway.json      # Configuração Railway
```

## 🔧 Desenvolvimento Local

```bash
npm install
npm run dev
```

## 📊 Monitoramento

- CPU: ~0.05 vCPU
- RAM: ~200-300MB
- Estimativa: 500-1000 chats/dia no plano gratuito
