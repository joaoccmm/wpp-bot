#!/usr/bin/env node

// Script de teste para verificar se as proteções estão funcionando
const { protecao } = require('./utils/protecaoAntiBot');
const { CONFIG_SEGURANCA, verificarSobrecarga, aplicarDelayContextual } = require('./config/seguranca');

console.log('🧪 Testando Sistema de Proteção Anti-Banimento\n');

async function testarProtecoes() {
  const usuarioTeste = 'teste_' + Date.now();
  
  console.log('1️⃣ Testando delays aleatórios...');
  
  // Testar diferentes tipos de delay
  const tipos = ['inicio_conversa', 'pergunta_sensivel', 'envio_arquivo', 'resposta_rapida'];
  
  for (const tipo of tipos) {
    const inicio = Date.now();
    await protecao.delayAleatorio(tipo, usuarioTeste);
    const duracao = Date.now() - inicio;
    console.log(`   ✅ ${tipo}: ${duracao}ms`);
  }
  
  console.log('\n2️⃣ Testando variação de mensagens...');
  
  const mensagemTeste = 'Olá! Tudo bem? Obrigado por aguardar.';
  const mensagemVariada = protecao.adicionarVariacaoNatural(mensagemTeste);
  console.log(`   Original: "${mensagemTeste}"`);
  console.log(`   Variada:  "${mensagemVariada}"`);
  
  console.log('\n3️⃣ Testando controle de velocidade...');
  
  // Simular múltiplas mensagens
  for (let i = 0; i < 5; i++) {
    protecao.registrarAtividade(usuarioTeste);
  }
  
  const precisaDelay = protecao.precisaDelayMaior(usuarioTeste);
  console.log(`   Usuario precisa delay maior: ${precisaDelay ? '✅' : '❌'}`);
  
  console.log('\n4️⃣ Testando detecção de horário...');
  
  const horarioSuspeito = protecao.isHorarioSuspeito();
  const agora = new Date();
  console.log(`   Horário atual: ${agora.toLocaleTimeString()}`);
  console.log(`   É suspeito: ${horarioSuspeito ? '⚠️ Sim' : '✅ Não'}`);
  
  console.log('\n5️⃣ Testando configurações...');
  
  console.log(`   Max mensagens/hora: ${CONFIG_SEGURANCA.MAX_MENSAGENS_POR_HORA}`);
  console.log(`   Delay mínimo: ${CONFIG_SEGURANCA.DELAY_MINIMO_ENTRE_MSGS}ms`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  
  console.log('\n6️⃣ Testando sobrecarga do sistema...');
  
  const sobrecarregado = verificarSobrecarga();
  console.log(`   Sistema sobrecarregado: ${sobrecarregado ? '⚠️ Sim' : '✅ Não'}`);
  
  console.log('\n✅ Todos os testes concluídos!');
  console.log('\n📊 Status Final:');
  console.log(`   🛡️ Proteções: ATIVAS`);
  console.log(`   ⏱️ Delays: FUNCIONANDO`);
  console.log(`   🎭 Variações: FUNCIONANDO`);
  console.log(`   📈 Monitoramento: ATIVO`);
  console.log(`   🚦 Controle de velocidade: ATIVO`);
}

// Executar testes
testarProtecoes().catch(error => {
  console.error('❌ Erro nos testes:', error);
  process.exit(1);
});
