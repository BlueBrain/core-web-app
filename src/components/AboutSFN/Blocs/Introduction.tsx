import { INTRODUCTION_PARAGRAPH } from '@/constants/about/about-content';

export default function Introduction() {
  return (
    <div className="relative flex w-full flex-col text-white" id="introduction">
      <h1 className="mb-12 text-[100px] font-bold uppercase tracking-wider">about</h1>
      <div className="relative flex w-full flex-col gap-y-4">
        {INTRODUCTION_PARAGRAPH.map((paragraph: string, index: number) => (
          <div
            key={`about-introduction-paragraph-${paragraph.slice(0, 10)}`}
            className="font-sans text-3xl font-normal leading-normal"
          >
            {index !== 0 && <div className="mb-6 mt-2 block h-8 w-px bg-primary-3" />}
            <p>{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
