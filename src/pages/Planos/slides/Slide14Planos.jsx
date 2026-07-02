import Pricing from '../../../components/Pricing';

const Slide14Planos = ({ step }) => (
  <div className="slide-section-wrap pricing-wrap has-steps">
    <Pricing onCtaClick={() => {}} step={step} />
  </div>
);

Slide14Planos.steps = 7;

export default Slide14Planos;
