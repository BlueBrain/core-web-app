import Link from 'next/link';

export default function VirtualLabNavigationSidebar() {
  return (
    <Link href="/virtual-lab/sandbox/explore">
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
