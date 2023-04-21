import { DeltaResource } from '@/types/explore-section';

export default function DetailHeaderName({ detail }: { detail: DeltaResource | null }) {
  if (!detail) return <>Not Found</>;
  // TODO: Add revision changing
  return (
    <>
      <div className="text-xs font-thin text-primary-7">Name</div>
      <div className="font-bold text-xl text-primary-7">{detail?.name}</div>
    </>
  );
}
