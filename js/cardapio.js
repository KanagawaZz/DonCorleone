/*
 * cardapio.js — Lê os produtos de config.js e renderiza filtros e cards (apenas via DOM seguro, sem innerHTML).
 * Cuida de formatação de preço, links de pedido no WhatsApp, imagem ausente/quebrada e cardápio vazio.
 */
import { buildOrderUrl, hasWhatsapp, safeImagePath } from './links.js';
import { createPizzaArt } from './pizzaArt.js';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function el(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}

/** Valida e normaliza a lista do config; itens inválidos são ignorados com aviso no console. */
function normalizeProducts(list) {
  const seen = new Set();
  const out = [];
  (Array.isArray(list) ? list : []).forEach((p, i) => {
    if (!p || typeof p.id !== 'string' || !p.id.trim() || typeof p.nome !== 'string' || !p.nome.trim()) {
      console.warn(`[cardápio] Item #${i} ignorado: "id" e "nome" são obrigatórios.`, p);
      return;
    }
    if (seen.has(p.id)) {
      console.warn(`[cardápio] id duplicado "${p.id}" ignorado.`);
      return;
    }
    seen.add(p.id);
    if (p.disponivel === false) return; // desativado: não aparece e não quebra o layout
    const preco = Number(p.preco);
    if (!Number.isFinite(preco) || preco < 0) console.warn(`[cardápio] Preço inválido em "${p.id}"; será exibido como "Consulte".`);
    out.push({ ...p, preco: Number.isFinite(preco) && preco >= 0 ? preco : null });
  });
  return out;
}

function createMedia(product) {
  const media = el('div', 'card__media');
  const fallback = () => {
    media.replaceChildren(createPizzaArt(product.arte || 'margherita', product.id));
    if (badge) media.prepend(badge);
  };
  const badgeText = product.etiqueta || (product.destaque ? 'Destaque' : '');
  const badge = badgeText ? el('span', `badge${product.destaque ? ' badge--gold' : ''}`, badgeText) : null;
  const src = safeImagePath(product.imagem);
  if (src) {
    const img = document.createElement('img');
    img.alt = `Pizza ${product.nome}`;
    img.width = 800;
    img.height = 600;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', fallback, { once: true });
    img.src = src;
    media.append(img);
    if (badge) media.prepend(badge);
  } else {
    fallback();
  }
  return media;
}

function createCard(config, product, index) {
  const li = el('li', 'card is-entering');
  li.style.setProperty('--i', String(index));
  li.dataset.id = product.id;

  const body = el('div', 'card__body');
  body.append(el('p', 'card__cat', product.categoria || ''));
  body.append(el('h3', 'card__name', product.nome));
  if (product.descricao) body.append(el('p', 'card__desc', product.descricao));
  const extra = [Array.isArray(product.ingredientes) && product.ingredientes.length ? product.ingredientes.join(' · ') : '', product.info || ''].filter(Boolean).join(' — ');
  if (extra) body.append(el('p', 'card__extra', extra));

  const foot = el('div', 'card__foot');
  foot.append(el('span', 'card__price', product.preco == null ? 'Consulte' : brl.format(product.preco)));
  const btn = el('a', 'btn btn--gold btn--sm', config.identidade.cardapio.botaoPedir);
  const url = buildOrderUrl(config, product);
  if (url) {
    btn.href = url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', `${config.identidade.cardapio.botaoPedir} ${product.nome} pelo WhatsApp (abre em nova aba)`);
  } else {
    btn.setAttribute('aria-disabled', 'true');
    btn.setAttribute('role', 'link');
    btn.title = config.identidade.final.semWhatsapp;
  }
  foot.append(btn);
  body.append(foot);

  li.append(createMedia(product), body);
  return li;
}

/** Monta o cardápio. Retorna { destroy } para remover listeners. */
export function initCardapio(config) {
  const grid = document.getElementById('menu-grid');
  const filters = document.getElementById('menu-filters');
  const empty = document.getElementById('menu-empty');
  const status = document.getElementById('menu-status');
  if (!grid || !filters || !empty) throw new Error('Pontos de montagem do cardápio não encontrados no HTML.');

  const texts = config.identidade.cardapio;
  const products = normalizeProducts(config.cardapio);
  const ordered = [...(config.categorias || [])];
  products.forEach((p) => { if (p.categoria && !ordered.includes(p.categoria)) ordered.push(p.categoria); });
  const categories = ordered.filter((c) => products.some((p) => p.categoria === c));

  let active = texts.todas;

  function render() {
    const visible = active === texts.todas ? products : products.filter((p) => p.categoria === active);
    grid.replaceChildren(...visible.map((p, i) => createCard(config, p, i)));
    empty.hidden = visible.length > 0;
    empty.textContent = visible.length ? '' : texts.vazio;
    if (status) status.textContent = `${visible.length} ${visible.length === 1 ? 'pizza' : 'pizzas'} em ${active}.`;
    filters.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === active)));
    document.dispatchEvent(new CustomEvent('doncorleone:menu-rendered')); // scroll.js recalcula os gatilhos
  }

  function onClick(e) {
    const chip = e.target.closest('.chip');
    if (!chip || chip.dataset.cat === active) return;
    active = chip.dataset.cat;
    render();
  }

  const chips = [texts.todas, ...categories].map((cat) => {
    const b = el('button', 'chip', cat);
    b.type = 'button';
    b.dataset.cat = cat;
    b.setAttribute('aria-pressed', 'false');
    return b;
  });
  filters.replaceChildren(...(categories.length > 1 ? chips : []));
  filters.hidden = categories.length <= 1;
  filters.addEventListener('click', onClick);

  render();
  if (!hasWhatsapp(config)) console.warn('[cardápio] Número de WhatsApp ausente/inválido: botões de pedido desativados.');

  return { destroy: () => filters.removeEventListener('click', onClick) };
}
