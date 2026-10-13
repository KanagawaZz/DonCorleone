/**
 * Gerador de Códigos Curtos de Pedidos - Don Corleone
 * 
 * Formato padronizado: DC-DDMM-XXX
 * Exemplo: DC-1310-74K
 * 
 * Utiliza charset sem caracteres ambíguos (sem 0/O, sem 1/I/L)
 * para evitar erros de leitura da atendente no WhatsApp ou pelo motoboy.
 */

const CHARSET_SEGURO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/**
 * Gera um código legível e único para o pedido.
 * 
 * @param {Date} [data=new Date()]
 * @param {string} [fuso='America/Cuiaba']
 * @returns {string} Código no formato DC-DDMM-XXX
 */
export function gerarCodigoPedido(data = new Date(), fuso = 'America/Cuiaba') {
  // Obter dia e mês com 2 dígitos no fuso horário da cantina
  let dia = String(data.getDate()).padStart(2, '0');
  let mes = String(data.getMonth() + 1).padStart(2, '0');

  try {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
      timeZone: fuso,
      day: '2-digit',
      month: '2-digit'
    });
    const partes = formatador.formatToParts(data);
    const diaParte = partes.find(p => p.type === 'day')?.value;
    const mesParte = partes.find(p => p.type === 'month')?.value;
    if (diaParte && mesParte) {
      dia = diaParte;
      mes = mesParte;
    }
  } catch (e) {
    // Fallback silencioso usando data do sistema
  }

  // 3 caracteres aleatórios alfanuméricos sem ambiguidade
  let randomico = '';
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * CHARSET_SEGURO.length);
    randomico += CHARSET_SEGURO[idx];
  }

  return `DC-${dia}${mes}-${randomico}`;
}
