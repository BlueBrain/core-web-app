import { SynapsesConfig } from '@/types/simulation/single-neuron';
import { classNames } from '@/util/utils';

type Props = {
  synapses: SynapsesConfig;
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

export default function SynapticInputs({ synapses }: Props) {
  return (
    <div className="flex flex-wrap">
      {synapses.map((synapse, index) => (
        // Same synaptic group (id) can be used multiple times in simulation. Therefore, appending index to key to create unique values
        // eslint-disable-next-line react/no-array-index-key
        <div key={`${synapse.id}-${index}`} className="mr-2 border border-neutral-200 p-4">
          <div>
            <div className="mb-6 flex items-center border-b border-neutral-200">
              <span
                className="mr-4 inline-block h-[14px] w-[14px]"
                style={{ backgroundColor: synapse.color }}
              />
              <h4>Synaptic Input {index + 1}</h4>
            </div>

            <Field label="Name" value="Synapses set" />

            <div className="flex">
              <Field label="Delay" value={`${synapse.delay}`} unit="ms" className="mr-10" />
              <Field label="Duration" value={`${synapse.duration}`} unit="ms" className="mr-10" />
              <Field label="Frequency" value={`${synapse.frequency}`} unit="Hz" className="mr-10" />
              <Field label="Weight scalar" value={`${synapse.weightScalar}`} />
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}
