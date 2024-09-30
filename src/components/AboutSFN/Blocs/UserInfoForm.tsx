import { useState } from 'react';
import { z } from 'zod';
import { LoadingOutlined } from '@ant-design/icons';

import FormInputBlock from './FormInputBlock';
import downloadFileByHref from '@/util/downloadFileByHref';

import { SingleDocumentProps } from '@/types/about/document-download';
import { classNames, getZodErrorPath } from '@/util/utils';
import { CloseIcon } from '@/components/icons';
import { basePath } from '@/config';

const contactSchema = z.object({
  firstName: z.string().min(4),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export default function UserInfoForm({
  content,
  setFormOpen,
}: {
  content: SingleDocumentProps;
  setFormOpen: (value: boolean) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<(string | number)[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrors([]);
    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get('firstName'));
    const lastName = String(formData.get('lastName'));
    const email = String(formData.get('email'));

    const { error, success } = await contactSchema.safeParseAsync({
      firstName,
      lastName,
      email,
    });

    if (error) {
      setErrors(getZodErrorPath(error));
      setStatus('error');
      return;
    }

    if (success) {
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
          downloadFileByHref(content.url, 'Brochure.pdf');
          setFormOpen(false);
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    }
  };
  return (
    <form
      name="marketing-form"
      className="relative z-[99999] flex h-full w-full flex-col justify-between bg-white p-10 md:p-12 xl:p-24"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="absolute right-6 top-6 bg-white p-4 text-primary-8"
        onClick={() => setFormOpen(false)}
        aria-label="Close form modal"
      >
        <CloseIcon className="block h-auto w-4" />
      </button>
      <div className="relative flex flex-col gap-y-6">
        <header className="relative mb-8 flex w-full flex-col md:mb-4 xl:mb-8">
          <div className="mb-2 text-4xl font-bold">Download {content.name}</div>
          <p className="font-sans text-lg font-light leading-normal">{content.description}</p>
        </header>
        <div className="flex flex-col gap-y-8">
          <div className="relative contents w-full grid-cols-2 gap-x-12 font-sans xl:grid">
            <FormInputBlock
              isRequired
              name="firstName"
              label="First Name"
              type="text"
              placeholder="Enter your first name..."
              error={errors.includes('firstName')}
            />
            <FormInputBlock
              isRequired
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Enter your last name..."
              error={errors.includes('lastName')}
            />
          </div>
          <FormInputBlock
            isRequired
            name="email"
            label="email"
            type="email"
            placeholder="Enter your email address..."
            error={errors.includes('email')}
          />
        </div>
      </div>
      <div className="relative mt-4 flex flex-col gap-y-2 md:mt-10 xl:mt-4">
        <p className="font-sans text-base font-light leading-normal">
          By submitting this form, you agree to receive information from the Blue Brain Project.
        </p>
        <button
          type="submit"
          className={classNames(
            'relative bg-primary-8 py-6 text-lg font-bold uppercase tracking-wider text-white',
            'flex items-center justify-center gap-4'
          )}
        >
          {status === 'loading' && <LoadingOutlined spin className="text-white" />}
          <span>Download PDF</span>
        </button>
        {status === 'error' && (
          <p className="font-light text-red-600">
            We encountered an issue with your submission. Please verify the form, and try again. If
            the problem persists, feel free to contact us.
          </p>
        )}
      </div>
    </form>
  );
}
