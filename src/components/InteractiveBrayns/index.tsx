import dynamic from 'next/dynamic';

const InteractiveBraynsPureClient = dynamic(() => import('./InteractiveBrayns'), { ssr: false });

export default function InteractiveBrayns() {
  return <InteractiveBraynsPureClient />;
}
