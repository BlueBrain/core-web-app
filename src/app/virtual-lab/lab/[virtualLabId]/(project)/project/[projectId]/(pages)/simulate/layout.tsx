import { ReactNode } from 'react';

export default function VirtualLabProjectSimulateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* TODO: Add carousel of different scales */}
      <div className="mb-4 bg-white p-[40px] text-center text-black">Carousel Placeholder</div>
      {children}
    </>
  );
}
