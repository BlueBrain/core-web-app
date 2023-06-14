import raster from './SimulationDisplayCard/raster.jpg';
import movie from './movie.png';
import psth from './psth.png';
import ImageReport from './ImageReport';

export default function SimulationReports() {
  return (
    <div className="text-primary-7 mt-7">
      <div className="text-primary-7">
        <span className="text-2xl font-bold">Reports</span>
        <span className="ml-3 text-xs">(3)</span>
      </div>
      <div className="grid grid-cols-3 mt-4">
        <ImageReport imageSource={raster.src} title="Spike Raster" />
        <ImageReport imageSource={movie.src} title="Movie" />
        <ImageReport imageSource={psth.src} title="PSTH Plot" />
      </div>
    </div>
  );
}
