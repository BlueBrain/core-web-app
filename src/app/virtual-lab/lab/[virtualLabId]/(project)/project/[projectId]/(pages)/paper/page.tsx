import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/PaperEditor'), { ssr: false });

function PaperPage() {
  return (
    <div className="mt-4 h-[80vh] bg-white p-8 text-slate-800">
      <Editor />
    </div>
  );
}

export default PaperPage;
