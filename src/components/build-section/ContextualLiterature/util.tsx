import { BuildQuestionInput } from '@/types/literature';

const propertyElement = (property?: string) =>
  property && <b className="px-2 py-px text-teal-600 rounded-md bg-secondary-0">{property}</b>;
const subjectElement = (subject?: string) =>
  subject && <b className="bg-[#E0F8FF] text-primary-6 rounded-md px-2 py-px">{subject}</b>;
const brainRegionElement = (title?: string) =>
  title && <b className="px-2 py-px bg-orange-100 rounded-md text-amber-600">{title}</b>;

/**
 *
 * @see (buildQuestionsList)
 * @returns CellComposition predefined questions list
 */
const buildCellCompositionQuestions = ({
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
            What are the {propertyElement('electrophysiological')} types in{' '}
            {brainRegionElement(brainRegionTitle)} region ?
          </span>
        ),
      }
    : {
        [`What are of morphological types in ${brainRegionTitle}`]: (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What are the {propertyElement('morphological')} types in{' '}
            {brainRegionElement(brainRegionTitle)} region ?
          </span>
        ),
      }),
});

// const buildCellModelAssignementQuestion = ({ about, brainRegionTitle, step, subject }: BuildQuestionInput) => null;
// const buildConnectomeDefinitionQuestion = ({ about, brainRegionTitle, step, subject }: BuildQuestionInput) => null;

export function destructPath(pathName: string) {
  if (pathName) {
    const [, build, step] = pathName.split('/');

    return {
      build,
      step,
    };
  }
  return {
    build: '',
    step: '',
  };
}

/**
 * This function will take a set of paramters in each different step (some parameters are common)
 * the result is the pre-defined questions both the text and styled text
 * the default text will be passed to the AI
 * @param Build.about depend on the step you are in (cell-composition) has Etype or MType
 * @param Build.brainRegionTitle selected brain region
 * @param Build.step build step (cell-composition, cell-model-assignement, ...)
 * @param Build.subject the selected object you want to investigate on (in cell-composition as ex: GEN_mtype, L1_DAC, ...)
 * @param Build.densityOrCount this related to cell-composition step it may be different in other steps
 * @returns both default text and styled text
 */
export function buildQuestionsList({
  about,
  brainRegionTitle,
  step,
  subject,
  densityOrCount,
}: BuildQuestionInput): Record<string, JSX.Element> | null {
  let questions: Record<string, JSX.Element> | null = null;
  if (step === 'cell-composition') {
    questions = buildCellCompositionQuestions({
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
