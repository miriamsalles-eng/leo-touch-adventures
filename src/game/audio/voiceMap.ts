/**
 * VOZ OFICIAL DO LEO — arquivos MP3 gravados (ElevenLabs).
 *
 * VOICE_MAP: semantic line id → MP3 file (file names kept exactly as delivered).
 * VOICE_LINES: semantic line id → the approved sentence that line belongs to.
 *
 * The service receives the sentence through the existing `speech.speak(text)`
 * API and resolves it to an id by a NORMALISED comparison (case, punctuation
 * and spaces ignored), so the visual uppercase never breaks the binding.
 *
 * REGRAS DESTA MIGRAÇÃO:
 * - MP3 é a voz padrão; SpeechSynthesis é APENAS fallback técnico quando um
 *   MP3 essencial falha (ver speech.ts).
 * - Textos sem MP3 cadastrado são SOMENTE VISUAIS: nenhuma voz é sintetizada
 *   para eles (feedbacks positivos simples, mensagens da tela de som etc.).
 * - Nenhum texto foi alterado para parear com os arquivos.
 */
const BASE = "/audio/leo/";

export const VOICE_MAP: Record<string, string> = {
  /* S02 — Encontre o Leo */
  "s02.hello": `${BASE}s02_01_oi_sou_leo.mp3.mp3`,
  "s02.skill.move": `${BASE}s02_02_aprender_mover_setinha.mp3.mp3`,
  "s02.instruction.find": `${BASE}s02_03_leve_setinha_ate_mim.mp3.mp3`,
  "s02.instruction.findAgain": `${BASE}s02_04_agora_me_encontre_aqui.mp3.mp3`,
  "s02.outro.foundAll": `${BASE}s02_05_encontrou_todas_as_vezes.mp3.mp3`,
  "s02.outro.nextObject": `${BASE}s02_06_agora_vou_pedir_um_objeto.mp3.mp3`,
  /* S03 — Clique no queijo */
  "s03.skill.click": `${BASE}s03_01_aprender_clicar.mp3.mp3`,
  "s03.instruction.cheese": `${BASE}s03_02_clique_no_queijo.mp3.mp3`,
  "s03.instruction.ball": `${BASE}s03_03_procure_a_bola.mp3.mp3`,
  "s03.instruction.apple": `${BASE}s03_04_onde_esta_a_maca.mp3.mp3`,
  "s03.instruction.banana": `${BASE}s03_05_clique_na_banana.mp3.mp3`,
  "s03.outro.helpPick": `${BASE}s03_06_pode_me_ajudar_a_pega_los.mp3.mp3`,
  /* S04 — Leve o queijo até Leo */
  "s04.skill.drag": `${BASE}s04_01_aprender_arrastar.mp3.mp3`,
  "s04.skill.drop": `${BASE}s04_02_soltar_no_lugar_certo.mp3.mp3`,
  "s04.instruction.bring": `${BASE}s04_03_clique_segure_traga.mp3.mp3`,
  "s04.instruction.release": `${BASE}s04_04_agora_solte_aqui.mp3.mp3`,
  "s04.instruction.left": `${BASE}s04_05_arraste_para_esquerda.mp3.mp3`,
  "s04.instruction.up": `${BASE}s04_06_arraste_para_cima.mp3.mp3`,
  "s04.instruction.down": `${BASE}s04_07_arraste_para_baixo.mp3.mp3`,
  "s04.outro.loving": `${BASE}s04_08_estou_adorando_brincar.mp3.mp3`,
  /* S05 — Arrume a mochila */
  "s05.hello.ufa": `${BASE}s05_01_ufa_quantas_brincadeiras.mp3.mp3`,
  "s05.hello.pack": `${BASE}s05_02_guardar_tudo_na_mochila.mp3.mp3`,
  "s05.instruction.pack": `${BASE}s05_03_guarde_na_mochila.mp3.mp3`,
  "s05.outro.ready": `${BASE}s05_04_mochila_pronta.mp3.mp3`,
  "s05.outro.tidyRoom": `${BASE}s05_05_falta_arrumar_quarto.mp3.mp3`,
  /* S06 — Cada coisa em seu lugar */
  "s06.hello.place": `${BASE}s06_01_cada_coisa_tem_seu_lugar.mp3.mp3`,
  "s06.instruction.sort": `${BASE}s06_02_coloque_cada_coisa_no_lugar.mp3.mp3`,
  "s06.outro.tidy": `${BASE}s06_03_que_quarto_arrumado.mp3.mp3`,
  /* S07 — Complete a figura */
  "s07.hello.rocket": `${BASE}s07_01_vamos_montar_foguete.mp3.mp3`,
  "s07.instruction.pieces": `${BASE}s07_02_leve_cada_peca.mp3.mp3`,
  "s07.outro.great": `${BASE}s07_03_foguete_ficou_otimo.mp3.mp3`,
  "s07.outro.park": `${BASE}s07_04_passeio_no_parque.mp3.mp3`,
  /* S08 — Caminho pelo jardim */
  "s08.prelude.cheese": `${BASE}s08_01_tem_um_queijo_ali.mp3.mp3`,
  "s08.prelude.takeMe": `${BASE}s08_02_pode_me_levar_ate_ele.mp3.mp3`,
  "s08.instruction.path": `${BASE}s08_03_me_leve_pelo_caminho.mp3.mp3`,
  "s08.outro.gotIt": `${BASE}s08_04_peguei_que_delicia.mp3.mp3`,
  "s08.outro.forest": `${BASE}s08_05_vamos_ver_a_floresta.mp3.mp3`,
  /* S09 — Floresta do Leo */
  "s09.prelude.another": `${BASE}s09_01_encontrei_outro.mp3.mp3`,
  "s09.prelude.canYou": `${BASE}s09_02_consegue_me_levar.mp3.mp3`,
  "s09.intro.curves": `${BASE}s09_03_caminho_tem_mais_curvas.mp3.mp3`,
  "s09.instruction.cheese": `${BASE}s09_04_me_leve_ate_o_queijo.mp3.mp3`,
  "s09.outro.didIt": `${BASE}s09_05_conseguimos.mp3.mp3`,
  "s09.outro.computer": `${BASE}s09_06_organizar_computador.mp3.mp3`,
  /* S10 — Organize o computador */
  "s10.hello.photo": `${BASE}s10_01_guardar_uma_foto.mp3.mp3`,
  "s10.skill.sound": `${BASE}s10_02_controlar_o_som.mp3.mp3`,
  "s10.instruction.mute": `${BASE}s10_03_clique_para_desligar_som.mp3.mp3`,
  "s10.feedback.soundOn": `${BASE}s10_04_som_ligado_novamente.mp3.mp3`,
  "s10.instruction.file": `${BASE}s10_05_leve_imagem_para_pasta.mp3.mp3`,
  "s10.outro.organized": `${BASE}s10_06_tudo_organizado.mp3.mp3`,
  "s10.outro.picnic": `${BASE}s10_07_fazer_um_piquenique.mp3.mp3`,
  /* S11 — Desafio do piquenique */
  "s11.hello.picnic": `${BASE}s11_01_organizar_piquenique.mp3.mp3`,
  "s11.instruction.basket": `${BASE}s11_02_clique_na_cesta.mp3.mp3`,
  "s11.instruction.food": `${BASE}s11_03_arraste_comida_para_toalha.mp3.mp3`,
  "s11.instruction.walk": `${BASE}s11_04_me_leve_ate_a_toalha.mp3.mp3`,
  "s11.outro.ready": `${BASE}s11_05_piquenique_pronto.mp3.mp3`,
  /* S12 — Encerramento (narração final completa em um único arquivo) */
  "s12.closing": `${BASE}s12_01_encerramento_final.mp3.mp3`,
  /* Feedbacks corretivos compartilhados */
  "shared.almost": `${BASE}shared_01_quase_tente_novamente.mp3.mp3`,
  "shared.holding": `${BASE}shared_02_continue_segurando.mp3.mp3`,
  "shared.keepOnPath": `${BASE}shared_03_volte_para_o_caminho.mp3.mp3`,
};

export const VOICE_LINES: Record<string, string> = {
  "s02.hello": "Oi! Eu sou o Leo! Vamos brincar?",
  "s02.skill.move": "Agora vamos aprender a mover a setinha!",
  "s02.instruction.find": "Mova a setinha e me encontre!",
  "s02.instruction.findAgain": "Agora me encontre aqui!",
  "s02.outro.foundAll": "Nossa! Você me encontrou todas as vezes!",
  "s02.outro.nextObject": "Agora vou pedir um objeto. Quando encontrar, clique nele!",
  "s03.skill.click": "Agora vamos aprender a clicar!",
  "s03.instruction.cheese": "Onde está o queijo? Clique nele!",
  "s03.instruction.ball": "Agora procure a bola!",
  "s03.instruction.apple": "E a maçã, onde está?",
  "s03.instruction.banana": "Falta a banana! Clique nela!",
  "s03.outro.helpPick": "Agora pode me ajudar a pegá-los?",
  "s04.skill.drag": "Agora vamos aprender a arrastar!",
  "s04.skill.drop": "E soltar no lugar certo!",
  "s04.instruction.bring": "Clique no queijo, segure e traga até mim!",
  "s04.instruction.release": "Agora solte aqui!",
  "s04.instruction.left": "Agora arraste para a esquerda!",
  "s04.instruction.up": "Agora arraste para cima!",
  "s04.instruction.down": "Agora arraste para baixo!",
  "s04.outro.loving": "Estou adorando brincar com você!",
  "s05.hello.ufa": "Ufa! Quantas brincadeiras!",
  "s05.hello.pack": "Agora vamos guardar tudo na mochila?",
  "s05.instruction.pack": "Guarde tudo na minha mochila!",
  "s05.outro.ready": "Mochila pronta!",
  "s05.outro.tidyRoom": "Agora falta arrumar o quarto!",
  "s06.hello.place": "Cada coisa tem o seu lugar!",
  "s06.instruction.sort": "Coloque cada coisa no seu lugar.",
  "s06.outro.tidy": "Que quarto arrumado!",
  "s07.hello.rocket": "Vamos montar um foguete?",
  "s07.instruction.pieces": "Leve cada peça para o lugar certo.",
  "s07.outro.great": "Nosso foguete ficou ótimo!",
  "s07.outro.park": "Que tal um passeio no parque?",
  "s08.prelude.cheese": "Opa! Tem um queijo ali!",
  "s08.prelude.takeMe": "Você pode me levar até ele?",
  "s08.instruction.path": "Me leve pelo caminho até o queijo!",
  "s08.outro.gotIt": "Peguei! Que delícia!",
  "s08.outro.forest": "Vamos ver o que tem na floresta?",
  "s09.prelude.another": "Encontrei outro!",
  "s09.prelude.canYou": "Você consegue me levar até ele?",
  "s09.intro.curves": "O caminho tem mais curvas!",
  "s09.instruction.cheese": "Me leve até o queijo!",
  "s09.outro.didIt": "Conseguimos!",
  "s09.outro.computer": "Antes do piquenique, vamos organizar o computador?",
  "s10.hello.photo": "Vamos guardar uma foto do passeio?",
  "s10.skill.sound": "Vamos aprender a controlar o som!",
  "s10.instruction.mute": "O som está ligado. Clique para desligar.",
  "s10.feedback.soundOn": "O som está ligado novamente.",
  "s10.instruction.file": "Leve a imagem para a pasta!",
  "s10.outro.organized": "Tudo organizado!",
  "s10.outro.picnic": "Agora vamos fazer um piquenique?",
  "s11.hello.picnic": "Agora vamos organizar nosso piquenique?",
  "s11.instruction.basket": "Clique na cesta para abrir!",
  "s11.instruction.food": "Arraste a comida para a toalha!",
  "s11.instruction.walk": "Agora me leve até a toalha!",
  "s11.outro.ready": "Nosso piquenique está pronto!",
  "s12.closing": "Você me ajudou em todos os desafios!",
  "shared.almost": "Quase! Tente novamente.",
  "shared.holding": "Continue segurando enquanto move.",
  "shared.keepOnPath": "Volte para o caminho.",
};

/** Lines preloaded right after COMEÇAR (first activity only). */
export const PRELOAD_IDS = ["s02.hello", "s02.skill.move", "s02.instruction.find", "s02.instruction.findAgain"];

const norm = (s: string) =>
  s
    .toLocaleLowerCase("pt-BR")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const BY_TEXT = new Map<string, string>();
for (const [id, text] of Object.entries(VOICE_LINES)) BY_TEXT.set(norm(text), id);

/** Semantic id registered for this sentence, or null (→ mensagem somente visual). */
export function voiceIdFor(text: string): string | null {
  return BY_TEXT.get(norm(text)) ?? null;
}

/** Returns the MP3 url for this sentence, or null (→ somente visual, sem voz). */
export function voiceFor(text: string): string | null {
  const id = voiceIdFor(text);
  return id ? (VOICE_MAP[id] ?? null) : null;
}
