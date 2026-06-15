import { useEffect, useRef } from 'react';

// Easing premium — expo out, usado por Vercel, Linear, Stripe
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.75s ${EASE}, transform 0.75s ${EASE}`;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.willChange = 'opacity, transform';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        // Libera o layer de GPU após a transição terminar
        el.addEventListener('transitionend', () => {
          el.style.willChange = 'auto';
        }, { once: true });
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

// Aplica scroll reveal em múltiplos filhos com stagger preciso
export const useChildrenReveal = (selector = '[data-reveal]', delay = 70, disabled = false) => {
  const ref = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll(selector);
    if (!children.length) return;

    children.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.7s ${EASE} ${i * delay}ms, transform 0.7s ${EASE} ${i * delay}ms`;
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        children.forEach(el => {
          el.style.willChange = 'opacity, transform';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.addEventListener('transitionend', () => {
            el.style.willChange = 'auto';
          }, { once: true });
        });
        observer.disconnect();
      }
    }, { threshold: 0.06 });

    observer.observe(container);
    return () => observer.disconnect();
  }, [selector, delay, disabled]);

  return ref;
};
