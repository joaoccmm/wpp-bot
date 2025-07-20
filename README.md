# 🤖 Chatbot WhatsApp

Chatbot para Wha## 📊 Recursos

- ✅ Interface web para QR Code
- ✅ QR Code como imagem (fácil escaneamento)
- ✅ Auto-refresh da página
- ✅ Design responsivo (mobile/desktop)
- ✅ Tratamento de URLs longas
- ✅ Logs organizados e informativos

## 🔧 Desenvolvimento Local

```bash
npm install
npm run dev
```

## 📈 Performanceção ao Google Sheets para cadastro de usuários.

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

### 3. Conectar WhatsApp

Após o deploy bem-sucedido:

1. **Acesse**: `https://seu-app.railway.app/qr`
2. **Escaneie**: O QR Code com seu WhatsApp
3. **Aguarde**: A conexão ser estabelecida

#### 📱 Como escanear:
- Abra WhatsApp > ⋮ Mais > Dispositivos conectados
- Toque em "Conectar um dispositivo"
- Escaneie o QR Code na tela

### 4. Monitoramento

- **Status**: `https://seu-app.railway.app/health`
- **QR Code**: `https://seu-app.railway.app/qr` (se precisar reconectar)
- **Homepage**: `https://seu-app.railway.app`

## � Recursos

- ✅ Interface web para QR Code
- ✅ QR Code como imagem (fácil escaneamento)
- ✅ Auto-refresh da página
- ✅ Design responsivo (mobile/desktop)
- ✅ Tratamento de URLs longas
- ✅ Logs organizados e informativos

## 🔧 Desenvolvimento Local

```bash
npm install
npm run dev
```

## � Performance

- **CPU**: ~0.05 vCPU
- **RAM**: ~200-300MB  
- **Estimativa**: 500-1000 chats/dia no plano gratuito Railway

## 🛠️ Tecnologias

- Node.js 20.x
- Venom-bot (WhatsApp automation)
- Google Sheets API
- QRCode generation
- Docker containerization