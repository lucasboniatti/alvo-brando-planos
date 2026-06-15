import { useEffect, useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import siteImobiliaria from '../assets/site-imobiliaria2.webp';
import siteClinica from '../assets/site-clinica.webp';
import siteImobiliaria2 from '../assets/site-restaurante.webp';
import siteConcessionaria from '../assets/site-concessionaria.webp';
import siteAcademia from '../assets/site-academia.webp';
import siteDistribuidora from '../assets/site-distribuidora.webp';
import siteTerapeuta from '../assets/site-terapeuta.webp';

// Cada tipo tem 3 variações de subtítulo (nome do lead muda)
const EVENT_TYPES = {
  novoLead: {
    icon: 'user', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado',
    subs: [
      'Carlos Mendonça · via Meta Ads · campanha ativa',
      'Juliana Ferreira · via Google Ads · landing page',
      'Rafael Sousa · via Instagram Ads · campanha ativa',
    ],
  },
  followUp: {
    icon: 'msg', color: '#2E7AE5', bg: 'rgba(46,122,229,0.1)', title: 'Follow-up enviado',
    subs: [
      'André Pereira · lembrete automático · sem resposta há 2 dias',
      'Larissa Monteiro · 3º contato · aguardando retorno',
      'Thiago Barbosa · lembrete automático · sem resposta há 1 dia',
    ],
  },
  qualificado: {
    icon: 'check', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Lead qualificado',
    subs: [
      'Marcos Oliveira · perfil aprovado · decisor confirmado',
      'Patrícia Lima · perfil aprovado · orçamento confirmado',
      'Diego Almeida · perfil aprovado · pronto para reunião',
    ],
  },
  reuniao: {
    icon: 'cal', color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião agendada',
    subs: [
      'Fernanda Costa · amanhã às 14h · confirmado',
      'Bruno Tavares · hoje às 16h · confirmado',
      'Camila Rocha · sexta às 10h · confirmado',
    ],
  },
  venda: {
    icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',
    subs: [
      'Gustavo Ribeiro · contrato assinado · R$ 12.000',
      'Sabrina Nunes · contrato assinado · R$ 8.500',
      'Leonardo Cardoso · contrato assinado · R$ 21.000',
    ],
  },
  indicacao: {
    icon: 'star', color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Indicação recebida',
    subs: [
      'Aline Santos · indicou 2 amigos · funil reiniciado',
      'Roberto Figueiredo · indicou 1 amigo · contato iniciado',
      'Mariana Vieira · indicou 3 amigos · funil reiniciado',
    ],
  },
  desqualificado: {
    icon: 'user', color: '#E53E3E', bg: 'rgba(229,62,62,0.1)', title: 'Lead desqualificado',
    subs: [
      'Paulo Henrique · fora do perfil · removido do funil',
      'Tatiane Moura · sem orçamento · arquivado',
      'Felipe Corrêa · não é decisor · removido do funil',
    ],
  },
  reagendada: {
    icon: 'cal', color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião reagendada',
    subs: [
      'Vanessa Pinto · novo horário · próxima terça 15h',
      'Rodrigo Castro · reagendado para quinta · 11h confirmado',
      'Natália Freitas · novo horário · quarta às 9h confirmado',
    ],
  },
};

const ALL_EVENTS = [
  // 1–9: sequência narrativa original
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Carlos Mendonça · via Meta Ads · campanha ativa' },
  { icon: 'msg',   color: '#2E7AE5', bg: 'rgba(46,122,229,0.1)', title: 'Follow-up enviado',     sub: 'Larissa Monteiro · 3º contato · aguardando retorno' },
  { icon: 'check', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Lead qualificado',      sub: 'Marcos Oliveira · perfil aprovado · decisor confirmado' },
  { icon: 'cal',   color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião agendada',      sub: 'Carlos Mendonça · amanhã às 14h · confirmado' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',         sub: 'Larissa Monteiro · contrato assinado · R$ 12.000' },
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Felipe Corrêa · via Instagram Ads · campanha ativa' },
  { icon: 'user',  color: '#E53E3E', bg: 'rgba(229,62,62,0.1)',  title: 'Lead desqualificado',   sub: 'Felipe Corrêa · não é decisor · removido do funil' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',         sub: 'Carlos Mendonça · contrato assinado · R$ 21.000' },
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Juliana Ferreira · via Google Ads · landing page' },
  // 10–37: sequência estendida
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Ana Silva · via Meta Ads · campanha ativa' },
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Pedro Almeida · via Google Ads · landing page' },
  { icon: 'msg',   color: '#2E7AE5', bg: 'rgba(46,122,229,0.1)', title: 'Follow-up enviado',     sub: 'Ana Silva · 1º contato · sem resposta há 1 dia' },
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Carla Mendes · via Instagram Ads · campanha ativa' },
  { icon: 'check', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Lead qualificado',      sub: 'Pedro Almeida · perfil aprovado · decisor confirmado' },
  { icon: 'msg',   color: '#2E7AE5', bg: 'rgba(46,122,229,0.1)', title: 'Follow-up enviado',     sub: 'Carla Mendes · lembrete automático · sem resposta há 2 dias' },
  { icon: 'cal',   color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião agendada',      sub: 'Ana Silva · hoje às 15h · confirmado' },
  { icon: 'user',  color: '#E53E3E', bg: 'rgba(229,62,62,0.1)',  title: 'Lead desqualificado',   sub: 'Bruno Tavares · sem orçamento · arquivado' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',         sub: 'Pedro Almeida · contrato assinado · R$ 8.500' },
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Marcos Ribeiro · via Meta Ads · campanha ativa' },
  { icon: 'cal',   color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião agendada',      sub: 'Carla Mendes · amanhã às 10h · confirmado' },
  { icon: 'msg',   color: '#2E7AE5', bg: 'rgba(46,122,229,0.1)', title: 'Follow-up enviado',     sub: 'Marcos Ribeiro · 1º contato · sem resposta há 1 dia' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',         sub: 'Ana Silva · contrato assinado · R$ 14.000' },
  { icon: 'star',  color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Indicação recebida',    sub: 'Pedro Almeida · indicou 2 amigos · funil reiniciado' },
  { icon: 'check', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Lead qualificado',      sub: 'Marcos Ribeiro · perfil aprovado · orçamento confirmado' },
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Juliana Costa · via Google Ads · landing page' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',         sub: 'Carla Mendes · contrato assinado · R$ 21.000' },
  { icon: 'cal',   color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião reagendada',    sub: 'Diego Ferreira · novo horário · quarta às 14h' },
  { icon: 'msg',   color: '#2E7AE5', bg: 'rgba(46,122,229,0.1)', title: 'Follow-up enviado',     sub: 'Juliana Costa · 2º contato · aguardando retorno' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',         sub: 'Marcos Ribeiro · contrato assinado · R$ 11.000' },
  { icon: 'check', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Lead qualificado',      sub: 'Juliana Costa · perfil aprovado · pronto para reunião' },
  { icon: 'star',  color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Indicação recebida',    sub: 'Ana Silva · indicou 1 amigo · contato iniciado' },
  { icon: 'user',  color: '#E53E3E', bg: 'rgba(229,62,62,0.1)',  title: 'Lead desqualificado',   sub: 'Tatiane Moura · não é decisor · removido do funil' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',         sub: 'Juliana Costa · contrato assinado · R$ 9.200' },
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Fernanda Lima · via Meta Ads · campanha ativa' },
  { icon: 'star',  color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Indicação recebida',    sub: 'Carla Mendes · indicou 3 amigos · funil reiniciado' },
  { icon: 'cal',   color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião agendada',      sub: 'Fernanda Lima · amanhã às 9h · confirmado' },
  { icon: 'check', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Lead qualificado',      sub: 'Fernanda Lima · perfil aprovado · decisor confirmado' },
  // 38–40: Beatriz Campos
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Beatriz Campos · via Meta Ads · campanha ativa' },
  { icon: 'cal',   color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião agendada',      sub: 'Beatriz Campos · quinta às 14h · confirmado' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada',         sub: 'Beatriz Campos · contrato assinado · R$ 13.800' },
];

function buildEvents() {
  return [...ALL_EVENTS];
}

const EVENTS = buildEvents();

function IconCheck({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function IconUser({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function IconCal({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IconMsg({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IconStar({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function EventIcon({ type, color }) {
  if (type === 'check') return <IconCheck color={color} />;
  if (type === 'user')  return <IconUser color={color} />;
  if (type === 'cal')   return <IconCal color={color} />;
  if (type === 'msg')   return <IconMsg color={color} />;
  if (type === 'star')  return <IconStar color={color} />;
  return null;
}

const SITES = [
  { name: 'Imobiliária',    img: siteImobiliaria,    conv: '15% conversão' },
  { name: 'Academia',       img: siteAcademia,       conv: '24% conversão' },
  { name: 'Clínica',        img: siteClinica,        conv: '21% conversão' },
  { name: 'Restaurante',    img: siteImobiliaria2,   conv: '18% conversão' },
  { name: 'Concessionária', img: siteConcessionaria, conv: '12% conversão' },
  { name: 'Distribuidora',  img: siteDistribuidora,  conv: '11% conversão' },
  { name: 'Terapeuta',      img: siteTerapeuta,      conv: '30% conversão' },
];

function LandingPageMock() {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const startX = useRef(null);
  const total = SITES.length;

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const site = SITES[active];

  const goTo = (next) => {
    setPrevActive(active);
    setActive(next);
    setTimeout(() => setPrevActive(null), 700);
  };

  useEffect(() => {
    if (total <= 1 || hovered) return;
    const t = setInterval(() => goTo((active + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total, hovered, active]);

  const goPrev = () => goTo((active - 1 + total) % total);
  const goNext = () => goTo((active + 1) % total);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <style>{`
        .conv-tag-mobile { display: none; }
        @media (max-width: 768px) {
          .conv-tag-desktop { display: none !important; }
          .conv-tag-mobile { display: flex !important; }
        }
      `}</style>
      <div
        style={{ ...mock.wrap }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={e => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (startX.current === null) return;
          const diff = startX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
          startX.current = null;
        }}
      >
        {/* Cabeçalho dentro do card */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--sand-50)',
          borderRadius: '16px 16px 0 0',
          borderBottom: '1px solid var(--border-1)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '-0.01em' }}>
            Sites de Alta Conversão
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ background: 'rgba(155,50,241,0.1)', color: 'var(--brand-600)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-display)', padding: '4px 10px', borderRadius: 999, letterSpacing: '0.03em', border: '1px solid rgba(155,50,241,0.2)' }}>
              {site.name}
            </div>
            <button onClick={goPrev} style={{ background: 'rgba(155,50,241,0.08)', border: '1px solid rgba(155,50,241,0.2)', color: 'var(--brand-500)', fontSize: 18, fontWeight: 400, lineHeight: 1, width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, transition: 'background 0.15s' }} aria-label="Anterior">‹</button>
            <button onClick={goNext} style={{ background: 'rgba(155,50,241,0.08)', border: '1px solid rgba(155,50,241,0.2)', color: 'var(--brand-500)', fontSize: 18, fontWeight: 400, lineHeight: 1, width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, transition: 'background 0.15s' }} aria-label="Próximo">›</button>
          </div>
        </div>

        {/* Screenshot com crossfade */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0 0 16px 16px' }}>
          {/* Imagem anterior — some */}
          {prevActive !== null && SITES[prevActive].img && (
            <img
              src={SITES[prevActive].img}
              alt=""
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: 0,
                transition: 'opacity 0.65s ease',
              }}
            />
          )}
          {/* Imagem atual — aparece */}
          <img
            key={active}
            src={site.img}
            alt={site.name}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              animation: 'siteFadeIn 0.65s ease both',
            }}
          />
          {/* Tag de conversão — desktop: sobre a imagem */}
          {!isMobile && (
            <div style={{
              position: 'absolute', bottom: 14, right: 14,
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--mint-50)', border: '1px solid var(--mint-100)',
              borderRadius: 999, padding: '4px 10px 4px 8px',
              backdropFilter: 'blur(8px)',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--mint-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--mint-600)', whiteSpace: 'nowrap' }}>{site.conv}</span>
            </div>
          )}
        </div>

      </div>
      {/* Tag de conversão — mobile: metade dentro/fora da borda inferior do card */}
      {isMobile && (
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          marginTop: -16, paddingRight: 14, position: 'relative', zIndex: 10,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--mint-50)', border: '1px solid var(--mint-100)',
            borderRadius: 999, padding: '4px 10px 4px 8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--mint-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--mint-600)', whiteSpace: 'nowrap' }}>{site.conv}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const mock = {
  wrap: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 30px 80px rgba(14,23,48,0.2), 0 8px 24px rgba(14,23,48,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  },
  urlBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderBottom: '1px solid var(--border-1)',
    background: 'var(--bg-canvas)',
  },
  dots: { display: 'flex', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 999, display: 'inline-block' },
  url: {
    flex: 1,
    background: '#fff',
    border: '1px solid var(--border-1)',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--fg-2)',
  },
  body: { padding: '20px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  lineGreen: {
    width: '55%', height: 10, borderRadius: 4,
    background: 'rgba(31,206,124,0.35)', marginBottom: 14,
  },
  line: { borderRadius: 4, background: 'var(--border-1)' },
  inputBox: {
    height: 36, borderRadius: 8,
    border: '1px solid var(--border-1)', background: 'var(--bg-canvas)',
  },
  btnGreen: {
    height: 44, borderRadius: 10, background: '#1FCE7C',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid var(--border-1)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  footerTitle: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--night-900)',
  },
  footerSub: {
    fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-2)', marginTop: 2,
  },
  badge: {
    background: 'rgba(31,206,124,0.12)', border: '1px solid rgba(31,206,124,0.3)',
    color: '#0A5C36', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
    padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap',
  },
};

const WINDOW = 4;

function getEvent(playlist, idx) {
  return playlist[idx % playlist.length];
}

function timeLabel(ts) {
  if (!ts) return 'agora';
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs <= 0) return 'agora';
  if (secs < 60) return `${secs}s atrás`;
  return `${Math.floor(secs / 60)}min atrás`;
}

const MarketingSection = () => {
  const [head, setHead] = useState(WINDOW - 1); // começa mostrando os 4 primeiros
  const timestamps = useRef({});
  const playlist = useRef([]);
  const sectionRef = useScrollReveal({ threshold: 0.06 });

  if (playlist.current.length === 0) {
    playlist.current = buildEvents();
    const now = Date.now();
    const offsets = [0, 25000, 90000, 300000];
    for (let i = 0; i < WINDOW; i++) {
      timestamps.current[WINDOW - 1 - i] = now - offsets[i];
    }
  }

  useEffect(() => {
    let timeout;
    const schedule = () => {
      const delay = 2500 + Math.random() * 4000;
      timeout = setTimeout(() => {
        setHead(h => {
          const next = h + 1;
          timestamps.current[next] = Date.now();
          return next;
        });
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);


  return (
    <section id="marketing" style={s.section}>
      <style>{`
        .mkt-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .mkt-inner { grid-template-columns: 1fr; gap: 40px; }
          .mkt-right { display: none; }
          .mkt-h2 { font-size: 24px !important; }
        }
        .crm-event {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid var(--border-1);
          border-radius: 14px;
          box-shadow: var(--shadow-sm);
          animation: crmSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .crm-event:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(14,23,48,0.10), 0 3px 8px rgba(14,23,48,0.06);
        }
        @keyframes crmSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes siteBlurIn {
          from { opacity: 0; filter: blur(6px); transform: scale(1.01); }
          to   { opacity: 1; filter: blur(0px); transform: scale(1); }
        }
        @keyframes siteFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div ref={sectionRef} className="mkt-inner">
        {/* Esquerda — feed de notificações */}
        <div>
          <div style={s.label}>Marketing Estratégico</div>
          <h2 style={s.h2} className="mkt-h2">Receba diariamente leads altamente qualificados no seu WhatsApp e CRM.</h2>
          <div style={s.feed}>
            {Array.from({ length: WINDOW }).map((_, i) => {
              // i=0 → topo (mais recente), i=WINDOW-1 → fundo (mais antigo, some)
              const globalIdx = head - i;
              const ev = getEvent(playlist.current, globalIdx < 0 ? 0 : globalIdx);
              const isTop = i === 0;
              const isBottom = i === WINDOW - 1;
              return (
                <div
                  key={globalIdx}
                  className="crm-event"
                  style={{
                    opacity: isBottom ? 0.28 : 1,
                    animation: isTop ? 'crmSlideIn 0.45s cubic-bezier(0.2,0.8,0.2,1) both' : 'none',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: ev.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <EventIcon type={ev.icon} color={ev.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={s.eventTitle}>{ev.title}</div>
                    <div style={s.eventSub}>{ev.sub}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={s.agora}>
                      {isTop ? 'agora' : timeLabel(timestamps.current[globalIdx])}
                    </span>
                    {isTop && <span style={{ width: 8, height: 8, borderRadius: 999, background: '#1FCE7C', display: 'inline-block' }}/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Direita — mock landing page */}
        <div className="mkt-right" style={{ display: 'flex', flexDirection: 'column' }}>
          <LandingPageMock />
        </div>
      </div>
    </section>
  );
};

const s = {
  section: { padding: '80px 24px', background: 'var(--sand-100)' },
  label: { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 },
  h2: { fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--night-900)', margin: '0 0 32px' },
  feed: { display: 'flex', flexDirection: 'column', gap: 10 },
  eventTitle: { fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--night-900)', lineHeight: 1.2 },
  eventSub: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-2)', marginTop: 2 },
  agora: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-2)' },
};

export default MarketingSection;
