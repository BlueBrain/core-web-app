import dynamic from 'next/dynamic';

const FeatureRows = dynamic(() => import('./FeatureRows'), { ssr: false });

export default function FeatureWithEModel() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-6 uppercase text-gray-500">
        <div>Feature name</div>
        <div>Value</div>
        <div>E-Model</div>
      </div>

      <FeatureRows />
    </div>
  );
}
