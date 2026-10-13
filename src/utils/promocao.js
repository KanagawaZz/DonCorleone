/**
 * Utilitário de Promoções e Descontos Configuráveis - Don Corleone
 * 
 * Permite ao dono da pizzaria criar campanhas pontuais (ex: Dia dos Namorados,
 * Terça da Pizza) sem alterar código de lógica.
 */

/**
 * Converte um objeto Date para string YYYY-MM-DD no fuso especificado.
 * 
 * @param {Date} date 
 * @param {string} fuso 
 * @returns {string}
 */
export function formatarDataParaComparacao(date = new Date(), fuso = 'America/Cuiaba') {
  try {
    const formatador = new Intl.DateTimeFormat('en-CA', {
      timeZone: fuso,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatador.format(date); // Retorna no padrão 'YYYY-MM-DD'
  } catch (e) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}

/**
 * Verifica se a promoção configurada está ativa e dentro do período vigente.
 * 
 * @param {object} configPromocao 
 * @param {Date} [dataReferencia=new Date()] 
 * @param {string} [fuso='America/Cuiaba'] 
 * @returns {{
 *   ativa: boolean,
 *   titulo: string,
 *   texto: string,
 *   cupom: string,
 *   descontoPercentual: number,
 *   calcularDesconto: (subtotal: number) => number
 * }}
 */
export function obterPromocaoAtiva(configPromocao = {}, dataReferencia = new Date(), fuso = 'America/Cuiaba') {
  if (!configPromocao || !configPromocao.ativa) {
    return {
      ativa: false,
      titulo: '',
      texto: '',
      cupom: '',
      descontoPercentual: 0,
      calcularDesconto: () => 0
    };
  }

  const hoje = formatarDataParaComparacao(dataReferencia, fuso);
  const inicio = configPromocao.inicio || '1970-01-01';
  const fim = configPromocao.fim || '2099-12-31';

  const dentroDoPeriodo = hoje >= inicio && hoje <= fim;

  if (!dentroDoPeriodo) {
    return {
      ativa: false,
      titulo: '',
      texto: '',
      cupom: '',
      descontoPercentual: 0,
      calcularDesconto: () => 0
    };
  }

  const perc = Math.max(0, Math.min(100, Number(configPromocao.descontoPercentual) || 0));

  return {
    ativa: true,
    titulo: configPromocao.titulo || 'Promoção Especial',
    texto: configPromocao.texto || '',
    cupom: configPromocao.cupom || '',
    descontoPercentual: perc,
    calcularDesconto: (subtotal = 0) => {
      if (perc <= 0 || subtotal <= 0) return 0;
      // Arredondamento monetário preciso em centavos
      return Math.round((subtotal * perc) / 100 * 100) / 100;
    }
  };
}
