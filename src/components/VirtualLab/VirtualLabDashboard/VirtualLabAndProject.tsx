import VirtualLabBanner from '../VirtualLabBanner';

type Props = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function VirtualLabAndProject({ id, name, description, createdAt }: Props) {
  return <VirtualLabBanner id={id} name={name} description={description} createdAt={createdAt} />;
}
