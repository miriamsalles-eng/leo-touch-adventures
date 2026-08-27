# Leo's Touchpad Adventures

Crie do zero uma aplicação educacional infantil independente chamada provisoriamente “Aventuras no Touchpad”, para crianças pequenas em Chromebooks aprenderem touchpad com Leo, um ratinho simpático. Não reutilize código, estrutura, componentes, identidade visual ou referências de projetos anteriores.

Implemente a primeira entrega completa: arquitetura modular, navegação, identidade visual infantil cartoon 3D contemporânea, sem scroll, responsiva 16:9 para 1366x768, 1280x720 e 1920x1080, usando Pointer Events (pointerdown/move/up/enter e setPointerCapture em drags) e localStorage apenas para etapa atual. Sem login, pontos, vidas, cronômetro, ranking, coleta de dados, ads ou compras.

Direção visual: cenários ricos mas organizados, formas suaves, azul claro/turquesa/verde/lilás/coral, amarelo só em destaque, pouco texto, botões grandes arredondados, contraste e acessibilidade. Leo é um ratinho infantil de corpo inteiro, olhos grandes, mochila e tênis, curioso e encorajador, não bebê. Não desenhar Leo permanentemente via SVG inline: use sistema externo de assets substituíveis em assets/leo, backgrounds, objects, ui, effects, audio, com placeholders coerentes quando necessário. Organize também os estados de Leo: neutral, happy, pointing, thinking, celebrating, with-cheese, laptop, looking up/left/right. Estruture para PNG/WebP transparentes futuros.

Crie componentes reutilizáveis semelhantes a Character, SpeechBubble inteligente (posiciona esquerda/direita/acima sem cobrir Leo ou atividade), GameButton, DragItem, DropZone com tolerância configurável (centro ou ~50% sobre o alvo), FeedbackPopup, ProgressDots discreto, SceneFrame; hooks useDragDrop/usePointerTracking/useAudio; data de atividades. Áudio opcional, não bloqueante, com botão mute.

Implemente abertura, 10 atividades e encerramento:
1 Abertura no quarto de Leo, título AVENTURAS NO TOUCHPAD, subtítulo “Vamos aprender a controlar a setinha?”, botão COMEÇAR.
2 Encontre o Leo: mover cursor até Leo, reação no hover e sucesso após ~800ms, sem clique, depois SEGUIR.
3 Clique no queijo: queijo, maçã e bola grandes; acerto no queijo, feedback gentil nos outros, retry.
4 Leve o queijo até Leo: drag do queijo, microetapas: pointerdown “Agora leve até Leo sem soltar”; ao alcançar alvo “Agora solte!” e só concluir em pointerup válido.
5 Arrume a mochila: lápis, caderno, estojo para mochila aberta, progresso 1/3, itens corretos permanecem, soltura fora retorna.
6 Cada coisa em seu lugar: livro->estante, bola->caixa, lápis->estojo, alvos bem distintos e grandes.
7 Complete a figura: puzzle simples de 3 peças grandes (foguete/robô/animal), snap tolerante, trava e pequena celebração.
8 Caminho pelo jardim: arrastar Leo por caminho largo e orgânico no jardim; se sair, reação e volta ao último ponto seguro, sem reinício.
9 Floresta do Leo: percurso amigável com curvas esquerda/direita, vertical/horizontal, meta queijo grande, sem corredores estreitos.
10 Organize o computador: desktop infantil abstrato, arrastar arquivo de imagem para pasta grande, pasta reage/abre e explica aplicação cotidiana.
11 Desafio final: piquenique curto combinando mover, clicar, arrastar e soltar: clicar na cesta, arrastar queijo/fruta e conduzir Leo ao local.
12 Final: Leo comemorando, resumo visual e textual MOVER/CLICAR/ARRASTAR/SOLTAR, fala curta, botões JOGAR DE NOVO e FINALIZAR se fizer sentido, além de RECOMEÇAR que limpa progresso.

Feedback sempre gentil e específico: “Isso!”, “Você conseguiu!”, “Quase! Tente novamente.”, “Continue segurando enquanto move.” Nunca use força/pressionar forte, erro punitivo ou autoavanço após erro. Instruções de 3 a 8 palavras, tipografia legível (ex. Nunito/Fredoka/Baloo 2), priorize imagem+demonstração+ação.

Garanta que toda tela tenha overflow hidden quando apropriado, sem elementos críticos nas bordas e sem sobreposições. Faça build/QA. Ao concluir, responda com auditoria objetiva: telas criadas, interações implementadas, assets placeholders, arquivos que controlam cada atividade, parâmetros ajustáveis e qualquer desvio da especificação.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://leo-touch-adventures.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4cc7c5a4-9656-4034-af1f-2435b2881e34).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
