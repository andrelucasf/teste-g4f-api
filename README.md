# API RESTful de Notícias

[![NestJS](https://img.shields.io/badge/NestJS-10.3.0-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

API RESTful completa para gerenciamento de notícias, desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL**. Implementa todas as melhores práticas de desenvolvimento, incluindo validação de dados, paginação, cache, processamento assíncrono e testes BDD.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Arquitetura e Estrutura](#-arquitetura-e-estrutura)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Execução Local](#-execução-local)
- [Execução com Docker](#-execução-com-docker)
- [Testes](#-testes)
- [Endpoints da API](#-endpoints-da-api)
- [GitFlow](#-gitflow)
- [Preparação para Escalar](#-preparação-para-escalar)

---

## 🚀 Funcionalidades

✅ **CRUD Completo** de notícias (Create, Read, Update, Delete)  
✅ **Validação de Payload** com mensagens personalizadas  
✅ **Códigos HTTP Semânticos** (201, 200, 204, 400, 404)  
✅ **Paginação e Filtros** - busca por título/descrição com metadados  
✅ **Cache em Memória** - otimização de performance nas listagens  
✅ **Processamento Assíncrono** - fila mock para notificações  
✅ **Migrations do TypeORM** - versionamento do schema do banco  
✅ **Testes BDD** - comportamento testado com metodologia Gherkin  
✅ **Docker e Docker Compose** - aplicação totalmente containerizada  
✅ **GitFlow** - estrutura de branches profissional  

---

## 🏗 Arquitetura e Estrutura

### Arquitetura em Camadas

O projeto segue os princípios de **Clean Architecture** e **SOLID**, dividido em camadas bem definidas:

```
src/
├── main.ts                      # Ponto de entrada da aplicação
├── app.module.ts                # Módulo raiz
├── database/                    # Camada de Dados
│   ├── database.module.ts       # Configuração do TypeORM
│   ├── data-source.ts           # DataSource para migrations
│   └── migrations/              # Migrations versionadas
├── noticias/                    # Módulo de Notícias
│   ├── entities/                # Entidades do banco (modelos)
│   │   └── noticia.entity.ts
│   ├── dto/                     # Data Transfer Objects (validação)
│   │   ├── create-noticia.dto.ts
│   │   ├── update-noticia.dto.ts
│   │   └── list-noticias.dto.ts
│   ├── interfaces/              # Contratos e tipos
│   │   └── paginated-response.interface.ts
│   ├── noticias.controller.ts   # Camada de Apresentação (rotas)
│   ├── noticias.service.ts      # Camada de Negócio (lógica)
│   └── noticias.module.ts       # Configuração do módulo
└── queue/                       # Processamento Assíncrono
    ├── queue.service.ts         # Serviço de fila mock
    ├── queue.module.ts
    └── interfaces/
        └── queue-job.interface.ts
```

### Justificativa da Estrutura

#### 1. **Separação de Responsabilidades**
- **Controllers**: Apenas recebem requisições e delegam para services
- **Services**: Contêm toda a lógica de negócio
- **Entities**: Definem o modelo de dados do banco
- **DTOs**: Validam e transformam dados de entrada/saída
- **Interfaces**: Contratos que garantem consistência

#### 2. **Modularização**
Cada funcionalidade é um módulo independente que pode ser:
- Testado isoladamente
- Reutilizado em outros projetos
- Desenvolvido por equipes diferentes
- Escalado horizontalmente

#### 3. **Injeção de Dependências**
NestJS usa o padrão de IoC (Inversion of Control), facilitando:
- Testes unitários com mocks
- Substituição de implementações
- Baixo acoplamento entre módulos

---

## 🛠 Tecnologias Utilizadas

### Backend
- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem
- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript e JavaScript

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional

### Validação e Transformação
- **class-validator** - Validação declarativa com decorators
- **class-transformer** - Transformação de objetos

### Cache e Fila
- **cache-manager** - Sistema de cache em memória
- **Fila Mock In-Memory** - Simulação de processamento assíncrono

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes HTTP de integração
- **Metodologia BDD** - Behavior Driven Development

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

---

## 📦 Pré-requisitos

### Para Execução Local
- Node.js >= 18.x
- PostgreSQL >= 13.x
- npm ou yarn

### Para Execução com Docker
- Docker >= 20.x
- Docker Compose >= 2.x

---

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/teste-g4f-api.git
cd teste-g4f-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=noticias_db

# Cache
CACHE_TTL=300
```

---

## 🖥 Execução Local

### 1. Inicie o PostgreSQL

Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```bash
createdb noticias_db
```

### 2. Execute as migrations

```bash
npm run build
npm run migration:run
```

### 3. Inicie a aplicação

#### Modo Desenvolvimento (com hot-reload)
```bash
npm run start:dev
```

#### Modo Produção
```bash
npm run build
npm run start:prod
```

A API estará disponível em: **http://localhost:3000**

---

## 🐳 Execução com Docker

### Ambiente de Produção

```bash
# Build e start dos containers
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar os containers
docker-compose down
```

### Ambiente de Desenvolvimento (com hot-reload)

```bash
# Build e start em modo dev
docker-compose -f docker-compose.dev.yml up -d

# Verificar logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar os containers
docker-compose -f docker-compose.dev.yml down
```

### Comandos Úteis do Docker

```bash
# Reconstruir imagens
docker-compose build --no-cache

# Remover volumes (apaga os dados do banco)
docker-compose down -v

# Acessar o container da API
docker exec -it noticias-api sh

# Acessar o PostgreSQL
docker exec -it noticias-db psql -U postgres -d noticias_db
```

A API estará disponível em: **http://localhost:3000**

---

## 🧪 Testes

### Executar todos os testes

```bash
npm test
```

### Testes E2E (BDD)

```bash
npm run test:e2e
```

### Cobertura de testes

```bash
npm run test:cov
```

### Estrutura dos Testes BDD

Os testes seguem a metodologia **Behavior Driven Development** com a estrutura Gherkin:

```gherkin
Funcionalidade: Criar uma nova notícia
  Cenário: Criar notícia com dados válidos
    Dado que eu tenho dados válidos de uma notícia
    Quando eu envio uma requisição POST
    Então a notícia deve ser criada com sucesso
```

**Testes Implementados:**

✅ Criar notícia com dados válidos (201 Created)  
✅ Validar título muito curto (400 Bad Request)  
✅ Validar descrição muito curta (400 Bad Request)  
✅ Validar campos obrigatórios (400 Bad Request)  
✅ Rejeitar campos extras não permitidos (400 Bad Request)  
✅ Listar notícias com paginação e metadados  
✅ Filtrar notícias por título  
✅ Filtrar notícias por descrição  
✅ Atualizar notícia existente  
✅ Deletar notícia (204 No Content)  
✅ Buscar notícia inexistente (404 Not Found)  

---

## 📡 Endpoints da API

Base URL: `http://localhost:3000/api`

### **POST** `/noticias` - Criar Notícia

**Request Body:**
```json
{
  "titulo": "Nova Tecnologia Revoluciona o Mercado",
  "descricao": "Uma nova tecnologia promete transformar completamente a forma como trabalhamos."
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Nova Tecnologia Revoluciona o Mercado",
  "descricao": "Uma nova tecnologia promete transformar completamente a forma como trabalhamos.",
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

### **GET** `/noticias` - Listar Notícias

**Query Parameters:**
- `page` (opcional, default: 1) - Número da página
- `limit` (opcional, default: 10) - Itens por página
- `titulo` (opcional) - Filtro por título
- `descricao` (opcional) - Filtro por descrição

**Exemplo:** `GET /api/noticias?page=1&limit=10&titulo=tecnologia`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "titulo": "Nova Tecnologia",
      "descricao": "Descrição...",
      "createdAt": "2025-12-18T10:30:00.000Z",
      "updatedAt": "2025-12-18T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### **GET** `/noticias/:id` - Buscar Notícia por ID

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Nova Tecnologia",
  "descricao": "Descrição completa...",
  "createdAt": "2025-12-18T10:30:00.000Z",
  "updatedAt": "2025-12-18T10:30:00.000Z"
}
```

**Erro:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Notícia com ID xyz não encontrada"
}
```

### **PATCH** `/noticias/:id` - Atualizar Notícia

**Request Body:**
```json
{
  "titulo": "Título Atualizado",
  "descricao": "Descrição atualizada"
}
```

**Response:** `200 OK`

### **DELETE** `/noticias/:id` - Deletar Notícia

**Response:** `204 No Content`

---

## 🌿 GitFlow

Este projeto segue a metodologia **GitFlow** para organização de branches:

### Estrutura de Branches

```
main (produção)
  └── develop (desenvolvimento)
      ├── feature/crud-noticias
      ├── feature/paginacao-filtros
      ├── feature/cache-implementacao
      ├── feature/queue-mock
      ├── feature/testes-bdd
      └── feature/docker-setup
```

### Workflow

1. **main** - Branch de produção (código estável)
2. **develop** - Branch de desenvolvimento (integração)
3. **feature/** - Branches para novas funcionalidades
4. **hotfix/** - Correções urgentes em produção
5. **release/** - Preparação para release

### Comandos Git

```bash
# Inicializar repositório
git init
git add .
git commit -m "feat: initial commit"

# Criar branch develop
git checkout -b develop

# Criar feature branch
git checkout -b feature/nome-da-feature develop

# Merge de feature em develop
git checkout develop
git merge --no-ff feature/nome-da-feature

# Release para produção
git checkout -b release/1.0.0 develop
# ... testes e ajustes ...
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"
```

---

## 📈 Preparação para Escalar

### 1. **Arquitetura Modular**
- Cada módulo é independente e pode ser extraído para um microserviço
- Comunicação via interfaces facilita a separação

### 2. **Cache Strategy**
- Implementação atual usa memória (adequado para single instance)
- Migração para **Redis** é direta via cache-manager
- Suporta cache distribuído entre múltiplas instâncias

### 3. **Processamento Assíncrono**
- Fila mock pode ser substituída por **Bull/BullMQ + Redis**
- Suporta workers distribuídos
- Facilita background jobs pesados

### 4. **Banco de Dados**
- TypeORM facilita migração entre bancos
- Suporta **read replicas** para leitura
- Connection pooling configurável

### 5. **Containerização**
- Docker permite deploy em Kubernetes
- Horizontal scaling via replicas
- Load balancing nativo

### 6. **Melhorias Futuras**

#### Curto Prazo
- [ ] Implementar autenticação JWT
- [ ] Adicionar rate limiting
- [ ] Documentação Swagger/OpenAPI
- [ ] Logs estruturados (Winston/Pino)
- [ ] Health checks e metrics (Prometheus)

#### Médio Prazo
- [ ] Migrar cache para Redis
- [ ] Implementar fila com Bull + Redis
- [ ] CI/CD com GitHub Actions
- [ ] Testes de carga (Artillery/K6)
- [ ] Monitoramento (Grafana)

#### Longo Prazo
- [ ] Separar em microserviços
- [ ] Event-driven architecture (RabbitMQ/Kafka)
- [ ] GraphQL gateway
- [ ] Deploy em Kubernetes
- [ ] Service mesh (Istio)

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento
npm run start:debug        # Inicia com debugger

# Build
npm run build              # Compila TypeScript

# Produção
npm run start:prod         # Inicia versão compilada

# Testes
npm test                   # Testes unitários
npm run test:e2e           # Testes end-to-end
npm run test:cov           # Cobertura de testes

# Code Quality
npm run lint               # Executa ESLint
npm run format             # Formata código com Prettier

# Migrations
npm run migration:generate # Gera migration
npm run migration:run      # Executa migrations
npm run migration:revert   # Reverte última migration
```

---

## 👨‍💻 Autor

**Andre Lucas**

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 🙏 Agradecimentos

Obrigado pela oportunidade de demonstrar minhas habilidades técnicas através deste teste!

---

**Desenvolvido com ❤️ usando NestJS e TypeScript**
