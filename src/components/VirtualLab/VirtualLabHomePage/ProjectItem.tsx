import Link from 'next/link';

type Props = {
  title: string;
  description: string;
  buttonHref?: string;
};

export default function ProjectItem({ title, description, buttonHref }: Props) {
  return (
    <div className="flex grow flex-col gap-3 rounded bg-white p-6 text-primary-8">
      <div className="text-xl font-bold">{title}</div>
      <div className="truncate">{description}</div>
      {buttonHref && (
        <div className="my-2">
          <Link className="border px-6 py-2 font-semibold" type="button" href={buttonHref}>
            View project
          </Link>
        </div>
      )}
    </div>
  );
}
