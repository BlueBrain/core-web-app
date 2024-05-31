'use client';

import dynamic from 'next/dynamic';
import { SerializedEditorState } from 'lexical/LexicalEditorState';
import { Button } from 'antd';

import { DeleteOutline, EditDocument } from '@/components/icons/EditorIcons';
import { PaperResource } from '@/types/nexus';

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

export default function PaperView({
  config,
  paper,
}: {
  config: SerializedEditorState;
  paper: PaperResource;
}) {
  return (
    <div
      id="editor-view-container"
      className="secondary-scrollbar mt-4 flex h-full min-h-[calc(100vh-200px)] flex-col gap-y-2 overflow-y-auto bg-primary-9"
    >
      <div className="flex h-full flex-col bg-primary-9">
        <div className="w-full bg-white px-8 py-4">
          <div className="mt-4 flex items-center justify-end bg-white">
            <div className="flex items-center justify-center gap-4">
              <Button
                htmlType="button"
                type="text"
                size="large"
                className="flex items-center justify-center gap-2 rounded-none"
              >
                Edit
                <EditDocument className="h-7 w-7 group-hover:scale-105 group-hover:transform group-hover:text-gray-300" />
              </Button>
              <Button
                htmlType="button"
                type="text"
                size="large"
                className="flex items-center justify-center gap-2 rounded-none"
              >
                Delete paper
                <DeleteOutline className="h-7 w-7 group-hover:scale-105 group-hover:transform group-hover:text-gray-300" />
              </Button>
            </div>
          </div>
          <div className="my-4 flex w-full flex-col gap-2 bg-white">
            <PaperInfoItem isTitle label="Title" description={paper.name} />
            <PaperInfoItem label="Summary" description={paper.description} />
            <PaperInfoItem isTitle label="Source data" description="cADpyr model" />
          </div>
        </div>
        <div className="w-full flex-grow bg-white px-8 py-4">
          <Editor {...{ config, paper }} />
        </div>
      </div>
    </div>
  );
}
