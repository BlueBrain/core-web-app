import { basePath } from '@/config';

function Background() {
  return (
    <div className="absolute inset-0 bg-primary-9 flex flex-col items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        fetchPriority='high'
        src={`${basePath}/images/obp_fullbrain.png`}
        alt="Open Brain Platform Full Brain"
        className="max-w-[42%] h-auto mb-[76px]"
      />
    </div>
  );
}

function HeroText() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
      <div className="whitespace-pre-line text-center select-none text-white text-7xl font-bold">{`From models building to\nsimulation experiments`}</div>
    </div>
  );
}

function OBPLogo() {
  return (
    <div className="absolute top-7 left-7 z-20 pr-2 ">
      <h1 className="whitespace-pre-line text-left text-[2.4rem] leading-[90.5%] text-white font-extrabold uppercase p-1">{`Open\nBrain\nPlatform`}</h1>
    </div>
  );
}

export default function Splash() {
  return (
    <>
      <Background />
      <HeroText />
      <OBPLogo />
    </>
  );
}
