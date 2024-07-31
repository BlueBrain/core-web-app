import View from './visualization/View';
import { EntityResource } from '@/types/nexus';

type Props = {
  resource: EntityResource;
};

export default function Visualization({ resource }: Props) {
  return <View resource={resource} />;
}
