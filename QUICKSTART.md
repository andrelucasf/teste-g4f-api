# 🚀 Guia Rápido de Início

Este guia mostra como executar a aplicação rapidamente, tanto localmente quanto com Docker.

---

## 📋 Pré-requisitos

### Opção 1: Execução Local

- Node.js 18+ instalado
- PostgreSQL 13+ rodando
- npm ou yarn

### Opção 2: Execução com Docker (Recomendado)

- Docker e Docker Compose instalados
- Nenhuma outra dependência necessária!

---

## 🐳 Opção 1: Executar com Docker (Mais Fácil)

### 1. Inicie a aplicação

```bash
# Build e start dos containers
docker-compose up -d

# Acompanhe os logs
docker-compose logs -f api
```

### 2. Acesse a API

A API estará disponível em: **http://localhost:3000**

### 3. Teste os endpoints

```bash
# Criar uma notícia
curl -X POST http://localhost:3000/api/noticias \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Primeira Notícia",
    "descricao": "Esta é a descrição da primeira notícia criada via API"
  }'

# Listar notícias
curl http://localhost:3000/api/noticias

# Listar com paginação
curl "http://localhost:3000/api/noticias?page=1&limit=5"

# Filtrar por título
curl "http://localhost:3000/api/noticias?titulo=Primeira"
```

### 4. Parar a aplicação

```bash
docker-compose down
```

---

## 💻 Opção 2: Executar Localmente

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env se necessário
nano .env
```

### 3. Inicie o PostgreSQL

Certifique-se de que o PostgreSQL está rodando e crie o banco:

```bash
# Via psql
createdb noticias_db

# Ou via Docker apenas para o banco
docker run --name postgres-noticias \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=noticias_db \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 4. Execute as migrations

```bash
npm run build
npm run migration:run
```

### 5. Inicie a aplicação

```bash
# Modo desenvolvimento (com hot-reload)
npm run start:dev

# Ou modo produção
npm run build
npm run start:prod
```

A API estará disponível em: **http://localhost:3000**

---

## 🧪 Executar Testes

```bash
# Testes E2E (BDD)
npm run test:e2e

# Todos os testes
npm test

# Testes com cobertura
npm run test:cov
```

---

## 📡 Endpoints Disponíveis

### Base URL: `http://localhost:3000/api`

| Método | Endpoint        | Descrição                                 |
| ------ | --------------- | ----------------------------------------- |
| POST   | `/noticias`     | Criar notícia                             |
| GET    | `/noticias`     | Listar notícias (com paginação e filtros) |
| GET    | `/noticias/:id` | Buscar notícia por ID                     |
| PATCH  | `/noticias/:id` | Atualizar notícia                         |
| DELETE | `/noticias/:id` | Deletar notícia                           |

---

## 🎯 Exemplos de Uso

### Criar Notícia

```bash
curl -X POST http://localhost:3000/api/noticias \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nova Tecnologia em 2025",
    "descricao": "Uma descrição detalhada da notícia sobre tecnologia"
  }'
```

### Listar com Filtros

```bash
# Filtrar por título
curl "http://localhost:3000/api/noticias?titulo=Tecnologia"

# Filtrar por descrição
curl "http://localhost:3000/api/noticias?descricao=2025"

# Paginação
curl "http://localhost:3000/api/noticias?page=1&limit=10"

# Combinar filtros
curl "http://localhost:3000/api/noticias?titulo=Tech&page=1&limit=5"
```

### Atualizar Notícia

```bash
curl -X PATCH http://localhost:3000/api/noticias/SEU_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Título Atualizado"
  }'
```

### Deletar Notícia

```bash
curl -X DELETE http://localhost:3000/api/noticias/SEU_ID_AQUI
```

---

## 🔍 Verificar Funcionamento

### Cache em Ação

Execute a mesma busca duas vezes e observe os logs:

```bash
# Primeira vez (busca no banco)
curl http://localhost:3000/api/noticias

# Segunda vez (retorna do cache)
curl http://localhost:3000/api/noticias
```

Nos logs você verá:

- 1ª chamada: `💾 Dados salvos no cache`
- 2ª chamada: `📦 Retornando dados do cache`

### Fila Assíncrona em Ação

Ao criar uma notícia, observe os logs:

```bash
docker-compose logs -f api
```

Você verá:

1. `📬 Job adicionado à fila`
2. `⚙️  Processando job...`
3. `📨 Notificação enviada`
4. `✅ Job completado com sucesso`

---

## 🛠 Comandos Úteis do Docker

```bash
# Ver logs da API
docker-compose logs -f api

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Acessar shell da API
docker exec -it noticias-api sh

# Acessar PostgreSQL
docker exec -it noticias-db psql -U postgres -d noticias_db

# Rebuild completo
docker-compose build --no-cache

# Remover volumes (apaga dados)
docker-compose down -v
```

---

## 📊 Estrutura de Resposta

### Sucesso na Criação (201)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Nova Notícia",
  "descricao": "Descrição completa...",
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

### Listagem com Metadados (200)

```json
{
  "data": [{ "id": "...", "titulo": "...", "descricao": "..." }],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Erro de Validação (400)

```json
{
  "statusCode": 400,
  "message": ["O título deve ter no mínimo 5 caracteres", "A descrição é obrigatória"],
  "error": "Bad Request"
}
```

### Não Encontrado (404)

```json
{
  "statusCode": 404,
  "message": "Notícia com ID xyz não encontrada",
  "error": "Not Found"
}
```

---

## 🐛 Troubleshooting

### Porta 5432 já em uso

Se você já tem PostgreSQL rodando localmente:

```bash
# Opção 1: Pare o PostgreSQL local
sudo service postgresql stop

# Opção 2: Mude a porta no docker-compose.yml
# De: "5432:5432"
# Para: "5433:5432"
# E atualize DB_PORT no .env para 5433
```

### Porta 3000 já em uso

Mude a porta no docker-compose.yml:

```yaml
ports:
  - '3001:3000' # Mude de 3000:3000 para 3001:3000
```

### Migrations não rodam

```bash
# Acesse o container
docker exec -it noticias-api sh

# Execute manualmente
npm run migration:run
```

---

## 📚 Próximos Passos

1. ✅ Leia o [README.md](README.md) completo para entender a arquitetura
2. ✅ Explore o [ARCHITECTURE.md](ARCHITECTURE.md) para justificativa da estrutura
3. ✅ Execute os testes BDD: `npm run test:e2e`
4. ✅ Experimente os diferentes filtros e paginação
5. ✅ Observe o cache e a fila em ação nos logs

---

**Dúvidas?** Consulte o README.md ou abra uma issue no repositório.

**Desenvolvido com ❤️ usando NestJS + TypeScript + PostgreSQL + Docker**
