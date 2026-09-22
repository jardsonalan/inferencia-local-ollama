# Inferência local com Ollama

Aplicação para classificação de chamados usando um modelo de linguagem executado localmente pelo [Ollama](https://ollama.com/). O projeto possui uma API em NestJS, um cliente web em Angular e uma rotina automatizada para avaliar a classificação em diferentes cenários.

## Visão geral

- **Backend:** NestJS e TypeScript.
- **Frontend:** Angular.
- **Inferência:** Ollama, com modelo configurável por variável de ambiente.
- **Orquestração:** Docker Compose.
- **Categorias:** `ACESSO`, `FINANCEIRO`, `MATRICULA`, `DOCUMENTOS` e `OUTROS`.

O backend envia o texto do chamado ao Ollama por meio de um prompt que restringe as categorias possíveis, exige resposta em letras maiúsculas e orienta o modelo a não seguir instruções contidas no próprio chamado.

## Pré-requisitos

- Node.js e npm;
- Docker e Docker Compose, para executar o Ollama e os serviços em contêineres;
- um modelo disponível no Ollama, por exemplo `llama3.2:latest`.

## Configuração

Instale as dependências do backend:

```bash
npm install
```

Para instalar as dependências do frontend:

```bash
cd frontend
npm install
cd ..
```

As principais variáveis de ambiente do backend são:

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta da API |
| `OLLAMA_BASE_URL` | depende do ambiente | URL do serviço Ollama |
| `OLLAMA_MODEL` | `llama3.2:latest` no Docker Compose | Modelo usado na inferência |
| `OLLAMA_TIMEOUT_MS` | `30000` | Tempo limite das requisições ao Ollama |

## Execução com Docker Compose

Suba os serviços:

```bash
docker compose up --build
```

Os serviços ficam disponíveis em:

- Frontend: `http://localhost:4200`
- API: `http://localhost:3000`
- Ollama: `http://localhost:11434`

Em outro terminal, baixe o modelo configurado:

```bash
docker exec -it ollama ollama pull llama3.2:latest
```

Para encerrar os serviços:

```bash
docker compose down
```

## Execução local

Inicie o backend em modo de desenvolvimento:

```bash
npm run start:dev
```

Inicie o frontend em outro terminal:

```bash
cd frontend
npm start
```

Quando o backend for executado fora do Docker, configure `OLLAMA_BASE_URL` para `http://localhost:11434`.

## API

### Classificar chamado

`POST /chamados/classificar`

Corpo da requisição:

```json
{
  "texto": "Minha senha expirou e não consigo entrar."
}
```

A resposta contém a categoria atribuída pelo modelo.

## Avaliação

A rotina de avaliação executa os casos definidos em `src/chamados/avaliacao/casos-avaliacao.ts`, compara a categoria obtida com a esperada e grava o relatório em `resultado-avaliacao.json`.

```bash
npm run avaliar:chamados
```

O relatório apresenta a acurácia, a conformidade do formato, a duração de cada chamada e o resultado individual dos casos. A bateria atualmente cobre casos normais, de fronteira, de ausência de informação e adversariais.

## Testes e qualidade

```bash
# Testes unitários
npm test

# Testes unitários com cobertura
npm run test:cov

# Testes ponta a ponta
npm run test:e2e

# Lint
npm run lint

# Build do backend
npm run build
```

## Conclusão técnica

A atividade documentou a execução e a avaliação de um sistema de categorização (utilizando Ollama) submetido a quatro cenários de teste: um caso normal (categoria esperada: MATRICULA), uma negação (categoria esperada: ACESSO), um texto com pouca informação (categoria esperada: OUTROS) e uma instrução maliciosa dentro do chamado (categoria esperada: OUTROS). Após a primeira rodada de testes unitários em contêiner e o registro da acurácia, o autor identificou uma falha e propôs um ajuste no sistema.

A intervenção realizada consistiu em uma alteração direta no início do prompt, com a justificativa de tornar o real motivo da solicitação mais explícito para o modelo de inteligência artificial. Contudo, a reexecução completa da bateria de testes evidenciou uma total ausência de efeito prático dessa modificação. Os resultados obtidos pelo avaliador persistiram exatamente iguais aos fornecidos na execução anterior, não ocorrendo nenhuma mudança comportamental por parte do sistema em nenhum dos cenários.

Conclui-se, portanto, que a alteração redacional introduzida no prompt foi insuficiente para corrigir a falha observada ou alterar as inferências do modelo. A persistência dos resultados indica que o modelo necessita de estratégias de engenharia de prompt mais complexas (como *few-shot prompting* ou regras de formatação mais rígidas) para superar falhas em cenários atípicos e de injeção maliciosa.
