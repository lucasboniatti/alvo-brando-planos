// Dados mock portados do dash-2

function generateSeries(days, base, variance, peakWeek = 8) {
  const result = []
  const end = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(d.getDate() - i)
    const week = Math.floor((days - 1 - i) / 7)
    const trend = 1 + (week / 13) * 0.4
    const peakFactor = week === peakWeek ? 1.35 : week === 10 ? 0.75 : 1
    const noise = 1 + (Math.sin(i * 2.3) * variance)
    result.push({ date: d.toISOString().slice(0, 10), value: Math.round(base * trend * peakFactor * noise) })
  }
  return result
}

function generateGhlSeries(days, base, variance, peakWeek = 8) {
  const result = []
  const end = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(d.getDate() - i)
    const week = Math.floor((days - 1 - i) / 7)
    const trend = 1 + (week / 13) * 0.35
    const peakFactor = week === peakWeek ? 1.4 : week === 10 ? 0.7 : 1
    const noise = 1 + (Math.sin(i * 1.9 + 0.5) * variance)
    result.push({ date: d.toISOString().slice(0, 10), value: Math.round(base * trend * peakFactor * noise) })
  }
  return result
}

function generateGoogleSeries(days, base, variance) {
  const result = []
  const end = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(d.getDate() - i)
    const trend = 1 + ((days - 1 - i) / days) * 0.3
    const noise = 1 + (Math.cos(i * 1.7) * variance)
    result.push({ date: d.toISOString().slice(0, 10), value: Math.round(base * trend * noise) })
  }
  return result
}

export const metaInvestmentSeries = generateSeries(90, 500, 0.15)
export const metaLeadsSeries = generateSeries(90, 20, 0.2)
export const metaCplSeries = metaInvestmentSeries.map((pt, i) => ({
  date: pt.date,
  value: parseFloat((pt.value / (metaLeadsSeries[i].value || 1)).toFixed(2)),
}))

export const googleInvestmentSeries = generateGoogleSeries(90, 133, 0.12)
export const googleLeadsSeries = generateGoogleSeries(90, 4, 0.18)

export const ghlRevenueSeries = generateGhlSeries(90, 7700, 0.18).map(pt => {
  const sales = Math.max(1, Math.round(pt.value / 5000 * 0.9))
  return { ...pt, sales, avgTicket: Math.round(pt.value / sales) }
})

export const ghlFunnel = {
  pipelineId: 'p1',
  pipelineName: 'Funil Principal',
  stages: [
    { id: 's1', name: 'Novos Leads',  position: 1, count: 2180, value: 0,         conversionToNext: 72.5 },
    { id: 's2', name: 'Qualificação', position: 2, count: 1580, value: 0,         conversionToNext: 58.2 },
    { id: 's3', name: 'Apresentação', position: 3, count: 920,  value: 1317840,   conversionToNext: 42.4 },
    { id: 's4', name: 'Negociação',   position: 4, count: 390,  value: 558870,    conversionToNext: 22.3 },
    { id: 's5', name: 'Fechamento',   position: 5, count: 87,   value: 124680,    conversionToNext: 52.9 },
    { id: 's6', name: 'Vendas',       position: 6, count: 46,   value: 697200,    conversionToNext: null },
  ],
}

export const ghlLostReasons = [
  { reason: 'Não tem dinheiro',        count: 104, valueLost: 1105920, byStage: { s1: { count: 0,   valueLost: 0 }, s2: { count: 0,  valueLost: 0 }, s3: { count: 38, valueLost: 404400 }, s4: { count: 42, valueLost: 446880 }, s5: { count: 24, valueLost: 254640 } } },
  { reason: 'Não tem interesse',       count: 82,  valueLost: 833520,  byStage: { s1: { count: 0,   valueLost: 0 }, s2: { count: 48, valueLost: 0 }, s3: { count: 34, valueLost: 345840 }, s4: { count: 0,  valueLost: 0 },       s5: { count: 0,  valueLost: 0      } } },
  { reason: 'Não está no momento',     count: 61,  valueLost: 657480,  byStage: { s1: { count: 0,   valueLost: 0 }, s2: { count: 22, valueLost: 0 }, s3: { count: 18, valueLost: 194040 }, s4: { count: 14, valueLost: 150920 }, s5: { count: 7,  valueLost: 75460  } } },
  { reason: 'Fora do raio de atuação', count: 38,  valueLost: 489140,  byStage: { s1: { count: 0,   valueLost: 0 }, s2: { count: 28, valueLost: 0 }, s3: { count: 10, valueLost: 128780 }, s4: { count: 0,  valueLost: 0 },       s5: { count: 0,  valueLost: 0      } } },
  { reason: 'Vitória do concorrente',  count: 24,  valueLost: 304720,  byStage: { s1: { count: 0,   valueLost: 0 }, s2: { count: 0,  valueLost: 0 }, s3: { count: 6,  valueLost: 76180  }, s4: { count: 12, valueLost: 152360 }, s5: { count: 6,  valueLost: 76180  } } },
  { reason: 'Falta de contato',        count: 138, valueLost: 192480,  byStage: { s1: { count: 62,  valueLost: 0 }, s2: { count: 38, valueLost: 0 }, s3: { count: 24, valueLost: 54720  }, s4: { count: 14, valueLost: 51120  }, s5: { count: 0,  valueLost: 0      } } },
  { reason: 'Sem contato com decisor', count: 36,  valueLost: 294840,  byStage: { s1: { count: 0,   valueLost: 0 }, s2: { count: 0,  valueLost: 0 }, s3: { count: 14, valueLost: 114660 }, s4: { count: 22, valueLost: 180180 }, s5: { count: 0,  valueLost: 0      } } },
  { reason: 'Não entendeu o anúncio',  count: 63,  valueLost: 0,       byStage: { s1: { count: 0,   valueLost: 0 }, s2: { count: 48, valueLost: 0 }, s3: { count: 15, valueLost: 0      }, s4: { count: 0,  valueLost: 0 },       s5: { count: 0,  valueLost: 0      } } },
]

export const ghlPipeline = {
  totalPipelineValue: 3121290,
  won: 87, lost: 458, open: 1635,
  wonValue: 697200, lostValue: 3669170, openValue: 13093650,
  avgTicket: 8014, avgSalesCycle: 18,
}

export const metaByAge = [
  { label: '18–24', impressions: 142000, leads: 312 },
  { label: '25–34', impressions: 318000, leads: 840 },
  { label: '35–44', impressions: 284000, leads: 620 },
  { label: '45–54', impressions: 142000, leads: 240 },
  { label: '55+',   impressions: 68000,  leads: 128 },
]

export const metaByGender = [
  { label: 'Masc.',       impressions: 498000, leads: 1240 },
  { label: 'Fem.',        impressions: 456000, leads: 1680 },
  { label: 'N/I',         impressions: 42000,  leads: 98 },
]

export const metaByDevice = [
  { label: 'Mobile',  impressions: 712000, leads: 1520 },
  { label: 'Desktop', impressions: 214000, leads: 282 },
  { label: 'Tablet',  impressions: 28000,  leads: 38 },
]

export const ghlRevenueBySource = [
  { source: 'Meta Ads',   revenue: 418320, percent: 60, sales: 131 },
  { source: 'Google Ads', revenue: 139440, percent: 20, sales: 40  },
  { source: 'Orgânico',   revenue: 69720,  percent: 10, sales: 21  },
  { source: 'Indicação',  revenue: 69720,  percent: 10, sales: 18  },
]

export const crossKPIs = { roas: 12.18, roasDelta: 8.4, cac: 655, cacDelta: -12.3 }

const metaTotalLeads = 2180
const metaTotalImpressions = 954000
const googleTotalLeads = 380
const googleTotalImpressions = 669600

export function filterSeries(series, from, to) {
  return series.filter(pt => pt.date >= from && pt.date <= to)
}

export function sumSeries(series) {
  return series.reduce((acc, pt) => acc + pt.value, 0)
}

export function computeKPIs(from, to, channel) {
  const metaInv  = sumSeries(filterSeries(metaInvestmentSeries, from, to))
  const googleInv = sumSeries(filterSeries(googleInvestmentSeries, from, to))
  const metaLeads = sumSeries(filterSeries(metaLeadsSeries, from, to))
  const googleLeads = sumSeries(filterSeries(googleLeadsSeries, from, to))

  const totalInvest  = channel === 'meta' ? metaInv : channel === 'google' ? googleInv : metaInv + googleInv
  const totalLeads   = channel === 'meta' ? metaLeads : channel === 'google' ? googleLeads : metaLeads + googleLeads
  const totalImpr    = channel === 'meta' ? metaTotalImpressions : channel === 'google' ? googleTotalImpressions : metaTotalImpressions + googleTotalImpressions
  const totalLeadsSt = channel === 'meta' ? metaTotalLeads : channel === 'google' ? googleTotalLeads : metaTotalLeads + googleTotalLeads

  const cpl = totalLeads > 0 ? totalInvest / totalLeads : 0
  const pipeline = ghlPipeline
  const totalOpps = pipeline.won + pipeline.lost + pipeline.open
  const leadToSale = totalOpps > 0 ? (pipeline.won / totalOpps) * 100 : 0

  return {
    investment:          { label: 'Investimento',      value: totalInvest,              format: 'currency',    delta: 8.3,              positiveDirection: 'up' },
    impressions:         { label: 'Impressões',        value: totalImpr,                format: 'number',      delta: 5.1,              positiveDirection: 'up' },
    leads:               { label: 'Leads',             value: totalLeadsSt,             format: 'number',      delta: 14.7,             positiveDirection: 'up' },
    cpl:                 { label: 'CPL',               value: cpl,                      format: 'currency',    delta: -18.2,            positiveDirection: 'down' },
    pipelineValue:       { label: 'Pipeline',          value: pipeline.totalPipelineValue, format: 'currency', delta: 0,                positiveDirection: 'up' },
    sales:               { label: 'Vendas',            value: pipeline.won,             format: 'number',      delta: 0,                positiveDirection: 'up' },
    revenue:             { label: 'Receita',           value: pipeline.wonValue,        format: 'currency',    delta: 0,                positiveDirection: 'up' },
    avgTicket:           { label: 'Ticket Médio',      value: pipeline.avgTicket,       format: 'currency',    delta: 0,                positiveDirection: 'up' },
    leadToSaleConversion:{ label: 'Taxa de Conversão', value: leadToSale,               format: 'percent',     delta: 0,                positiveDirection: 'up' },
    cac:                 { label: 'CAC',               value: crossKPIs.cac,            format: 'currency',    delta: crossKPIs.cacDelta, positiveDirection: 'down' },
    avgSalesCycle:       { label: 'Ciclo de Vendas',   value: pipeline.avgSalesCycle,   format: 'days',        delta: 0,                positiveDirection: 'down' },
    roas:                { label: 'ROAS',              value: crossKPIs.roas,           format: 'multiplier',  delta: crossKPIs.roasDelta, positiveDirection: 'up' },
  }
}

export function computeTrends(from, to, channel) {
  const metaInv = filterSeries(metaInvestmentSeries, from, to)
  const googleInv = filterSeries(googleInvestmentSeries, from, to)
  const metaL = filterSeries(metaLeadsSeries, from, to)
  const googleL = filterSeries(googleLeadsSeries, from, to)

  const investment = channel === 'meta' ? metaInv
    : channel === 'google' ? googleInv
    : metaInv.map((pt, i) => ({ date: pt.date, value: pt.value + (googleInv[i]?.value ?? 0) }))

  const leads = channel === 'meta' ? metaL
    : channel === 'google' ? googleL
    : metaL.map((pt, i) => ({ date: pt.date, value: pt.value + (googleL[i]?.value ?? 0) }))

  return {
    investment,
    leads,
    revenue: filterSeries(ghlRevenueSeries, from, to),
  }
}

export function computeDistribution() {
  const pipeline = ghlPipeline
  const totalLeads = pipeline.won + pipeline.lost + pipeline.open
  const totalValue = pipeline.wonValue + pipeline.lostValue + pipeline.openValue

  return {
    leadsBySource: [
      { source: 'Meta Ads',   leads: 1308, percent: 60 },
      { source: 'Google Ads', leads: 436,  percent: 20 },
      { source: 'Orgânico',   leads: 218,  percent: 10 },
      { source: 'Indicação',  leads: 218,  percent: 10 },
    ],
    byAge: metaByAge,
    byGender: metaByGender,
    byDevice: metaByDevice,
    bySource: ghlRevenueBySource,
    leadsByStatus: [
      { label: 'Abertos',  value: pipeline.open, percent: Math.round(pipeline.open / totalLeads * 100),  color: '#9B32F1' },
      { label: 'Perdidos', value: pipeline.lost,  percent: Math.round(pipeline.lost  / totalLeads * 100), color: '#FF5A5A' },
      { label: 'Ganhos',   value: pipeline.won,   percent: Math.round(pipeline.won   / totalLeads * 100), color: '#2ECC71' },
    ],
    valueByStatus: [
      { label: 'Abertos',  value: pipeline.openValue, percent: Math.round(pipeline.openValue / totalValue * 100), color: '#9B32F1' },
      { label: 'Perdidos', value: pipeline.lostValue,  percent: Math.round(pipeline.lostValue  / totalValue * 100), color: '#FF5A5A' },
      { label: 'Ganhos',   value: pipeline.wonValue,   percent: Math.round(pipeline.wonValue   / totalValue * 100), color: '#2ECC71' },
    ],
  }
}
