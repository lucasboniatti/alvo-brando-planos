import HowItWorks from '../../../components/HowItWorks';

const Slide06HowItWorks = ({ step }) => (
  <div className="slide-section-wrap hiw-wrap has-steps">
    <HowItWorks onCtaClick={() => {}} step={step} />
  </div>
);

Slide06HowItWorks.steps = 3;

export default Slide06HowItWorks;
