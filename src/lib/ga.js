const getUtms = () => {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get('utm_source')   || undefined,
    utm_medium:   p.get('utm_medium')   || undefined,
    utm_campaign: p.get('utm_campaign') || undefined,
    utm_content:  p.get('utm_content')  || undefined,
    utm_term:     p.get('utm_term')     || undefined,
  };
};

const send = (eventName, params = {}) => {
  if (typeof window.gtag !== 'function') return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  window.gtag('event', eventName, clean);
};

export const gaFormOpened = ({ origem, plano } = {}) =>
  send('form_opened', { origem, plano, ...getUtms() });

export const gaStepCompleted = ({ step, step_id, resposta } = {}) =>
  send('step_completed', { step, step_id, resposta });

export const gaFormSubmitted = ({ plano } = {}) =>
  send('form_submitted', { plano });

export const gaExitIntent = ({ tela, step, step_id } = {}) =>
  send('exit_intent', { tela, step, step_id });

export const gaCouponViewed = ({ plano } = {}) =>
  send('coupon_viewed', { plano });

export const gaCouponCopied = ({ plano } = {}) =>
  send('coupon_copied', { plano });

export const gaCheckoutClicked = ({ plano, origem, cupom } = {}) =>
  send('checkout_clicked', { plano, origem, cupom });

export const gaCtaClicked = ({ origem } = {}) =>
  send('cta_clicked', { origem });

export const gaFaqOpened = ({ pergunta, index } = {}) =>
  send('faq_opened', { pergunta, index });

export const gaRoiInteracted = ({ campo, valor } = {}) =>
  send('roi_interacted', { campo, valor });

export const gaNavLinkClicked = ({ destino } = {}) =>
  send('nav_link_clicked', { destino });

export const gaLoginModalOpened = ({ origem } = {}) =>
  send('login_modal_opened', { origem });

export const gaLoginAttempted = () =>
  send('login_attempted');

export const gaLoginFailed = () =>
  send('login_failed');

export const gaCreateAccountClicked = ({ origem } = {}) =>
  send('create_account_clicked', { origem });

export const gaDashboardTabSwitched = ({ aba } = {}) =>
  send('dashboard_tab_switched', { aba });

export const gaDashboardConvClicked = ({ nome, posicao, temp } = {}) =>
  send('dashboard_conv_clicked', { nome, posicao, temp });
