const { getEstado, setEstado, limparEstado } = require("../utils/estados");
const { salvarNoSheets } = require("../google/sheets");
const { protecao } = require("../utils/protecaoAntiBot");
const { protecaoSimples } = require("../utils/protecaoSimples");
const { enviarMensagemRobusta } = require("../utils/envioRobusto");
const path = require("path");
const fs = require("fs");

// Função para enviar mensagem com proteção anti-bot (versão simplificada)
async function enviarMensagemSegura(client, id, mensagem, tipo = "normal") {
  try {
    console.log(
      `📤 [DEBUG] Enviando mensagem para ${id}: ${mensagem.substring(0, 50)}...`
    );

    // Delay simples de 1-2 segundos
    const delay = Math.floor(Math.random() * 1000) + 1000; // 1-2 segundos
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Enviar mensagem diretamente
    await client.sendText(id, mensagem);

    console.log(`✅ [DEBUG] Mensagem enviada com sucesso para ${id}`);
  } catch (error) {
    console.error(`❌ [DEBUG] Erro ao enviar mensagem para ${id}:`, error);
    throw error;
  }
}

// Função helper para envio mais simples
async function enviarComSeguranca(client, id, mensagem) {
  console.log(`📤 Enviando: ${mensagem.substring(0, 100)}...`);

  // Delay de 1.5 segundos fixo
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    await client.sendText(id, mensagem);
    console.log(`✅ Mensagem enviada com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem:`, error);
    throw error;
  }
}

// Estrutura de mensagens limpa - pronta para nova configuração
const mensagens = {
  inicio:
    "📝 *Terceira Etapa - Questionário Final*\n\n" +
    "Agora vamos fazer algumas perguntas para finalizar seu cadastro.\n\n" +
    "💡 Digite *cancelar* a qualquer momento para sair.",

  // SEÇÃO 2: PROBLEMAS DE SAÚDE FÍSICA
  saudeProblemas:
    "🏥 *2. Problemas de Saúde Física*\n\n" +
    "Estamos perguntando se você teve algum problema de saúde no corpo depois do desastre. Isso ajuda a mostrar os danos à sua saúde.\n\n" +
    "❓ *Você teve problemas físicos depois da barragem?*\n\n" +
    "👉 *Sim* ou *Não*",

  saudeTipos:
    "🩺 *2.1 Se sim, marque os que teve:*\n\n" +
    "Digite o *número* ou *letra* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*a)* Problemas de pele\n" +
    "*b)* Dor de barriga\n" +
    "*c)* Urina alterada\n" +
    "*d)* Fraturas ou machucados\n" +
    "*e)* Dores nas juntas\n" +
    "*f)* Doença no sangue, nervos ou hormônios\n" +
    "*g)* Outros\n\n" +
    "_Exemplo: a,c,e ou 1,3,5_",

  saudeOutros:
    "📝 *2.2 Você marcou 'Outros' - descreva quais problemas:*\n\n" +
    "Digite uma descrição dos outros problemas de saúde que teve:",

  saudeContinua:
    "⏰ *2.3 Esses sintomas ainda continuam?*\n\n" + "👉 *Sim* ou *Não*",

  saudeQuando:
    "📅 *2.4 Quando começou a perceber que era por causa da barragem?*\n\n" +
    "Digite o mês e ano (exemplo: 11/2015) seguido da descrição:\n\n" +
    "_Formato: MM/AAAA - descrição_\n" +
    "_Exemplo: 11/2015 - por causa de exames_",

  saudeDiagnostico:
    "🔬 *2.5 Recebeu algum diagnóstico médico?*\n\n" +
    "👉 *Sim* ou *Não*\n\n" +
    "_Se sim, você poderá descrever qual diagnóstico na próxima pergunta_",

  saudeDiagnosticoQual:
    "📋 *Qual diagnóstico médico você recebeu?*\n\n" +
    "Descreva o(s) diagnóstico(s) que recebeu:",

  saudeRenda:
    "💰 *2.6 Esses problemas afetaram sua renda ou trabalho?*\n\n" +
    "👉 *Sim* ou *Não*",

  saudeRendaContinua:
    "⏳ *2.7 Ainda continua afetando sua renda/trabalho?*\n\n" +
    "👉 *Sim* ou *Não*",

  // SEÇÃO 3: PROBLEMAS EMOCIONAIS OU PSICOLÓGICOS
  emocionalProblemas:
    "🧠 *3. Problemas Emocionais ou Psicológicos*\n\n" +
    "Algumas pessoas tiveram ansiedade, depressão ou tristeza profunda depois do rompimento. Queremos saber se isso aconteceu com você.\n\n" +
    "❓ *Você teve algum sofrimento emocional ou psicológico?*\n\n" +
    "👉 *Sim* ou *Não*",

  emocionalTipos:
    "🧠 *3.1 Se sim, marque o que teve:*\n\n" +
    "Digite o *número* ou *letra* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*a)* Depressão\n" +
    "*b)* Ansiedade\n" +
    "*c)* Estresse pós-traumático\n" +
    "*d)* Abuso de álcool ou drogas\n" +
    "*e)* Não foi diagnosticado por médico\n" +
    "*f)* Outro\n\n" +
    "_Exemplo: a,b,c ou 1,2,3_",

  emocionalOutros:
    "📝 *3.2 Você marcou 'Outro' - descreva qual problema emocional:*\n\n" +
    "Digite uma descrição do problema emocional que teve:",

  emocionalQuando:
    "📅 *3.3 Quando começou?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  emocionalExiste:
    "🕐 *3.4 Os sintomas ainda existem?*\n\n" + "👉 *Sim* ou *Não*",

  emocionalAtrapalhou:
    "💼 *3.5 Te atrapalhou de viver ou trabalhar normalmente?*\n\n" +
    "👉 *Sim* ou *Não*",

  emocionalAtestado:
    "📋 *3.6 Você teve atestado médico sobre isso?*\n\n" + "👉 *Sim* ou *Não*",

  emocionalGastos:
    "💸 *3.7 Gastos com tratamento por mês:*\n\n" +
    "Digite o valor em reais que gasta por mês com tratamento (apenas números):\n\n" +
    "_Exemplo: 150 (para R$ 150,00)_\n" +
    "_Digite 0 se não tem gastos_",

  // SEÇÃO 4: PERDA DE BENS
  bensPerda:
    "🏚️ *4. Perda de Bens*\n\n" +
    "Queremos saber se você perdeu algum bem, como casa, terra, plantações ou animais.\n\n" +
    "❓ *Você perdeu, teve destruído ou danificado algum bem?*\n\n" +
    "👉 *Sim* ou *Não*",

  bensTipos:
    "📦 *4.1 O que você tinha:*\n\n" +
    "Digite o *número* correspondente aos bens que você tinha (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Casa\n" +
    "*2)* Terra\n" +
    "*3)* Plantações\n" +
    "*4)* Animais\n" +
    "*5)* Veículos\n" +
    "*6)* Barcos\n" +
    "*7)* Equipamentos\n" +
    "*8)* Bens pessoais ou sentimentais\n" +
    "*9)* Construções\n\n" +
    "_Exemplo: 1,3,5 ou 2,4,8_",

  bensValorAntes:
    "💰 *4.2 Valor dos bens antes do desastre:*\n\n" +
    "Digite o valor total em reais que seus bens valiam antes do desastre (apenas números):\n\n" +
    "_Exemplo: 150000 (para R$ 150.000,00)_\n" +
    "_Digite 0 se não sabe o valor_",

  bensValorDepois:
    "💰 *4.3 Valor depois do desastre:*\n\n" +
    "Digite o valor total em reais que seus bens valem agora após o desastre (apenas números):\n\n" +
    "_Exemplo: 50000 (para R$ 50.000,00)_\n" +
    "_Digite 0 se perdeu tudo_",

  bensQuando:
    "📅 *4.4 Quando percebeu a perda?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  // SEÇÃO 5: MUDANÇA DE CASA
  mudancaCasa:
    "🏠 *5. Mudança de Casa*\n\n" +
    "Algumas pessoas precisaram sair de casa depois do desastre. Vamos entender se isso aconteceu com você.\n\n" +
    "❓ *Você teve que se mudar?*\n\n" +
    "👉 *Sim* ou *Não*",

  mudancaMotivo:
    "🏚️ *5.1 Por qual motivo?*\n\n" +
    "Digite o *número* correspondente ao motivo (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Casa destruída\n" +
    "*2)* Risco à saúde ou segurança\n" +
    "*3)* Sem estrutura no bairro\n" +
    "*4)* Reassentamento\n" +
    "*5)* Outros\n\n" +
    "_Exemplo: 1,2 ou 3,4_",

  mudancaOutros:
    "📝 *Você marcou 'Outros' - descreva qual motivo:*\n\n" +
    "Digite uma descrição do motivo da mudança:",

  mudancaQuando:
    "📅 *5.2 Quando se mudou?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  mudancaVoltou:
    "🔄 *5.3 Conseguiu voltar para o local antigo?*\n\n" + "👉 *Sim* ou *Não*",

  mudancaMoradia:
    "🏡 *5.4 Nova moradia foi:*\n\n" +
    "Digite o *número* correspondente:\n\n" +
    "*1)* Paga por você\n" +
    "*2)* Fornecida por ONG (exceto Renova)\n" +
    "*3)* Dada pela Renova ou Samarco\n\n" +
    "_Escolha apenas uma opção_",

  mudancaGastos:
    "💰 *5.5 Você teve gastos com a mudança?*\n\n" + "👉 *Sim* ou *Não*",

  // SEÇÃO 6: ALIMENTAÇÃO
  alimentacaoFonte:
    "🍽️ *6. Alimentação*\n\n" +
    "Queremos saber se você perdeu sua fonte de alimentação e teve que gastar mais com comida.\n\n" +
    "❓ *Você perdeu sua fonte de comida (pesca, plantio, criação)?*\n\n" +
    "👉 *Sim* ou *Não*",

  alimentacaoQuando:
    "📅 *6.1 Quando isso aconteceu?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  alimentacaoSemFonte:
    "🚫 *6.2 Ainda está sem essa fonte?*\n\n" + "👉 *Sim* ou *Não*",

  alimentacaoGastos:
    "💸 *6.3 Teve gastos com:*\n\n" +
    "Digite o *número* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Compra de alimentos\n" +
    "*2)* Produção alternativa\n" +
    "*3)* Viagens para buscar comida\n" +
    "*4)* Outros\n\n" +
    "_Exemplo: 1,2 ou 3,4_",

  alimentacaoOutros:
    "📝 *Você marcou 'Outros' - descreva quais gastos:*\n\n" +
    "Digite uma descrição dos outros gastos com alimentação:",

  alimentacaoValor:
    "💰 *6.4 Gasto mensal:*\n\n" +
    "Digite o valor em reais que gasta por mês com alimentação (apenas números):\n\n" +
    "_Exemplo: 300 (para R$ 300,00)_\n" +
    "_Digite 0 se não tem gastos extras_",

  // SEÇÃO 7: AUMENTO NO CUSTO DE VIDA
  custoVidaAumento:
    "💰 *7. Aumento no Custo de Vida*\n\n" +
    "Depois do desastre, muita gente começou a gastar mais com transporte, moradia, alimentação etc. Isso aconteceu com você?\n\n" +
    "❓ *Seu custo de vida aumentou?*\n\n" +
    "👉 *Sim* ou *Não*",

  custoVidaTipos:
    "📊 *7.1 Marque com o que aumentou:*\n\n" +
    "Digite o *número* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Alimentação\n" +
    "*2)* Moradia\n" +
    "*3)* Transporte\n" +
    "*4)* Lazer\n" +
    "*5)* Vestuário\n\n" +
    "_Exemplo: 1,3,5 ou 2,4_",

  custoVidaQuando:
    "📅 *7.2 Desde quando?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  custoVidaValor:
    "💸 *7.3 Gastos mensais aproximados:*\n\n" +
    "Digite o valor total em reais dos gastos mensais extras (apenas números):\n\n" +
    "_Exemplo: 500 (para R$ 500,00)_\n" +
    "_Digite 0 se não consegue estimar_",

  // SEÇÃO 8: PREJUÍZO NA RENDA
  rendaPrejuizo:
    "👷 *8. Prejuízo na Renda*\n\n" +
    "Queremos entender se você perdeu renda por causa da tragédia.\n\n" +
    "❓ *Sua renda foi prejudicada?*\n\n" +
    "👉 *Sim* ou *Não*",

  rendaMotivos:
    "💼 *8.1 Por quê?*\n\n" +
    "Digite o *número* correspondente ao motivo (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Pesca\n" +
    "*2)* Agricultura\n" +
    "*3)* Pecuária\n" +
    "*4)* Fechamento da Samarco\n" +
    "*5)* Danos materiais ou ambientais\n" +
    "*6)* Turismo (poucas pessoas no local)\n" +
    "*7)* Saída de moradores\n\n" +
    "_Exemplo: 1,4,5 ou 2,6_",

  rendaQuando:
    "📅 *8.2 Quando começou?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  rendaValor:
    "💰 *8.3 Quanto perdeu por mês:*\n\n" +
    "Digite o valor em reais que perdeu de renda mensal (apenas números):\n\n" +
    "_Exemplo: 1500 (para R$ 1.500,00)_\n" +
    "_Digite 0 se não consegue estimar_",

  // SEÇÃO 9: PROBLEMAS COM ÁGUA
  aguaProblemas:
    "🚰 *9. Problemas com Água*\n\n" +
    "Você teve falta de água, água contaminada ou instável depois do rompimento?\n\n" +
    "❓ *Seu abastecimento de água foi afetado?*\n\n" +
    "👉 *Sim* ou *Não*",

  aguaTipos:
    "💧 *9.1 Tipo de problema:*\n\n" +
    "Digite o *número* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Ficou sem água\n" +
    "*2)* Ficava oscilando\n" +
    "*3)* Contaminada\n\n" +
    "_Exemplo: 1,3 ou 2_",

  aguaContinua:
    "⏰ *9.2 Ainda continua?*\n\n" + "👉 *Sim* ou *Não*",

  aguaTempo:
    "📅 *9.3 Desde quando e por quanto tempo?*\n\n" +
    "Descreva desde quando começou e por quanto tempo durou:\n\n" +
    "_Exemplo: Desde novembro/2015, durou 6 meses_\n" +
    "_Se ainda continua, informe apenas desde quando_",

  aguaGastos:
    "💸 *9.4 Teve gastos com:*\n\n" +
    "Digite o *número* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Compra de água\n" +
    "*2)* Poço ou cisterna\n" +
    "*3)* Transporte\n" +
    "*4)* Outros\n" +
    "*5)* Não tive despesas\n\n" +
    "_Exemplo: 1,3 ou 2,4_",

  aguaOutros:
    "📝 *Você marcou 'Outros' - descreva quais gastos:*\n\n" +
    "Digite uma descrição dos outros gastos com água:",

  aguaValor:
    "💰 *9.5 Gasto mensal:*\n\n" +
    "Digite o valor em reais que gasta por mês com água (apenas números):\n\n" +
    "_Exemplo: 150 (para R$ 150,00)_\n" +
    "_Digite 0 se não tem gastos ou marcou 'Não tive despesas'_",

  // SEÇÃO 11: USO DO RIO E DA TERRA
  rioTerraRio:
    "🌊 *11. Uso do Rio e da Terra*\n\n" +
    "Você usava o rio ou a terra para algo e teve que parar?\n\n" +
    "❓ *Perdeu o uso do rio ou mar?*\n\n" +
    "👉 *Sim* ou *Não*",

  rioTerraTerra:
    "🌱 *Perdeu o uso da terra?*\n\n" +
    "❓ *Você usava a terra para algo e teve que parar?*\n\n" +
    "👉 *Sim* ou *Não*",

  rioTerraUsos:
    "🎯 *11.1 Qual era o seu uso?*\n\n" +
    "Digite o *número* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Pesca\n" +
    "*2)* Navegação\n" +
    "*3)* Esporte\n" +
    "*4)* Cerimônias\n" +
    "*5)* Para plantar/comer\n" +
    "*6)* Criar animais\n" +
    "*7)* Atividades com a família\n" +
    "*8)* Tradições ou cultos\n" +
    "*9)* Outros\n\n" +
    "_Exemplo: 1,5,7 ou 2,4,8_",

  rioTerraOutros:
    "📝 *Você marcou 'Outros' - descreva quais usos:*\n\n" +
    "Digite uma descrição dos outros usos do rio/terra:",

  rioTerraQuando:
    "📅 *11.2 Quando percebeu a perda?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  // SEÇÃO 13: INDENIZAÇÕES OU AÇÕES
  indenizacaoProcesso:
    "⚖️ *13. Indenizações ou Ações*\n\n" +
    "Para entender sua situação, precisamos saber se você já entrou com ação judicial ou recebeu algum dinheiro.\n\n" +
    "❓ *Você já processou a Samarco/Renova?*\n\n" +
    "👉 *Sim* ou *Não*",

  indenizacaoRecebidas:
    "💰 *13.1 Você já recebeu alguma dessas indenizações?*\n\n" +
    "Digite o *número* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* AFE\n" +
    "*2)* PIM (conhecido como os 1.000 reais)\n" +
    "*3)* PID (os 35 mil reais)\n" +
    "*4)* Sistema NÓVEL (os 15 mil reais)\n" +
    "*5)* Não recebi nada\n\n" +
    "_Exemplo: 1,2 ou 3,4_",

  indenizacaoQuando:
    "📅 *13.2 Quando recebeu?*\n\n" +
    "Digite o mês e ano da última indenização recebida:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 03/2020_",

  indenizacaoCadastrado:
    "📋 *13.3 Está cadastrado para receber?*\n\n" +
    "❓ *Você está cadastrado para receber indenizações?*\n\n" +
    "👉 *Sim* ou *Não*",

  indenizacaoContato:
    "📞 *13.4 Já foi contatado pela Renova/Samarco?*\n\n" +
    "❓ *Você já foi contatado pela Renova ou Samarco?*\n\n" +
    "👉 *Sim* ou *Não*",

  // Mensagens finais
  final:
    "✅ *Cadastro Finalizado!*\n\nSuas informações foram registradas com sucesso.\n\nEntraremos em contato em breve!",
};

// Função principal do fluxo de perguntas - estrutura limpa
async function fluxoPerguntas(client, msg) {
  const id = msg.from;
  const userRaw = msg.body.trim();
  const userMessage = userRaw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const estado = getEstado(id);

  console.log(
    `🎯 FluxoPerguntas - ID: ${id}, Mensagem: "${userMessage}", Etapa atual: ${estado?.etapa3}`
  );

  if (!estado?.etapa3) {
    console.error("[fluxoPerguntas] estado ou etapa3 indefinido!");
    return;
  }

  const etapa3 = estado.etapa3.trim().toLowerCase();

  // Função helper para avançar entre etapas
  const avancar = async (proximaEtapa, mensagem) => {
    console.log(`🔄 Avançando de "${etapa3}" para "${proximaEtapa}"`);
    estado.etapa3 = proximaEtapa;
    setEstado(id, estado);
    console.log(`📤 Enviando mensagem: "${mensagem.substring(0, 50)}..."`);
    await enviarComSeguranca(client, id, mensagem);
    console.log(`✅ Função avancar concluída para etapa "${proximaEtapa}"`);
  };

  switch (etapa3) {
    case "inicio":
      // Iniciar com pergunta sobre problemas de saúde
      await avancar("saude_problemas", mensagens.saudeProblemas);
      break;

    case "saude_problemas":
      if (["sim", "s", "ok", "tive", "sim tive"].includes(userMessage)) {
        estado.saudeProblemas = true;
        await avancar("saude_tipos", mensagens.saudeTipos);
      } else if (
        ["não", "nao", "n", "nenhum", "não tive"].includes(userMessage)
      ) {
        estado.saudeProblemas = false;
        // Pular para próxima seção (seção 3)
        await avancar(
          "proxima_secao",
          "✅ *Informações registradas!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve problemas físicos\n• *NÃO* se não teve problemas"
        );
      }
      break;

    case "saude_tipos":
      // Processar seleção de tipos de problemas
      const tiposMap = {
        a: "Problemas de pele",
        b: "Dor de barriga",
        c: "Urina alterada",
        d: "Fraturas ou machucados",
        e: "Dores nas juntas",
        f: "Doença no sangue, nervos ou hormônios",
        g: "Outros",
        1: "Problemas de pele",
        2: "Dor de barriga",
        3: "Urina alterada",
        4: "Fraturas ou machucados",
        5: "Dores nas juntas",
        6: "Doença no sangue, nervos ou hormônios",
        7: "Outros",
      };

      const opcoesSelecionadas = userRaw
        .toLowerCase()
        .replace(/[^a-g1-7,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in tiposMap);

      if (opcoesSelecionadas.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite *a,b,c* ou *1,2,3* (as opções que teve)\n\n" +
            "_Exemplo: a,c,e ou 1,3,5_"
        );
        return;
      }

      const tiposSelecionados = opcoesSelecionadas.map((opt) => tiposMap[opt]);
      estado.saudeTipos = tiposSelecionados;

      console.log(`✅ Tipos selecionados: ${tiposSelecionados.join(", ")}`);

      // Se selecionou "Outros", perguntar qual
      if (
        opcoesSelecionadas.includes("g") ||
        opcoesSelecionadas.includes("7")
      ) {
        await avancar("saude_outros", mensagens.saudeOutros);
      } else {
        await avancar("saude_continua", mensagens.saudeContinua);
      }
      break;

    case "saude_outros":
      estado.saudeOutros = userRaw.trim();
      await avancar("saude_continua", mensagens.saudeContinua);
      break;

    case "saude_continua":
      if (["sim", "s", "ok", "continua", "ainda"].includes(userMessage)) {
        estado.saudeContinua = true;
      } else if (
        ["não", "nao", "n", "parou", "não continua"].includes(userMessage)
      ) {
        estado.saudeContinua = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se os sintomas ainda continuam\n• *NÃO* se os sintomas pararam"
        );
        return;
      }
      await avancar("saude_quando", mensagens.saudeQuando);
      break;

    case "saude_quando":
      // Validar formato MM/AAAA - descrição
      const regexData = /^(\d{1,2})\/(\d{4})\s*-?\s*(.+)$/;
      const matchData = userRaw.match(regexData);

      if (!matchData) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA - descrição*\n\n_Exemplo: 11/2015 - por causa de exames_"
        );
        return;
      }

      const [, mes, ano, descricao] = matchData;
      estado.saudeQuando = {
        mes: mes.padStart(2, "0"),
        ano: ano,
        descricao: descricao.trim(),
      };

      await avancar("saude_diagnostico", mensagens.saudeDiagnostico);
      break;

    case "saude_diagnostico":
      if (["sim", "s", "ok", "recebi", "sim recebi"].includes(userMessage)) {
        estado.saudeDiagnostico = true;
        await avancar("saude_diagnostico_qual", mensagens.saudeDiagnosticoQual);
      } else if (
        ["não", "nao", "n", "nenhum", "não recebi"].includes(userMessage)
      ) {
        estado.saudeDiagnostico = false;
        await avancar("saude_renda", mensagens.saudeRenda);
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se recebeu diagnóstico médico\n• *NÃO* se não recebeu"
        );
      }
      break;

    case "saude_diagnostico_qual":
      estado.saudeDiagnosticoQual = userRaw.trim();
      await avancar("saude_renda", mensagens.saudeRenda);
      break;

    case "saude_renda":
      if (["sim", "s", "ok", "afetou", "sim afetou"].includes(userMessage)) {
        estado.saudeRenda = true;
        await avancar("saude_renda_continua", mensagens.saudeRendaContinua);
      } else if (["não", "nao", "n", "não afetou"].includes(userMessage)) {
        estado.saudeRenda = false;
        // Finalizar seção 2, ir para próxima
        await avancar(
          "proxima_secao",
          "✅ *Seção de Saúde Física concluída!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se afetou renda/trabalho\n• *NÃO* se não afetou"
        );
      }
      break;

    case "saude_renda_continua":
      if (["sim", "s", "ok", "continua", "ainda"].includes(userMessage)) {
        estado.saudeRendaContinua = true;
      } else if (
        ["não", "nao", "n", "parou", "não continua"].includes(userMessage)
      ) {
        estado.saudeRendaContinua = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se ainda afeta\n• *NÃO* se não afeta mais"
        );
        return;
      }

      // Finalizar seção 2
      await avancar(
        "proxima_secao",
        "✅ *Seção de Saúde Física concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "proxima_secao":
      // Iniciar seção 3 - Problemas Emocionais
      await avancar("emocional_problemas", mensagens.emocionalProblemas);
      break;

    case "emocional_problemas":
      if (["sim", "s", "ok", "tive", "sim tive"].includes(userMessage)) {
        estado.emocionalProblemas = true;
        await avancar("emocional_tipos", mensagens.emocionalTipos);
      } else if (
        ["não", "nao", "n", "nenhum", "não tive"].includes(userMessage)
      ) {
        estado.emocionalProblemas = false;
        // Pular para próxima seção (seção 4)
        await avancar(
          "secao4",
          "✅ *Seção Emocional registrada!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve problemas emocionais\n• *NÃO* se não teve problemas"
        );
      }
      break;

    case "emocional_tipos":
      // Processar seleção de tipos de problemas emocionais
      const tiposEmocionalMap = {
        a: "Depressão",
        b: "Ansiedade",
        c: "Estresse pós-traumático",
        d: "Abuso de álcool ou drogas",
        e: "Não foi diagnosticado por médico",
        f: "Outro",
        1: "Depressão",
        2: "Ansiedade",
        3: "Estresse pós-traumático",
        4: "Abuso de álcool ou drogas",
        5: "Não foi diagnosticado por médico",
        6: "Outro",
      };

      const opcoesEmocionalSelecionadas = userRaw
        .toLowerCase()
        .replace(/[^a-f1-6,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in tiposEmocionalMap);

      if (opcoesEmocionalSelecionadas.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite *a,b,c* ou *1,2,3* (as opções que teve)\n\n" +
            "_Exemplo: a,c,e ou 1,3,5_"
        );
        return;
      }

      const tiposEmocionalSelecionados = opcoesEmocionalSelecionadas.map(
        (opt) => tiposEmocionalMap[opt]
      );
      estado.emocionalTipos = tiposEmocionalSelecionados;

      console.log(
        `✅ Tipos emocionais selecionados: ${tiposEmocionalSelecionados.join(
          ", "
        )}`
      );

      // Se selecionou "Outro", perguntar qual
      if (
        opcoesEmocionalSelecionadas.includes("f") ||
        opcoesEmocionalSelecionadas.includes("6")
      ) {
        await avancar("emocional_outros", mensagens.emocionalOutros);
      } else {
        await avancar("emocional_quando", mensagens.emocionalQuando);
      }
      break;

    case "emocional_outros":
      estado.emocionalOutros = userRaw.trim();
      await avancar("emocional_quando", mensagens.emocionalQuando);
      break;

    case "emocional_quando":
      // Validar formato MM/AAAA
      const regexDataEmocional = /^(\d{1,2})\/(\d{4})$/;
      const matchDataEmocional = userRaw.match(regexDataEmocional);

      if (!matchDataEmocional) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesEmocional, anoEmocional] = matchDataEmocional;
      estado.emocionalQuando = {
        mes: mesEmocional.padStart(2, "0"),
        ano: anoEmocional,
      };

      await avancar("emocional_existe", mensagens.emocionalExiste);
      break;

    case "emocional_existe":
      if (["sim", "s", "ok", "existem", "ainda"].includes(userMessage)) {
        estado.emocionalExiste = true;
      } else if (
        ["não", "nao", "n", "não existem", "pararam"].includes(userMessage)
      ) {
        estado.emocionalExiste = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se os sintomas ainda existem\n• *NÃO* se os sintomas pararam"
        );
        return;
      }
      await avancar("emocional_atrapalhou", mensagens.emocionalAtrapalhou);
      break;

    case "emocional_atrapalhou":
      if (
        ["sim", "s", "ok", "atrapalhou", "sim atrapalhou"].includes(userMessage)
      ) {
        estado.emocionalAtrapalhou = true;
      } else if (["não", "nao", "n", "não atrapalhou"].includes(userMessage)) {
        estado.emocionalAtrapalhou = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se atrapalhou viver/trabalhar\n• *NÃO* se não atrapalhou"
        );
        return;
      }
      await avancar("emocional_atestado", mensagens.emocionalAtestado);
      break;

    case "emocional_atestado":
      if (["sim", "s", "ok", "tive", "sim tive"].includes(userMessage)) {
        estado.emocionalAtestado = true;
      } else if (["não", "nao", "n", "não tive"].includes(userMessage)) {
        estado.emocionalAtestado = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve atestado médico\n• *NÃO* se não teve atestado"
        );
        return;
      }
      await avancar("emocional_gastos", mensagens.emocionalGastos);
      break;

    case "emocional_gastos":
      // Validar valor numérico
      const gastoLimpo = userRaw.replace(/[^\d]/g, "");

      if (!/^\d+$/.test(gastoLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 150 (para R$ 150,00)_\n_Digite 0 se não tem gastos_"
        );
        return;
      }

      estado.emocionalGastos = parseInt(gastoLimpo);

      // Finalizar seção 3
      await avancar(
        "secao4",
        "✅ *Seção Emocional concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "secao4":
      // Iniciar seção 4 - Perda de Bens
      await avancar("bens_perda", mensagens.bensPerda);
      break;

    case "bens_perda":
      if (["sim", "s", "ok", "perdi", "sim perdi"].includes(userMessage)) {
        estado.bensPerda = true;
        await avancar("bens_tipos", mensagens.bensTipos);
      } else if (
        ["não", "nao", "n", "nenhum", "não perdi"].includes(userMessage)
      ) {
        estado.bensPerda = false;
        // Pular para próxima seção (seção 5)
        await avancar(
          "secao5",
          "✅ *Seção Bens registrada!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se perdeu/danificou bens\n• *NÃO* se não perdeu bens"
        );
      }
      break;

    case "bens_tipos":
      // Processar seleção de tipos de bens
      const tiposBensMap = {
        1: "Casa",
        2: "Terra",
        3: "Plantações",
        4: "Animais",
        5: "Veículos",
        6: "Barcos",
        7: "Equipamentos",
        8: "Bens pessoais ou sentimentais",
        9: "Construções",
      };

      const opcoesBensSelecionadas = userRaw
        .toLowerCase()
        .replace(/[^1-9,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in tiposBensMap);

      if (opcoesBensSelecionadas.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite os números dos bens que você tinha\n\n" +
            "_Exemplo: 1,3,5 ou 2,4,8_"
        );
        return;
      }

      const tiposBensSelecionados = opcoesBensSelecionadas.map(
        (opt) => tiposBensMap[opt]
      );
      estado.bensTipos = tiposBensSelecionados;

      console.log(
        `✅ Tipos de bens selecionados: ${tiposBensSelecionados.join(", ")}`
      );

      await avancar("bens_valor_antes", mensagens.bensValorAntes);
      break;

    case "bens_valor_antes":
      // Validar valor numérico
      const valorAntesLimpo = userRaw.replace(/[^\d]/g, "");

      if (!/^\d+$/.test(valorAntesLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 150000 (para R$ 150.000,00)_\n_Digite 0 se não sabe o valor_"
        );
        return;
      }

      estado.bensValorAntes = parseInt(valorAntesLimpo);
      await avancar("bens_valor_depois", mensagens.bensValorDepois);
      break;

    case "bens_valor_depois":
      // Validar valor numérico
      const valorDepoisLimpo = userRaw.replace(/[^\d]/g, "");

      if (!/^\d+$/.test(valorDepoisLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 50000 (para R$ 50.000,00)_\n_Digite 0 se perdeu tudo_"
        );
        return;
      }

      estado.bensValorDepois = parseInt(valorDepoisLimpo);
      await avancar("bens_quando", mensagens.bensQuando);
      break;

    case "bens_quando":
      // Validar formato MM/AAAA
      const regexDataBens = /^(\d{1,2})\/(\d{4})$/;
      const matchDataBens = userRaw.match(regexDataBens);

      if (!matchDataBens) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesBens, anoBens] = matchDataBens;
      estado.bensQuando = {
        mes: mesBens.padStart(2, "0"),
        ano: anoBens,
      };

      // Finalizar seção 4
      await avancar(
        "secao5",
        "✅ *Seção Perda de Bens concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "secao5":
      // Iniciar seção 5 - Mudança de Casa
      await avancar("mudanca_casa", mensagens.mudancaCasa);
      break;

    case "mudanca_casa":
      if (["sim", "s", "ok", "mudei", "sim mudei"].includes(userMessage)) {
        estado.mudancaCasa = true;
        await avancar("mudanca_motivo", mensagens.mudancaMotivo);
      } else if (["não", "nao", "n", "não mudei"].includes(userMessage)) {
        estado.mudancaCasa = false;
        // Pular para próxima seção (seção 6)
        await avancar(
          "secao6",
          "✅ *Seção Mudança registrada!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve que se mudar\n• *NÃO* se não se mudou"
        );
      }
      break;

    case "mudanca_motivo":
      // Processar seleção de motivos
      const motivosMudancaMap = {
        1: "Casa destruída",
        2: "Risco à saúde ou segurança",
        3: "Sem estrutura no bairro",
        4: "Reassentamento",
        5: "Outros",
      };

      const motivosSelecionados = userRaw
        .toLowerCase()
        .replace(/[^1-5,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in motivosMudancaMap);

      if (motivosSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite os números dos motivos\n\n" +
            "_Exemplo: 1,2 ou 3,4_"
        );
        return;
      }

      const motivosTexto = motivosSelecionados.map(
        (opt) => motivosMudancaMap[opt]
      );
      estado.mudancaMotivo = motivosTexto;

      console.log(
        `✅ Motivos de mudança selecionados: ${motivosTexto.join(", ")}`
      );

      // Se selecionou "Outros", perguntar qual
      if (motivosSelecionados.includes("5")) {
        await avancar("mudanca_outros", mensagens.mudancaOutros);
      } else {
        await avancar("mudanca_quando", mensagens.mudancaQuando);
      }
      break;

    case "mudanca_outros":
      estado.mudancaOutros = userRaw.trim();
      await avancar("mudanca_quando", mensagens.mudancaQuando);
      break;

    case "mudanca_quando":
      // Validar formato MM/AAAA
      const regexDataMudanca = /^(\d{1,2})\/(\d{4})$/;
      const matchDataMudanca = userRaw.match(regexDataMudanca);

      if (!matchDataMudanca) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesMudanca, anoMudanca] = matchDataMudanca;
      estado.mudancaQuando = {
        mes: mesMudanca.padStart(2, "0"),
        ano: anoMudanca,
      };

      await avancar("mudanca_voltou", mensagens.mudancaVoltou);
      break;

    case "mudanca_voltou":
      if (["sim", "s", "ok", "voltei", "consegui"].includes(userMessage)) {
        estado.mudancaVoltou = true;
      } else if (
        ["não", "nao", "n", "não voltei", "não consegui"].includes(userMessage)
      ) {
        estado.mudancaVoltou = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se conseguiu voltar\n• *NÃO* se não conseguiu voltar"
        );
        return;
      }
      await avancar("mudanca_moradia", mensagens.mudancaMoradia);
      break;

    case "mudanca_moradia":
      // Processar tipo de nova moradia
      const moradiaMap = {
        1: "Paga por você",
        2: "Fornecida por ONG (exceto Renova)",
        3: "Dada pela Renova ou Samarco",
      };

      const opcaoMoradia = userRaw.replace(/[^1-3]/g, "").trim();

      if (!opcaoMoradia || !(opcaoMoradia in moradiaMap)) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma opção válida:\n\n" +
            "Digite *1*, *2* ou *3*\n\n" +
            "1) Paga por você\n2) Fornecida por ONG\n3) Dada pela Renova/Samarco"
        );
        return;
      }

      estado.mudancaMoradia = moradiaMap[opcaoMoradia];
      console.log(`✅ Tipo de moradia: ${estado.mudancaMoradia}`);

      await avancar("mudanca_gastos", mensagens.mudancaGastos);
      break;

    case "mudanca_gastos":
      if (["sim", "s", "ok", "tive", "sim tive"].includes(userMessage)) {
        estado.mudancaGastos = true;
      } else if (["não", "nao", "n", "não tive"].includes(userMessage)) {
        estado.mudancaGastos = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve gastos com a mudança\n• *NÃO* se não teve gastos"
        );
        return;
      }

      // Finalizar seção 5
      await avancar(
        "secao6",
        "✅ *Seção Mudança de Casa concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "secao6":
      // Iniciar seção 6 - Alimentação
      await avancar("alimentacao_fonte", mensagens.alimentacaoFonte);
      break;

    case "alimentacao_fonte":
      if (["sim", "s", "ok", "perdi", "sim perdi"].includes(userMessage)) {
        estado.alimentacaoFonte = true;
        await avancar("alimentacao_quando", mensagens.alimentacaoQuando);
      } else if (["não", "nao", "n", "não perdi"].includes(userMessage)) {
        estado.alimentacaoFonte = false;
        // Pular para próxima seção (seção 7)
        await avancar(
          "secao7",
          "✅ *Seção Alimentação registrada!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se perdeu fonte de comida\n• *NÃO* se não perdeu"
        );
      }
      break;

    case "alimentacao_quando":
      // Validar formato MM/AAAA
      const regexDataAlimentacao = /^(\d{1,2})\/(\d{4})$/;
      const matchDataAlimentacao = userRaw.match(regexDataAlimentacao);

      if (!matchDataAlimentacao) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesAlimentacao, anoAlimentacao] = matchDataAlimentacao;
      estado.alimentacaoQuando = {
        mes: mesAlimentacao.padStart(2, "0"),
        ano: anoAlimentacao,
      };

      await avancar("alimentacao_sem_fonte", mensagens.alimentacaoSemFonte);
      break;

    case "alimentacao_sem_fonte":
      if (["sim", "s", "ok", "ainda", "sem fonte"].includes(userMessage)) {
        estado.alimentacaoSemFonte = true;
      } else if (
        ["não", "nao", "n", "recuperei", "tenho fonte"].includes(userMessage)
      ) {
        estado.alimentacaoSemFonte = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se ainda está sem a fonte\n• *NÃO* se recuperou a fonte"
        );
        return;
      }
      await avancar("alimentacao_gastos", mensagens.alimentacaoGastos);
      break;

    case "alimentacao_gastos":
      // Processar seleção de tipos de gastos
      const gastosAlimentacaoMap = {
        1: "Compra de alimentos",
        2: "Produção alternativa",
        3: "Viagens para buscar comida",
        4: "Outros",
      };

      const gastosAlimentacaoSelecionados = userRaw
        .toLowerCase()
        .replace(/[^1-4,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in gastosAlimentacaoMap);

      if (gastosAlimentacaoSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite os números dos gastos que teve\n\n" +
            "_Exemplo: 1,2 ou 3,4_"
        );
        return;
      }

      const gastosTexto = gastosAlimentacaoSelecionados.map(
        (opt) => gastosAlimentacaoMap[opt]
      );
      estado.alimentacaoGastos = gastosTexto;

      console.log(
        `✅ Gastos com alimentação selecionados: ${gastosTexto.join(", ")}`
      );

      // Se selecionou "Outros", perguntar qual
      if (gastosAlimentacaoSelecionados.includes("4")) {
        await avancar("alimentacao_outros", mensagens.alimentacaoOutros);
      } else {
        await avancar("alimentacao_valor", mensagens.alimentacaoValor);
      }
      break;

    case "alimentacao_outros":
      estado.alimentacaoOutros = userRaw.trim();
      await avancar("alimentacao_valor", mensagens.alimentacaoValor);
      break;

    case "alimentacao_valor":
      // Validar valor numérico
      const valorAlimentacaoLimpo = userRaw.replace(/[^\d]/g, "");

      if (!/^\d+$/.test(valorAlimentacaoLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 300 (para R$ 300,00)_\n_Digite 0 se não tem gastos extras_"
        );
        return;
      }

      estado.alimentacaoValor = parseInt(valorAlimentacaoLimpo);

      // Finalizar seção 6
      await avancar(
        "secao7",
        "✅ *Seção Alimentação concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "secao7":
      // Iniciar seção 7 - Aumento no Custo de Vida
      await avancar("custo_vida_aumento", mensagens.custoVidaAumento);
      break;

    case "custo_vida_aumento":
      if (["sim", "s", "ok", "aumentou", "sim aumentou"].includes(userMessage)) {
        estado.custoVidaAumento = true;
        await avancar("custo_vida_tipos", mensagens.custoVidaTipos);
      } else if (["não", "nao", "n", "não aumentou"].includes(userMessage)) {
        estado.custoVidaAumento = false;
        // Pular para próxima seção (seção 8)
        await avancar("secao8", "✅ *Seção Custo de Vida registrada!*\n\nVamos para a próxima seção...");
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se o custo de vida aumentou\n• *NÃO* se não aumentou"
        );
      }
      break;

    case "custo_vida_tipos":
      // Processar seleção de tipos de gastos
      const tiposCustoMap = {
        '1': 'Alimentação',
        '2': 'Moradia',
        '3': 'Transporte',
        '4': 'Lazer',
        '5': 'Vestuário'
      };

      const tiposCustoSelecionados = userRaw.toLowerCase()
        .replace(/[^1-5,]/g, '')
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt in tiposCustoMap);

      if (tiposCustoSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
          "Digite os números dos gastos que aumentaram\n\n" +
          "_Exemplo: 1,3,5 ou 2,4_"
        );
        return;
      }

      const tiposCustoTexto = tiposCustoSelecionados.map(opt => tiposCustoMap[opt]);
      estado.custoVidaTipos = tiposCustoTexto;

      console.log(`✅ Tipos de custo aumentado: ${tiposCustoTexto.join(', ')}`);

      await avancar("custo_vida_quando", mensagens.custoVidaQuando);
      break;

    case "custo_vida_quando":
      // Validar formato MM/AAAA
      const regexDataCusto = /^(\d{1,2})\/(\d{4})$/;
      const matchDataCusto = userRaw.match(regexDataCusto);
      
      if (!matchDataCusto) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesCusto, anoCusto] = matchDataCusto;
      estado.custoVidaQuando = {
        mes: mesCusto.padStart(2, '0'),
        ano: anoCusto
      };

      await avancar("custo_vida_valor", mensagens.custoVidaValor);
      break;

    case "custo_vida_valor":
      // Validar valor numérico
      const valorCustoLimpo = userRaw.replace(/[^\d]/g, '');
      
      if (!/^\d+$/.test(valorCustoLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 500 (para R$ 500,00)_\n_Digite 0 se não consegue estimar_"
        );
        return;
      }

      estado.custoVidaValor = parseInt(valorCustoLimpo);
      
      // Finalizar seção 7
      await avancar("secao8", "✅ *Seção Custo de Vida concluída!*\n\nVamos para a próxima seção...");
      break;

    case "secao8":
      // Iniciar seção 8 - Prejuízo na Renda
      await avancar("renda_prejuizo", mensagens.rendaPrejuizo);
      break;

    case "renda_prejuizo":
      if (["sim", "s", "ok", "foi", "sim foi"].includes(userMessage)) {
        estado.rendaPrejuizo = true;
        await avancar("renda_motivos", mensagens.rendaMotivos);
      } else if (["não", "nao", "n", "não foi"].includes(userMessage)) {
        estado.rendaPrejuizo = false;
        // Pular para próxima seção (seção 9)
        await avancar("secao9", "✅ *Seção Renda registrada!*\n\nVamos para a próxima seção...");
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se sua renda foi prejudicada\n• *NÃO* se não foi prejudicada"
        );
      }
      break;

    case "renda_motivos":
      // Processar seleção de motivos da perda de renda
      const motivosRendaMap = {
        '1': 'Pesca',
        '2': 'Agricultura', 
        '3': 'Pecuária',
        '4': 'Fechamento da Samarco',
        '5': 'Danos materiais ou ambientais',
        '6': 'Turismo (poucas pessoas no local)',
        '7': 'Saída de moradores'
      };

      const motivosRendaSelecionados = userRaw.toLowerCase()
        .replace(/[^1-7,]/g, '')
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt in motivosRendaMap);

      if (motivosRendaSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
          "Digite os números dos motivos da perda de renda\n\n" +
          "_Exemplo: 1,4,5 ou 2,6_"
        );
        return;
      }

      const motivosRendaTexto = motivosRendaSelecionados.map(opt => motivosRendaMap[opt]);
      estado.rendaMotivos = motivosRendaTexto;

      console.log(`✅ Motivos da perda de renda: ${motivosRendaTexto.join(', ')}`);

      await avancar("renda_quando", mensagens.rendaQuando);
      break;

    case "renda_quando":
      // Validar formato MM/AAAA
      const regexDataRenda = /^(\d{1,2})\/(\d{4})$/;
      const matchDataRenda = userRaw.match(regexDataRenda);
      
      if (!matchDataRenda) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesRenda, anoRenda] = matchDataRenda;
      estado.rendaQuando = {
        mes: mesRenda.padStart(2, '0'),
        ano: anoRenda
      };

      await avancar("renda_valor", mensagens.rendaValor);
      break;

    case "renda_valor":
      // Validar valor numérico
      const valorRendaLimpo = userRaw.replace(/[^\d]/g, '');
      
      if (!/^\d+$/.test(valorRendaLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 1500 (para R$ 1.500,00)_\n_Digite 0 se não consegue estimar_"
        );
        return;
      }

      estado.rendaValor = parseInt(valorRendaLimpo);
      
      // Finalizar seção 8
      await avancar("secao9", "✅ *Seção Prejuízo na Renda concluída!*\n\nVamos para a próxima seção...");
      break;

    case "secao9":
      // Iniciar seção 9 - Problemas com Água
      await avancar("agua_problemas", mensagens.aguaProblemas);
      break;

    case "agua_problemas":
      if (["sim", "s", "ok", "foi", "sim foi"].includes(userMessage)) {
        estado.aguaProblemas = true;
        await avancar("agua_tipos", mensagens.aguaTipos);
      } else if (["não", "nao", "n", "não foi"].includes(userMessage)) {
        estado.aguaProblemas = false;
        // Pular para próxima seção (seção 10)
        await avancar("secao10", "✅ *Seção Água registrada!*\n\nVamos para a próxima seção...");
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se o abastecimento de água foi afetado\n• *NÃO* se não foi afetado"
        );
      }
      break;

    case "agua_tipos":
      // Processar seleção de tipos de problemas com água
      const tiposAguaMap = {
        '1': 'Ficou sem água',
        '2': 'Ficava oscilando',
        '3': 'Contaminada'
      };

      const tiposAguaSelecionados = userRaw.toLowerCase()
        .replace(/[^1-3,]/g, '')
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt in tiposAguaMap);

      if (tiposAguaSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
          "Digite os números dos problemas que teve\n\n" +
          "_Exemplo: 1,3 ou 2_"
        );
        return;
      }

      const tiposAguaTexto = tiposAguaSelecionados.map(opt => tiposAguaMap[opt]);
      estado.aguaTipos = tiposAguaTexto;

      console.log(`✅ Tipos de problemas com água: ${tiposAguaTexto.join(', ')}`);

      await avancar("agua_continua", mensagens.aguaContinua);
      break;

    case "agua_continua":
      if (["sim", "s", "ok", "continua", "ainda"].includes(userMessage)) {
        estado.aguaContinua = true;
      } else if (["não", "nao", "n", "parou", "não continua"].includes(userMessage)) {
        estado.aguaContinua = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se ainda continua\n• *NÃO* se já parou"
        );
        return;
      }
      await avancar("agua_tempo", mensagens.aguaTempo);
      break;

    case "agua_tempo":
      estado.aguaTempo = userRaw.trim();
      await avancar("agua_gastos", mensagens.aguaGastos);
      break;

    case "agua_gastos":
      // Processar seleção de tipos de gastos com água
      const gastosAguaMap = {
        '1': 'Compra de água',
        '2': 'Poço ou cisterna',
        '3': 'Transporte',
        '4': 'Outros',
        '5': 'Não tive despesas'
      };

      const gastosAguaSelecionados = userRaw.toLowerCase()
        .replace(/[^1-5,]/g, '')
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt in gastosAguaMap);

      if (gastosAguaSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
          "Digite os números dos gastos que teve\n\n" +
          "_Exemplo: 1,3 ou 5 (se não teve despesas)_"
        );
        return;
      }

      const gastosAguaTexto = gastosAguaSelecionados.map(opt => gastosAguaMap[opt]);
      estado.aguaGastos = gastosAguaTexto;

      console.log(`✅ Gastos com água: ${gastosAguaTexto.join(', ')}`);

      // Se selecionou "Outros", perguntar qual
      if (gastosAguaSelecionados.includes('4')) {
        await avancar("agua_outros", mensagens.aguaOutros);
      } 
      // Se selecionou "Não tive despesas", pular para próxima seção
      else if (gastosAguaSelecionados.includes('5')) {
        estado.aguaValor = 0;
        await avancar("secao10", "✅ *Seção Problemas com Água concluída!*\n\nVamos para a próxima seção...");
      } 
      else {
        await avancar("agua_valor", mensagens.aguaValor);
      }
      break;

    case "agua_outros":
      estado.aguaOutros = userRaw.trim();
      await avancar("agua_valor", mensagens.aguaValor);
      break;

    case "agua_valor":
      // Validar valor numérico
      const valorAguaLimpo = userRaw.replace(/[^\d]/g, '');
      
      if (!/^\d+$/.test(valorAguaLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 150 (para R$ 150,00)_\n_Digite 0 se não tem gastos_"
        );
        return;
      }

      estado.aguaValor = parseInt(valorAguaLimpo);
      
      // Finalizar seção 9
      await avancar("secao10", "✅ *Seção Problemas com Água concluída!*\n\nVamos para a próxima seção...");
      break;

    case "secao10":
      // Ir direto para seção 11 - Uso do Rio e da Terra
      await avancar("rio_terra_rio", mensagens.rioTerraRio);
      break;

    case "rio_terra_rio":
      if (["sim", "s", "ok", "perdi", "sim perdi"].includes(userMessage)) {
        estado.rioTerraRio = true;
        estado.rioTerraAlgumUso = true; // Marca que houve algum uso perdido
        await avancar("rio_terra_terra", mensagens.rioTerraTerra);
      } else if (["não", "nao", "n", "não perdi"].includes(userMessage)) {
        estado.rioTerraRio = false;
        // Perguntar sobre a terra mesmo se não perdeu o rio
        await avancar("rio_terra_terra", mensagens.rioTerraTerra);
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se perdeu o uso do rio/mar\n• *NÃO* se não perdeu"
        );
      }
      break;

    case "rio_terra_terra":
      if (["sim", "s", "ok", "perdi", "sim perdi"].includes(userMessage)) {
        estado.rioTerraTerra = true;
        estado.rioTerraAlgumUso = true; // Marca que houve algum uso perdido
        await avancar("rio_terra_usos", mensagens.rioTerraUsos);
      } else if (["não", "nao", "n", "não perdi"].includes(userMessage)) {
        estado.rioTerraTerra = false;
        
        // Se não perdeu nem rio nem terra, pular para seção 12
        if (!estado.rioTerraAlgumUso) {
          await avancar("secao12", "✅ *Seção Uso do Rio e Terra registrada!*\n\nVamos para a próxima seção...");
        } else {
          // Se perdeu pelo menos um (rio), continuar com os usos
          await avancar("rio_terra_usos", mensagens.rioTerraUsos);
        }
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se perdeu o uso da terra\n• *NÃO* se não perdeu"
        );
      }
      break;

    case "rio_terra_usos":
      // Processar seleção de tipos de usos
      const usosRioTerraMap = {
        '1': 'Pesca',
        '2': 'Navegação',
        '3': 'Esporte',
        '4': 'Cerimônias',
        '5': 'Para plantar/comer',
        '6': 'Criar animais',
        '7': 'Atividades com a família',
        '8': 'Tradições ou cultos',
        '9': 'Outros'
      };

      const usosRioTerraSelecionados = userRaw.toLowerCase()
        .replace(/[^1-9,]/g, '')
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt in usosRioTerraMap);

      if (usosRioTerraSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
          "Digite os números dos usos que teve\n\n" +
          "_Exemplo: 1,5,7 ou 2,4,8_"
        );
        return;
      }

      const usosRioTerraTexto = usosRioTerraSelecionados.map(opt => usosRioTerraMap[opt]);
      estado.rioTerraUsos = usosRioTerraTexto;

      console.log(`✅ Usos do rio/terra: ${usosRioTerraTexto.join(', ')}`);

      // Se selecionou "Outros", perguntar qual
      if (usosRioTerraSelecionados.includes('9')) {
        await avancar("rio_terra_outros", mensagens.rioTerraOutros);
      } else {
        await avancar("rio_terra_quando", mensagens.rioTerraQuando);
      }
      break;

    case "rio_terra_outros":
      estado.rioTerraOutros = userRaw.trim();
      await avancar("rio_terra_quando", mensagens.rioTerraQuando);
      break;

    case "rio_terra_quando":
      // Validar formato MM/AAAA
      const regexDataRioTerra = /^(\d{1,2})\/(\d{4})$/;
      const matchDataRioTerra = userRaw.match(regexDataRioTerra);
      
      if (!matchDataRioTerra) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesRioTerra, anoRioTerra] = matchDataRioTerra;
      estado.rioTerraQuando = {
        mes: mesRioTerra.padStart(2, '0'),
        ano: anoRioTerra
      };

      // Finalizar seção 11
      await avancar("secao12", "✅ *Seção Uso do Rio e Terra concluída!*\n\nVamos para a próxima seção...");
      break;

    case "secao12":
      // Ir direto para seção 13 - Indenizações ou Ações
      await avancar("indenizacao_processo", mensagens.indenizacaoProcesso);
      break;

    case "indenizacao_processo":
      if (["sim", "s", "ok", "processei", "sim processei"].includes(userMessage)) {
        estado.indenizacaoProcesso = true;
      } else if (["não", "nao", "n", "não processei"].includes(userMessage)) {
        estado.indenizacaoProcesso = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se já processou a Samarco/Renova\n• *NÃO* se não processou"
        );
        return;
      }
      await avancar("indenizacao_recebidas", mensagens.indenizacaoRecebidas);
      break;

    case "indenizacao_recebidas":
      // Processar seleção de indenizações recebidas
      const indenizacoesMap = {
        '1': 'AFE',
        '2': 'PIM (conhecido como os 1.000 reais)',
        '3': 'PID (os 35 mil reais)',
        '4': 'Sistema NÓVEL (os 15 mil reais)',
        '5': 'Não recebi nada'
      };

      const indenizacoesSelecionadas = userRaw.toLowerCase()
        .replace(/[^1-5,]/g, '')
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt in indenizacoesMap);

      if (indenizacoesSelecionadas.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
          "Digite os números das indenizações que recebeu\n\n" +
          "_Exemplo: 1,2 ou 5 (se não recebeu nada)_"
        );
        return;
      }

      const indenizacoesTexto = indenizacoesSelecionadas.map(opt => indenizacoesMap[opt]);
      estado.indenizacaoRecebidas = indenizacoesTexto;

      console.log(`✅ Indenizações recebidas: ${indenizacoesTexto.join(', ')}`);

      // Se selecionou "Não recebi nada", pular pergunta sobre quando recebeu
      if (indenizacoesSelecionadas.includes('5')) {
        await avancar("indenizacao_cadastrado", mensagens.indenizacaoCadastrado);
      } else {
        await avancar("indenizacao_quando", mensagens.indenizacaoQuando);
      }
      break;

    case "indenizacao_quando":
      // Validar formato MM/AAAA
      const regexDataIndenizacao = /^(\d{1,2})\/(\d{4})$/;
      const matchDataIndenizacao = userRaw.match(regexDataIndenizacao);
      
      if (!matchDataIndenizacao) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 03/2020_"
        );
        return;
      }

      const [, mesIndenizacao, anoIndenizacao] = matchDataIndenizacao;
      estado.indenizacaoQuando = {
        mes: mesIndenizacao.padStart(2, '0'),
        ano: anoIndenizacao
      };

      await avancar("indenizacao_cadastrado", mensagens.indenizacaoCadastrado);
      break;

    case "indenizacao_cadastrado":
      if (["sim", "s", "ok", "estou", "sim estou"].includes(userMessage)) {
        estado.indenizacaoCadastrado = true;
      } else if (["não", "nao", "n", "não estou"].includes(userMessage)) {
        estado.indenizacaoCadastrado = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se está cadastrado para receber\n• *NÃO* se não está cadastrado"
        );
        return;
      }
      await avancar("indenizacao_contato", mensagens.indenizacaoContato);
      break;

    case "indenizacao_contato":
      if (["sim", "s", "ok", "fui", "sim fui"].includes(userMessage)) {
        estado.indenizacaoContato = true;
      } else if (["não", "nao", "n", "não fui"].includes(userMessage)) {
        estado.indenizacaoContato = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se já foi contatado\n• *NÃO* se não foi contatado"
        );
        return;
      }

      // Finalizar seção 13 e questionário completo
      await avancar("finalizar", "✅ *Seção Indenizações concluída!*\n\n🎉 *Questionário completo!*\n\nSeus dados estão sendo salvos...");
      break;

    case "finalizar":
      // Salvar dados e finalizar questionário
      await salvarDadosCompletos(client, id, estado);
      
      await client.sendText(
        id,
        "🎉 *Parabéns! Cadastro finalizado com sucesso!*\n\n" +
        "✅ Todas as suas informações foram registradas\n" +
        "📊 Seus dados foram salvos no sistema\n" +
        "📞 Entraremos em contato em breve\n\n" +
        "*Obrigado pela sua participação!* 🙏"
      );
      
      limparEstado(id);
      break;    default:
      console.log(`⚠️ Etapa não reconhecida: ${etapa3}`);
      await client.sendText(
        id,
        "❓ Não entendi sua resposta. Digite *cancelar* para sair ou aguarde instruções."
      );
      break;
  }
}

// Função para salvar dados completos
async function salvarDadosCompletos(client, id, estado) {
  console.log("🚀 Salvando dados completos diretamente");
  console.log(
    "📦 Estado completo antes do salvamento:",
    JSON.stringify(estado, null, 2)
  );

  try {
    // Preparar dados para salvamento
    const dadosParaSalvar = {
      timestamp: new Date().toISOString(),
      id: id,
      nome: estado.nome || "",
      cpf: estado.cpf || "",
      nascimento: estado.nascimento || "",
      telefone: estado.telefone || "",
      email: estado.email || "",
      cep: estado.cep || "",
      rua: estado.rua || "",
      numero: estado.numero || "",
      complemento: estado.complemento || "",
      bairro: estado.bairro || "",

      // Dados de saúde física
      saude_problemas: estado.saudeProblemas || false,
      saude_tipos: estado.saudeTipos ? estado.saudeTipos.join("; ") : "",
      saude_outros: estado.saudeOutros || "",
      saude_continua: estado.saudeContinua || false,
      saude_quando_mes: estado.saudeQuando?.mes || "",
      saude_quando_ano: estado.saudeQuando?.ano || "",
      saude_quando_descricao: estado.saudeQuando?.descricao || "",
      saude_diagnostico: estado.saudeDiagnostico || false,
      saude_diagnostico_qual: estado.saudeDiagnosticoQual || "",
      saude_renda_afetou: estado.saudeRenda || false,
      saude_renda_continua: estado.saudeRendaContinua || false,

      // Dados emocionais/psicológicos
      emocional_problemas: estado.emocionalProblemas || false,
      emocional_tipos: estado.emocionalTipos
        ? estado.emocionalTipos.join("; ")
        : "",
      emocional_outros: estado.emocionalOutros || "",
      emocional_quando_mes: estado.emocionalQuando?.mes || "",
      emocional_quando_ano: estado.emocionalQuando?.ano || "",
      emocional_existe: estado.emocionalExiste || false,
      emocional_atrapalhou: estado.emocionalAtrapalhou || false,
      emocional_atestado: estado.emocionalAtestado || false,
      emocional_gastos: estado.emocionalGastos || 0,

      // Dados de perda de bens
      bens_perda: estado.bensPerda || false,
      bens_tipos: estado.bensTipos ? estado.bensTipos.join("; ") : "",
      bens_valor_antes: estado.bensValorAntes || 0,
      bens_valor_depois: estado.bensValorDepois || 0,
      bens_quando_mes: estado.bensQuando?.mes || "",
      bens_quando_ano: estado.bensQuando?.ano || "",
      bens_perda_valor:
        estado.bensValorAntes && estado.bensValorDepois
          ? estado.bensValorAntes - estado.bensValorDepois
          : 0,

      // Dados de mudança de casa
      mudanca_casa: estado.mudancaCasa || false,
      mudanca_motivo: estado.mudancaMotivo
        ? estado.mudancaMotivo.join("; ")
        : "",
      mudanca_outros: estado.mudancaOutros || "",
      mudanca_quando_mes: estado.mudancaQuando?.mes || "",
      mudanca_quando_ano: estado.mudancaQuando?.ano || "",
      mudanca_voltou: estado.mudancaVoltou || false,
      mudanca_moradia_tipo: estado.mudancaMoradia || "",
      mudanca_gastos: estado.mudancaGastos || false,

      // Dados de alimentação
      alimentacao_fonte_perda: estado.alimentacaoFonte || false,
      alimentacao_quando_mes: estado.alimentacaoQuando?.mes || "",
      alimentacao_quando_ano: estado.alimentacaoQuando?.ano || "",
      alimentacao_sem_fonte: estado.alimentacaoSemFonte || false,
      alimentacao_gastos_tipos: estado.alimentacaoGastos
        ? estado.alimentacaoGastos.join("; ")
        : "",
      alimentacao_outros: estado.alimentacaoOutros || "",
      alimentacao_valor_mensal: estado.alimentacaoValor || 0,

      // Dados de custo de vida
      custo_vida_aumento: estado.custoVidaAumento || false,
      custo_vida_tipos: estado.custoVidaTipos ? estado.custoVidaTipos.join('; ') : "",
      custo_vida_quando_mes: estado.custoVidaQuando?.mes || "",
      custo_vida_quando_ano: estado.custoVidaQuando?.ano || "",
      custo_vida_valor_mensal: estado.custoVidaValor || 0,

      // Dados de prejuízo na renda
      renda_prejudicada: estado.rendaPrejuizo || false,
      renda_motivos: estado.rendaMotivos ? estado.rendaMotivos.join('; ') : "",
      renda_quando_mes: estado.rendaQuando?.mes || "",
      renda_quando_ano: estado.rendaQuando?.ano || "",
      renda_valor_perdido: estado.rendaValor || 0,

      // Dados de problemas com água
      agua_problemas: estado.aguaProblemas || false,
      agua_tipos: estado.aguaTipos ? estado.aguaTipos.join('; ') : "",
      agua_continua: estado.aguaContinua || false,
      agua_tempo_descricao: estado.aguaTempo || "",
      agua_gastos_tipos: estado.aguaGastos ? estado.aguaGastos.join('; ') : "",
      agua_outros: estado.aguaOutros || "",
      agua_valor_mensal: estado.aguaValor || 0,

      // Dados de uso do rio e terra
      rio_terra_perdeu_rio: estado.rioTerraRio || false,
      rio_terra_perdeu_terra: estado.rioTerraTerra || false,
      rio_terra_usos: estado.rioTerraUsos ? estado.rioTerraUsos.join('; ') : "",
      rio_terra_outros: estado.rioTerraOutros || "",
      rio_terra_quando_mes: estado.rioTerraQuando?.mes || "",
      rio_terra_quando_ano: estado.rioTerraQuando?.ano || "",

      // Dados de indenizações ou ações
      indenizacao_processou: estado.indenizacaoProcesso || false,
      indenizacao_tipos_recebidas: estado.indenizacaoRecebidas ? estado.indenizacaoRecebidas.join('; ') : "",
      indenizacao_quando_mes: estado.indenizacaoQuando?.mes || "",
      indenizacao_quando_ano: estado.indenizacaoQuando?.ano || "",
      indenizacao_cadastrado: estado.indenizacaoCadastrado || false,
      indenizacao_foi_contatado: estado.indenizacaoContato || false,

      status: "questionario_completo",
      observacoes:
        "Questionário completo: todas as seções de impactos e indenizações foram preenchidas",
    };

    console.log("📊 Dados preparados:", dadosParaSalvar);

    // Salvar no Google Sheets
    await salvarNoSheets(dadosParaSalvar);
    console.log("✅ Dados salvos com sucesso no Google Sheets!");

    return true;
  } catch (error) {
    console.error("❌ Erro ao salvar dados:", error);
    throw error;
  }
}

module.exports = {
  fluxoPerguntas,
  mensagens,
  enviarComSeguranca,
};
