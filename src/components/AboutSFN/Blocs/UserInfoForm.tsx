import FormInputBlock from './FormInputBlock';
import { SingleDocumentProps } from '@/types/about/document-download';
import { CloseIcon } from '@/components/icons';

export default function UserInfoForm({
  content,
  handleSubmit,
  setFormOpen,
}: {
  content: SingleDocumentProps;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFormOpen: (value: boolean) => void;
}) {
  return (
    <form
      name="marketing-form"
      className="relative flex h-2/3 w-2/3 flex-col justify-between bg-white p-24"
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
        <header className="relative mb-12 flex w-full flex-col">
          <div className="mb-2 text-4xl font-bold">Download {content.name}</div>
          <p className="font-sans text-lg font-light leading-normal">{content.description}</p>
        </header>
        <div className="flex flex-col gap-y-8">
          <div className="relative grid w-full grid-cols-2 gap-x-12 font-sans">
            <FormInputBlock
              name="firstName"
              label="First Name"
              type="text"
              placeholder="Enter your first name..."
              isRequired
            />
            <FormInputBlock
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Enter your last name..."
              isRequired
            />
          </div>
          <FormInputBlock
            name="email"
            label="email"
            type="email"
            placeholder="Enter your email address..."
            isRequired
          />
        </div>
      </div>
      <div className="relative flex flex-col gap-y-6">
        <p className="font-sans text-lg font-light leading-normal">
          By submitting this form, you agree to receive information from the Blue Brain Project.
        </p>
        <button
          type="submit"
          className="relative bg-primary-8 py-6 text-lg font-bold uppercase tracking-wider text-white"
        >
          Download PDF
        </button>
      </div>
    </form>
  );
}
