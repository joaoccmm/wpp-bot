// Versão simplificada da proteção para debugging
const protecaoSimples = {
  async delaySimples(ms = 1000) {
    console.log(`⏳ Delay simples: ${ms}ms`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  async enviarComDelay(client, id, mensagem) {
    console.log(
      `📤 Enviando mensagem simples para ${id}: ${mensagem.substring(0, 50)}...`
    );
    await this.delaySimples(1000); // 1 segundo apenas
    await client.sendText(id, mensagem);
    console.log(`✅ Mensagem enviada com sucesso`);
  },
};

module.exports = { protecaoSimples };
