# Identidade visual

> Como a marca aparece em tudo que o MazyOS gera.
> As skills de conteúdo, carrossel e post leem esse arquivo antes de criar qualquer visual.
> Edite quando a marca evoluir.

---

## Cores

- **Fundo principal:** Branco (`#ffffff`)
- **Cor de destaque / CTA:** Azul institucional `#2c4c91` (extraído do logo oficial e do CSS do site atual, knr.adv.br)
- **Texto principal:** Cinza-escuro `#4a4f55` (já usado no site atual); títulos em `#1a2233`
- **Fundo alternativo / cards:** Cinza muito claro `#f5f6f8`
- **Cor proibida:** Roxo, vermelho, neon, gradientes, glassmorphism — banca jurídica premium, não estética de startup/SaaS

---

## Tipografia

- **Títulos e destaques:** Serifada (Georgia/Times, sem carregar fonte externa — transmite tradição/solidez)
- **Corpo, subtítulos e botões:** Sans-serif de sistema (-apple-system, Segoe UI, Roboto, Arial)
- **Peso do título:** 700 (bold)

---

## Estilo geral

Clean, premium, corporativo, minimalista, atemporal. Composição por tipografia, espaçamento e grid — evitar depender de fotografia ou ilustração pesada. Referência: banca jurídica premium + empresa corporativa moderna.

---

## Elementos-chave

- Bordas: finas, `#dfe2e7`, 1px
- Border-radius dos cards: quase reto (2px) — nada de cantos muito arredondados
- Botões: sólidos (azul institucional) ou outline, sem sombra
- Sombras: nenhuma — hierarquia vem de borda e espaçamento, não de elevação

---

## O que NUNCA fazer

- Não usar roxo, vermelho, neon, gradiente ou glassmorphism
- Não usar fotos de banco de imagem clichê (martelo de juiz, balança da justiça, aperto de mãos)
- Não adicionar vídeo, GIF ou efeito pesado — a sensação premium vem do design, não do peso

---

## Logo

- **Arquivo:** `identidade/logo-knr.png` (também em `site/img/logo-knr.png`, usado pelo build do site) — baixado da fonte oficial em knr.adv.br/img/logo-knr.png
- **Versão pra fundo escuro:** não há arquivo separado; no site, o logo é invertido via CSS (`filter: brightness(0) invert(1)`) no rodapé escuro
- **Onde usar:** header e footer do site, slide final de carrossel/proposta (CTA)
- **Tamanho sugerido:** largura entre 140-180px nos HTMLs (proporção original 260×89)

---

## Observações adicionais

Paleta e logo vêm 100% do material oficial já em uso pela KNR (knr.adv.br) — nada foi inventado. Se o escritório atualizar a marca, atualizar este arquivo e o `site/img/logo-knr.png` juntos.
