import Image from 'next/image';

export default function SpikeRaster({ rasterImage }: { rasterImage: string }) {
  return (
    <div className="h-full basis-1/4 border-2 border-solid border-red-700">
      {rasterImage && (
        <Image
          src={rasterImage}
          className="h-auto w-full"
          height={100}
          width={100}
          alt="Spike Raster Image"
        />
      )}
    </div>
  );
}
