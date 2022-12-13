import Image from 'next/image';

export default function SpikeRaster({ rasterImage }: { rasterImage: string }) {
  return (
    <div className="h-full basis-1/4">
      {rasterImage && (
        <Image
          src={rasterImage}
          className="w-full h-auto"
          height={100}
          width={100}
          alt="Spike Raster Image"
        />
      )}
    </div>
  );
}
