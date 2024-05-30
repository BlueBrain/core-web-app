'use client';

import dynamic from 'next/dynamic';

// import { ServerSideComponentProp } from '@/types/common';
import { DeleteOutline, EditDocument } from '@/components/icons/EditorIcons';

const Editor = dynamic(() => import('@/components/papers/PaperEditor'), { ssr: false });

function PaperInfoItem({
  label,
  description,
  isTitle = false,
}: {
  label: string;
  description: string;
  isTitle?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="text-base text-neutral-4">{label}</h3>
      {isTitle ? (
        <h1 className="text-xl font-bold text-primary-8">{description}</h1>
      ) : (
        <p className="text-lg text-primary-8">{description}</p>
      )}
    </div>
  );
}

// type Props = ServerSideComponentProp<{
//   virtualLabId: string;
//   projectId: string;
//   paperId: string
// }>;

function PaperPage() {
  return (
    <div className="mt-4 flex h-full min-h-[80vh] flex-col gap-y-2 overflow-y-auto bg-white px-8 pb-40">
      <div className="mt-4 flex items-center justify-end">
        <div className="flex items-center justify-center gap-8">
          <button
            type="button"
            className="group flex items-center justify-center gap-2 rounded-none text-primary-8 hover:font-bold hover:text-primary-9"
          >
            Edit
            <EditDocument className="h-7 w-7 group-hover:scale-105 group-hover:transform group-hover:text-gray-300" />
          </button>
          <button
            type="button"
            className="group flex items-center justify-center gap-2 rounded-none text-primary-8 hover:font-bold hover:text-primary-9"
          >
            Delete paper
            <DeleteOutline className="h-7 w-7 group-hover:scale-105 group-hover:transform group-hover:text-gray-300" />
          </button>
        </div>
      </div>
      <div className="my-4 flex w-full flex-col gap-2">
        <PaperInfoItem
          isTitle
          label="Title"
          description="Thalamus observation of neuron 019.234.599"
        />
        <PaperInfoItem
          label="Summary"
          description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet beatae numquam, labore odio nisi optio explicabo eaque excepturi hic nesciunt id ex, illum ipsam sint temporibus cum blanditiis et! Minima."
        />
        <PaperInfoItem isTitle label="Source data" description="cADpyr model" />
      </div>
      <Editor />
    </div>
  );
}

export default PaperPage;
