'use client';

import UserInfoForm from './UserInfoForm';

import { SingleDocumentProps } from '@/types/about/document-download';
import { classNames } from '@/util/utils';

export default function FormDownloadDocument({
  content,
  formOpen,
  setFormOpen,
}: {
  content: SingleDocumentProps;
  formOpen: boolean;
  setFormOpen: (value: boolean) => void;
}) {
  return (
    <>
      <div className="fixed left-0 top-0 z-[5555] h-screen w-screen bg-primary-7 opacity-50 backdrop-blur-lg" />
      <div
        className={classNames(
          'fixed left-1/2 top-1/2 z-[99999] flex h-screen w-screen  -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[rgba(0,39,102,0.8)] text-primary-8 md:h-3/4 md:w-3/4 xl:h-2/3 xl:w-2/3',
          formOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <UserInfoForm content={content} setFormOpen={setFormOpen} />
      </div>
    </>
  );
}
