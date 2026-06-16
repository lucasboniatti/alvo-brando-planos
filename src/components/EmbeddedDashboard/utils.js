export function fmtCurrency(v) {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `R$${(v / 1_000).toFixed(1)}k`
  return `R$${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function fmtCurrencyFull(v) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function fmtNumber(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}k`
  return v.toLocaleString('pt-BR')
}

export function fmtKPIValue(value, format) {
  if (format === 'currency')   return fmtCurrency(value)
  if (format === 'percent')    return `${value.toFixed(1)}%`
  if (format === 'multiplier') return `${value.toFixed(1)}×`
  if (format === 'days')       return `${value}d`
  return fmtNumber(value)
}

export function fmtDelta(delta) {
  if (delta === 0 || delta == null) return '—'
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}%`
}

export function deltaColor(delta, positiveDirection) {
  if (delta === 0 || delta == null) return '#5C636E'
  const positive = positiveDirection === 'up' ? delta > 0 : delta < 0
  return positive ? '#2ECC71' : '#FF5A5A'
}

export function getDateRange(preset) {
  const today = new Date()
  const fmt = (d) => d.toISOString().slice(0, 10)
  const to = fmt(today)
  if (preset === '7d')  { const f = new Date(today); f.setDate(f.getDate() - 6);  return { from: fmt(f), to } }
  if (preset === '30d') { const f = new Date(today); f.setDate(f.getDate() - 29); return { from: fmt(f), to } }
  if (preset === '90d') { const f = new Date(today); f.setDate(f.getDate() - 89); return { from: fmt(f), to } }
  const f = new Date(today); f.setDate(f.getDate() - 29); return { from: fmt(f), to }
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()}/${d.getMonth() + 1}`
}
