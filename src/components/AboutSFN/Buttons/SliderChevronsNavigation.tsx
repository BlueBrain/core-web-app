'use client';

import { ChevronLeft, ChevronRight } from '@/components/icons';

export default function SliderChevronsNavigation({
  activeItem,
  setActiveItem,
  totalItems,
}: {
  activeItem: number;
  setActiveItem: (direction: string) => void;
  totalItems: number;
}) {
  const chevronColor = (direction: 'prev' | 'next') => {
    let color = '#fff';

    if (direction === 'prev' && activeItem === 0) {
      color = '#1890FF';
    } else if (direction === 'next' && activeItem === totalItems - 1) {
      color = '#1890FF';
    }

    return color;
  };

  const progressiveLineWidth = (100 / totalItems) * (activeItem + 1);

  return (
    <div className="relative flex w-full flex-row items-center justify-between gap-x-12">
      <button
        type="button"
        onClick={() => setActiveItem('prev')}
        aria-label="Previous"
        disabled={activeItem === 0}
        className="flex h-10 w-10 items-center justify-center bg-primary-9 md:h-6 md:w-6"
      >
        <ChevronLeft fill={chevronColor('prev')} className="h-auto w-4 md:w-2" />
      </button>

      <div className="relative flex w-full flex-1 flex-row items-center gap-x-6 text-2xl md:gap-x-4 md:text-base">
        {activeItem + 1}
        <div className="relative block h-1 w-full bg-primary-7 md:h-px ">
          <div
            className="block h-full bg-white transition-width duration-300 ease-in-out"
            style={{ width: `${progressiveLineWidth}%` }}
          />
        </div>
        {totalItems}
      </div>

      <button
        type="button"
        onClick={() => setActiveItem('next')}
        aria-label="Next"
        disabled={activeItem + 1 === totalItems}
        className="flex h-10 w-10 items-center justify-center bg-primary-9 md:h-6 md:w-6"
      >
        <ChevronRight fill={chevronColor('next')} className="h-auto w-4 md:w-2" />
      </button>
    </div>
  );
}
