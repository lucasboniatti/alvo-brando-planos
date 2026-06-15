import Comparison from '../../../components/Comparison';

const Slide15Comparacao = ({ step }) => (
  <div className="slide-section-wrap comparison-wrap has-steps">
    <Comparison onCtaClick={() => {}} step={step} />
  </div>
);

Slide15Comparacao.steps = 2;

export default Slide15Comparacao;
