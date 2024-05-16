import Link from 'next/link';

type Props = {
  link: string;
};

export default function VirtualLabNavigationSidebar({ link }: Props) {
  return (
    <Link href={link}>
      <div className="relative flex h-screen w-10 flex-col items-center justify-between bg-primary-9 pt-5 font-semibold">
        <span
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Open Brain Platform
        </span>
      </div>
    </Link>
  );
}
