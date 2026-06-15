import WhySection from '../../../components/WhySection';

const TOTAL_TABS = 5;

const SlideWhySection = ({ step }) => (
  <div className="slide-section-wrap why-wrap">
    <WhySection activeTab={step} />
  </div>
);

SlideWhySection.steps = TOTAL_TABS - 1;

export default SlideWhySection;
