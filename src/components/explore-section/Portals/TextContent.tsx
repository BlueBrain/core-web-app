import { Portal } from '@/types/explore-portal';

export default function TextContent({ content }: { content: Portal }) {
  const contentDescription = `${content.description.slice(0, 110)}...`;

  return (
    <div className="flex w-full flex-col items-start justify-center pl-5">
      <h2 className="text-3xl font-bold leading-none text-white">{content.name}</h2>

      <div className="mb-2 mt-3 flex flex-row items-center">
        <div className="flex flex-row items-center gap-x-1">
          {content.categories.map((category: string) => (
            <div
              className="rounded-3xl bg-primary-9 px-4 py-1 text-sm font-light text-primary-0"
              key={`category-portal-${category}`}
            >
              {category}
            </div>
          ))}
        </div>
        <div className="ml-2 text-xs font-normal text-primary-2">
          Last update: {content.lastUpdate}
        </div>
      </div>

      <p className="font-light leading-tight text-primary-1">{contentDescription}</p>
    </div>
  );
}
