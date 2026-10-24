# site-igrejadeuseagloria

Landing page institucional ("Em breve") da **Igreja Evangélica Pentecostal – Deus é a Glória**, de Rondonópolis – MT, destinada ao domínio `www.igrejadeuseagloria.com.br`.

É um site **100% estático** (HTML5, CSS3 e JavaScript puro, sem frameworks, sem build e sem dependências de Node), servido por **Nginx (Alpine)** em um container Docker e pensado para ser publicado no **Dokploy**.

> Este repositório contém apenas o código do site. Nenhum domínio, DNS ou servidor é alterado por ele.

## Sumário

- [O que o site apresenta](#o-que-o-site-apresenta)
- [Stack](#stack)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como funciona](#como-funciona)
- [Testar localmente](#testar-localmente)
- [Publicar no Dokploy](#publicar-no-dokploy)
- [Como editar o conteúdo](#como-editar-o-conteúdo)
- [Mapa do Google (opcional)](#mapa-do-google-opcional)
- [SEO, acessibilidade e desempenho](#seo-acessibilidade-e-desempenho)
- [Conteúdo bíblico](#conteúdo-bíblico)

## O que o site apresenta

Página única (`site/index.html`) com as seções:

| Seção | Âncora | Conteúdo |
|---|---|---|
| Hero | `#inicio` | Logo com halo, raios e partículas animadas, chamada "Nosso site completo está chegando em breve!", versículo (Mateus 18:20) e botões de WhatsApp e YouTube |
| Nossa igreja | `#sobre` | Texto de boas-vindas e três cartões de valores: Avivamento, Palavra e Comunhão |
| Faixa de versículo | – | Atos 1:8 em destaque |
| Acompanhe-nos | `#acompanhe` | Cartões para YouTube, Instagram e WhatsApp |
| Onde estamos | `#localizacao` | Endereço, botão **Como chegar** (rota no Google Maps) e painel do mapa |
| Rodapé | – | Logo, endereço, ícones de redes sociais e direitos autorais |

Há ainda um botão flutuante de WhatsApp sempre visível e uma página `404.html` personalizada.

**Contatos e canais** (já presentes no código):

- WhatsApp: (66) 99631-5255, com mensagem pré-preenchida
- Instagram: `@igrejadeuseagloria`
- YouTube: `@igrejadeuseagloria`
- Endereço: R. Elza Honório dos Santos, 35 - Jardim Primavera Segunda Parte, Rondonópolis - MT, 78725-260

## Stack

- **Front-end:** HTML5, CSS3 (variáveis CSS, grid/flex, `clamp()`), JavaScript ES6+ sem bibliotecas
- **Fontes:** Cinzel (títulos) e Montserrat (texto), carregadas do Google Fonts
- **Servidor:** `nginx:alpine`
- **Empacotamento:** Docker e Docker Compose
- **Hospedagem prevista:** Dokploy, com HTTPS via Let's Encrypt

Paleta de cores (definida em `:root` no CSS): azul-marinho `#0B1A33`, dourado `#D4A537` / `#F2C14E`, vermelho `#B3261E`, laranja `#E8661C` e creme `#FFF9EE`.

## Estrutura do projeto

```text
/
├── Dockerfile              # imagem nginx:alpine + healthcheck
├── docker-compose.yml      # teste local (porta 8080 -> 80)
├── nginx.conf              # gzip, cabeçalhos de segurança, cache, /health, 404 e redirect www
├── .dockerignore
├── .gitignore
├── README.md
└── site/                   # raiz web (copiada para /usr/share/nginx/html)
    ├── index.html
    ├── 404.html
    ├── robots.txt
    ├── sitemap.xml
    ├── site.webmanifest
    ├── favicon.ico
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    └── assets/
        ├── css/style.css
        ├── js/main.js
        └── img/
            ├── logo.png
            ├── logo.webp
            └── og-image.jpg  # 1200x630, imagem de compartilhamento
```

## Como funciona

### JavaScript (`site/assets/js/main.js`)

Um único script, sem dependências, que faz três coisas:

1. **Revelação ao rolar:** elementos com `data-reveal` ganham a classe `is-visible` via `IntersectionObserver`.
2. **Partículas ("brasas"):** gera 19 elementos (11 em telas menores que 620 px) dentro de `#particulas`, com tamanho, duração, atraso e deriva aleatórios.
3. **Google Maps:** valida a URL do botão **Como chegar** (somente `https` e domínios Google) e, se `data-maps-embed-url` estiver preenchido com uma URL válida da Maps Embed API, substitui o painel por um `iframe`.

Tudo respeita `prefers-reduced-motion`: com movimento reduzido, as animações e partículas são desativadas e o conteúdo aparece direto.

### Nginx (`nginx.conf`)

- Escuta na porta **80** e oculta a versão do servidor (`server_tokens off`).
- Ativa **gzip** para texto, CSS, JS, JSON, XML e SVG.
- Envia `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy` em todas as respostas. Os cabeçalhos são repetidos em cada `location`, porque o Nginx não herda `add_header` quando o bloco define outro.
- **Cache:** HTML sem cache (`no-store`); manifest sem cache; imagens, CSS, JS e fontes com cache de 365 dias e `immutable`.
- **`/health`** responde `200 ok`, sem log de acesso. É usado pelo `HEALTHCHECK` do Docker.
- **Redirecionamento:** `igrejadeuseagloria.com.br` (sem `www`) recebe `301` para `https://www.igrejadeuseagloria.com.br`, preservando caminho e parâmetros.
- Rotas inexistentes exibem `404.html`.

### Docker

- `Dockerfile`: copia `nginx.conf` para `conf.d/default.conf` e `site/` para `/usr/share/nginx/html/`; expõe a porta 80 e define o healthcheck com `wget`.
- `docker-compose.yml`: serviço `site` (container `igreja-deus-e-a-gloria-landing`), publica `8080:80`, com `restart: unless-stopped` e o mesmo healthcheck.

## Testar localmente

Requisitos: Docker Desktop (ou Docker Engine) com Docker Compose v2.

```bash
docker compose up --build -d
```

Em seguida:

1. Abra `http://localhost:8080`.
2. Verifique `http://localhost:8080/health` (deve responder `200` com `ok`).
3. Abra uma rota inexistente, como `http://localhost:8080/pagina-inexistente`, para ver a página 404 personalizada.

Logs e encerramento:

```bash
docker compose logs -f
docker compose down
```

Se a sua instalação só tiver o executável com hífen, use `docker-compose` no lugar de `docker compose`.

Para apenas gerar a imagem: `docker build -t igreja-deus-e-a-gloria-landing .`

Como o site é estático, também dá para abrir `site/index.html` direto no navegador para uma revisão visual rápida. Nesse caso, os caminhos absolutos (`/assets/...`) não resolvem; prefira servir a pasta `site/` por Nginx/Docker ou por qualquer servidor estático.

## Publicar no Dokploy

1. Envie este repositório ao provedor Git conectado ao Dokploy.
2. No Dokploy, crie uma **Application** e conecte o repositório. Selecione a branch de publicação e deixe a raiz do projeto como contexto de build.
3. Em **Build Type**, escolha **Dockerfile**, com o caminho `Dockerfile` na raiz. Não há etapa de build nem runtime Node.
4. Configure a porta interna da aplicação como **80**.
5. Em domínios, cadastre `www.igrejadeuseagloria.com.br` e `igrejadeuseagloria.com.br`.
6. Ative HTTPS com **Let's Encrypt** para os dois domínios e aguarde o certificado ficar válido.
7. Faça o deploy e confira: container saudável, página principal, `/health`, página 404 e o redirecionamento do domínio sem `www`.

### DNS necessário

No provedor de DNS, aponte os registros **A** para o IP público do servidor Dokploy:

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` | IP público do servidor |
| A | `www` | IP público do servidor |

Aguarde a propagação antes de emitir o certificado HTTPS.

## Como editar o conteúdo

- **Textos, links, endereço e contatos:** `site/index.html`. O endereço e o telefone aparecem em vários pontos (seção "Onde estamos", rodapé, JSON-LD e links do WhatsApp/Maps); altere todos.
- **Estilos:** `site/assets/css/style.css`.
- **Domínio canônico:** `index.html` (canonical, Open Graph, Twitter Card, JSON-LD), `robots.txt`, `sitemap.xml` e o `if` de redirecionamento em `nginx.conf`.
- **Cache busting:** o CSS é referenciado como `style.css?v=1.0.2` e o JS como `main.js?v=1.0.1`, em `index.html` e `404.html` (o CSS). Como o Nginx aplica cache longo a esses arquivos, **incremente o `?v=` ao alterá-los**, senão os visitantes continuam vendo a cópia antiga.
- **`lastmod` do sitemap:** atualize `site/sitemap.xml` quando o conteúdo mudar.
- **Logo e ícones:** `logo.png` e `logo.webp` preservam a logo original (com o nome da igreja). Os ícones quadrados (favicons, `apple-touch-icon`, `android-chrome-*`) usam só o símbolo da chama e da pomba. A imagem `og-image.jpg` mede 1200x630.

## Mapa do Google (opcional)

O botão **Como chegar** abre uma rota de carro até o endereço, e o cartão **Ver localização no Google Maps** abre uma busca pelo endereço. Ambos usam links universais do Google Maps e **não precisam de chave de API**. Eles não criam um perfil público da igreja no Google nem garantem um Place ID específico.

Por padrão, o painel do mapa mostra o endereço e um botão de busca. Para exibir um mapa interativo **dentro** da página:

1. Crie uma chave da **Maps Embed API** em um projeto do Google Cloud com faturamento habilitado.
2. Restrinja a chave ao domínio publicado e à Maps Embed API.
3. Preencha `data-maps-embed-url` na `div#map-container` de `site/index.html` com a URL `https://www.google.com/maps/embed/v1/place?key=SUA_CHAVE_RESTRITA&q=<endereço codificado>`.

Enquanto o atributo estiver vazio, o `main.js` não carrega nenhum `iframe` inválido. Ele só aceita URLs `https://www.google.com/maps/embed/v1/place` que tenham `key` e `q`.

Documentação oficial: [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) e [chave de API](https://developers.google.com/maps/documentation/embed/get-api-key).

## SEO, acessibilidade e desempenho

- `lang="pt-BR"`, título e descrição em português, URL canônica, Open Graph, Twitter Card, `robots.txt`, `sitemap.xml` e JSON-LD do tipo `Church` (nome, telefone, endereço postal e redes sociais).
- Manifest PWA básico (`site.webmanifest`) e conjunto completo de ícones.
- Logo em WebP com fallback em PNG, via `<picture>`.
- Link "Pular para o conteúdo", foco visível, textos alternativos, `aria-label` descritivo nos links que abrem nova aba e `rel="noopener"` nos links externos.
- Respeito a `prefers-reduced-motion`.
- Servidor com gzip, cache longo para ativos estáticos e cabeçalhos de segurança básicos.

## Conteúdo bíblico

Os versículos estão identificados como **Almeida Corrigida Fiel (ACF)**: Mateus 18:20 (hero) e Atos 1:8 (faixa de destaque).

## Direitos

© 2026 Igreja Evangélica Pentecostal – Deus é a Glória. Todos os direitos reservados. A logo e a identidade visual pertencem à igreja.
