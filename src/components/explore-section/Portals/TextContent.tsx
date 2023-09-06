import { Portal } from '@/types/explore-portal';

export default function TextContent({ content }: { content: Portal }) {
  const contentDescription = `${content.description.slice(0, 110)}...`;

  return (
    <div className="w-full flex flex-col items-start justify-center pl-5">
      <h2 className="text-3xl font-bold leading-none text-white">{content.name}</h2>

      <div className="flex flex-row items-center mt-3 mb-2">
        <div className="flex flex-row gap-x-1 items-center">
          {content.categories.map((category: string) => (
            <div
              className="text-sm text-primary-0 font-light bg-primary-9 rounded-3xl px-4 py-1"
              key={`category-portal-${category}`}
            >
              {category}
            </div>
          ))}
        </div>
        <div className="font-normal text-xs text-primary-2 ml-2">
          Last update: {content.lastUpdate}
        </div>
      </div>

      <p className="font-light text-primary-1 leading-tight">{contentDescription}</p>
    </div>
  );
}
