# JR Perfumaria - Backend API

API REST para a loja JR Perfumaria. Conecta diretamente ao PostgreSQL.

## Deploy no Coolify

1. Crie um novo repositório no GitHub (ex: `jr-perfumaria-api`)
2. Faça push destes arquivos para o repositório
3. No Coolify, crie um **novo serviço** apontando para esse repositório
4. Use **Build Pack: Dockerfile** (ele vai encontrar o `Dockerfile` automaticamente)
5. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=postgresql://postgres:SUA_SENHA@HOST_DO_POSTGRES:5432/jr_perfumaria
   PORT=4000
   ```
6. Configure o domínio: `https://api.jrperfumaria.com`
7. Porta exposta: `4000`
8. Deploy!

## Testar

Acesse `https://api.jrperfumaria.com/health` — deve retornar `{"status":"ok"}`

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /health | Health check |
| GET | /products | Listar produtos |
| POST | /products | Criar produto |
| PATCH | /products/:id | Atualizar produto |
| DELETE | /products/:id | Remover produto |
| GET | /categories | Listar categorias |
| POST | /categories | Criar categoria |
| PATCH | /categories/:id | Atualizar categoria |
| DELETE | /categories/:id | Remover categoria |
| GET | /banners | Listar banners |
| POST | /banners | Criar banner |
| PATCH | /banners/:id | Atualizar banner |
| DELETE | /banners/:id | Remover banner |
| GET | /settings | Listar configurações |
| POST | /settings | Criar/atualizar configuração |
