import { useRouter } from 'next/navigation';

type Props = {
  title: string;
  description: string;
  buttonHref: string;
};

export default function ProjectItem({ title, description, buttonHref }: Props) {
  const router = useRouter();
  return (
    <div className="max-w-[365px] rounded bg-white p-6 text-primary-8">
      <div className="text-xl font-bold">{title}</div>
      <div className="truncate">{description}</div>
      <button
        className="mt-5 border px-6 py-2 font-semibold"
        type="button"
        onClick={() => {
          router.push(buttonHref);
        }}
      >
        View project
      </button>
    </div>
  );
}
