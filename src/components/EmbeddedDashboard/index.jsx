import { useState, useMemo, useRef, useEffect } from 'react'
import {
  ComposedChart, Bar, Line, BarChart as ReBarChart, AreaChart, Area,
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

// ─── Mock de rankings ──────────────────────────────────────────────────────────
const SOURCES = [
  { id: 'src1', name: 'Meta Ads',   leads: 1308, won: 81, lost: 312, spend: 45000, cpl: 34.40, cac: 555.56 },
  { id: 'src2', name: 'Google Ads', leads: 436,  won: 33, lost: 98,  spend: 12000, cpl: 27.52, cac: 363.64 },
  { id: 'src3', name: 'Orgânico',   leads: 218,  won: 14, lost: 52,  spend: 0,     cpl: 0,     cac: null   },
  { id: 'src4', name: 'Indicação',  leads: 218,  won: 18, lost: 38,  spend: 0,     cpl: 0,     cac: null   },
]
const SELLERS = [
  { id: 'sel1', name: 'Lucas Ferreira',  leads: 420, won: 38, lost: 124, cac: 321.05 },
  { id: 'sel2', name: 'Ana Paula Costa', leads: 386, won: 44, lost: 108, cac: 281.82 },
  { id: 'sel3', name: 'Rafael Mendes',   leads: 348, won: 31, lost: 98,  cac: 348.39 },
  { id: 'sel4', name: 'Juliana Alves',   leads: 312, won: 27, lost: 92,  cac: 370.37 },
  { id: 'sel5', name: 'Bruno Oliveira',  leads: 278, won: 22, lost: 86,  cac: 409.09 },
]
const CAMPAIGNS = [
  { id: 'c1',  name: 'Captação — Topo de Funil',     active: true,  channel: 'meta',   leads: 820, won: 48, lost: 142, spend: 18500, cpl: 22.56, cac: 385  },
  { id: 'c2',  name: 'Remarketing — Fundo de Funil', active: true,  channel: 'meta',   leads: 640, won: 62, lost: 98,  spend: 16200, cpl: 25.31, cac: 261  },
  { id: 'c3',  name: 'Lookalike — Escala',           active: false, channel: 'meta',   leads: 380, won: 0,  lost: 0,   spend: 10300, cpl: 27.10, cac: null },
  { id: 'gc1', name: 'Search — Marca',               active: true,  channel: 'google', leads: 98,  won: 12, lost: 18,  spend: 2840,  cpl: 28.98, cac: 237  },
  { id: 'gc2', name: 'Search — Concorrentes',        active: true,  channel: 'google', leads: 82,  won: 9,  lost: 14,  spend: 2620,  cpl: 31.95, cac: 291  },
]
const CONJUNTOS = [
  { id: 'cj1', name: 'Interesses — Energia Solar',  active: true,  channel: 'meta',   leads: 340, won: 22, lost: 68,  spend: 7800,  cpl: 22.94, cac: 354  },
  { id: 'cj2', name: 'Lookalike 1% — Clientes',     active: true,  channel: 'meta',   leads: 280, won: 18, lost: 52,  spend: 6400,  cpl: 22.86, cac: 355  },
  { id: 'cj3', name: 'Remarketing — Visitantes 30d',active: false, channel: 'meta',   leads: 200, won: 0,  lost: 0,   spend: 4100,  cpl: 20.50, cac: null },
]
const CREATIVES = [
  { id: 'ad1', name: 'ADS 01 - VSL 3min Problema/Solução', active: true,  leads: 298, won: 14, lost: 42, spend: 6240, cpl: 20.94, cac: 446 },
  { id: 'ad2', name: 'ADS 02 - Depoimento João Silva',      active: true,  leads: 245, won: 11, lost: 38, spend: 5180, cpl: 21.14, cac: 471 },
  { id: 'ad3', name: 'ADS 03 - Carrossel 5 Resultados',     active: false, leads: 218, won: 0,  lost: 0,  spend: 4920, cpl: 22.57, cac: null },
  { id: 'ad4', name: 'ADS 04 - Imagem Estática Oferta',     active: true,  leads: 204, won: 9,  lost: 32, spend: 4680, cpl: 22.94, cac: 520 },
  { id: 'ad5', name: 'ADS 05 - VSL 90s Urgência',           active: false, leads: 185, won: 0,  lost: 0,  spend: 4320, cpl: 23.35, cac: null },
]
const PESQUISAS = [
  { id: 'kw1', keyword: 'energia solar residencial',    active: true,  leads: 42, won: 8,  lost: 12, cost: 1240, cpc: 29.52, cac: 155 },
  { id: 'kw2', keyword: 'instalação painel solar',      active: true,  leads: 28, won: 5,  lost: 8,  cost: 820,  cpc: 29.29, cac: 164 },
  { id: 'kw3', keyword: 'financiamento energia solar',  active: true,  leads: 18, won: 3,  lost: 6,  cost: 540,  cpc: 30.00, cac: 180 },
  { id: 'kw4', keyword: 'solar fotovoltaico preço',     active: false, leads: 12, won: 0,  lost: 0,  cost: 360,  cpc: 30.00, cac: null },
]
const OBJETIVOS = [
  { id: 'obj1', name: 'WhatsApp — Geração de Lead',     leads: 820, won: 48, lost: 142, spend: 18500, cpl: 22.56, cac: 385  },
  { id: 'obj2', name: 'Formulário — Lead Ads',          leads: 488, won: 33, lost: 98,  spend: 13200, cpl: 27.05, cac: 400  },
  { id: 'obj3', name: 'Landing Page — Conversão',       leads: 380, won: 0,  lost: 0,   spend: 10300, cpl: 27.10, cac: null },
  { id: 'obj4', name: 'Direto — Instagram DM',          leads: 98,  won: 12, lost: 18,  spend: 2840,  cpl: 28.98, cac: 237  },
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

const GLOBAL_SVG_FIX = `
  .dash-embed svg, .dash-embed svg * { outline: none !important; }
  .dash-embed .recharts-wrapper { border: none !important; outline: none !important; }
  .dash-embed ::-webkit-scrollbar { width: 4px; height: 4px; }
  .dash-embed ::-webkit-scrollbar-track { background: transparent; }
  .dash-embed ::-webkit-scrollbar-thumb { background: #232C42; border-radius: 4px; }
  .dash-embed .rdp { --rdp-accent-color: #9B32F1; --rdp-background-color: rgba(155,50,241,0.15); font-size: 12px; }
  .dash-embed .rdp-day_button { width: 30px; height: 30px; font-size: 11px; }
`

// ─── Primitivos ────────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14, ...style }}>
      {children}
    </div>
  )
}

function CardLabel({ children }) {
  return <p style={{ fontSize: 12, color: T.secondary, marginBottom: 10 }}>{children}</p>
}

function Section({ title, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
        {typeof title === 'string'
          ? <h3 style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{title}</h3>
          : title}
      </div>
      {children}
    </section>
  )
}

function Grid3({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>{children}</div>
}

// ─── DateRangePicker (portado do dashboard real) ───────────────────────────────
function localISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
function addDays(date, n) { return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n) }
function startOfWeek(date) { const d = new Date(date); d.setDate(d.getDate() - d.getDay()); return d }
function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1) }
function endOfMonth(date)   { return new Date(date.getFullYear(), date.getMonth() + 1, 0) }
function startOfQuarter(date) { const q = Math.floor(date.getMonth() / 3); return new Date(date.getFullYear(), q * 3, 1) }
function endOfQuarter(date)   { const q = Math.floor(date.getMonth() / 3); return new Date(date.getFullYear(), q * 3 + 3, 0) }
function startOfYear(date)  { return new Date(date.getFullYear(), 0, 1) }
function endOfYear(date)    { return new Date(date.getFullYear(), 11, 31) }

const PRESETS_COL1 = [
  { key: 'today', label: 'Hoje',             getRange: () => { const t = localISO(new Date()); return { from: t, to: t } } },
  { key: 'yest',  label: 'Ontem',            getRange: () => { const d = localISO(addDays(new Date(), -1)); return { from: d, to: d } } },
  { key: 'l7',    label: 'Últimos 7 dias',   getRange: () => ({ from: localISO(addDays(new Date(), -6)),   to: localISO(new Date()) }) },
  { key: 'l15',   label: 'Últimos 15 dias',  getRange: () => ({ from: localISO(addDays(new Date(), -14)),  to: localISO(new Date()) }) },
  { key: 'l30',   label: 'Últimos 30 dias',  getRange: () => ({ from: localISO(addDays(new Date(), -29)),  to: localISO(new Date()) }) },
  { key: 'l90',   label: 'Últimos 90 dias',  getRange: () => ({ from: localISO(addDays(new Date(), -89)),  to: localISO(new Date()) }) },
  { key: 'l180',  label: 'Últimos 180 dias', getRange: () => ({ from: localISO(addDays(new Date(), -179)), to: localISO(new Date()) }) },
  { key: 'l360',  label: 'Últimos 360 dias', getRange: () => ({ from: localISO(addDays(new Date(), -359)), to: localISO(new Date()) }) },
  { key: 'all',   label: 'Todo período',     getRange: () => ({ from: '2000-01-01', to: localISO(new Date()) }) },
]
const PRESETS_COL2 = [
  { key: 'tw',     label: 'Essa semana',       getRange: () => ({ from: localISO(startOfWeek(new Date())), to: localISO(new Date()) }) },
  { key: 'lw',     label: 'Semana passada',    getRange: () => ({ from: localISO(startOfWeek(addDays(new Date(), -7))), to: localISO(addDays(startOfWeek(new Date()), -1)) }) },
  { key: 'tm',     label: 'Esse mês',          getRange: () => ({ from: localISO(startOfMonth(new Date())), to: localISO(new Date()) }) },
  { key: 'lm',     label: 'Mês passado',       getRange: () => { const f = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1); return { from: localISO(f), to: localISO(endOfMonth(f)) } } },
  { key: 'tq',     label: 'Esse trimestre',    getRange: () => ({ from: localISO(startOfQuarter(new Date())), to: localISO(new Date()) }) },
  { key: 'lq',     label: 'Trimestre passado', getRange: () => { const f = startOfQuarter(new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1)); return { from: localISO(f), to: localISO(endOfQuarter(f)) } } },
  { key: 'ty',     label: 'Esse ano',          getRange: () => ({ from: localISO(startOfYear(new Date())), to: localISO(new Date()) }) },
  { key: 'ly',     label: 'Ano passado',       getRange: () => { const f = new Date(new Date().getFullYear() - 1, 0, 1); return { from: localISO(f), to: localISO(endOfYear(f)) } } },
  { key: 'custom', label: 'Personalizado',     getRange: () => ({ from: '', to: '' }) },
]
const ALL_PRESETS = [...PRESETS_COL1, ...PRESETS_COL2.filter(p => p.key !== 'custom')]

const DAYS_PT = ['D','S','T','Q','Q','S','S']

function MiniCalendar({ month, onMonthChange, from, to, pendingFrom, pendingTo, onSelect }) {
  const year  = month.getFullYear()
  const mIdx  = month.getMonth()
  const first = new Date(year, mIdx, 1).getDay()
  const days  = new Date(year, mIdx + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, mIdx, d))

  const selFrom = pendingFrom ?? from
  const selTo   = pendingTo   ?? (pendingFrom ? null : to)

  function isoOf(d) { return localISO(d) }
  function inRange(d) {
    if (!selFrom || !selTo || !d) return false
    return isoOf(d) > selFrom && isoOf(d) < selTo
  }
  function isFrom(d) { return d && isoOf(d) === selFrom }
  function isTo(d)   { return d && isoOf(d) === selTo }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, textAlign: 'center' }}>
        {DAYS_PT.map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: T.muted, padding: '2px 0', fontWeight: 600 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const active = isFrom(d) || isTo(d)
          const range  = inRange(d)
          return (
            <div key={i} onClick={() => d && onSelect(isoOf(d))}
              style={{
                height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, borderRadius: 4, cursor: d ? 'pointer' : 'default',
                background: active ? T.accent : range ? 'rgba(155,50,241,0.18)' : 'transparent',
                color: active ? '#fff' : d ? T.primary : 'transparent',
                fontWeight: active ? 700 : 400,
              }}>
              {d ? d.getDate() : ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatDateInput(val) {
  const digits = val.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0,2)}/${digits.slice(2)}`
  return `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`
}
function parseDateInput(val) {
  const parts = val.replace(/\D/g, '')
  if (parts.length < 6) return null
  const d = parseInt(parts.slice(0, 2))
  const m = parseInt(parts.slice(2, 4))
  let y = parseInt(parts.slice(4))
  if (y < 100) y += 2000
  if (d < 1 || d > 31 || m < 1 || m > 12) return null
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}
function fmtDateLabel(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y.slice(2)}`
}

function DateRangePicker({ from, to, onChange }) {
  const [open, setOpen]         = useState(false)
  const [calMonth, setCalMonth] = useState(new Date())
  const [pendingFrom, setPFrom] = useState(null)
  const [pendingTo, setPTo]     = useState(null)
  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput]     = useState('')
  const [customActive, setCustomActive] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  const activePreset = ALL_PRESETS.find(p => { const r = p.getRange(); return r.from === from && r.to === to }) ?? null
  const isCustomMode = activePreset === null

  function openPopover() {
    if (isCustomMode) {
      const pFrom = from
      const pTo   = to
      setPFrom(pFrom)
      setPTo(pTo)
      setFromInput(fmtDateLabel(pFrom))
      setToInput(fmtDateLabel(pTo))
      setCustomActive(true)
    } else {
      setPFrom(null); setPTo(null)
      setFromInput(''); setToInput('')
      setCustomActive(false)
    }
    setOpen(o => !o)
  }

  function applyPreset(p) {
    if (p.key === 'custom') { setPFrom(null); setPTo(null); setFromInput(''); setToInput(''); setCustomActive(true); return }
    const r = p.getRange()
    onChange(r.from, r.to)
    setCustomActive(false)
    setOpen(false)
  }

  function handleDayClick(iso) {
    setCustomActive(true)
    if (!pendingFrom || (pendingFrom && pendingTo)) {
      setPFrom(iso); setPTo(null)
      setFromInput(fmtDateLabel(iso)); setToInput('')
    } else {
      if (iso < pendingFrom) { setPFrom(iso); setPTo(pendingFrom); setFromInput(fmtDateLabel(iso)); setToInput(fmtDateLabel(pendingFrom)) }
      else { setPTo(iso); setToInput(fmtDateLabel(iso)) }
    }
  }

  function handleFromInput(val) {
    const fmt = formatDateInput(val)
    setFromInput(fmt)
    setCustomActive(true)
    const date = parseDateInput(fmt)
    if (date) { setCalMonth(date); setPFrom(localISO(date)) }
  }

  function handleToInput(val) {
    const fmt = formatDateInput(val)
    setToInput(fmt)
    setCustomActive(true)
    const date = parseDateInput(fmt)
    if (date) setPTo(localISO(date))
  }

  function applyCustom() {
    if (pendingFrom && pendingTo) {
      onChange(pendingFrom, pendingTo)
      setOpen(false)
    }
  }

  function fmtLabel(f, t) {
    if (!f || !t) return '—'
    const fmt = s => { const [y, m, d] = s.split('-'); return `${d}/${m}` }
    return `${fmt(f)} – ${fmt(t)}`
  }

  const btnLabel = activePreset ? activePreset.label : (isCustomMode ? fmtLabel(from, to) : 'Personalizado')

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={openPopover} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 10px', borderRadius: 8,
        border: `1px solid ${T.border}`, background: T.surface2,
        color: T.secondary, fontSize: 11, cursor: 'pointer',
      }}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.6 }}>
          <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>{btnLabel}</span>
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 200,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'inline-flex', overflow: 'hidden',
        }}>
          {/* Painel esquerdo — 2 colunas de presets */}
          <div style={{ borderRight: `1px solid ${T.border}`, padding: '16px 12px 12px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: 4 }}>Filtro Rápido</span>
            <div style={{ height: 1, background: T.border, margin: '0 -4px' }} />
            <div style={{ display: 'flex', gap: 0 }}>
              {[PRESETS_COL1, PRESETS_COL2].map((col, ci) => (
                <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {col.map((p, idx) => {
                    const isLast = idx === col.length - 1
                    const isActive = p.key === 'custom'
                      ? (isCustomMode || customActive)
                      : (!customActive && activePreset?.key === p.key)
                    return (
                      <div key={p.key}>
                        {isLast && <div style={{ height: 1, background: T.border, margin: '4px 4px' }} />}
                        <button onClick={() => applyPreset(p)} style={{
                          textAlign: 'left', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                          background: isActive ? `rgba(155,50,241,0.15)` : 'transparent',
                          color: isActive ? T.accent : T.secondary,
                          fontWeight: isActive ? 600 : 400,
                          transition: 'background 120ms, color 120ms',
                        }}>
                          {p.label}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Painel direito — inputs + calendário */}
          <div style={{ padding: '16px 12px 12px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Inputs De / Até */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {[{ val: fromInput, fn: handleFromInput, ph: 'dd/mm/aa' }, { val: toInput, fn: handleToInput, ph: 'dd/mm/aa' }].map((inp, i) => (
                <input key={i} type="text" placeholder={inp.ph} value={inp.val}
                  onChange={e => inp.fn(e.target.value)} maxLength={8}
                  style={{
                    padding: '6px 10px', border: `1px solid ${T.border}`, borderRadius: 8,
                    fontSize: 12, color: T.primary, background: T.surface2,
                    outline: 'none', flex: 1, width: 0,
                  }} />
              ))}
            </div>

            {/* Header calendário: ‹ ano › | ‹ mês › */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
              <button onClick={() => setCalMonth(m => new Date(m.getFullYear() - 1, m.getMonth(), 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 13, padding: '2px 4px', borderRadius: 4, lineHeight: 1 }}>‹</button>
              <span style={{ fontSize: 12, color: T.muted, minWidth: 32, textAlign: 'center' }}>{calMonth.getFullYear()}</span>
              <button onClick={() => setCalMonth(m => new Date(m.getFullYear() + 1, m.getMonth(), 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 13, padding: '2px 4px', borderRadius: 4, lineHeight: 1 }}>›</button>
              <span style={{ color: T.border, margin: '0 2px' }}>|</span>
              <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.accent, fontSize: 13, padding: '2px 4px', borderRadius: 4, lineHeight: 1 }}>‹</button>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.primary, minWidth: 72, textAlign: 'center', textTransform: 'capitalize' }}>
                {calMonth.toLocaleDateString('pt-BR', { month: 'long' })}
              </span>
              <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.accent, fontSize: 13, padding: '2px 4px', borderRadius: 4, lineHeight: 1 }}>›</button>
            </div>

            <MiniCalendar month={calMonth} onMonthChange={setCalMonth}
              from={from} to={to} pendingFrom={pendingFrom} pendingTo={pendingTo}
              onSelect={handleDayClick} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
              <button onClick={() => setOpen(false)} style={{ padding: '4px 10px', fontSize: 11, background: 'transparent', border: 'none', cursor: 'pointer', color: T.secondary }}>
                Cancelar
              </button>
              <button onClick={applyCustom} disabled={!pendingFrom || !pendingTo} style={{
                padding: '6px 20px', fontSize: 11, fontWeight: 600, borderRadius: 6, border: 'none', cursor: pendingFrom && pendingTo ? 'pointer' : 'not-allowed',
                background: pendingFrom && pendingTo ? T.accent : T.surface2,
                color: pendingFrom && pendingTo ? '#fff' : T.muted,
              }}>
                Aplicar período
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── FilterBar ─────────────────────────────────────────────────────────────────
const CHANNELS = [{ id: 'all', label: 'Todos' }, { id: 'meta', label: 'Meta' }, { id: 'google', label: 'Google' }]

function FilterBar({ from, to, onDateChange, channel, setChannel }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px', borderBottom: `1px solid ${T.border}`,
      background: T.surface, gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: T.primary, letterSpacing: '-0.01em' }}>Dashboard</span>
        <span style={{ fontSize: 11, color: T.muted }}>Marketing &amp; Vendas</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <DateRangePicker from={from} to={to} onChange={onDateChange} />
        <div style={{ width: 1, height: 18, background: T.border }} />
        <div style={{ display: 'flex', background: T.surface2, borderRadius: 8, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
          {CHANNELS.map(ch => (
            <button key={ch.id} onClick={() => setChannel(ch.id)} style={{
              padding: '5px 12px', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              background: channel === ch.id ? T.accent : 'transparent',
              color: channel === ch.id ? 'white' : T.secondary,
            }}>
              {ch.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── KPI Cards ─────────────────────────────────────────────────────────────────
function KPICard({ metric }) {
  const color = deltaColor(metric.delta, metric.positiveDirection)
  return (
    <Card>
      <p style={{ fontSize: 10, color: T.secondary, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{metric.label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: T.primary, fontVariantNumeric: 'tabular-nums', marginBottom: 4, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {fmtKPIValue(metric.value, metric.format)}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
        <span style={{ fontWeight: 600, color, flexShrink: 0 }}>{fmtDelta(metric.delta)}</span>
        <span style={{ color: T.muted }}>vs anterior</span>
      </div>
    </Card>
  )
}

// ─── Trend Charts ──────────────────────────────────────────────────────────────
function TrendChartInvestLeads({ investment, leads }) {
  const data = investment.map((pt, i) => ({ date: formatDate(pt.date), Investimento: pt.value, Leads: leads[i]?.value ?? 0 }))
  const step = data.length > 60 ? 14 : data.length > 30 ? 7 : 1
  return (
    <ResponsiveContainer width="100%" height={185}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="date" tick={{ fill: T.muted, fontSize: 9 }} tickLine={false} axisLine={false} interval={step - 1} />
        <YAxis yAxisId="invest" tick={{ fill: T.muted, fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} width={44} />
        <YAxis yAxisId="leads" orientation="right" tick={{ fill: T.muted, fontSize: 9 }} tickLine={false} axisLine={false} width={24} />
        <Tooltip contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11 }} />
        <Legend wrapperStyle={{ fontSize: 10, color: T.secondary }} iconSize={7} />
        <Bar   yAxisId="leads"  dataKey="Leads"        fill={T.accent} radius={[2,2,0,0]} opacity={0.75} />
        <Line  yAxisId="invest" dataKey="Investimento" type="monotone" stroke={T.pos} strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function TrendChartRevenue({ revenue }) {
  const data = revenue.map(pt => ({ label: formatDate(pt.date), value: pt.value }))
  return (
    <ResponsiveContainer width="100%" height={185}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={T.accent} stopOpacity={0.3} />
            <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: T.muted, fontSize: 9 }} tickLine={false} axisLine={false} interval={data.length > 30 ? 6 : 0} />
        <YAxis tick={{ fill: T.muted, fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} width={44} />
        <Tooltip contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11 }} formatter={v => [fmtCurrencyFull(v), 'Receita']} />
        <Area type="monotone" dataKey="value" stroke={T.accent} strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 3, fill: T.accent }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Donut Chart (idêntico ao dashboard real: 160×160, innerRadius=50, outerRadius=75) ──
function DonutChart({ data, colors, centerLabel, fmtVal, fmtVal2 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
        <PieChart width={160} height={160}>
          <Pie data={data} dataKey="value" nameKey="label"
            cx="50%" cy="50%" innerRadius={50} outerRadius={75} strokeWidth={0}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </PieChart>
        {centerLabel && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: T.primary, letterSpacing: '-0.02em', opacity: 0.6, fontVariantNumeric: 'tabular-nums' }}>
              {centerLabel}
            </span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
        {data.map((item, i) => (
          <div key={item.label || item.source}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
              <span style={{ color: T.secondary }}>{item.label || item.source}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: T.muted, marginLeft: 'auto', paddingLeft: 16 }}>{item.percent}%</span>
            </div>
            <div style={{ display: 'flex', gap: 12, paddingLeft: 16, marginTop: 2 }}>
              <span style={{ fontSize: 10, color: T.muted, fontVariantNumeric: 'tabular-nums' }}>
                {fmtVal ? fmtVal(item.value) : fmtNumber(item.value)}
              </span>
              {fmtVal2 && item.value2 != null && (
                <span style={{ fontSize: 10, color: T.muted, fontVariantNumeric: 'tabular-nums' }}>
                  {fmtVal2(item.value2)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const COLORS_STATUS  = ['#9B32F1', '#FF5A5A', '#2ECC71']
const COLORS_SOURCE_SALES   = ['#9B32F1', '#C278FF', '#7B2FBE', '#C278FF99']  // tons de roxo
const COLORS_SOURCE_REVENUE = ['#2ECC71', '#27AE60', '#1A9E50', '#2ECC7177']   // tons de verde

// ─── Funil ─────────────────────────────────────────────────────────────────────
function FunnelSection({ funnel, lostReasons }) {
  const [disabled, setDisabled] = useState(new Set())
  const toggle = id => setDisabled(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        <Card>
          <CardLabel>Estágios do Funil</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {stages.map((stage, i) => {
              const isOff = disabled.has(stage.id)
              const w = isOff ? 0 : (stage.count / maxCount) * 100
              const prev = active[active.findIndex(a => a.id === stage.id) - 1]
              const rate = prev ? convAfter.get(prev.id) : undefined
              return (
                <div key={stage.id} onClick={() => toggle(stage.id)} style={{ cursor: 'pointer', opacity: isOff ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: isOff ? T.surface2 : T.accent, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: isOff ? T.muted : 'white' }}>{stage.position}</span>
                    <span style={{ fontSize: 11, color: T.secondary, flex: 1 }}>{stage.name}</span>
                    {rate !== undefined && <span style={{ fontSize: 10, fontWeight: 600, color: T.muted }}>{rate.toFixed(1)}%</span>}
                  </div>
                  <div style={{ height: 26, background: T.surface2, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '100%', borderRadius: 6, width: `${w}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, transition: 'width 0.4s ease' }} />
                    {!isOff && w > 0 && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, gap: 8, pointerEvents: 'none' }}>
                        {stage.value > 0 && <span style={{ fontSize: 10, color: T.muted, whiteSpace: 'nowrap' }}>{fmtCurrency(stage.value)}</span>}
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>{fmtNumber(stage.count)}</span>
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
            <div key={row.reason} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 6 ? `1px solid ${T.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, width: 16, flexShrink: 0 }}>{i+1}</span>
                <span style={{ fontSize: 13, color: T.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.reason}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', color: T.secondary }}>{fmtNumber(row.count)}</span>
                {row.valueLost > 0 && <span style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', color: T.neg, minWidth: 60, textAlign: 'right' }}>{fmtCurrency(row.valueLost)}</span>}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Section>
  )
}

// ─── Distribuição ──────────────────────────────────────────────────────────────
function DistributionSection({ dist }) {
  return (
    <Section title="Distribuição">
      <Grid3>
        <Card>
          <CardLabel>Leads por Status</CardLabel>
          <DonutChart
            data={dist.leadsByStatus}
            colors={COLORS_STATUS}
            centerLabel={fmtNumber(dist.leadsByStatus.reduce((s,i) => s + i.value, 0))}
            fmtVal={fmtNumber} />
        </Card>
        <Card>
          <CardLabel>Vendas por Fonte</CardLabel>
          <DonutChart
            data={dist.bySource.map(d => ({ label: d.source, value: d.sales, percent: d.percent }))}
            colors={COLORS_SOURCE_SALES}
            centerLabel={fmtNumber(dist.bySource.reduce((s,i) => s + i.sales, 0))}
            fmtVal={fmtNumber} />
        </Card>
        <Card>
          <CardLabel>Receita por Fonte</CardLabel>
          <DonutChart
            data={dist.bySource.map(d => ({ label: d.source, value: d.revenue, percent: d.percent }))}
            colors={COLORS_SOURCE_REVENUE}
            centerLabel={fmtCurrency(dist.bySource.reduce((s,i) => s + i.revenue, 0))}
            fmtVal={fmtCurrency} />
        </Card>
      </Grid3>
    </Section>
  )
}

// ─── Rankings ──────────────────────────────────────────────────────────────────
const META_ICON = <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const GOOGLE_ICON = <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>

function srcIcon(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('meta') || n.includes('facebook')) return META_ICON
  if (n.includes('google')) return GOOGLE_ICON
  if (n.includes('orgânico') || n.includes('organico'))
    return <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
  return <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
}

function RankingBar({ rank, icon, name, active: isActive, value, maxValue, color, meta }) {
  const w = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, width: 16, flexShrink: 0, textAlign: 'right' }}>{rank}</span>
      <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 4, flexShrink: 0, background: T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.secondary }}>
        {icon}
        {isActive !== undefined && (
          <span style={{ position: 'absolute', top: 2, right: 2, width: 7, height: 7, borderRadius: '50%', background: isActive ? T.pos : T.neg, boxShadow: `0 0 0 1.5px ${T.surface}` }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
          <span style={{ fontSize: 11, color: T.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{name}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.primary, fontVariantNumeric: 'tabular-nums', flexShrink: 0, marginLeft: 6 }}>{fmtNumber(value)}</span>
        </div>
        <div style={{ height: 6, background: T.surface2, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
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

function RankCard({ title, rows, getValue, getIcon, getName, getActive, getMeta, color }) {
  const sorted = [...rows].sort((a, b) => getValue(b) - getValue(a))
  const max = sorted.length > 0 ? getValue(sorted[0]) : 1
  return (
    <Card>
      <CardLabel>{title}</CardLabel>
      <div style={{ maxHeight: 280, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${T.border} transparent` }}>
        {sorted.map((row, i) => (
          <RankingBar key={row.id || row.keyword || row.name} rank={i+1}
            icon={getIcon(row)} name={getName(row)} active={getActive ? getActive(row) : undefined}
            value={getValue(row)} maxValue={max} color={color}
            meta={getMeta ? getMeta(row) : null} />
        ))}
      </div>
    </Card>
  )
}

// Modos de ranking
const RANKING_MODES = [
  { key: 'fonte',    label: 'Fonte'    },
  { key: 'campanha', label: 'Campanha' },
  { key: 'conjunto', label: 'Conjunto' },
  { key: 'criativo', label: 'Criativo' },
  { key: 'pesquisa', label: 'Pesquisa' },
  { key: 'objetivo', label: 'Objetivo' },
  { key: 'vendedor', label: 'Vendedor' },
]

function RankingsSection() {
  const [mode, setMode] = useState('fonte')

  const configs = {
    fonte: {
      rows: SOURCES,
      getIcon: r => srcIcon(r.name),
      getName: r => r.name,
      getActive: r => r.spend > 0 ? true : undefined,
      getMeta: r => {
        const m = []
        if (r.spend > 0) m.push({ label: 'Invest.', value: fmtCurrency(r.spend) })
        if (r.cpl  > 0) m.push({ label: 'CPL',     value: fmtCurrency(r.cpl) })
        if (r.cac)       m.push({ label: 'CAC',     value: fmtCurrency(r.cac) })
        return m.length ? m : null
      },
    },
    campanha: {
      rows: CAMPAIGNS,
      getIcon: r => r.channel === 'google' ? GOOGLE_ICON : META_ICON,
      getName: r => r.name,
      getActive: r => r.active,
      getMeta: r => {
        const m = [{ label: 'Invest.', value: fmtCurrency(r.spend) }, { label: 'CPL', value: fmtCurrency(r.cpl) }]
        if (r.cac) m.push({ label: 'CAC', value: fmtCurrency(r.cac) })
        return m
      },
    },
    conjunto: {
      rows: CONJUNTOS,
      getIcon: r => r.channel === 'google' ? GOOGLE_ICON : META_ICON,
      getName: r => r.name,
      getActive: r => r.active,
      getMeta: r => {
        const m = [{ label: 'Invest.', value: fmtCurrency(r.spend) }, { label: 'CPL', value: fmtCurrency(r.cpl) }]
        if (r.cac) m.push({ label: 'CAC', value: fmtCurrency(r.cac) })
        return m
      },
    },
    criativo: {
      rows: CREATIVES,
      getIcon: () => <span style={{ fontSize: 9, fontWeight: 700, color: T.accent }}>AD</span>,
      getName: r => r.name,
      getActive: r => r.active,
      getMeta: r => {
        const m = [{ label: 'Invest.', value: fmtCurrency(r.spend) }, { label: 'CPL', value: fmtCurrency(r.cpl) }]
        if (r.cac) m.push({ label: 'CAC', value: fmtCurrency(r.cac) })
        return m
      },
    },
    pesquisa: {
      rows: PESQUISAS,
      getIcon: () => GOOGLE_ICON,
      getName: r => r.keyword,
      getActive: r => r.active,
      getMeta: r => {
        const m = [{ label: 'Invest.', value: fmtCurrency(r.cost) }, { label: 'CPC', value: fmtCurrency(r.cpc) }]
        if (r.cac) m.push({ label: 'CAC', value: fmtCurrency(r.cac) })
        return m
      },
    },
    objetivo: {
      rows: OBJETIVOS,
      getIcon: () => <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4zm0 3a1 1 0 011 1v4a1 1 0 01-2 0V8a1 1 0 011-1zm0 8a1 1 0 110 2 1 1 0 010-2z"/></svg>,
      getName: r => r.name,
      getActive: undefined,
      getMeta: r => {
        const m = [{ label: 'Invest.', value: fmtCurrency(r.spend) }, { label: 'CPL', value: fmtCurrency(r.cpl) }]
        if (r.cac) m.push({ label: 'CAC', value: fmtCurrency(r.cac) })
        return m
      },
    },
    vendedor: {
      rows: SELLERS,
      getIcon: r => <span style={{ fontSize: 9, fontWeight: 700, color: T.secondary }}>{(r.name || '').split(' ').map(n => n[0]).slice(0,2).join('')}</span>,
      getName: r => r.name,
      getActive: undefined,
      getMeta: r => r.cac ? [{ label: 'CAC', value: fmtCurrency(r.cac) }] : null,
    },
  }

  const cfg = configs[mode]

  const getLeads = r => r.leads ?? r.conversions ?? 0
  const getWon   = r => r.won ?? 0
  const getLost  = r => r.lost ?? 0

  const sectionTitle = (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {RANKING_MODES.map(m => (
        <button key={m.key} onClick={() => setMode(m.key)} style={{
          padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: mode === m.key ? 600 : 400,
          background: mode === m.key ? T.accent : T.surface2,
          color: mode === m.key ? '#fff' : T.muted,
          transition: 'all 0.15s',
        }}>{m.label}</button>
      ))}
    </div>
  )

  return (
    <Section title={sectionTitle}>
      <Grid3>
        <RankCard title={`Leads — ${RANKING_MODES.find(m=>m.key===mode)?.label}`}
          rows={cfg.rows} getValue={getLeads} color={T.accent}
          getIcon={cfg.getIcon} getName={cfg.getName}
          getActive={cfg.getActive} getMeta={cfg.getMeta} />
        <RankCard title={`Ganhos — ${RANKING_MODES.find(m=>m.key===mode)?.label}`}
          rows={cfg.rows} getValue={getWon} color={T.pos}
          getIcon={cfg.getIcon} getName={cfg.getName}
          getActive={cfg.getActive} getMeta={cfg.getMeta} />
        <RankCard title={`Perdidos — ${RANKING_MODES.find(m=>m.key===mode)?.label}`}
          rows={cfg.rows} getValue={getLost} color={T.neg}
          getIcon={cfg.getIcon} getName={cfg.getName}
          getActive={cfg.getActive} getMeta={cfg.getMeta} />
      </Grid3>
    </Section>
  )
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function EmbeddedDashboard() {
  const [channel, setChannel] = useState('all')
  const [dateFrom, setDateFrom] = useState(() => getDateRange('30d').from)
  const [dateTo,   setDateTo]   = useState(() => getDateRange('30d').to)
  const [atBottom, setAtBottom] = useState(false)
  const scrollRef = useRef(null)

  const kpis   = useMemo(() => computeKPIs(dateFrom, dateTo, channel),   [dateFrom, dateTo, channel])
  const trends = useMemo(() => computeTrends(dateFrom, dateTo, channel), [dateFrom, dateTo, channel])
  const dist   = useMemo(() => computeDistribution(), [])

  function handleDateChange(from, to) { setDateFrom(from); setDateTo(to) }

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
    setAtBottom(remaining < 20)
  }

  return (
    <div className="dash-embed" style={{
      background: T.bg, borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${T.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      fontFamily: 'Inter, system-ui, sans-serif', color: T.primary,
      maxHeight: 600, position: 'relative',
    }}>
      <style>{GLOBAL_SVG_FIX}</style>

      <FilterBar from={dateFrom} to={dateTo} onDateChange={handleDateChange} channel={channel} setChannel={setChannel} />

      <div ref={scrollRef} onScroll={handleScroll} style={{ maxHeight: 560, overflowY: 'auto', padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 20, scrollbarWidth: 'thin', scrollbarColor: `${T.border} transparent` }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 10 }}>
          {Object.values(kpis).map(m => <KPICard key={m.label} metric={m} />)}
        </div>

        {/* Tendência */}
        <Section title="Tendência">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <Card><CardLabel>Investimento × Leads</CardLabel><TrendChartInvestLeads investment={trends.investment} leads={trends.leads} /></Card>
            <Card><CardLabel>Receita no Tempo</CardLabel><TrendChartRevenue revenue={trends.revenue} /></Card>
          </div>
        </Section>

        {/* Funil */}
        <FunnelSection funnel={ghlFunnel} lostReasons={ghlLostReasons} />

        {/* Distribuição */}
        <DistributionSection dist={dist} />

        {/* Rankings */}
        <RankingsSection />
      </div>

      {/* Scroll indicator — bolinha embaixo */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '4px 0', pointerEvents: 'none',
        background: `linear-gradient(to top, ${T.bg}cc, transparent)`,
        height: 24,
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: atBottom ? T.border : T.accent,
          opacity: atBottom ? 0.3 : 0.7,
          transition: 'background 0.3s, opacity 0.3s',
          boxShadow: atBottom ? 'none' : `0 0 6px ${T.accent}88`,
        }} />
      </div>
    </div>
  )
}
