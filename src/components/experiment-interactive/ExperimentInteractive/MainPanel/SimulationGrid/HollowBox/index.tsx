import { AddSimulationButton } from './AddSimulationButton';

interface HollowBoxProps {
  index: number;
}

export default function HollowBox({ index }: HollowBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {index === 0 ? <AddSimulationButton /> : null}
    </div>
  );
}
