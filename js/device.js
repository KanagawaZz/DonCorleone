/*
 * device.js — Escolhe o perfil de qualidade gráfica a partir das capacidades reais do dispositivo
 * (CPU, memória, economia de dados, rede, ponteiro) e não apenas da largura da tela.
 */

/** @returns {'alto'|'medio'|'baixo'|'estatico'} */
export function detectQuality(cena3d) {
  if (!cena3d.ativar) return 'estatico';
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const smallScreen = window.innerWidth < 900;
  if (coarse && smallScreen && !cena3d.ativarNoMobile) return 'estatico';
  if (cena3d.qualidade !== 'auto') return cena3d.qualidade;

  const nav = navigator;
  const conn = nav.connection;
  if (conn?.saveData) return 'baixo';
  if (conn && /(^|-)(2g|3g)$/.test(conn.effectiveType || '')) return 'baixo';

  let penalty = 0;
  const mem = nav.deviceMemory ?? 4; // Chromium: valores 0.25–8
  const cores = nav.hardwareConcurrency ?? 4;
  if (mem <= 2) penalty += 2; else if (mem <= 4) penalty += 1;
  if (cores <= 2) penalty += 2; else if (cores <= 4) penalty += 1;
  if (coarse && smallScreen) penalty += 1;
  return penalty >= 3 ? 'baixo' : penalty >= 1 ? 'medio' : 'alto';
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
