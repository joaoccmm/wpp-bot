// Versão final simplificada e robusta da função de envio
async function enviarMensagemRobusta(client, id, mensagem, tentativasMax = 3) {
  console.log(`📤 [ROBUSTO] Enviando para ${id}: ${mensagem.substring(0, 50)}...`);
  
  for (let i = 1; i <= tentativasMax; i++) {
    try {
      console.log(`🔄 Tentativa ${i}/${tentativasMax}`);
      
      // Delay simples e confiável (1-2 segundos)
      const delay = 1000 + Math.floor(Math.random() * 1000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Envio direto
      await client.sendText(id, mensagem);
      
      console.log(`✅ [ROBUSTO] Sucesso na tentativa ${i}`);
      return true;
      
    } catch (error) {
      console.error(`❌ [ROBUSTO] Erro na tentativa ${i}:`, error.message);
      
      if (i === tentativasMax) {
        console.error(`🚨 [ROBUSTO] Falha após ${tentativasMax} tentativas`);
        return false;
      }
      
      // Aguardar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, i * 1000));
    }
  }
}

module.exports = { enviarMensagemRobusta };
