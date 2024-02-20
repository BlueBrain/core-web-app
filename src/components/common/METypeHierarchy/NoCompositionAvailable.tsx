import { MissingData } from '@/components/icons';

export function NoCompositionAvailable() {
  return (
    <div className="mt-48 flex flex-col gap-3 text-center">
      <MissingData className="w-full" style={{ color: '#fff' }} />
      <h3 className="text-base font-semibold text-white">
        No volume annotations
        <br />
        available for this brain region
      </h3>
    </div>
  );
}
