# 🏠 Aluga Fácil API

API REST para a plataforma de aluguel de imóveis, construída com **ASP.NET Core 8** + **PostgreSQL** + **Entity Framework Core**.

---

## 🚀 Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0 |
| [PostgreSQL](https://www.postgresql.org/download/) | 14+ |

---

## ⚙️ Configuração Inicial

### 1. Clone e acesse o projeto

```bash
git clone <url-do-repositorio>
cd aluga-facil-api
```

### 2. Configure a string de conexão

Edite o arquivo `src/appsettings.Development.json` com os dados do seu PostgreSQL local:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=aluga_facil_dev;Username=postgres;Password=SUA_SENHA"
  }
}
```

> **Importante:** Altere também a chave JWT em `appsettings.json`:
> ```json
> "Jwt": {
>   "Key": "ALTERE_ESTA_CHAVE_COM_PELO_MENOS_32_CARACTERES!"
> }
> ```

---

## 🛠️ Comandos para inicializar o projeto

Execute **em ordem** a partir da raiz do repositório:

### Passo 1 — Restaurar pacotes NuGet

```bash
cd src
dotnet restore
```

### Passo 2 — Instalar a ferramenta EF Core (uma vez por máquina)

```bash
dotnet tool install --global dotnet-ef
```

> Se já tiver instalado, atualize com: `dotnet tool update --global dotnet-ef`

### Passo 3 — Criar a Migration inicial

```bash
dotnet ef migrations add InitialCreate --output-dir Data/Migrations
```

### Passo 4 — Aplicar as Migrations ao banco de dados

```bash
dotnet ef database update
```

> O banco `aluga_facil_dev` será criado automaticamente no PostgreSQL.

### Passo 5 — Executar a API

```bash
dotnet run
```

A API estará disponível em:
- **HTTP:** `http://localhost:5000`
- **Swagger UI:** `http://localhost:5000` (raiz, em desenvolvimento)

---

## 📋 Endpoints

### 🔐 Auth (`/api/auth`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/api/auth/register` | Cadastro de usuário | ❌ |
| `POST` | `/api/auth/login` | Login e geração de JWT | ❌ |

### 👤 Usuários (`/api/users`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/users/me` | Visualizar perfil | ✅ |
| `PUT` | `/api/users/me` | Atualizar perfil | ✅ |

### 🏠 Imóveis (`/api/properties`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/properties` | Catálogo com filtros e paginação | ❌ |
| `GET` | `/api/properties/map` | Pontos para o mapa | ❌ |
| `GET` | `/api/properties/{id}` | Detalhes + link WhatsApp | ❌ |
| `GET` | `/api/properties/mine` | Meus anúncios | ✅ |
| `POST` | `/api/properties` | Criar anúncio | ✅ |
| `PUT` | `/api/properties/{id}` | Editar anúncio | ✅ |
| `DELETE` | `/api/properties/{id}` | Deletar anúncio | ✅ |

#### Parâmetros de filtro (`GET /api/properties`)

```
?city=Fortaleza
&state=CE
&minPrice=500
&maxPrice=2000
&bedrooms=2
&petsAllowed=true
&isFurnished=false
&tag=apartamento
&page=1
&pageSize=20
```

### ⭐ Avaliações (`/api/reviews`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/reviews/landlord/{landlordId}` | Avaliações de um locador | ❌ |
| `POST` | `/api/reviews` | Criar avaliação | ✅ |
| `DELETE` | `/api/reviews/{id}` | Deletar avaliação | ✅ |

### 🖼️ Fotos (`/api/photos`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/api/photos/upload` | Upload de imagem (`multipart/form-data`, campo `file`), retorna `{ "url": "..." }` para usar em `PhotoUrls` | ✅ |

> Armazenamento via **MinIO** (S3-compatible). Limite de 10MB por arquivo, apenas `image/*`.

---

## 🏗️ Arquitetura

```
src/
├── Controllers/        # Camada de apresentação (HTTP)
├── Services/           # Regras de negócio
│   └── Interfaces/
├── Repositories/       # Acesso a dados
│   └── Interfaces/
├── Models/             # Entidades do domínio
├── DTOs/
│   ├── Request/        # Payloads de entrada
│   └── Response/       # Payloads de saída
├── Data/               # AppDbContext + Migrations
├── Mappings/           # Perfis AutoMapper
└── Middlewares/        # Tratamento global de exceções + helpers
```

**Padrões aplicados:** Repository Pattern, Service Layer, DTO, Dependency Injection.

---

## 🔑 Autenticação

A API usa **JWT Bearer Token**. Após o login, inclua o token no header:

```
Authorization: Bearer <seu_token>
```

---

## 🌍 WhatsApp (RF04)

O endpoint `GET /api/properties/{id}` retorna o campo `whatsAppLink` com o link direto:

```
https://wa.me/5585999999999
```

O frontend apenas abre essa URL — sem nenhuma dependência adicional.

---

## 🐳 Docker

Para subir a stack completa (API + PostgreSQL + MinIO) de uma vez:

```bash
cp .env.example .env   # ajuste as senhas se quiser
docker compose up -d
```

Isso sobe:
- **API:** `http://localhost:8080` (Swagger na raiz)
- **PostgreSQL:** `localhost:5432`
- **MinIO API (S3):** `localhost:9000`
- **MinIO Console (web):** `http://localhost:9001` (login com `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` do `.env`)

O bucket de fotos (`aluga-facil-photos`) é criado automaticamente pela API na inicialização, já com política de leitura pública.

> Só o PostgreSQL, sem o resto da stack:
> ```bash
> docker run --name aluga-facil-db \
>   -e POSTGRES_PASSWORD=postgres \
>   -e POSTGRES_DB=aluga_facil_dev \
>   -p 5432:5432 \
>   -d postgres:16
> ```
