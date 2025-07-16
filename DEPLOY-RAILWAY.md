# 🚀 DEPLOY NO RAILWAY - INSTRUÇÕES PASSO A PASSO

## ✅ PREPARAÇÃO CONCLUÍDA

Seu projeto já está preparado com:

- ✅ package.json com engines Node.js 18.x
- ✅ Health check HTTP na porta 3000
- ✅ Dockerfile otimizado
- ✅ .gitignore atualizado
- ✅ Configuração para variáveis de ambiente
- ✅ railway.json configurado
- ✅ README.md atualizado

## 🌐 AGORA VAMOS FAZER O DEPLOY

### 1. **Acesse o Railway**

- Vá para [railway.app](https://railway.app)
- Clique em "Login" e conecte com sua conta GitHub

### 2. **Criar Novo Projeto**

- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Escolha o repositório `wpp-bot`
- Railway detectará automaticamente que é um projeto Node.js

### 3. **Configurar Variável de Ambiente**

**IMPORTANTE**: Você precisa adicionar suas credenciais Google como variável de ambiente.

- No painel do Railway, vá na aba "Variables"
- Clique em "New Variable"
- Nome: `GOOGLE_CREDENTIALS`
- Valor: Copie TODO o conteúdo do seu arquivo `credenciais-google.json` local

⚠️ **ATENÇÃO**: Cole o conteúdo completo do arquivo JSON como uma única linha.

### 4. **Deploy Automático**

- Railway iniciará o build automaticamente
- Aguarde ~2-5 minutos
- Você verá logs do build e deploy

### 5. **Acessar a Aplicação**

- Railway fornecerá uma URL como: `https://seu-projeto.railway.app`
- Acesse a URL para verificar se está funcionando
- Para health check: `https://seu-projeto.railway.app/health`

### 6. **Configurar WhatsApp**

- No primeiro acesso, o bot mostrará um QR Code nos logs
- Vá na aba "Deployments" > "View Logs"
- Escaneie o QR Code com WhatsApp
- Aguarde aparecer "✅ WhatsApp conectado!"

## 📊 MONITORAMENTO

### **No Railway Dashboard:**

- **Metrics**: CPU, RAM, Rede
- **Logs**: Logs em tempo real
- **Usage**: Consumo dos $5 gratuitos

### **Estimativas:**

- **CPU**: ~$1.50/mês
- **RAM**: ~$2.00/mês
- **Rede**: ~$0.50/mês
- **Total**: ~$4/mês (sobra $1 para picos)

## 🔧 COMANDOS ÚTEIS

### **Ver logs:**

```bash
# No Railway Dashboard > Deployments > View Logs
```

### **Redeploy:**

```bash
# Fazer push de qualquer mudança
git push origin master
```

### **Variáveis de ambiente:**

- `GOOGLE_CREDENTIALS`: Credenciais do Google Sheets
- `PORT`: Porta do servidor (Railway define automaticamente)

## 🆘 TROUBLESHOOTING

### **Se o bot não conectar:**

1. Verifique os logs no Railway
2. Confirme que GOOGLE_CREDENTIALS está configurado
3. Verifique se a planilha Google existe e está acessível

### **Se exceder $5:**

1. Bot para automaticamente
2. Receberá email de notificação
3. Volta a funcionar no próximo mês

### **Para mais recursos:**

- Considere o plano Hobby ($5/mês + uso)
- Sem limite de créditos mensais

## 🎉 PRONTO!

Seu chatbot WhatsApp agora está rodando 24/7 na nuvem!

**Capacidade estimada**: 500-1000 chats/dia no plano gratuito
**Uptime**: 99.9%
**Manutenção**: Zero (Railway cuida de tudo)

Para dúvidas, consulte: https://railway.app/help
