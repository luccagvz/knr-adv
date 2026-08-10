# Empresa

> Memória central do negócio. O Claude lê esse arquivo antes de cada resposta.
> Preenchido pelo `/instalar` — você pode editar a qualquer momento.

**Nome:** Kruschewsky e Nunes Ribeiro Advogados Associados (KNR)
**Negócio:** Banca jurídica empresarial multidisciplinar, sede em Salvador (BA)
**O que faz:** Advocacia empresarial — societário, comercial, tributário, imobiliário, trabalhista, investimentos estrangeiros e mais 10 áreas (ver `site/content/areas.js`)
**Perfil:** Agência/consultoria — escritório com sócios e equipe própria, atendendo clientes externos
**Atende clientes:** Médias e grandes empresas, nacionais e estrangeiras (imobiliário, hoteleiro, industrial, portuário, logística) e investidores estrangeiros
**Equipe:** 5 sócios — Marcelo Kruschewsky, Diego Ribeiro, Sérgio Nunes, Juliana Andrade Gavazza, Carmen Dolores Bittencourt (detalhes em `site/content/socios.js`)
**Ferramentas:** Site institucional próprio (`site/`, gerado estaticamente via `node site/build.js`)
**Principais entregas:** Site institucional (`site/`) reconstruído a partir do conteúdo real de knr.adv.br

## Contexto adicional

Site institucional reconstruído em 2026-08-08 a partir de um dossiê do usuário — ver `site/` na raiz do projeto. Conteúdo (áreas, sócios, clientes, casos em destaque, notícias) foi extraído diretamente das páginas internas de knr.adv.br, incluindo uma página `/casos-destaque/` não linkada no menu do site antigo. Nenhum dado foi inventado; onde a informação real não existia (e-mail de contato, fotos dos sócios), ficou marcado como placeholder no código.
