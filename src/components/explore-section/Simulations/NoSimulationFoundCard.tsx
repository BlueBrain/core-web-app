import NoSimulationFoundIcon from '@/components/icons/NoSimulationFoundIcon';

export default function NoSimulationFoundCard() {
  return (
    <div className="flex h-52 w-96 items-center justify-center rounded bg-neutral-1">
      <div className="m-24 text-center font-semibold text-neutral-5">
        <NoSimulationFoundIcon className="m-auto block" />
        <div className="mt-2">No Simulation for these dimensions combination</div>
      </div>
    </div>
  );
}
