import { BuildQuestionInput } from '@/types/literature';

const propertyElement = (property?: string) =>
  property && <b className="px-2 py-px text-teal-600 rounded-md bg-secondary-0">{property}</b>;
const subjectElement = (subject?: string) =>
  subject && <b className="bg-[#E0F8FF] text-primary-6 rounded-md px-2 py-px">{subject}</b>;
const brainRegionElement = (title?: string) =>
  title && <b className="px-2 py-px bg-orange-100 rounded-md text-amber-600">{title}</b>;

const buildCellCompositionQuestion = ({
  about,
  brainRegionTitle,
  step,
  subject,
  densityOrCount,
}: BuildQuestionInput): Record<string, JSX.Element> => ({
  [`What is the neuron ${densityOrCount} of ${subject} in ${brainRegionTitle}`]: (
    <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
      What is the neuron {propertyElement(densityOrCount)} of {subjectElement(subject)} in{' '}
      {brainRegionElement(brainRegionTitle)} region ?
    </span>
  ),
  ...(about === 'EType'
    ? {
        [`What are of electrophysiological types in ${brainRegionTitle}`]: (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What are the {propertyElement('electrophysiological')} in{' '}
            {brainRegionElement(brainRegionTitle)} region ?
          </span>
        ),
      }
    : {
        [`What are of morphological types in ${brainRegionTitle}`]: (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What are the {propertyElement('morphological')} in{' '}
            {brainRegionElement(brainRegionTitle)} region ?
          </span>
        ),
      }),
});

// const buildCellModelAssignementQuestion = ({ about, brainRegionTitle, step, subject }: BuildQuestionInput) => null;
// const buildConnectomeDefinitionQuestion = ({ about, brainRegionTitle, step, subject }: BuildQuestionInput) => null;

export function destructPath(pathName: string) {
  const [, build, step] = pathName.split('/');

  return {
    build,
    step,
  };
}

export function buildQuestionsList({
  about,
  brainRegionTitle,
  step,
  subject,
  densityOrCount,
}: BuildQuestionInput): Record<string, JSX.Element> | null {
  let questions: Record<string, JSX.Element> | null = null;
  if (step === 'cell-composition') {
    questions = buildCellCompositionQuestion({
      about,
      brainRegionTitle,
      step,
      subject,
      densityOrCount,
    });
  }
  // else if (step === 'cell-model-assignment') {
  //     questions = buildCellModelAssignementQuestion({ about, brainRegionTitle, step, subject });
  // } else if (step === 'connectome-definition') {
  //     questions = buildConnectomeDefinitionQuestion({ about, brainRegionTitle, step, subject });
  // }
  return questions;
}
