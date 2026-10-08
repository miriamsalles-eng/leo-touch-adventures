# Remover o ícone do aviso de habilidade

## O que muda
- O aviso de habilidade (faixa branca no topo, ex.: "APRENDENDO: MOVER") deixa de mostrar o ícone à esquerda em todas as telas (mover, clicar, arrastar, soltar, controlar o som, praticar/usar).
- Fica só: etiqueta pequena em cima + frase principal embaixo, centralizadas.
- Os ícones da tela final (MOVER/CLICAR/ARRASTAR/SOLTAR) continuam iguais.

## O que não muda
Textos, áudios, tempos, lógica, posição da faixa, tamanho da fonte e comportamento das atividades.

## Detalhes técnicos
- `src/game/components/SkillIntro.tsx`: remover o `<img>` do ícone; o campo `icon` continua no tipo (cenas não são tocadas).
- Ajuste leve no contêiner: remover `gap-3`, padding horizontal `px-7` → `px-9`, e `items-center` no bloco de texto para centralizar etiqueta e frase.
- Validação: Playwright em 1366×768 medindo a largura da faixa vs. palco para as frases de S02, S03, S04 (2 passos), S10 e a mais longa ("AGORA VAMOS APRENDER A MOVER A SETINHA!"), confirmando que nada encosta nas bordas nem transborda.
