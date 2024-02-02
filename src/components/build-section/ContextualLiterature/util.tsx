import { BuildQuestionInput } from '@/types/literature';

const propertyElement = (property?: string) =>
  property && <b className="rounded-md bg-secondary-0 px-2 py-px text-teal-600">{property}</b>;
const subjectElement = (subject?: string) =>
  subject && <b className="rounded-md bg-[#E0F8FF] px-2 py-px text-primary-6">{subject}</b>;
const brainRegionElement = (title?: string) =>
  title && <b className="rounded-md bg-orange-100 px-2 py-px text-amber-600">{title}</b>;

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
}: BuildQuestionInput): Record<string, JSX.Element> => {
  if (step === 'cell-composition') {
    return {
      [`What is the neuron ${densityOrCount} of ${subject} in ${brainRegionTitle} ?`]: (
        <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
          What is the neuron {propertyElement(densityOrCount)} of {subjectElement(subject)} in{' '}
          {brainRegionElement(brainRegionTitle)} region ?
        </span>
      ),
      ...(about === 'EType'
        ? {
            [`What are electrophysiological types in ${brainRegionTitle} region ?`]: (
              <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
                What are the {propertyElement('electrophysiological')} types in{' '}
                {brainRegionElement(brainRegionTitle)} region ?
              </span>
            ),
          }
        : {
            [`What are morphological types in ${brainRegionTitle} region ?`]: (
              <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
                What are the {propertyElement('morphological')} types in{' '}
                {brainRegionElement(brainRegionTitle)} region ?
              </span>
            ),
          }),
    };
  }
  if (step === 'connectome-model-assignment') {
    return {
      ...(about === 'nrrp' && {
        'What is the number of readily releasible pool of vesicles ?': (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What is the number of readily releasible pool of vesicles?
          </span>
        ),
      }),
      ...(about === 'gsyn' && {
        'What is the synapse conductance ?': (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What is the synapse conductance?
          </span>
        ),
      }),
      ...(about === 'dtc' && {
        'What is the mean time to decay from peak PSP amplitude to base line ?': (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What is the mean time to decay from peak PSP amplitude to base line?
          </span>
        ),
      }),
      ...(about === 'u' && {
        'What is the utilisation probability of the synaptic efficacy ?': (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What is the utilisation probability of the synaptic efficacy?
          </span>
        ),
      }),
      ...(about === 'f' && {
        'What is the facilitation time constant ?': (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What is the facilitation time constant?
          </span>
        ),
      }),
      ...(about === 'd' && {
        'What is the decay time constant ?': (
          <span key={`${step}-${brainRegionTitle}-${about}-${subject}`} className="text-lg">
            What is the decay time constant ?
          </span>
        ),
      }),
    };
  }
  return {};
};

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
  } else if (step === 'connectome-model-assignment') {
    questions = buildCellCompositionQuestions({
      about,
      brainRegionTitle,
      step,
      subject: about,
    });
  }
  return questions;
}
