import SimulationPlotAsImage from '@/components/explore-section/MEModel/DetailView/SimulationPlotAsImage';
import {
  DEFAULT_PROTOCOL,
  PROTOCOL_DETAILS,
  SIMULATION_COLORS,
} from '@/constants/simulate/single-neuron';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { CurrentInjectionSimulationConfig } from '@/types/simulation/single-neuron';
import { classNames } from '@/util/utils';

type Props = {
  currentInjection: CurrentInjectionSimulationConfig;
  stimulusData: PlotData | null;
};

function Field({
  label,
  value,
  unit,
  className,
}: {
  label: string;
  value: string;
  unit?: string;
  className?: string;
}) {
  return (
    <div className={classNames('mb-4 mr-10 text-primary-7', className)}>
      <div className="text-sm uppercase text-neutral-4">{label}</div>
      <div>
        <span className="mr-2 font-bold">{value}</span>
        {unit && <span>[{unit}]</span>}
      </div>
    </div>
  );
}

export default function StimulationDetails({ currentInjection, stimulusData }: Props) {
  const protocol = currentInjection.stimulus.stimulusProtocol ?? DEFAULT_PROTOCOL;
  return (
    <div className="flex flex-wrap">
      <div className="w-[500px] border border-neutral-200 p-4">
        <div className="mb-6 flex items-center border-b border-neutral-200 font-semibold text-neutral-4">
          Stimulation
        </div>

        <div className="mr-10 text-primary-7">
          <div className="text-sm uppercase text-neutral-4">Location</div>
          <div className="mb-4">
            <span
              className="mr-4 inline-block h-[11px] w-[11px] border"
              style={{ backgroundColor: SIMULATION_COLORS[0] }}
            />
            <span className="mr-2 font-bold">{currentInjection.injectTo}</span>
          </div>

          <Field label="Stimulation Mode" value={currentInjection.stimulus.stimulusType} />
          <Field label="Protocol" value={PROTOCOL_DETAILS[protocol].label} />
          <div className="ml-4 flex">
            <Field
              label="Delay"
              value={`${PROTOCOL_DETAILS[protocol].defaults.time.delay}`}
              unit="ms"
            />
            <Field
              label="Duration"
              value={`${PROTOCOL_DETAILS[protocol].defaults.time.duration}`}
              unit="ms"
            />
            <Field
              label="Stop Time"
              value={`${PROTOCOL_DETAILS[protocol].defaults.time.stopTime}`}
              unit="ms"
            />
          </div>

          {stimulusData && <SimulationPlotAsImage title="Stimulation" plotData={stimulusData} />}
        </div>
      </div>
    </div>
  );
}
