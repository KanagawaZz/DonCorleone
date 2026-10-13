/**
 * Utilitário para cálculo de horário de funcionamento no fuso America/Cuiaba (UTC-4)
 * 
 * Regra: Segunda a Domingo, das 17:00 às 23:00
 * Horário de corte da cozinha: 22:30 (configurável em site.config.js)
 * 
 * A função é pura e aceita um objeto Date opcional para facilitar testes e revalidações.
 */

export function obterStatusFuncionamento(dataReferencia = new Date(), configHorario = {}) {
  const fuso = configHorario.fusoHorario ?? 'America/Cuiaba';
  
  // Grade padrão oficial caso não venha no config
  const diasGrade = configHorario.dias || [
    { dia: 0, nome: "Domingo", abertura: "17:30", fechamento: "23:15" },
    { dia: 1, nome: "Segunda-feira", abertura: "17:30", fechamento: "23:00" },
    { dia: 2, nome: "Terça-feira", abertura: "17:30", fechamento: "23:00" },
    { dia: 3, nome: "Quarta-feira", abertura: "17:30", fechamento: "23:00" },
    { dia: 4, nome: "Quinta-feira", abertura: "17:30", fechamento: "23:00" },
    { dia: 5, nome: "Sexta-feira", abertura: "17:30", fechamento: "23:15" },
    { dia: 6, nome: "Sábado", abertura: "17:30", fechamento: "23:30" }
  ];

  // Obter dia da semana, hora e minuto atual no fuso de Cuiabá
  let diaSemana = 0;
  let horaAtual = 0;
  let minutoAtual = 0;

  try {
    const formatador = new Intl.DateTimeFormat('en-US', {
      timeZone: fuso,
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });

    const partes = formatador.formatToParts(dataReferencia);
    const mapa = {};
    for (const p of partes) {
      mapa[p.type] = p.value;
    }

    const mapaDias = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    diaSemana = mapaDias[mapa.weekday] ?? dataReferencia.getDay();
    horaAtual = parseInt(mapa.hour, 10) || 0;
    minutoAtual = parseInt(mapa.minute, 10) || 0;
  } catch (e) {
    diaSemana = dataReferencia.getDay();
    horaAtual = dataReferencia.getHours();
    minutoAtual = dataReferencia.getMinutes();
  }

  // Configuração do dia atual
  const configDiaAtual = diasGrade.find(d => d.dia === diaSemana) || diasGrade[0];
  
  // Parse de abertura e fechamento
  const [horaAb, minAb] = (configDiaAtual.abertura || "17:30").split(':').map(n => parseInt(n, 10));
  const [horaFech, minFech] = (configDiaAtual.fechamento || "23:00").split(':').map(n => parseInt(n, 10));

  const minutosTotais = horaAtual * 60 + minutoAtual;
  const minutosAbertura = horaAb * 60 + minAb;
  const minutosFechamento = horaFech * 60 + minFech;

  let estaAberto = false;
  let motivoFechamento = null;
  let statusTexto = '';

  if (minutosTotais < minutosAbertura) {
    estaAberto = false;
    motivoFechamento = 'antes_abertura';
    statusTexto = `Fechado agora · abrimos hoje às ${configDiaAtual.abertura.replace(':', 'h')}`;
  } else if (minutosTotais >= minutosFechamento) {
    estaAberto = false;
    motivoFechamento = 'apos_fechamento';
    const proximoDia = diasGrade.find(d => d.dia === (diaSemana + 1) % 7) || diasGrade[0];
    statusTexto = `Fechado agora · abrimos amanhã às ${proximoDia.abertura.replace(':', 'h')}`;
  } else {
    estaAberto = true;
    motivoFechamento = null;
    statusTexto = `Aberto agora · atendimento até ${configDiaAtual.fechamento.replace(':', 'h')}`;
  }

  return {
    estaAberto,
    podeFazerPedido: estaAberto,
    motivoFechamento,
    diaSemana,
    nomeDia: configDiaAtual.nome,
    horaAtual,
    minutoAtual,
    horarioAberturaStr: configDiaAtual.abertura,
    horarioFechamentoStr: configDiaAtual.fechamento,
    statusTexto,
    classeStatus: estaAberto ? 'status--aberto' : 'status--fechado'
  };
}
