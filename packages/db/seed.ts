import { createLocalDb } from "./src/local";
import { createPost } from "./src/queries/posts";
import { createPage } from "./src/queries/pages";

async function seed() {
  const db = await createLocalDb();

  // Posts
  const posts = [
    {
      title: "Começando com Astro",
      slug: "comecando-com-astro",
      status: "published" as const,
      excerpt: "Astro é um framework moderno para construir sites rápidos com zero JavaScript por padrão.",
      author: "Felipe",
      content: `## Por que Astro?

Astro é um **framework web** que entrega zero JavaScript por padrão. Diferente de SPA (Single Page Applications), o Astro renderiza tudo no servidor.

### Principais recursos

- **Ilhas de arquitetura**: apenas componentes interativos carregam JS
- **Suporte a múltiplos frameworks**: React, Vue, Svelte, Solid — tudo junto
- **Content Collections**: sistema de conteúdo com TypeScript
- **SSG e SSR**: gere estático ou servidor

### Código de exemplo

\`\`\`astro
---
const mensagem = "Olá, mundo!";
---
<h1>{mensagem}</h1>
\`\`\`

Astro compila isso para HTML puro no build. Nenhum JavaScript enviado ao cliente.
`,
    },
    {
      title: "MDX: Markdown com componentes",
      slug: "mdx-markdown-com-componentes",
      status: "published" as const,
      excerpt: "MDX permite usar componentes React/Vue/Svelte dentro de arquivos Markdown.",
      author: "Felipe",
      content: `## O que é MDX?

MDX é uma extensão do Markdown que permite usar **JSX** (componentes) dentro do texto.

### Exemplo

\`\`\`mdx
import { Callout } from './callout'

# Meu post

<Callout type="info">
  Este é um componente renderizado inline!
</Callout>

Texto normal com **negrito** e *itálico*.
\`\`\`

### Quando usar MDX

| Caso | Recomendação |
|------|-------------|
| Blog simples | Markdown puro |
| Documentação interativa | MDX |
| Landing pages | MDX com componentes |
| Conteúdo dinâmico | MDX + CMS |

### Lista de plugins úteis

1. \`remark-gfm\` — suporte a tabelas, strikethrough
2. \`rehype-slug\` — IDs em headings
3. \`rehype-highlight\` — syntax highlighting
`,
    },
    {
      title: "Deploy com Cloudflare Workers",
      slug: "deploy-cloudflare-workers",
      status: "published" as const,
      excerpt: "Como fazer deploy de apps Astro no Cloudflare Workers usando Wrangler.",
      author: "Felipe",
      content: `## Deploy no Cloudflare Workers

O Cloudflare Workers é uma plataforma serverless que roda código no edge.

### Configuração

1. Instale o adaptador:

\`\`\`bash
bun add @astrojs/cloudflare
\`\`\`

2. Configure \`astro.config.mjs\`:

\`\`\`js
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare()
});
\`\`\`

3. Crie \`wrangler.jsonc\`:

\`\`\`jsonc
{
  "name": "meu-app",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"]
}
\`\`\`

4. Deploy:

\`\`\`bash
bunx wrangler deploy
\`\`\`

> **Dica**: Use \`wrangler dev\` para testar localmente antes do deploy.
`,
    },
  ];

  for (const post of posts) {
    await createPost(db, {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      status: post.status,
    });
    console.log(`  ✓ Post: ${post.title}`);
  }

  // Pages
  const pages = [
    {
      title: "Sobre",
      slug: "sobre",
      status: "published" as const,
      content: `# Sobre o astroweb

Este é um **CMS headless** construído com Astro e Cloudflare.

## Stack

- **Astro** — framework web
- **Cloudflare D1** — banco de dados SQLite
- **Cloudflare Workers** — deploy serverless
- **Tailwind CSS** — utilitários CSS
- **MDX** — conteúdo com componentes
- **Turborepo** — monorepo

## Contato

Entre em contato pelo email **contato@astroweb.com**.
`,
    },
    {
      title: "Política de Privacidade",
      slug: "privacidade",
      status: "published" as const,
      content: `# Política de Privacidade

**Última atualização**: 01/01/2026

## Dados coletados

Não coletamos dados pessoais. O site é puramente estático e não utiliza cookies de rastreamento.

## Hospedagem

O site é hospedado no **Cloudflare**. Consulte a política de privacidade do Cloudflare para informações sobre logs de servidor.

## Contato

Dúvidas? Envie email para **privacidade@astroweb.com**.
`,
    },
  ];

  for (const page of pages) {
    await createPage(db, {
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
    });
    console.log(`  ✓ Page: ${page.title}`);
  }

  console.log(`\n✅ Seed completo: ${posts.length} posts + ${pages.length} páginas`);
}

seed().catch((err) => {
  console.error("Seed falhou:", err);
  process.exit(1);
});
