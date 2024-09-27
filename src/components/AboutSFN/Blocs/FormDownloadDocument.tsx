'use client';

import { useState } from 'react';

import UserInfoForm from './UserInfoForm';

import { SingleDocumentProps } from '@/types/about/document-download';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';
import downloadFileByHref from '@/util/downloadFileByHref';

export default function FormDownloadDocument({
  content,
  formOpen,
  setFormOpen,
}: {
  content: SingleDocumentProps;
  formOpen: boolean;
  setFormOpen: (value: boolean) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get('firstName'));
    const lastName = String(formData.get('lastName'));
    const email = String(formData.get('email'));

    try {
      const response = await fetch(`${basePath}/api/marketing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      });

      if (response.ok) {
        setStatus('success');
        const fileUrl = `${basePath}${content.url}`;
        downloadFileByHref(fileUrl, 'Brochure.pdf');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setFormOpen(false);
    }
  };

  return (
    <div
      className={classNames(
        'fixed left-0 top-0 z-[1000] flex h-screen w-screen  items-center justify-center bg-[rgba(0,39,102,0.8)] text-primary-8',
        formOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {status === 'idle' && (
        <UserInfoForm content={content} handleSubmit={handleSubmit} setFormOpen={setFormOpen} />
      )}
      {status === 'loading' && (
        <div className="relative flex h-2/3 w-2/3 flex-col justify-between bg-white p-24">
          <div className="relative font-sans text-4xl font-bold text-primary-8">Loading...</div>
        </div>
      )}
    </div>
  );
}
