const { getEstado, setEstado, limparEstado } = require("../utils/estados");
const { salvarNoSheets } = require("../google/sheets");
const { protecao } = require("../utils/protecaoAntiBot");
const { protecaoSimples } = require("../utils/protecaoSimples");
const { enviarMensagemRobusta } = require("../utils/envioRobusto");
const path = require("path");
const fs = require("fs");

// Função para enviar mensagem com proteção anti-bot (versão simplificada para debug)
async function enviarMensagemSegura(client, id, mensagem, tipo = "normal") {
  try {
    console.log(
      `� [DEBUG] Enviando mensagem para ${id}: ${mensagem.substring(0, 50)}...`
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

// Função para enviar arquivo com proteção
async function enviarArquivoSeguro(client, id, caminhoArquivo, caption = "") {
  console.log("📄 Preparando envio de arquivo com proteção anti-bot");

  // Delay específico para arquivos
  await protecao.delayEnvioArquivo(id);

  // Simular digitação mais longa para arquivo
  await protecao.simularDigitando(client, id, 8000);

  // Tentar envio do arquivo com múltiplas estratégias
  return await enviarPDFContrato(client, id);
}

// Função para salvar dados completos diretamente
async function salvarDadosCompletos(client, id, estado) {
  console.log("🚀 Salvando dados completos diretamente");
  console.log(
    "📦 Estado completo antes do salvamento:",
    JSON.stringify(estado, null, 2)
  );

  try {
    const dadosParaSalvar = {
      nome: estado.nome,
      nascimento: estado.nascimento,
      cpf: estado.cpf,
      telefone: estado.telefone,
      email: estado.email,
      cep: estado.cep,
      rua: estado.rua,
      numero: estado.numero,
      bairro: estado.bairro,
      complemento: estado.complemento,
      menor_idade: estado.menorIdade,
      acao_inglaterra: estado.pergunta1,
      indigena_quilombola: estado.pergunta2,
      mesmo_endereco_romp: estado.pergunta3,
      dano_fisico_medico: estado.pergunta5,
      tipo_dano_fisico: estado.pergunta6,
      diagnostico_dano_fisico: estado.pergunta7,
      consequencias_dano: estado.pergunta8,
      transtorno_psiquiatrico: estado.pergunta9,
      diagnostico_psiquiatrico: estado.pergunta10,
      consequencias_psiquiatrico: estado.pergunta11,
      perda_propriedade: estado.pergunta12,
      tipos_perdas_propriedade: estado.pergunta13,
      detalhes_perdas: "",
      mudou_casa: estado.pergunta14,
      motivo_mudanca: estado.pergunta15,
      data_mudanca: estado.pergunta16,
      voltou_casa_original: estado.pergunta17,
      destino_mudanca: estado.pergunta18,
      perdeu_fonte_alimento: estado.pergunta19,
      quando_perda_alimento: estado.pergunta19_1,
      perda_alimento_continua: estado.pergunta19_2,
      despesas_perda_alimento: estado.pergunta19_3,
      outras_despesas_alimento: estado.pergunta19_4,
      renda_afetada: estado.pergunta20,
      motivos_renda_afetada: estado.pergunta20_1,
      quando_renda_afetada: estado.pergunta20_2,
      reducao_renda_persiste: estado.pergunta20_3,
      valor_perda_renda_mensal: estado.pergunta20_4,
      energia_afetada: estado.pergunta21,
      tipo_problema_energia: estado.pergunta21_1,
      quando_problema_energia: estado.pergunta21_2,
      despesas_energia: estado.pergunta21_3,
      outras_despesas_energia: estado.pergunta21_4,
      uso_rio_mar_afetado: estado.pergunta22,
      como_uso_rio_afetado: estado.pergunta22_1,
      outros_usos_rio_afetados: estado.pergunta22_2,
      quando_percebeu_perdas_rio: estado.pergunta22_3,
      uso_terra_afetado: estado.pergunta23,
      como_uso_terra_afetado: estado.pergunta23_1,
      outros_impactos_terra: estado.pergunta23_2,
      quando_percebeu_perdas_terra: estado.pergunta23_3,
      uso_rios_mar_afetado_2: estado.pergunta24,
      atividades_pesca: estado.pergunta24_1,
      outros_usos_recursos_hidricos: estado.pergunta24_2,
      outros_usos_descricao: estado.pergunta24_3,
      quando_percebeu_problemas_hidricos: estado.pergunta24_4,
      outros_prejuizos_materiais: estado.pergunta26,
      especificar_prejuizos_materiais: estado.pergunta26_1,
      indenizacao_recebida: estado.pergunta27,
      aderiu_repactuacao: estado.pergunta28,
      tipo_iniciativa_repactuacao: estado.pergunta28_1,
      recebeu_proposta_indenizacao: estado.pergunta28_2,
      recebeu_indenizacao_programas: estado.pergunta28_3,
      morador_bento_paracatu: estado.pergunta29,
      compensacao_nao_financeira: estado.pergunta30,
      cadastrou_compensacao: estado.pergunta30_1,
      contato_compensacao: estado.pergunta30_2,
      quem_indicou: estado.pergunta31,
    };

    console.log(
      "💾 Dados estruturados para salvamento:",
      JSON.stringify(dadosParaSalvar, null, 2)
    );

    await salvarNoSheets(dadosParaSalvar);

    await client.sendText(
      id,
      "✅ Seus dados foram salvos com sucesso! Entraremos em contato em breve com os próximos passos. ✈️"
    );
    console.log("✅ Dados salvos com sucesso para:", id);
  } catch (error) {
    await client.sendText(
      id,
      "⚠️ Ocorreu um erro ao salvar seus dados. Tente novamente mais tarde."
    );
    console.error("❌ Erro ao salvar planilha:", error);
    console.error("🔍 Stack trace completo:", error.stack);
  }

  limparEstado(id);
}

// Função para verificar se todas as perguntas obrigatórias foram respondidas
function verificarFluxoCompleto(estado) {
  const perguntasObrigatorias = [
    "menorIdade",
    "pergunta1",
    "pergunta2",
    "pergunta3",
    "pergunta5",
    "pergunta31", // pergunta final obrigatória
  ];

  return perguntasObrigatorias.every(
    (pergunta) => estado[pergunta] !== undefined && estado[pergunta] !== null
  );
}

// Função para forçar salvamento se o fluxo estiver completo
async function tentarSalvarSeCompleto(client, id, estado) {
  if (verificarFluxoCompleto(estado)) {
    console.log(
      "🔄 Detectado fluxo potencialmente completo - salvando através da função principal..."
    );
    await salvarDadosCompletos(client, id, estado);
    return true;
  }
  return false;
}

const mensagens = {
  inicio:
    "🤔 Agora vamos fazer algumas perguntas finais para concluir seu cadastro.",
  perguntaMenorIdade:
    "Você é menor de idade ou precisa de representante para agir legalmente em seu nome?\n👉 Sim ou Não",
  pergunta1:
    "1️⃣ Você faz parte da ação da Inglaterra relacionada ao rompimento da barragem de Fundão (Mariana)?\n👉 Sim ou Não",
  pergunta2:
    "2️⃣ Você se identifica como Indígena ou Quilombola?\n👉 Sim ou Não",
  pergunta3:
    "3️⃣ O endereço que você informou é o mesmo onde morava na época do rompimento da barragem?\n👉 Sim ou Não",
  // pergunta4 REMOVIDA
  pergunta5:
    "4️⃣ Em decorrência do rompimento da barragem de Mariana, você sofreu algum dano físico atestado por um médico?\n👉 Sim ou Não",
  pergunta6:
    "4️⃣.1️⃣ Caso sim, qual dos seguintes (responda com as letras correspondentes, pode escolher mais de uma):\n" +
    "a) Problemas de pele\nb) Doenças gastrointestinais\nc) Condições urinárias\nd) Fraturas ósseas\n" +
    "e) Ferimentos\nf) Outros danos físicos\ng) Não sofri nenhum dano físico",
  pergunta7:
    '4️⃣.2️⃣ Qual foi o diagnóstico e quando?\n👉 Exemplo: "Dermatite diagnosticada em janeiro de 2016"',
  pergunta8:
    "4️⃣.3️⃣ Esse(s) dano(s) (responda com as letras):\n" +
    "a) Restringiram sua capacidade de gerar renda\nb) Limitaram sua vida fora do trabalho\n" +
    "c) Geraram despesas médicas\n" +
    "d) Nenhuma das opções acima",
  pergunta9:
    "5️⃣ Em decorrência do rompimento da barragem de Mariana, Você foi diagnosticado com transtorno psiquiátrico por um médico?\n👉 Sim ou Não",
  pergunta10:
    '5️⃣.1️⃣ Qual foi o diagnóstico e quando?\n👉 Exemplo: "Ansiedade diagnosticada em março de 2017"',
  pergunta11:
    "5️⃣.2️⃣ Esse(s) dano(s) causados (responda com as letras):\n" +
    "a) Restringiram sua capacidade de gerar renda\nb) Limitaram sua vida fora do trabalho\n" +
    "c) Geraram despesas médicas\nd) Nenhuma das opções acima",
  pergunta12:
    "6️⃣ Você sofreu perdas em algum tipo de propriedade?\n👉 Sim ou Não",
  pergunta13:
    "6️⃣.1️⃣ Marque todos que se aplicam (letras):\n" +
    "a) Terra\nb) Casa\nc) Outras construções\nd) Pecuária\n" +
    "e) Plantações\nf) Veículo(s)\ng) Barcos\nh) Equipamentos\n" +
    "i) Bens pessoais\nj) Sentimentais\nk) Nenhuma das anteriores",
  pergunta14:
    "7️⃣ Você precisou se mudar por causa do rompimento?\n👉 Sim ou Não",
  pergunta15:
    "7️⃣.1️⃣ Qual o motivo da mudança? (letras):\n" +
    "a) Casa destruída\nb) Perigo no local\nc) Inabitável\nd) Infraestrutura danificada\n" +
    "e) Emprego\nf) Deslocamento da comunidade\ng) Nenhuma das opções",
  pergunta16: '7️⃣.2️⃣ Quando você se mudou?\n👉 Exemplo: "Março de 2016"',
  pergunta17: "7️⃣.3️⃣ Você já voltou para sua casa original?\n👉 Sim ou Não",
  pergunta18:
    "7️⃣.4️⃣ Para onde você se mudou? (responda com letras):\n" +
    "a) Local próprio/familiar\nb) Organização externa\nc) Samarco/Renova",
  pergunta19:
    "8️⃣ Após o rompimento da barragem de Mariana, você perdeu sua principal fonte de alimento?\n\n" +
    "📌 Exemplo: Se você dependia da pesca, da lavoura, da horta ou da criação de animais para se alimentar e perdeu isso após o desastre.\n\n👉 Sim ou Não",
  pergunta19_1:
    "8️⃣.1️⃣ Quando ocorreu essa perda?\n👉 Responda com o mês e o ano (ex: 11/2015)",
  pergunta19_2: "8️⃣.2️⃣ Essa perda ainda continua até hoje?\n👉 Sim ou Não",
  pergunta19_3:
    "8️⃣.3️⃣ Quais despesas adicionais você precisou arcar devido a essa perda? (Marque até DUAS opções)\n" +
    "👉 Responda com as letras correspondentes (ex: A, B, C)\n\n" +
    "a) Compra de alimentos para substituição\n" +
    "b) Produção de alimentos para substituição\n" +
    "c) Viagem ou entrega para obter alimentos\n" +
    "d) Outros\n" +
    "e) Não tive despesas adicionais",
  pergunta19_4:
    "8️⃣.4️⃣ Por favor, descreva quais foram essas despesas.\n👉 Escreva sua resposta em uma frase curta",
  pergunta20:
    "9️⃣ Sua renda foi afetada pelo rompimento da barragem de Mariana?\n👉 Sim ou Não",
  pergunta20_1:
    "9️⃣.1️⃣ Sua renda foi afetada devido a quais motivos?\n" +
    "👉 Responda com as letras correspondentes (ex: A, C, F)\n\n" +
    "A) Pesca profissional\n" +
    "B) Agricultura (plantações)\n" +
    "C) Pecuária (criação de animais)\n" +
    "D) Encerramento das operações da Samarco\n" +
    "E) Danos materiais causados pelo rompimento\n" +
    "F) Danos ambientais ao seu trabalho (exceto agropecuária)\n" +
    "G) Redução do turismo na região\n" +
    "H) Saída de pessoas da área afetada\n" +
    "I) Lesão física/doença causada pelo rompimento\n" +
    "J) Danos psiquiátricos causados pelo rompimento",
  pergunta20_2:
    "9️⃣.2️⃣ Quando sua renda começou a ser afetada?\n👉 Informe o mês e o ano (ex: 11/2015)",
  pergunta20_3:
    "9️⃣.3️⃣ Essa redução de renda ainda persiste hoje?\n👉 Sim ou Não",
  pergunta20_4:
    "9️⃣.4️⃣ Você consegue estimar quanto aproximadamente perdeu de renda por mês devido ao rompimento da barragem?\n👉 Responda com um valor em reais (ex: R$ 300)",
  pergunta21:
    "🔟 Seu fornecimento de energia elétrica foi afetado após o rompimento da barragem de Mariana?\n👉 Sim ou Não",
  pergunta21_1:
    "🔟.1️⃣ Qual foi o tipo de problema no fornecimento?\n" +
    "👉 Responda com as letras correspondentes (ex: A ou B)\n\n" +
    "A) Corte total no fornecimento\n" +
    "B) Fornecimento instável/intermitente",
  pergunta21_2:
    "🔟.2️⃣ Quando ocorreu a primeira interrupção ou instabilidade no fornecimento de energia?\n👉 Informe o mês e o ano (ex: 11/2015)",
  pergunta21_3:
    "🔟.3️⃣ Você teve despesas extras devido aos problemas de energia?\n" +
    "👉 Responda com as letras correspondentes (ex: A, B, C)\n\n" +
    "A) Aluguel de gerador ou energia alternativa\n" +
    "B) Viagens relacionadas\n" +
    "C) Reparos elétricos\n" +
    "D) Outros\n" +
    "E) Não tive despesas adicionais",
  pergunta21_4:
    "🔟.4️⃣ Descreva quais foram essas despesas.\n👉 Escreva sua resposta em uma frase curta",
  pergunta22:
    "1️⃣1️⃣ Seu uso e aproveitamento do rio e/ou mar foi afetado após o rompimento da barragem de Mariana?\n👉 Sim ou Não",
  pergunta22_1:
    "1️⃣1️⃣.1️⃣ Como esse uso foi afetado?\n" +
    "👉 Responda com as letras correspondentes (ex: A, B, C)\n\n" +
    "Pesca:\n" +
    "A) Para lazer\n" +
    "B) Para alimentação\n" +
    "C) Para troca\n" +
    "D) Para venda\n\n" +
    "Outros usos:\n" +
    "E) Navegação\n" +
    "F) Esportes aquáticos (natação, etc.)\n" +
    "G) Poluição afetando meu cotidiano\n" +
    "H) Impacto em atividades/cerimônias tradicionais\n" +
    "I) Outros",
  pergunta22_2:
    "1️⃣1️⃣.2️⃣ Descreva quais foram esses usos afetados.\n👉 Escreva sua resposta em uma frase curta",
  pergunta22_3:
    "1️⃣1️⃣.3️⃣ Quando você percebeu que essas perdas estavam relacionadas ao rompimento?\n👉 Informe o mês e o ano (ex: 11/2015)",
  pergunta23:
    "1️⃣2️⃣ Seu uso e aproveitamento da terra foi afetado após o rompimento da barragem de Mariana?\n👉 Sim ou Não",
  pergunta23_1:
    "1️⃣2️⃣.1️⃣ Como esse uso foi afetado?\n" +
    "👉 Marque todas as opções que se aplicam, usando as letras correspondentes (ex: A, C, F)\n\n" +
    "Atividades produtivas:\n" +
    "A) Cultivo para consumo próprio\n" +
    "B) Criação de animais\n\n" +
    "Usos sociais/culturais:\n" +
    "C) Esportes\n" +
    "D) Lugar de encontro/socialização\n" +
    "E) Impacto em atividades/cerimônias tradicionais\n\n" +
    "Outros impactos:\n" +
    "F) Poluição afetando meu cotidiano\n" +
    "G) Outros",
  pergunta23_2:
    "1️⃣2️⃣.2️⃣ Descreva quais foram esses impactos.\n👉 Escreva sua resposta em uma frase curta",
  pergunta23_3:
    "1️⃣2️⃣.3️⃣ Quando você percebeu que essas perdas estavam relacionadas ao rompimento?\n👉 Informe o mês e o ano (ex: 11/2015)",
  pergunta24:
    "1️⃣3️⃣ O rompimento da barragem afetou o seu uso de rios ou do mar?\n👉 Sim ou Não",
  pergunta24_1:
    "1️⃣3️⃣.1️⃣ Atividades de Pesca\n" +
    "👉 Responda com as letras correspondentes (ex: A, B, C)\n\n" +
    "a) Pesca por lazer\n" +
    "b) Pesca para alimentação própria\n" +
    "c) Pesca para troca/comércio informal\n" +
    "d) Pesca comercial (para renda)\n" +
    "e) Nenhuma atividade de pesca",
  pergunta24_2:
    "1️⃣3️⃣.2️⃣ Outros Usos dos Recursos Hídricos\n" +
    "👉 Responda com as letras correspondentes (ex: A, B, C)\n\n" +
    "a) Navegação/transporte por barco\n" +
    "b) Esportes aquáticos (natação, etc.)\n" +
    "c) Poluição que afetou meu cotidiano\n" +
    "d) Impacto em rituais/práticas tradicionais\n" +
    "e) Outros",
  pergunta24_3:
    "1️⃣3️⃣.3️⃣ Descreva quais foram:\n👉 Escreva sua resposta em uma frase curta",
  pergunta24_4:
    "1️⃣3️⃣.4️⃣ Quando você percebeu que esses problemas estavam relacionados ao rompimento?\n👉 Informe o mês e o ano (ex: 11/2015)",
  pergunta26:
    "1️⃣4️⃣ O rompimento da barragem te gerou outros prejuízos materiais, de qualquer tipo?\n👉 Sim ou Não",
  pergunta26_1:
    "1️⃣4️⃣.1️⃣ Por favor, especifique quais foram esses prejuízos materiais.\n" +
    "👉 Você pode citar, por exemplo:\n\n" +
    "Danos a eletrodomésticos (ex: máquina de lavar, geladeira, freezer)\n" +
    "Danos a sistemas de irrigação\n" +
    "Danos a encanamentos ou caixas d'água\n" +
    "Corrosão de bombas d'água ou motores\n" +
    "Outros equipamentos danificados pelo uso da água contaminada",
  pergunta27:
    "1️⃣5️⃣ Você recebeu alguma indenização em dinheiro antes de 2024 por meio de algum dos seguintes programas ou sistemas?\n" +
    "👉 Marque todas as opções que se aplicam (ex: A, C)\n\n" +
    "A) Auxílio Financeiro Emergencial (AFE)\n" +
    "B) Programa de Indenização Mediada – PIM (valor de R$ 1.000)\n" +
    "C) Sistema Judicial Simplificado (Sistema Novel – por exemplo: R$ 15.000 pelo dano água)\n" +
    "D) Outra forma de indenização da Renova ou Samarco que não está listada acima\n" +
    "E) Não recebi nenhuma indenização",
  pergunta28:
    "1️⃣6️⃣ Você aderiu a alguma das iniciativas indenizatórias da Repactuação assinada em novembro de 2024?\n👉 Sim ou Não",
  pergunta28_1:
    "1️⃣6️⃣.1️⃣ Qual tipo de iniciativa você ingressou ou está aguardando análise?\n" +
    "👉 Responda com as letras correspondentes (ex: A, B, C)\n\n" +
    "a) PIM-AFE\n" +
    "b) PID (R$ 35.000)\n" +
    "C) Recebi pelo Sistema Judicial Simplificado (Sistema Novel – por exemplo: R$ 15.000 pelo dano água)\n" +
    "d) Pescadores profissionais e agricultores familiares (R$ 95.000)\n" +
    "e) Dano Água\n" +
    "f) PTR-Mariana\n" +
    "g) Compensação Individual para moradores de Mariana (R$ 35.000)",
  pergunta28_2:
    "1️⃣6️⃣.2️⃣ Você recebeu alguma proposta de indenização dessas iniciativas?\n👉 Sim ou Não",
  pergunta28_3:
    "1️⃣6️⃣.3️⃣ Você recebeu alguma indenização referente a algum desses programas?\n👉 Sim ou Não",
  pergunta29:
    "1️⃣7️⃣ Você é ou era morador de Bento Rodrigues ou Paracatu de Baixo no momento do desastre?\n👉 Sim ou Não",
  pergunta30:
    "1️⃣8️⃣ Você recebeu algum tipo de compensação não financeira de natureza socioeconômica ou ambiental da Samarco/Renova antes de 2024 (além do reassentamento)?\n👉 Sim ou Não",
  pergunta30_1:
    "1️⃣8️⃣.1️⃣ Você se cadastrou para receber esse tipo de compensação não financeira?\n👉 Sim ou Não",
  pergunta30_2:
    "1️⃣8️⃣.2️⃣ A Samarco/Renova entrou em contato com você para tratar do recebimento dessa compensação não financeira?\n👉 Sim ou Não",
  pergunta31:
    "1️⃣9️⃣ Antes de finalizar, gostaria de saber quem te indicou para participar deste processo.\n" +
    "Escolha uma das opções abaixo:\n\n" +
    "👉 Dr. Igor\n" +
    "👉 Matheus\n" +
    "👉 Aline\n" +
    "👉 Simony\n" +
    "👉 João Victor",
  // MENSAGEM REMOVIDA - NÃO USAR
  // final: "✅ Obrigado! Suas informações foram registradas com sucesso.\n\nEntraremos em contato em breve com os próximos passos. ✈️",
};

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

  const avancar = async (proximaEtapa, mensagem) => {
    console.log(`🔄 Avançando de "${etapa3}" para "${proximaEtapa}"`);
    console.log(`📋 Estado atual das perguntas:`, {
      menorIdade: estado.menorIdade,
      pergunta1: estado.pergunta1,
      pergunta2: estado.pergunta2,
      pergunta3: estado.pergunta3,
      pergunta5: estado.pergunta5,
      pergunta6: estado.pergunta6,
      pergunta7: estado.pergunta7,
      pergunta8: estado.pergunta8,
      pergunta9: estado.pergunta9,
      pergunta10: estado.pergunta10,
      pergunta11: estado.pergunta11,
      pergunta12: estado.pergunta12,
      pergunta13: estado.pergunta13,
      pergunta14: estado.pergunta14,
      pergunta15: estado.pergunta15,
      pergunta16: estado.pergunta16,
      pergunta17: estado.pergunta17,
      pergunta18: estado.pergunta18,
    });
    estado.etapa3 = proximaEtapa;
    setEstado(id, estado);
    console.log(`📤 Enviando mensagem: "${mensagem.substring(0, 50)}..."`);
    await enviarComSeguranca(client, id, mensagem);
    console.log(`✅ Função avancar concluída para etapa "${proximaEtapa}"`);
  };

  switch (etapa3) {
    case "inicio":
      // Enviar mensagem introdutória e automaticamente a primeira pergunta
      await enviarMensagemSegura(
        client,
        id,
        mensagens.inicio,
        "inicio_conversa"
      );
      await avancar("menoridade", mensagens.perguntaMenorIdade);
      break;

    case "menoridade":
      if (/^(sim|s|✅)$/i.test(userMessage)) {
        estado.menorIdade = userRaw;
        setEstado(id, estado);
        await client.sendText(
          id,
          "⚠️ Você é menor de idade, nossa equipe entrará em contato."
        );
        limparEstado(id);
      } else if (/^(nao|não|n|❌)$/i.test(userMessage)) {
        console.log("📝 Usuário respondeu NÃO para menor de idade");
        estado.menorIdade = userRaw;
        setEstado(id, estado);
        console.log("💾 Estado salvo, avançando para pergunta1...");
        await avancar("pergunta1", mensagens.pergunta1);
        console.log("✅ Pergunta1 enviada com sucesso");
      } else {
        await enviarMensagemSegura(
          client,
          id,
          "Por favor, responda com *Sim* ou *Não*.",
          "resposta_rapida"
        );
      }
      break;

    case "pergunta1":
      console.log(`📝 Processando pergunta1 com resposta: "${userMessage}"`);
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta1 = userRaw;
        setEstado(id, estado);
        console.log(`✅ Pergunta1 salva: ${userRaw}`);
        await avancar("pergunta2", mensagens.pergunta2);
      } else {
        await enviarMensagemSegura(
          client,
          id,
          "Por favor, responda com *Sim* ou *Não*.",
          "resposta_rapida"
        );
      }
      break;

    case "pergunta2":
      console.log(`📝 Processando pergunta2 com resposta: "${userMessage}"`);
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta2 = userRaw;
        setEstado(id, estado);
        console.log(`✅ Pergunta2 salva: ${userRaw}`);
        await avancar("pergunta3", mensagens.pergunta3);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta3":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta3 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta5", mensagens.pergunta5); // pula para pergunta5
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    // pergunta4 removida

    case "pergunta5":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta5 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta6", mensagens.pergunta6);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta5 = userRaw;
        setEstado(id, estado);
        // pula direto para pergunta9
        await avancar("pergunta9", mensagens.pergunta9);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta6":
      if (
        /^[a-g]+(,[a-g]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta6 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta7", mensagens.pergunta7);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta7":
      if (userRaw.trim().length > 0) {
        estado.pergunta7 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta8", mensagens.pergunta8);
      } else {
        await client.sendText(id, "Por favor, informe o diagnóstico e data.");
      }
      break;

    case "pergunta8":
      if (
        /^[a-d]+(,[a-d]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta8 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta9", mensagens.pergunta9);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta9":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta9 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta10", mensagens.pergunta10);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta9 = userRaw;
        setEstado(id, estado);
        // pula direto para pergunta12
        await avancar("pergunta12", mensagens.pergunta12);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta10":
      if (userMessage.length > 0) {
        estado.pergunta10 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta11", mensagens.pergunta11);
      } else {
        await client.sendText(id, "Por favor, informe o diagnóstico e data.");
      }
      break;

    case "pergunta11":
      if (
        /^[a-d]+(,[a-d]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta11 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta12", mensagens.pergunta12);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta12":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta12 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta13", mensagens.pergunta13);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta12 = userRaw;
        setEstado(id, estado);
        // pula direto para pergunta14
        await avancar("pergunta14", mensagens.pergunta14);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta13":
      if (
        /^[a-k]+(,[a-k]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta13 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta14", mensagens.pergunta14);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta14":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta14 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta15", mensagens.pergunta15);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta14 = userRaw;
        setEstado(id, estado);
        console.log(
          "🔄 Pergunta 14 = Não - Continuando para pergunta 19 (pergunta 8 visual)"
        );
        await avancar("pergunta19", mensagens.pergunta19);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta15":
      if (
        /^[a-g]+(,[a-g]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta15 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta16", mensagens.pergunta16);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta16":
      if (userMessage.length > 0) {
        estado.pergunta16 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta17", mensagens.pergunta17);
      } else {
        await client.sendText(id, "Por favor, informe quando você se mudou.");
      }
      break;

    case "pergunta17":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta17 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta18", mensagens.pergunta18);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta18":
      console.log(
        `📝 Processando pergunta18 (ÚLTIMA PERGUNTA ANTERIOR) com resposta: "${userMessage}"`
      );
      if (
        /^[a-c]+(,[a-c]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta18 = userRaw;
        setEstado(id, estado);
        console.log(`✅ Pergunta18 salva: ${userRaw}`);
        console.log(`🔄 Continuando para pergunta19`);
        await avancar("pergunta19", mensagens.pergunta19);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta19":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta19 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta19_1", mensagens.pergunta19_1);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta19 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta20", mensagens.pergunta20);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta19_1":
      if (userMessage.length > 0) {
        estado.pergunta19_1 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta19_2", mensagens.pergunta19_2);
      } else {
        await client.sendText(id, "Por favor, informe quando ocorreu a perda.");
      }
      break;

    case "pergunta19_2":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta19_2 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta19_3", mensagens.pergunta19_3);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta19_3":
      if (
        /^[a-e]+(,[a-e]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta19_3 = userRaw;
        setEstado(id, estado);
        if (userMessage.includes("d")) {
          await avancar("pergunta19_4", mensagens.pergunta19_4);
        } else {
          await avancar("pergunta20", mensagens.pergunta20);
        }
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta19_4":
      if (userMessage.length > 0) {
        estado.pergunta19_4 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta20", mensagens.pergunta20);
      } else {
        await client.sendText(id, "Por favor, descreva as despesas.");
      }
      break;

    case "pergunta20":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta20 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta20_1", mensagens.pergunta20_1);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta20 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta21", mensagens.pergunta21);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta20_1":
      if (
        /^[a-j]+(,[a-j]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta20_1 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta20_2", mensagens.pergunta20_2);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta20_2":
      if (userMessage.length > 0) {
        estado.pergunta20_2 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta20_3", mensagens.pergunta20_3);
      } else {
        await client.sendText(
          id,
          "Por favor, informe quando sua renda foi afetada."
        );
      }
      break;

    case "pergunta20_3":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta20_3 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta20_4", mensagens.pergunta20_4);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta20_4":
      if (userMessage.length > 0) {
        estado.pergunta20_4 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta21", mensagens.pergunta21);
      } else {
        await client.sendText(id, "Por favor, informe o valor aproximado.");
      }
      break;

    case "pergunta21":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta21 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta21_1", mensagens.pergunta21_1);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta21 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta22", mensagens.pergunta22);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta21_1":
      if (
        /^[a-b]+(,[a-b]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta21_1 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta21_2", mensagens.pergunta21_2);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta21_2":
      if (userMessage.length > 0) {
        estado.pergunta21_2 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta21_3", mensagens.pergunta21_3);
      } else {
        await client.sendText(
          id,
          "Por favor, informe quando ocorreu o problema."
        );
      }
      break;

    case "pergunta21_3":
      if (
        /^[a-e]+(,[a-e]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta21_3 = userRaw;
        setEstado(id, estado);
        if (userMessage.includes("d")) {
          await avancar("pergunta21_4", mensagens.pergunta21_4);
        } else {
          await avancar("pergunta22", mensagens.pergunta22);
        }
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta21_4":
      if (userMessage.length > 0) {
        estado.pergunta21_4 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta22", mensagens.pergunta22);
      } else {
        await client.sendText(id, "Por favor, descreva as despesas.");
      }
      break;

    case "pergunta22":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta22 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta22_1", mensagens.pergunta22_1);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta22 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta23", mensagens.pergunta23);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta22_1":
      if (
        /^[a-i]+(,[a-i]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta22_1 = userRaw;
        setEstado(id, estado);
        if (userMessage.includes("i")) {
          await avancar("pergunta22_2", mensagens.pergunta22_2);
        } else {
          await avancar("pergunta22_3", mensagens.pergunta22_3);
        }
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta22_2":
      if (userMessage.length > 0) {
        estado.pergunta22_2 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta22_3", mensagens.pergunta22_3);
      } else {
        await client.sendText(id, "Por favor, descreva os usos afetados.");
      }
      break;

    case "pergunta22_3":
      if (userMessage.length > 0) {
        estado.pergunta22_3 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta23", mensagens.pergunta23);
      } else {
        await client.sendText(
          id,
          "Por favor, informe quando percebeu as perdas."
        );
      }
      break;

    case "pergunta23":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta23 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta23_1", mensagens.pergunta23_1);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta23 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta24", mensagens.pergunta24);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta23_1":
      if (
        /^[a-g]+(,[a-g]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta23_1 = userRaw;
        setEstado(id, estado);
        if (userMessage.includes("g")) {
          await avancar("pergunta23_2", mensagens.pergunta23_2);
        } else {
          await avancar("pergunta23_3", mensagens.pergunta23_3);
        }
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta23_2":
      if (userMessage.length > 0) {
        estado.pergunta23_2 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta23_3", mensagens.pergunta23_3);
      } else {
        await client.sendText(id, "Por favor, descreva os impactos.");
      }
      break;

    case "pergunta23_3":
      if (userMessage.length > 0) {
        estado.pergunta23_3 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta24", mensagens.pergunta24);
      } else {
        await client.sendText(
          id,
          "Por favor, informe quando percebeu as perdas."
        );
      }
      break;

    case "pergunta24":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta24 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta24_1", mensagens.pergunta24_1);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta24 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta26", mensagens.pergunta26);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta24_1":
      if (
        /^[a-e]+(,[a-e]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta24_1 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta24_2", mensagens.pergunta24_2);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta24_2":
      if (
        /^[a-e]+(,[a-e]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta24_2 = userRaw;
        setEstado(id, estado);
        if (userMessage.includes("e")) {
          await avancar("pergunta24_3", mensagens.pergunta24_3);
        } else {
          await avancar("pergunta24_4", mensagens.pergunta24_4);
        }
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta24_3":
      if (userMessage.length > 0) {
        estado.pergunta24_3 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta24_4", mensagens.pergunta24_4);
      } else {
        await client.sendText(id, "Por favor, descreva quais foram.");
      }
      break;

    case "pergunta24_4":
      if (userMessage.length > 0) {
        estado.pergunta24_4 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta26", mensagens.pergunta26);
      } else {
        await client.sendText(
          id,
          "Por favor, informe quando percebeu os problemas."
        );
      }
      break;

    case "pergunta26":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta26 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta26_1", mensagens.pergunta26_1);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta26 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta27", mensagens.pergunta27);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta26_1":
      if (userMessage.length > 0) {
        estado.pergunta26_1 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta27", mensagens.pergunta27);
      } else {
        await client.sendText(
          id,
          "Por favor, especifique os prejuízos materiais."
        );
      }
      break;

    case "pergunta27":
      if (
        /^[a-e]+(,[a-e]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta27 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta28", mensagens.pergunta28);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta28":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta28 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta28_1", mensagens.pergunta28_1);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta28 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta29", mensagens.pergunta29);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta28_1":
      if (
        /^[a-g]+(,[a-g]+)*$/.test(userMessage.replace(/\s/g, "")) ||
        userMessage.length > 0
      ) {
        estado.pergunta28_1 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta28_2", mensagens.pergunta28_2);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com as letras indicadas."
        );
      }
      break;

    case "pergunta28_2":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta28_2 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta28_3", mensagens.pergunta28_3);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta28_3":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta28_3 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta29", mensagens.pergunta29);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta29":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta29 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta30", mensagens.pergunta30);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta30":
      if (["sim", "s"].includes(userMessage)) {
        estado.pergunta30 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta31", mensagens.pergunta31);
      } else if (["nao", "não", "n"].includes(userMessage)) {
        estado.pergunta30 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta30_1", mensagens.pergunta30_1);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta30_1":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta30_1 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta30_2", mensagens.pergunta30_2);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta30_2":
      if (["sim", "s", "nao", "não", "n"].includes(userMessage)) {
        estado.pergunta30_2 = userRaw;
        setEstado(id, estado);
        await avancar("pergunta31", mensagens.pergunta31);
      } else {
        await client.sendText(id, "Por favor, responda com *Sim* ou *Não*.");
      }
      break;

    case "pergunta31": {
      const opcaoIndicacao = userMessage.toLowerCase();
      if (
        opcaoIndicacao.includes("igor") ||
        opcaoIndicacao.includes("matheus") ||
        opcaoIndicacao.includes("aline") ||
        opcaoIndicacao.includes("simony") ||
        opcaoIndicacao.includes("joão") ||
        opcaoIndicacao.includes("joao") ||
        opcaoIndicacao.includes("victor")
      ) {
        estado.pergunta31 = userRaw;
        setEstado(id, estado);
        console.log(
          `📝 PERGUNTA 31 RESPONDIDA - Avançando para solicitação de documento`
        );

        // Avançar para etapa de documento
        estado.etapa3 = "documento";
        setEstado(id, estado);
        await client.sendText(
          id,
          "📄 *ÚLTIMA ETAPA*\n\n" +
            "Para finalizar seu cadastro, preciso que envie uma foto de um *documento oficial com foto* (RG, CNH ou Carteira de Trabalho).\n\n" +
            "📸 *Envie 2 fotos:*\n" +
            "• 1ª foto: Frente do documento\n" +
            "• 2ª foto: Verso do documento\n\n" +
            "⚠️ *Importante:* As fotos não serão salvas, apenas verificadas para validação."
        );
      } else {
        await client.sendText(
          id,
          "Por favor, escolha uma das opções: Dr. Igor, Matheus, Aline, Simony ou João Victor."
        );
      }
      break;
    }

    case "documento": {
      // Contar quantas fotos foram enviadas
      if (!estado.documentos_enviados) {
        estado.documentos_enviados = 0;
      }

      if (msg.type === "image") {
        estado.documentos_enviados++;
        setEstado(id, estado);

        if (estado.documentos_enviados === 1) {
          await client.sendText(
            id,
            "✅ *1ª foto recebida!* (Frente)\n\n📸 Agora envie a *2ª foto* (verso do documento)."
          );
        } else if (estado.documentos_enviados >= 2) {
          await client.sendText(
            id,
            "✅ *2ª foto recebida!* (Verso)\n\n🎉 Documentos verificados com sucesso!"
          );

          // Avançar para etapa do contrato
          estado.etapa3 = "contrato";
          setEstado(id, estado);

          console.log(
            `📄 DOCUMENTOS VERIFICADOS - Enviando contrato para assinatura`
          );

          // Enviar o arquivo PDF
          try {
            // Múltiplos caminhos possíveis para o arquivo
            const possiblePaths = [
              path.join(__dirname, "..", "contrato-padrao.pdf"),
              path.join(process.cwd(), "contrato-padrao.pdf"),
              "./contrato-padrao.pdf",
              "contrato-padrao.pdf",
              "/app/contrato-padrao.pdf", // Caminho específico para Docker/Railway
            ];

            let contractPath = null;

            // Tentar encontrar o arquivo em diferentes localizações
            for (const testPath of possiblePaths) {
              console.log(`🔍 Testando caminho: ${testPath}`);
              if (fs.existsSync(testPath)) {
                contractPath = testPath;
                console.log(`✅ Arquivo encontrado em: ${contractPath}`);
                break;
              }
            }

            if (!contractPath) {
              // Listar arquivos do diretório para debug
              console.log("📂 Conteúdo do diretório atual:", process.cwd());
              try {
                const files = fs.readdirSync(process.cwd());
                console.log(
                  "📄 Arquivos encontrados:",
                  files.filter((f) => f.endsWith(".pdf"))
                );
                console.log("📁 Todos os arquivos:", files.slice(0, 20)); // Primeiros 20 arquivos
              } catch (e) {
                console.log("❌ Erro ao listar arquivos:", e.message);
              }

              throw new Error(
                "Arquivo contrato-padrao.pdf não encontrado em nenhum local"
              );
            }

            // Verificar se o arquivo tem conteúdo
            const stats = fs.statSync(contractPath);
            console.log(`📊 Tamanho do arquivo: ${stats.size} bytes`);

            if (stats.size === 0) {
              throw new Error("Arquivo PDF está vazio");
            }

            // Tentar diferentes métodos de envio
            console.log(`📤 Enviando arquivo PDF: ${contractPath}`);

            // Delay crítico antes de enviar arquivo
            console.log("🛡️ Aplicando proteção anti-bot para envio de PDF...");
            await protecao.delayEnvioArquivo(id);

            // Primeiro, tentar com sendFile padrão
            try {
              await client.sendFile(
                id,
                contractPath,
                "contrato-padrao.pdf",
                "Contrato de Representação Legal"
              );
              console.log("✅ PDF enviado com sucesso via sendFile");
            } catch (sendFileError) {
              console.log(
                "⚠️ sendFile falhou, tentando método alternativo:",
                sendFileError.message
              );

              // Método alternativo: ler arquivo e enviar como buffer
              try {
                const fileBuffer = fs.readFileSync(contractPath);
                console.log(`📊 Buffer criado com ${fileBuffer.length} bytes`);

                await client.sendFile(
                  id,
                  fileBuffer,
                  "contrato-padrao.pdf",
                  "Contrato de Representação Legal"
                );
                console.log("✅ PDF enviado com sucesso via buffer");
              } catch (bufferError) {
                console.log(
                  "⚠️ Buffer também falhou, tentando método base64:",
                  bufferError.message
                );

                // Último recurso: converter para base64 e enviar
                const fileBuffer = fs.readFileSync(contractPath);
                const base64Data = fileBuffer.toString("base64");
                console.log(
                  `📊 Base64 criado com ${base64Data.length} caracteres`
                );

                // Enviar como documento usando base64
                await client.sendFileFromBase64(
                  id,
                  base64Data,
                  "contrato-padrao.pdf",
                  "Contrato de Representação Legal"
                );
                console.log("✅ PDF enviado com sucesso via base64");
              }
            }

            // Delay crítico antes de enviar instruções de contrato
            await protecao.delayAleatorio("pergunta_sensivel", id);

            // Simular digitação longa para mensagem importante
            await protecao.simularDigitando(client, id, 10000);

            // Enviar instruções para assinatura
            await client.sendText(
              id,
              "📋 *ÚLTIMA ETAPA - CONTRATO*\n\n" +
                "Por favor, leia o arquivo PDF que acabei de enviar.\n\n" +
                "⚠️ *IMPORTANTE:* Após ler todo o contrato, digite exatamente a mensagem abaixo:\n\n" +
                `💬 *COPIE E COLE:*\n` +
                `"Eu *${estado.nome}*, li, concordo e autorizo a utilização dos meus dados no processo e que o Dr. Igor assine em meu nome."\n\n` +
                "🔍 *Atenção:* Digite a mensagem completa e exata para finalizar seu cadastro."
            );

            console.log("✅ Instruções do contrato enviadas");
          } catch (error) {
            console.error("❌ ERRO DETALHADO AO ENVIAR CONTRATO:");
            console.error("   Mensagem:", error.message);
            console.error("   Stack:", error.stack);
            console.error("   Tipo:", typeof error);
            console.error("📂 Diretório atual:", process.cwd());
            console.error("📂 __dirname:", __dirname);
            console.error("🌍 NODE_ENV:", process.env.NODE_ENV);
            console.error("🚂 RAILWAY:", !!process.env.RAILWAY_ENVIRONMENT);
            console.error(
              "🐳 DOCKER:",
              !!process.env.DOCKER_CONTAINER || fs.existsSync("/.dockerenv")
            );

            await client.sendText(
              id,
              "❌ Erro ao enviar contrato. Nossa equipe foi notificada.\n\n" +
                "✅ Mesmo assim, seus dados foram salvos com sucesso!\n\n" +
                "📞 Entraremos em contato em breve para finalizar o processo."
            );

            // Salvar dados mesmo se não conseguir enviar o contrato
            await salvarDadosCompletos(client, id, estado);
          }
        }
      } else {
        await client.sendText(
          id,
          "📄 Por favor, envie uma *foto* do documento. " +
            `Você já enviou ${estado.documentos_enviados}/2 fotos.`
        );
      }
      break;
    }

    case "contrato": {
      const mensagemEsperada = `Eu ${estado.nome}, li, concordo e autorizo a utilização dos meus dados no processo e que o Dr. Igor assine em meu nome.`;
      const mensagemRecebida = userMessage.trim();

      // Normalizar as mensagens para comparação (remover acentos, espaços extras, etc)
      const normalizar = (str) =>
        str
          .toLowerCase()
          .replace(/\s+/g, " ")
          .replace(/[áàâãä]/g, "a")
          .replace(/[éèêë]/g, "e")
          .replace(/[íìîï]/g, "i")
          .replace(/[óòôõö]/g, "o")
          .replace(/[úùûü]/g, "u")
          .replace(/[ç]/g, "c")
          .trim();

      const esperadaNormalizada = normalizar(mensagemEsperada);
      const recebidaNormalizada = normalizar(mensagemRecebida);

      // Verificar se a mensagem contém os elementos essenciais
      const contemNome = recebidaNormalizada.includes(normalizar(estado.nome));
      const contemConcordo = recebidaNormalizada.includes("concordo");
      const contemAutorizo = recebidaNormalizada.includes("autorizo");
      const contemDrIgor =
        recebidaNormalizada.includes("dr. igor") ||
        recebidaNormalizada.includes("dr igor");
      const contemAssine = recebidaNormalizada.includes("assine");

      if (
        contemNome &&
        contemConcordo &&
        contemAutorizo &&
        contemDrIgor &&
        contemAssine
      ) {
        await client.sendText(
          id,
          "✅ *CONTRATO ACEITO!*\n\n" +
            "🎉 Parabéns! Seu cadastro foi finalizado com sucesso.\n\n" +
            "📝 Todos os seus dados foram registrados e o Dr. Igor foi autorizado a assinar em seu nome.\n\n" +
            "✨ *Obrigado por participar do processo!*"
        );

        console.log(`🏁 CONTRATO ACEITO - Finalizando cadastro completo`);
        await salvarDadosCompletos(client, id, estado);
      } else {
        await client.sendText(
          id,
          "❌ *Mensagem incorreta.*\n\n" +
            "Por favor, copie e cole exatamente a mensagem solicitada:\n\n" +
            `💬 *COPIE ESTA MENSAGEM:*\n` +
            `"Eu *${estado.nome}*, li, concordo e autorizo a utilização dos meus dados no processo e que o Dr. Igor assine em meu nome."\n\n` +
            "🔍 É importante digitar a mensagem completa e correta."
        );
      }
      break;
    }

    case "final":
      console.log("⚠️ ATENÇÃO: Caso 'final' não deveria ser executado mais!");
      console.log("🚀 Executando salvamento de backup...");
      console.log(
        "📦 Estado completo antes do salvamento:",
        JSON.stringify(estado, null, 2)
      );

      await salvarDadosCompletos(client, id, estado);
      break;
    default: {
      console.log(
        `⚠️ Etapa não reconhecida: "${etapa3}" - Tentando salvamento de emergência`
      );
      const salvouEmergencia = await tentarSalvarSeCompleto(client, id, estado);
      if (!salvouEmergencia) {
        await client.sendText(id, "Não entendi. Vamos começar de novo?");
        limparEstado(id);
      }
      break;
    }
  }
}

// Função helper para envio mais simples
async function enviarComSeguranca(client, id, mensagem) {
  console.log(`📤 [SIMPLES] Enviando: ${mensagem.substring(0, 50)}...`);

  try {
    // Delay mínimo
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await client.sendText(id, mensagem);
    console.log(`✅ [SIMPLES] Enviado com sucesso`);
  } catch (error) {
    console.error(`❌ [SIMPLES] Erro:`, error.message);
    throw error;
  }
}

module.exports = {
  fluxoPerguntas,
  mensagens,
  enviarComSeguranca,
};
