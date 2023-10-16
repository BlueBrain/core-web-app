import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ExploreESHit } from '@/types/explore-section/es';
import Card from '@/components/explore-section/CardView/Card';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/es-experiment';

type CardViewProps = {
  data?: ExploreESHit[];
  experimentTypeName: string;
};

export default function CardView({ data, experimentTypeName }: CardViewProps) {
  if (!data || data.length === 0) {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  return (
    <div className="h-full grid grid-cols-3 gap-4">
      {data.map((d) => (
        <Card
          key={d._id}
          resource={d._source as ReconstructedNeuronMorphology}
          experimentTypeName={experimentTypeName}
        />
      ))}
    </div>
  );
}
