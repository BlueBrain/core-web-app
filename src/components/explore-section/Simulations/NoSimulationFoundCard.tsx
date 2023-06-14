import NoSimulationFoundIcon from '@/components/icons/NoSimulationFoundIcon';

export default function NoSimulationFoundCard() {
  return (
    <div className="flex items-center justify-center bg-neutral-1 h-52 w-96 rounded">
      <div className="text-center m-24 text-neutral-5 font-semibold">
        <NoSimulationFoundIcon className="block m-auto" />
        <div className="mt-2">No Simulation for these dimensions combination</div>
      </div>
    </div>
  );
}
