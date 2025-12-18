# Justificativa da Estrutura do Projeto

## 📐 Arquitetura Escolhida

Este projeto foi estruturado seguindo os princípios da **Clean Architecture** e **Domain-Driven Design (DDD)**, adaptados para o contexto de uma aplicação NestJS de médio/grande porte.

---

## 🎯 Princípios Aplicados

### 1. **Separation of Concerns (SoC)**

Cada camada tem uma responsabilidade única e bem definida:

```
Camada de Apresentação (Controllers)
    ↓ comunica via DTOs
Camada de Aplicação (Services)
    ↓ usa
Camada de Domínio (Entities)
    ↓ persiste via
Camada de Infraestrutura (TypeORM/Database)
```

**Benefícios:**
- Facilita manutenção
- Permite testes isolados
- Mudanças em uma camada não afetam outras

### 2. **Dependency Injection (DI)**

Todo o projeto usa injeção de dependências do NestJS:

```typescript
constructor(
  @InjectRepository(Noticia) private repo: Repository<Noticia>,
  @Inject(CACHE_MANAGER) private cache: Cache,
  private queueService: QueueService,
) {}
```

**Benefícios:**
- Facilita testes com mocks
- Baixo acoplamento
- Inversão de controle

### 3. **Single Responsibility Principle (SRP)**

Cada arquivo/classe tem uma única razão para mudar:

- **Controllers**: Apenas roteamento HTTP
- **Services**: Apenas lógica de negócio
- **Entities**: Apenas estrutura de dados
- **DTOs**: Apenas validação/transformação

---

## 🗂 Estrutura de Pastas Detalhada

```
src/
│
├── main.ts                          # Bootstrap da aplicação
│   └── Configura pipes, CORS, prefixo global
│
├── app.module.ts                    # Módulo raiz
│   └── Orquestra todos os módulos
│
├── database/                        # 📦 Módulo de Infraestrutura
│   ├── database.module.ts           # Configuração TypeORM
│   ├── data-source.ts               # DataSource para migrations CLI
│   └── migrations/                  # Migrations versionadas
│       └── 1234567890123-CreateNoticias.ts
│
├── noticias/                        # 📦 Módulo de Domínio
│   │
│   ├── entities/                    # 🎯 Camada de Domínio
│   │   └── noticia.entity.ts        # Modelo de dados (ORM)
│   │
│   ├── dto/                         # 🎯 Camada de Transporte
│   │   ├── create-noticia.dto.ts    # Payload de criação
│   │   ├── update-noticia.dto.ts    # Payload de atualização
│   │   └── list-noticias.dto.ts     # Query params de listagem
│   │
│   ├── interfaces/                  # 🎯 Contratos
│   │   └── paginated-response.interface.ts
│   │
│   ├── noticias.controller.ts       # 🎯 Camada de Apresentação
│   │   └── Define rotas HTTP e delegação
│   │
│   ├── noticias.service.ts          # 🎯 Camada de Aplicação
│   │   └── Lógica de negócio, cache, fila
│   │
│   └── noticias.module.ts           # Configuração do módulo
│
└── queue/                           # 📦 Módulo de Processamento
    ├── interfaces/
    │   └── queue-job.interface.ts
    ├── queue.service.ts             # Serviço de fila mock
    └── queue.module.ts
```

---

## 🔍 Justificativa por Camada

### **Controllers** (noticias.controller.ts)

**Responsabilidade:** Receber requisições HTTP e retornar respostas

```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
async create(@Body() dto: CreateNoticiaDto) {
  return this.service.create(dto);
}
```

**Por quê?**
- ✅ Separa HTTP do negócio
- ✅ Facilita troca de protocolo (REST → GraphQL)
- ✅ Mantém código limpo e focado

### **Services** (noticias.service.ts)

**Responsabilidade:** Implementar lógica de negócio

```typescript
async create(dto: CreateNoticiaDto): Promise<Noticia> {
  const noticia = this.repo.create(dto);
  const saved = await this.repo.save(noticia);
  
  await this.invalidateCache();
  await this.queueService.addNotification({...});
  
  return saved;
}
```

**Por quê?**
- ✅ Reutilizável em diferentes contextos
- ✅ Testável independentemente do HTTP
- ✅ Concentra regras de negócio

### **Entities** (noticia.entity.ts)

**Responsabilidade:** Definir modelo de dados

```typescript
@Entity('noticias')
export class Noticia {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  titulo: string;
}
```

**Por quê?**
- ✅ Single source of truth do schema
- ✅ TypeORM gera migrations automaticamente
- ✅ Validação em nível de banco

### **DTOs** (create-noticia.dto.ts)

**Responsabilidade:** Validar e transformar dados

```typescript
export class CreateNoticiaDto {
  @IsNotEmpty()
  @MinLength(5)
  titulo: string;
}
```

**Por quê?**
- ✅ Validação declarativa
- ✅ Auto-documentação
- ✅ Segurança (whitelist de campos)

### **Interfaces** (paginated-response.interface.ts)

**Responsabilidade:** Definir contratos

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  meta: {...};
}
```

**Por quê?**
- ✅ Type safety
- ✅ Contrato explícito
- ✅ Facilita refatoração

---

## 🚀 Preparação para Escalar

### 1. **Migração para Microserviços**

Estrutura atual permite extração direta:

```
Monolito (Atual)          →    Microserviços (Futuro)
├── NoticiasModule               ├── Notícias Service
├── UsuariosModule        →      ├── Usuários Service
└── ComentariosModule            └── Comentários Service
```

**Como?**
- Cada módulo já é independente
- Comunicação via interfaces facilita gRPC/HTTP
- Cache e fila já são externos (preparados para Redis)

### 2. **Escalabilidade Horizontal**

```
Load Balancer
    ├── API Instance 1 ─┐
    ├── API Instance 2 ─┼─→ Redis (cache compartilhado)
    └── API Instance 3 ─┘
            ↓
    PostgreSQL (master + replicas)
```

**Estrutura suporta:**
- ✅ Stateless design (cache externo)
- ✅ Connection pooling
- ✅ Read replicas (TypeORM)

### 3. **Separação de Responsabilidades**

```
API Gateway (NestJS)
    ├── Auth Service
    ├── Noticias Service
    └── Notification Workers (fila)
```

**Módulos prontos para separação:**
- `QueueModule` → Workers independentes
- `NoticiasModule` → CRUD Service
- `DatabaseModule` → Shared library

---

## 🔧 Padrões Implementados

### 1. **Repository Pattern**

```typescript
@InjectRepository(Noticia)
private readonly repo: Repository<Noticia>
```

**Benefícios:**
- Abstrai persistência
- Facilita testes (mock do repository)
- Permite troca de ORM

### 2. **Strategy Pattern** (Cache)

```typescript
@Inject(CACHE_MANAGER)
private cache: Cache
```

**Benefícios:**
- Trocar memória por Redis é trivial
- Interface unificada
- Configurável por ambiente

### 3. **Observer Pattern** (Fila)

```typescript
await this.queueService.addNotification({...})
```

**Benefícios:**
- Desacopla criação de notificação
- Processamento assíncrono
- Escalável para múltiplos workers

---

## 📊 Comparação: Antes e Depois

### ❌ Estrutura Ruim (Monolítica)

```
src/
├── index.ts (tudo junto)
├── routes.ts (todas as rotas)
├── database.ts (queries diretas)
└── utils.ts (miscelânea)
```

**Problemas:**
- Alto acoplamento
- Difícil testar
- Impossível escalar partes separadas

### ✅ Estrutura Atual (Modular)

```
src/
├── modules/ (domínios separados)
├── shared/ (código reutilizável)
└── config/ (configurações)
```

**Vantagens:**
- Baixo acoplamento
- Fácil testar
- Escalável por módulo

---

## 🎓 Conclusão

A estrutura escolhida equilibra:

1. **Simplicidade** - Fácil entender e navegar
2. **Manutenibilidade** - Mudanças localizadas
3. **Escalabilidade** - Pronto para crescer
4. **Testabilidade** - Cada parte testável isoladamente
5. **Profissionalismo** - Segue padrões da indústria

Esta arquitetura não é "over-engineering" para o escopo atual, mas sim **preparação inteligente** para crescimento futuro, evitando refatorações custosas.
