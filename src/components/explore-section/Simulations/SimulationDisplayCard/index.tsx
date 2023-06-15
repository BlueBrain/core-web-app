import { InfoCircleOutlined } from '@ant-design/icons';
import raster from './raster.jpg';
import voltage from './voltage.jpg';
import imagery from './imagery.jpg';
import CenteredMessage from '@/components/CenteredMessage';
import SimulationCard from '@/components/explore-section/Simulations/SimulationDisplayCard/SimulationCard';
import { SimulationResource } from '@/types/explore-section/resources';

type SimulationDisplayCardProps = {
  display: string;
  simulation: SimulationResource;
  xDimension: string;
  yDimension: string;
};

export default function SimulationDisplayCard({
  display,
  simulation,
  xDimension,
  yDimension,
}: SimulationDisplayCardProps) {
  switch (display) {
    case 'raster':
      return <img src={raster.src} />;
    case 'voltage':
      return <img src={voltage.src} />;
    case 'imagery':
      return <img src={imagery.src} />;
    case 'status':
      return (
        <SimulationCard simulation={simulation} xDimension={xDimension} yDimension={yDimension} />
      );
    default:
      return (
        <CenteredMessage
          message="This display is not implemented yet"
          icon={<InfoCircleOutlined className="text-5xl" />}
        />
      );
  }
}
