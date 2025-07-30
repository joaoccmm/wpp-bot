# Implementação: Solicitação de Documentos e Contrato

## Funcionalidade Implementada

Após a última seção do questionário (Indenizações), o sistema agora solicita:

1. Fotos de documento oficial
2. Envio e confirmação de contrato de autorização

### Fluxo Completo

1. **Finalização da seção de indenizações** → Inicia solicitação de documentos
2. **Documento Frente**:
   - Solicita foto da frente do documento oficial (RG, CNH ou Passaporte)
   - Informa que se for documento de frente única, deve enviar a mesma imagem
   - Valida se é uma imagem/foto
3. **Documento Verso**:
   - Solicita foto do verso do documento
   - Reforça que se for frente única, deve enviar a mesma foto
   - Valida se é uma imagem/foto
4. **Envio do Contrato**:
   - Envia o arquivo `contrato-padrao.pdf`
   - Solicita que o usuário leia o contrato
5. **Confirmação do Contrato**:
   - Envia texto específico para copiar e colar
   - Valida se o texto foi copiado corretamente
6. **Finalização**: Após todas as etapas, finaliza o cadastro

### Novas Etapas Criadas

#### Mensagens

- `documentoFrente`: Instrução para envio da frente
- `documentoVerso`: Instrução para envio do verso
- `contratoEnvio`: Aviso sobre envio do contrato
- `contratoConfirmacao`: Instrução para confirmação
- `contratoTexto`: Texto específico para copiar e colar

#### Cases no Switch

- `documento_frente`: Processa foto da frente
- `documento_verso`: Processa foto do verso
- `contrato_envio`: Envia arquivo PDF e avança
- `contrato_confirmacao`: Envia texto para confirmar
- `contrato_aceite`: Valida texto copiado pelo usuário

### Validações Implementadas

#### Documentos

```javascript
// Verificação se é imagem
if (!msg.isMedia || msg.type !== "image") {
  // Mensagem de erro pedindo especificamente uma foto
}
```

#### Contrato

```javascript
// Verificação de elementos essenciais no texto
const contemNome =
  textoUsuario.toLowerCase().includes("eu ") && textoUsuario.includes(",");
const contemConcordo = textoUsuario
  .toLowerCase()
  .includes("li, concordo e autorizo");
const contemDados = textoUsuario
  .toLowerCase()
  .includes("utilização dos meus dados");
const contemIgor = textoUsuario.toLowerCase().includes("dr. igor");
```

### Texto de Autorização

**Formato esperado:**

```
"Eu [NOME COMPLETO], li, concordo e autorizo a utilização dos meus dados no processo e que o Dr. Igor assine em meu nome."
```

**Mensagem enviada:**

```
💬 COPIE E COLE:

"Eu [SEU NOME COMPLETO], li, concordo e autorizo a utilização dos meus dados no processo e que o Dr. Igor assine em meu nome."
```

### Dados Salvos

Novos campos adicionados ao Google Sheets:

- `documento_frente_enviado`: boolean
- `documento_verso_enviado`: boolean
- `contrato_aceito`: boolean
- `texto_autorizacao`: string (texto completo digitado pelo usuário)

### Tratamento de Erros

- **Arquivo PDF não encontrado**: Continua o fluxo sem o arquivo
- **Documento inválido**: Solicita nova foto
- **Texto incorreto**: Reenvia o texto para copiar novamente

## Arquivos Modificados

### 1. `flows/fluxoPerguntas.js`

- Adicionadas mensagens de contrato
- Modificado `documento_verso` para ir para contrato
- Criados cases `contrato_envio`, `contrato_confirmacao` e `contrato_aceite`
- Adicionados campos de contrato no salvamento

### 2. `google/sheets.js`

- Adicionados cabeçalhos `contrato_aceito` e `texto_autorizacao`
- Total de campos agora: 89 (anteriormente 87)

### 3. `contrato-padrao.pdf`

- Arquivo deve existir na raiz do projeto
- Enviado automaticamente via WhatsApp

## Fluxo Final

```
Questionário → Indenizações → Documento Frente → Documento Verso → Contrato PDF → Confirmação Texto → Finalização
```

## Experiência do Usuário

- Instruções claras sobre documentos aceitos
- Envio automático do contrato em PDF
- Texto pré-formatado para facilitar cópia
- Validação rigorosa do texto de autorização
- Mensagens de erro específicas para cada tipo de problema
