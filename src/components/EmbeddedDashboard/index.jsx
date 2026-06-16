import { useState, useMemo } from 'react'
import {
  ComposedChart, Bar, BarChart as ReBarChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  fmtKPIValue, fmtDelta, deltaColor,
  fmtCurrency, fmtCurrencyFull, fmtNumber,
  getDateRange, formatDate,
} from './utils.js'
import {
  computeKPIs, computeTrends, computeDistribution,
  ghlFunnel, ghlLostReasons,
} from './mock.js'

// ─── Mock de rankings (inline, portado do dash-2) ─────────────────────────────
const SOURCES = [
  { id: 'src1', name: 'Meta Ads',   leads: 1308, won: 81, lost: 312, open: 915, appointments: 334, attended: 260, noShow: 74, spend: 45000, cpl: 34.40, cac: 555.56, revenue: 648000 },
  { id: 'src2', name: 'Google Ads', leads: 436,  won: 33, lost: 98,  open: 305, appointments: 110, attended: 84,  noShow: 26, spend: 12000, cpl: 27.52, cac: 363.64, revenue: 264000 },
  { id: 'src3', name: 'Orgânico',   leads: 218,  won: 14, lost: 52,  open: 152, appointments: 48,  attended: 38,  noShow: 10, spend: 0,     cpl: 0,     cac: null,   revenue: 112000 },
  { id: 'src4', name: 'Indicação',  leads: 218,  won: 18, lost: 38,  open: 162, appointments: 62,  attended: 52,  noShow: 10, spend: 0,     cpl: 0,     cac: null,   revenue: 144000 },
]
const SELLERS = [
  { id: 'sel1', name: 'Lucas Ferreira',  leads: 420, won: 38, lost: 124, open: 258, appointments: 112, attended: 72,  noShow: 24, revenue: 190000, cac: 321.05 },
  { id: 'sel2', name: 'Ana Paula Costa', leads: 386, won: 44, lost: 108, open: 234, appointments: 104, attended: 64,  noShow: 22, revenue: 220000, cac: 281.82 },
  { id: 'sel3', name: 'Rafael Mendes',   leads: 348, won: 31, lost: 98,  open: 219, appointments: 88,  attended: 54,  noShow: 20, revenue: 155000, cac: 348.39 },
  { id: 'sel4', name: 'Juliana Alves',   leads: 312, won: 27, lost: 92,  open: 193, appointments: 76,  attended: 46,  noShow: 18, revenue: 135000, cac: 370.37 },
  { id: 'sel5', name: 'Bruno Oliveira',  leads: 278, won: 22, lost: 86,  open: 170, appointments: 64,  attended: 38,  noShow: 16, revenue: 110000, cac: 409.09 },
]
const CAMPAIGNS = [
  { id: 'c1', name: 'Captação — Topo de Funil',     active: true,  channel: 'meta',   leads: 820, won: 48, lost: 142, appointments: 186, attended: 142, noShow: 44, spend: 18500, cpl: 22.56, cac: 385 },
  { id: 'c2', name: 'Remarketing — Fundo de Funil', active: true,  channel: 'meta',   leads: 640, won: 62, lost: 98,  appointments: 148, attended: 118, noShow: 30, spend: 16200, cpl: 25.31, cac: 261 },
  { id: 'c3', name: 'Lookalike — Escala',           active: false, channel: 'meta',   leads: 380, won: 0,  lost: 0,   appointments: 0,   attended: 0,   noShow: 0,  spend: 10300, cpl: 27.10, cac: null },
  { id: 'gc1', name: 'Search — Marca',              active: true,  channel: 'google', leads: 98,  won: 12, lost: 18,  appointments: 28,  attended: 22,  noShow: 6,  spend: 2840,  cpl: 28.98, cac: 237 },
  { id: 'gc2', name: 'Search — Concorrentes',       active: true,  channel: 'google', leads: 82,  won: 9,  lost: 14,  appointments: 22,  attended: 16,  noShow: 6,  spend: 2620,  cpl: 31.95, cac: 291 },
]
const CREATIVES = [
  { id: 'ad1', name: 'ADS 01 - VSL 3min Problema/Solução', active: true,  leads: 298, won: 14, lost: 42, appointments: 68, attended: 52, noShow: 16, spend: 6240, cpl: 20.94, cac: 446 },
  { id: 'ad2', name: 'ADS 02 - Depoimento João Silva',      active: true,  leads: 245, won: 11, lost: 38, appointments: 56, attended: 42, noShow: 14, spend: 5180, cpl: 21.14, cac: 471 },
  { id: 'ad3', name: 'ADS 03 - Carrossel 5 Resultados',     active: false, leads: 218, won: 0,  lost: 0,  appointments: 0,  attended: 0,  noShow: 0,  spend: 4920, cpl: 22.57, cac: null },
  { id: 'ad4', name: 'ADS 04 - Imagem Estática Oferta',     active: true,  leads: 204, won: 9,  lost: 32, appointments: 44, attended: 34, noShow: 10, spend: 4680, cpl: 22.94, cac: 520 },
  { id: 'ad5', name: 'ADS 05 - VSL 90s Urgência',           active: false, leads: 185, won: 0,  lost: 0,  appointments: 0,  attended: 0,  noShow: 0,  spend: 4320, cpl: 23.35, cac: null },
  { id: 'ad6', name: 'ADS 06 - Reels Bastidores',           active: true,  leads: 162, won: 7,  lost: 28, appointments: 38, attended: 28, noShow: 10, spend: 3840, cpl: 23.70, cac: 549 },
  { id: 'ad7', name: 'ADS 07 - Depoimento Maria Costa',     active: true,  leads: 148, won: 6,  lost: 26, appointments: 34, attended: 26, noShow: 8,  spend: 3620, cpl: 24.46, cac: 603 },
]

// ─── Tokens ────────────────────────────────────────────────────────────────────
const T = {
  bg:        '#080B10',
  surface:   '#111520',
  surface2:  '#181D2B',
  border:    '#232C42',
  primary:   '#F2F4F7',
  secondary: '#9BA3AF',
  muted:     '#5C636E',
  accent:    '#9B32F1',
  accent2:   '#C278FF',
  pos:       '#2ECC71',
  neg:       '#FF5A5A',
}

// ─── Fix: remover borda dos SVGs do recharts ──────────────────────────────────
const GLOBAL_SVG_FIX = `
  .dash-embed svg, .dash-embed svg * { outline: none !important; }
  .dash-embed .recharts-wrapper { border: none !important; outline: none !important; }
  .dash-embed ::-webkit-scrollbar { width: 4px; height: 4px; }
  .dash-embed ::-webkit-scrollbar-track { background: transparent; }
  .dash-embed ::-webkit-scrollbar-thumb { background: #232C42; border-radius: 4px; }
`

// ─── Primitivos ────────────────────────────────────────────────────────────────
function Card({ children, style, accent }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${accent ? T.accent : T.border}`,
      borderRadius: 12,
      padding: 14,
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardLabel({ children }) {
  return <p style={{ fontSize: 13, color: T.secondary, marginBottom: 14 }}>{children}</p>
}

function Section({ title, children, action }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 10, borderBottom: `1px solid ${T.border}`,
      }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function Grid({ cols, gap, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: gap ?? 16 }}>
      {children}
    </div>
  )
}

// ─── FilterBar ─────────────────────────────────────────────────────────────────
const PRESETS  = [{ id: '7d', label: '7d' }, { id: '30d', label: '30d' }, { id: '90d', label: '90d' }]
const CHANNELS = [{ id: 'all', label: 'Todos' }, { id: 'meta', label: 'Meta' }, { id: 'google', label: 'Google' }]

function PillGroup({ items, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: T.surface2, borderRadius: 8, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onChange(item.id)} style={{
          padding: '6px 14px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          background: value === item.id ? T.accent : 'transparent',
          color: value === item.id ? 'white' : T.secondary,
          transition: 'background 0.15s, color 0.15s',
        }}>
          {item.label}
        </button>
      ))}
    </div>
  )
}

function FilterBar({ preset, setPreset, channel, setChannel }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      padding: '10px 16px', borderBottom: `1px solid ${T.border}`,
      background: T.surface, flexWrap: 'wrap', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PillGroup items={PRESETS}  value={preset}  onChange={setPreset}  />
        <div style={{ width: 1, height: 20, background: T.border }} />
        <PillGroup items={CHANNELS} value={channel} onChange={setChannel} />
      </div>
    </div>
  )
}

// ─── KPI Cards ─────────────────────────────────────────────────────────────────
function KPICard({ metric }) {
  const color = deltaColor(metric.delta, metric.positiveDirection)
  return (
    <Card>
      <p style={{ fontSize: 11, color: T.secondary, marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{metric.label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: T.primary, fontVariantNumeric: 'tabular-nums', marginBottom: 6, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {fmtKPIValue(metric.value, metric.format)}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
        <span style={{ fontWeight: 600, color, flexShrink: 0 }}>{fmtDelta(metric.delta)}</span>
        <span style={{ color: T.muted }}>vs anterior</span>
      </div>
    </Card>
  )
}

// ─── Trend Charts ──────────────────────────────────────────────────────────────
function TrendChartInvestLeads({ investment, leads }) {
  const data = investment.map((pt, i) => ({ date: formatDate(pt.date), index: i, Investimento: pt.value, Leads: leads[i]?.value ?? 0 }))
  const step = data.length > 60 ? 14 : data.length > 30 ? 7 : 1
  return (
    <ResponsiveContainer width="100%" height={140}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.4} vertical={false} />
        <XAxis xAxisId="bar"  dataKey="date"  tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} interval={step - 1} />
        <XAxis xAxisId="line" dataKey="index" type="number" domain={[0, data.length - 1]} hide />
        <YAxis yAxisId="invest" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} width={46} />
        <YAxis yAxisId="leads" orientation="right" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
        <Tooltip contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11, color: T.secondary }} iconSize={8} />
        <Line xAxisId="line" yAxisId="invest" type="monotone" dataKey="Investimento" stroke={T.pos}    strokeWidth={2} dot={false} activeDot={{ r: 3 }} connectNulls />
        <Bar   xAxisId="bar"  yAxisId="leads"  dataKey="Leads" fill={T.accent} radius={[2,2,0,0]} opacity={0.75} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function TrendChartRevenue({ revenue }) {
  const data = revenue.map(pt => ({ label: formatDate(pt.date), value: pt.value }))
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={T.accent} stopOpacity={0.3} />
            <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} interval={data.length > 30 ? 6 : 0} />
        <YAxis tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} width={46} />
        <Tooltip contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} formatter={v => [fmtCurrencyFull(v), 'Receita']} />
        <Area type="monotone" dataKey="value" stroke={T.accent} strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 3, fill: T.accent }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Bar Chart (Dual Axis) — igual ao dash-2 ──────────────────────────────────
function DualBarChart({ data, label1, label2 }) {
  const chartData = data.map(d => ({ label: d.label, impressions: d.impressions, leads: d.leads }))
  return (
    <ResponsiveContainer width="100%" height={160}>
      <ReBarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="20%" barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left"  tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={38} />
        <YAxis yAxisId="right" tick={{ fill: T.muted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={30} orientation="right" />
        <Tooltip contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(155,50,241,0.06)' }} />
        <Bar yAxisId="left"  dataKey="impressions" name={label1 || 'Impressões'} fill={T.pos}    radius={[2,2,0,0]} maxBarSize={18} />
        <Bar yAxisId="right" dataKey="leads"        name={label2 || 'Leads'}      fill={T.accent} radius={[2,2,0,0]} maxBarSize={18} />
      </ReBarChart>
    </ResponsiveContainer>
  )
}

// ─── Funil ─────────────────────────────────────────────────────────────────────
function FunnelSection({ funnel, lostReasons }) {
  const [disabled, setDisabled] = useState(new Set())
  const toggle = (id) => setDisabled(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const stages = funnel.stages
  const active = stages.filter(s => !disabled.has(s.id))
  const maxCount = active.length > 0 ? Math.max(...active.map(s => s.count)) : 1
  const convAfter = new Map()
  for (let i = 0; i < active.length - 1; i++) {
    convAfter.set(active[i].id, active[i].count > 0 ? (active[i+1].count / active[i].count) * 100 : 0)
  }
  const activeIds = active.map(s => s.id)
  const reasons = lostReasons
    .map(r => ({ ...r, count: activeIds.reduce((s, id) => s + (r.byStage[id]?.count ?? 0), 0), valueLost: activeIds.reduce((s, id) => s + (r.byStage[id]?.valueLost ?? 0), 0) }))
    .filter(r => r.count > 0).sort((a, b) => b.count - a.count)

  return (
    <Section title="Funil de Vendas">
      <Grid cols={2} gap={16}>
        <Card>
          <CardLabel>Estágios do Funil</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stages.map((stage, i) => {
              const isOff = disabled.has(stage.id)
              const w = isOff ? 0 : (stage.count / maxCount) * 100
              const isLast = stage.id === stages[stages.length - 1].id && active[active.length - 1]?.id === stage.id
              const prev = active[active.findIndex(a => a.id === stage.id) - 1]
              const rate = prev ? convAfter.get(prev.id) : undefined
              return (
                <div key={stage.id} onClick={() => toggle(stage.id)} style={{ cursor: 'pointer', opacity: isOff ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: isOff ? T.surface2 : T.accent, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: isOff ? T.muted : 'white' }}>{stage.position}</span>
                    <span style={{ fontSize: 12, color: T.secondary, flex: 1 }}>{stage.name}</span>
                    {rate !== undefined && <span style={{ fontSize: 11, fontWeight: 600, color: T.muted }}>{rate.toFixed(1)}%</span>}
                  </div>
                  <div style={{ height: 30, background: T.surface2, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '100%', borderRadius: 6, width: `${w}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, opacity: 1 - i * 0.1, transition: 'width 0.4s ease' }} />
                    {!isOff && w > 0 && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10, gap: 10, pointerEvents: 'none' }}>
                        {stage.value > 0 && <span style={{ fontSize: 11, color: isLast ? T.pos : T.muted, fontWeight: isLast ? 600 : 400, whiteSpace: 'nowrap' }}>{fmtCurrency(stage.value)}</span>}
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>{fmtNumber(stage.count)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
        <Card>
          <CardLabel>Oportunidades Perdidas por Motivo</CardLabel>
          {reasons.slice(0, 7).map((row, i) => (
            <div key={row.reason} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 6 ? `1px solid ${T.border}` : 'none', opacity: 1 - i * 0.06 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: T.muted, width: 16, flexShrink: 0 }}>{i+1}</span>
                <span style={{ fontSize: 12, color: T.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.reason}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: T.secondary }}>{fmtNumber(row.count)}</span>
                {row.valueLost > 0 && <span style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', color: T.neg, minWidth: 68, textAlign: 'right' }}>{fmtCurrency(row.valueLost)}</span>}
              </div>
            </div>
          ))}
        </Card>
      </Grid>
    </Section>
  )
}

// ─── Donut Chart ────────────────────────────────────────────────────────────────
const DONUT_COLORS_STATUS = ['#9B32F1', '#FF5A5A', '#2ECC71']
const DONUT_COLORS_SOURCE = ['#9B32F1', '#C278FF', '#2ECC71', '#F5A623']

function DonutChart({ data, colors, centerLabel, fmtVal }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
        <PieChart width={100} height={100}>
          <Pie data={data} cx={50} cy={50} innerRadius={32} outerRadius={48} paddingAngle={2} dataKey="value" stroke="none"
            onMouseEnter={(_, i) => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} opacity={hovered === null || hovered === i ? 1 : 0.35} />)}
          </Pie>
        </PieChart>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.primary, fontVariantNumeric: 'tabular-nums' }}>
            {hovered !== null ? (fmtVal ? fmtVal(data[hovered].value) : fmtNumber(data[hovered].value)) : centerLabel}
          </span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {data.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0', opacity: hovered === null || hovered === i ? 1 : 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: T.secondary }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.primary, fontVariantNumeric: 'tabular-nums' }}>{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Distribution Section ──────────────────────────────────────────────────────
function DistributionSection({ dist }) {
  return (
    <Section title="Distribuição">
      <Grid cols={3} gap={16}>
        <Card>
          <CardLabel>Leads por Status</CardLabel>
          <DonutChart data={dist.leadsByStatus} colors={DONUT_COLORS_STATUS} centerLabel={fmtNumber(dist.leadsByStatus.reduce((s,i) => s + i.value, 0))} />
        </Card>
        <Card>
          <CardLabel>Vendas por Fonte</CardLabel>
          <DonutChart data={dist.bySource.map(d => ({ label: d.source, value: d.sales, percent: d.percent }))} colors={DONUT_COLORS_SOURCE} centerLabel={fmtNumber(dist.bySource.reduce((s,i) => s + i.sales, 0))} fmtVal={fmtNumber} />
        </Card>
        <Card>
          <CardLabel>Receita por Fonte</CardLabel>
          <DonutChart data={dist.bySource.map(d => ({ label: d.source, value: d.revenue, percent: d.percent }))} colors={DONUT_COLORS_SOURCE} centerLabel={fmtCurrency(dist.bySource.reduce((s,i) => s + i.revenue, 0))} fmtVal={fmtCurrency} />
        </Card>
      </Grid>
      <Grid cols={3} gap={16}>
        <Card>
          <CardLabel>Leads por Idade</CardLabel>
          <DualBarChart data={dist.byAge} />
        </Card>
        <Card>
          <CardLabel>Leads por Gênero</CardLabel>
          <DualBarChart data={dist.byGender} />
        </Card>
        <Card>
          <CardLabel>Leads por Dispositivo</CardLabel>
          <DualBarChart data={dist.byDevice} />
        </Card>
      </Grid>
    </Section>
  )
}

// ─── Rankings ──────────────────────────────────────────────────────────────────
const META_ICON = <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const GOOGLE_ICON = <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>

const RANK_MODES = [
  { id: 'fonte',    label: 'Fonte' },
  { id: 'campanha', label: 'Campanha' },
  { id: 'criativo', label: 'Criativo' },
  { id: 'vendedor', label: 'Vendedor' },
]

const RANK_METRICS = [
  { id: 'leads',        label: 'Leads' },
  { id: 'won',          label: 'Vendas' },
  { id: 'appointments', label: 'Reuniões' },
  { id: 'attended',     label: 'Realizadas' },
]

function RankingBar({ rank, icon, name, active: isActive, value, maxValue, color, meta }) {
  const w = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, width: 16, flexShrink: 0, textAlign: 'right' }}>{rank}</span>
      <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 6, flexShrink: 0, background: T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.secondary }}>
        {icon}
        {isActive !== undefined && (
          <span style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, borderRadius: '50%', background: isActive ? T.pos : T.neg }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, color: T.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '72%' }}>{name}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.primary, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{fmtNumber(value)}</span>
        </div>
        <div style={{ height: 5, background: T.surface2, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }} />
        </div>
        {meta && (
          <div style={{ display: 'flex', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
            {meta.map(m => <span key={m.label} style={{ fontSize: 10, color: T.muted }}>{m.label}: {m.value}</span>)}
          </div>
        )}
      </div>
    </div>
  )
}

function sourceIcon(name) {
  const n = name.toLowerCase()
  if (n.includes('meta') || n.includes('facebook')) return META_ICON
  if (n.includes('google')) return GOOGLE_ICON
  if (n.includes('orgânico')) return <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
  return <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
}

function RankingCard({ title, rows, metricKey, color, getIcon, getName, getActive, getMeta }) {
  const sorted = [...rows].sort((a, b) => (b[metricKey] ?? 0) - (a[metricKey] ?? 0))
  const max = sorted.length > 0 ? (sorted[0][metricKey] ?? 0) : 1
  return (
    <Card>
      <CardLabel>{title}</CardLabel>
      <div style={{ maxHeight: 360, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${T.border} transparent` }}>
        {sorted.map((row, i) => (
          <RankingBar key={row.id || row.name} rank={i+1} icon={getIcon(row)} name={getName(row)} active={getActive ? getActive(row) : undefined}
            value={row[metricKey] ?? 0} maxValue={max} color={color}
            meta={getMeta ? getMeta(row) : null} />
        ))}
      </div>
    </Card>
  )
}

function RankingsSection() {
  const [mode, setMode] = useState('fonte')
  const [metric, setMetric] = useState('leads')

  const color = metric === 'won' ? T.pos : metric === 'appointments' || metric === 'attended' ? T.accent2 : T.accent

  const rows = mode === 'fonte' ? SOURCES : mode === 'campanha' ? CAMPAIGNS : mode === 'criativo' ? CREATIVES : SELLERS
  const getIcon = (r) => mode === 'fonte' ? sourceIcon(r.name) : mode === 'campanha' ? (r.channel === 'google' ? GOOGLE_ICON : META_ICON) : mode === 'criativo' ? <span style={{ fontSize: 10, fontWeight: 700, color: T.accent }}>AD</span> : <span style={{ fontSize: 10, fontWeight: 700 }}>{(r.name || '').split(' ').map(n => n[0]).slice(0,2).join('')}</span>
  const getName = (r) => r.name
  const getActive = (r) => r.active
  const getMeta = (r) => {
    const m = []
    if (r.spend > 0) m.push({ label: 'Invest.', value: fmtCurrency(r.spend) })
    if (r.cpl > 0)   m.push({ label: 'CPL',     value: fmtCurrency(r.cpl) })
    if (r.cac)        m.push({ label: 'CAC',     value: fmtCurrency(r.cac) })
    return m.length ? m : null
  }

  const titles = { leads: 'Leads', won: 'Vendas', appointments: 'Reuniões Agendadas', attended: 'Reuniões Realizadas' }
  const modeLabel = { fonte: 'por Fonte', campanha: 'por Campanha', criativo: 'por Criativo', vendedor: 'por Vendedor' }

  return (
    <Section title={
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {RANK_MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: mode === m.id ? 600 : 400, background: mode === m.id ? T.accent : T.surface2, color: mode === m.id ? '#fff' : T.muted, transition: 'all 0.15s' }}>{m.label}</button>
        ))}
      </div>
    } action={
      <div style={{ display: 'flex', gap: 4 }}>
        {RANK_METRICS.map(m => (
          <button key={m.id} onClick={() => setMetric(m.id)} style={{ padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: metric === m.id ? 600 : 400, background: metric === m.id ? T.surface2 : 'transparent', color: metric === m.id ? T.primary : T.muted, transition: 'all 0.15s' }}>{m.label}</button>
        ))}
      </div>
    }>
      <Grid cols={1} gap={16}>
        <RankingCard
          title={`${titles[metric]} ${modeLabel[mode]}`}
          rows={rows}
          metricKey={metric}
          color={color}
          getIcon={getIcon}
          getName={getName}
          getActive={getActive}
          getMeta={getMeta}
        />
      </Grid>
    </Section>
  )
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function EmbeddedDashboard() {
  const [preset,  setPreset]  = useState('30d')
  const [channel, setChannel] = useState('all')

  const { from, to } = useMemo(() => getDateRange(preset), [preset])
  const kpis   = useMemo(() => computeKPIs(from, to, channel),   [from, to, channel])
  const trends = useMemo(() => computeTrends(from, to, channel), [from, to, channel])
  const dist   = useMemo(() => computeDistribution(), [])

  return (
    <div className="dash-embed" style={{ background: T.bg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.5)', fontFamily: 'Inter, system-ui, sans-serif', color: T.primary }}>
      <style>{GLOBAL_SVG_FIX}</style>

      <FilterBar preset={preset} setPreset={setPreset} channel={channel} setChannel={setChannel} />

      <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 20, scrollbarWidth: 'thin', scrollbarColor: `${T.border} transparent` }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 10 }}>
          {Object.values(kpis).map(m => <KPICard key={m.label} metric={m} />)}
        </div>

        {/* Tendência */}
        <Section title="Tendência">
          <Grid cols={2} gap={16}>
            <Card><CardLabel>Investimento × Leads</CardLabel><TrendChartInvestLeads investment={trends.investment} leads={trends.leads} /></Card>
            <Card><CardLabel>Receita no Tempo</CardLabel><TrendChartRevenue revenue={trends.revenue} /></Card>
          </Grid>
        </Section>

        {/* Funil */}
        <FunnelSection funnel={ghlFunnel} lostReasons={ghlLostReasons} />

        {/* Distribuição */}
        <DistributionSection dist={dist} />

        {/* Rankings */}
        <RankingsSection />
      </div>
    </div>
  )
}
