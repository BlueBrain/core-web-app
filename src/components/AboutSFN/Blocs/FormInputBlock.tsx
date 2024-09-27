import Slugify from '@/util/slugify';

export default function FormInputBlock({
  name,
  label,
  type,
  placeholder,
  isRequired,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  isRequired: boolean;
}) {
  return (
    <div className="relative flex flex-col gap-y-2 font-sans">
      <label
        className="relative text-lg font-bold uppercase tracking-wide"
        htmlFor={Slugify(label)}
      >
        {label}
        {isRequired && <span className="text-red-600"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="relative border-b border-solid border-primary-8 pb-2 focus:border-none"
        aria-label={Slugify(label)}
        id={Slugify(label)}
        required={isRequired}
      />
    </div>
  );
}
