/*
 * content.js — Aplica os textos e dados de config.js no HTML (data-cfg, passos, história, contato, redes)
 * e configura todos os CTAs de pedido do WhatsApp. Usa textContent/DOM; nunca innerHTML.
 */
import { buildOrderUrl, hasWhatsapp, safeExternalUrl, safeImagePath } from './links.js';

const el = (tag, className, text) => {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
};
const $ = (id) => document.getElementById(id);
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

export function applyContent(config) {
  // Textos simples
  document.querySelectorAll('[data-cfg]').forEach((node) => {
    const value = get(config, node.dataset.cfg);
    if (typeof value === 'string') node.textContent = value;
    else console.warn(`[config] Caminho "${node.dataset.cfg}" não encontrado em config.js.`);
  });

  // Logo da marca
  document.querySelectorAll('[data-brand-logo]').forEach((img) => { img.alt = ''; });

  // Passos da pizza em camadas
  const steps = $('stage-steps');
  steps.replaceChildren(...config.identidade.etapas.passos.map((p) => {
    const li = el('li');
    li.append(el('h3', '', p.titulo), el('p', '', p.texto));
    return li;
  }));

  // História
  $('story-text').replaceChildren(...config.identidade.historia.paragrafos.map((t) => el('p', '', t)));
  $('story-facts').replaceChildren(...config.identidade.historia.destaques.map((d) => {
    const li = el('li');
    li.append(el('strong', '', d.valor), el('span', '', d.rotulo));
    return li;
  }));
  const photo = safeImagePath(config.identidade.imagens.historia);
  const storyImg = $('story-img');
  if (photo) {
    storyImg.addEventListener('load', () => { storyImg.hidden = false; $('story-frame').classList.add('has-photo'); }, { once: true });
    storyImg.addEventListener('error', () => { storyImg.remove(); }, { once: true });
    storyImg.alt = 'Preparo artesanal de pizza na DonCorleone';
    storyImg.src = photo;
  } else {
    storyImg.remove();
  }

  // Contato
  const c = config.contato;
  const address = $('info-address');
  address.textContent = c.endereco;
  const map = safeExternalUrl(c.linkMapa);
  if (map) {
    const a = el('a', 'info-link', ' Ver no mapa');
    a.href = map; a.target = '_blank'; a.rel = 'noopener noreferrer';
    address.append(' —', a);
  }
  $('info-hours').replaceChildren(...c.horarios.map((h) => {
    const row = el('div');
    row.append(el('dt', '', h.dia), el('dd', '', h.horas));
    return row;
  }));
  const social = (c.redes || []).map((r) => ({ nome: r.nome, url: safeExternalUrl(r.url) })).filter((r) => r.url && r.nome);
  $('social-title').hidden = social.length === 0;
  $('info-social').replaceChildren(...social.map((r) => {
    const li = el('li');
    const a = el('a', '', r.nome);
    a.href = r.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', `${r.nome} (abre em nova aba)`);
    li.append(a);
    return li;
  }));
  $('info-extras').replaceChildren(...(c.informacoesExtras || []).map((t) => el('li', '', t)));

  // CTAs de WhatsApp (nav, hero, flutuante, final)
  const orderUrl = buildOrderUrl(config);
  const enabled = hasWhatsapp(config);
  document.querySelectorAll('[data-order]').forEach((a) => {
    if (enabled) {
      a.href = orderUrl; a.target = '_blank'; a.rel = 'noopener noreferrer';
      if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', `${a.textContent.trim()} pelo WhatsApp (abre em nova aba)`);
    } else {
      a.removeAttribute('href'); a.setAttribute('role', 'link'); a.setAttribute('aria-disabled', 'true'); a.tabIndex = -1;
    }
  });
  const off = $('order-off');
  off.hidden = enabled;
  off.textContent = enabled ? '' : config.identidade.final.semWhatsapp;
  $('fab').hidden = !enabled;
}
