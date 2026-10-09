/**
 * Utilitário para cálculo de horário de funcionamento no fuso America/Cuiaba (UTC-4)
 * 
 * Regra: Segunda a Domingo, das 17:00 às 23:00
 * A função é pura e aceita um objeto Date opcional para facilitar testes automatizados.
 */

export function obterStatusFuncionamento(dataReferencia = new Date(), configHorario = {}) {
  const horaAbertura = configHorario.horaAbertura ?? 17;
  const horaFechamento = configHorario.horaFechamento ?? 23;
  const fuso = configHorario.fusoHorario ?? 'America/Cuiaba';

  // Obter hora e minuto no fuso de Cuiabá
  const formatador = new Intl.DateTimeFormat('pt-BR', {
    timeZone: fuso,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const partes = formatador.formatToParts(dataReferencia);
  const mapa = {};
  for (const p of partes) {
    mapa[p.type] = parseInt(p.value, 10);
  }

  const horaAtual = mapa.hour ?? 0;
  const minutoAtual = mapa.minute ?? 0;
  const minutosTotais = horaAtual * 60 + minutoAtual;

  const minutosAbertura = horaAbertura * 60;
  const minutosFechamento = horaFechamento * 60;

  // Aberto entre 17:00 e 22:59:59 (até antes das 23:00)
  const estaAberto = minutosTotais >= minutosAbertura && minutosTotais < minutosFechamento;

  let statusTexto = "";
  if (estaAberto) {
    statusTexto = configHorario.textoAberto || `Aberto agora · recebe pedidos até ${horaFechamento}h`;
  } else {
    if (minutosTotais < minutosAbertura) {
      statusTexto = configHorario.textoFechadoHoje || `Fechado agora · abrimos hoje às ${horaAbertura}h`;
    } else {
      statusTexto = configHorario.textoFechadoAmanha || `Fechado agora · abrimos às ${horaAbertura}h`;
    }
  }

  return {
    estaAberto,
    horaAtual,
    minutoAtual,
    statusTexto,
    classeStatus: estaAberto ? 'status--aberto' : 'status--fechado'
  };
}
