// TODO: this redirection page should be re-worked

import { useRouter } from 'next/navigation';

import { ExportOutlined } from '@ant-design/icons';

export default function EModelInteractiveView() {
  const router = useRouter();
  return (
    <>
      <div className="text-4xl">Simulate Single Neuron</div>
      <button
        onClick={() => router.push('/simulate/single-neuron/edit')}
        type="button"
        className="border border-white p-4"
      >
        <ExportOutlined /> Go to simulation application
      </button>
    </>
  );
}
