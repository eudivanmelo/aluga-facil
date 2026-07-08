# 🏠 Aluga Fácil

Plataforma de catálogo de imóveis para alugar, com contato direto entre inquilino e proprietário (sem intermediação). Full-stack: frontend em **Angular** e API em **.NET 8**.

## Funcionalidades

- **Catálogo de imóveis** com busca (cidade, bairro ou título), filtros por tipo, preço, quartos, pets e mobiliado.
- **Mapa interativo** (MapLibre + OpenStreetMap) com os imóveis geolocalizados.
- **Detalhes do imóvel** com galeria de fotos e contato direto via WhatsApp/telefone.
- **Autenticação** por CPF (cadastro/login com JWT).
- **Perfil do usuário**: dados da conta e imóveis anunciados.
- **Anunciar imóvel**: formulário em etapas com upload de fotos e seleção da localização exata no mapa.
- **Hero da home** com estatísticas reais da plataforma (imóveis ativos, cidades, usuários).

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | Angular 22 (standalone components, Signals), Tailwind CSS, MapLibre GL, Lucide Icons |
| Backend | ASP.NET Core 8, Entity Framework Core, PostgreSQL |
| Armazenamento de imagens | MinIO (S3-compatible) |
| Autenticação | JWT Bearer Token |

## Estrutura do repositório

```
aluga-facil/
├── src/              # Frontend Angular (este projeto)
└── backend/          # API .NET — ver backend/README.md
```

## Como rodar

### 1. Backend (API + PostgreSQL + MinIO)

Sobe tudo via Docker Compose — veja detalhes e endpoints em [`backend/README.md`](backend/README.md):

```bash
cd backend
cp .env.example .env
docker compose up -d
```

A API fica disponível em `http://localhost:8080` (Swagger na raiz).

### 2. Frontend

```bash
npm install
npm start
```

A aplicação fica disponível em `http://localhost:4200`. A URL da API é configurada em `src/environments/environment.ts` / `environment.development.ts` (`apiUrl`).

## Scripts úteis

| Comando | Descrição |
|---|---|
| `npm start` | Sobe o servidor de desenvolvimento (`ng serve`) |
| `npm run build` | Build de produção (saída em `dist/`) |
| `npm test` | Roda os testes unitários (Vitest) |

## Arquitetura do frontend

```
src/app/
├── components/     # Componentes reutilizáveis (header, footer, hero, mapa, cards...)
├── pages/          # Telas/rotas (home, login, cadastro, perfil, anunciar imóvel...)
└── core/
    ├── services/     # Comunicação com a API e estado da aplicação
    ├── models/       # Interfaces alinhadas aos DTOs do backend
    ├── guards/       # Proteção de rotas autenticadas
    ├── interceptors/ # Injeção do token JWT nas chamadas à API
    ├── pipes/        # Máscaras de CPF/telefone
    └── validators/   # Validadores de formulário (CPF, senha, telefone)
```
