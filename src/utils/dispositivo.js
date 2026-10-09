/**
 * Utilitário para detecção de capacidades do dispositivo e preferências de acessibilidade
 */

export function detectarDispositivoFraco() {
  if (typeof window === 'undefined') return false;

  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  // @ts-ignore
  const deviceMemory = navigator.deviceMemory || 4;

  const ehFraco = hardwareConcurrency < 4 || deviceMemory < 4;
  return ehFraco;
}

export function prefereMovimentoReduzido() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
