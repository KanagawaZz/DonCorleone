/**
 * Utilitário para detecção de capacidades do dispositivo e preferências de acessibilidade
 */

export function prefereMovimentoReduzido() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
