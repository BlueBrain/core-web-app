import { Button } from 'antd';
import EModelView from '@/components/build-section/cell-model-assignment/e-model/EModelView';
import useNavigateToBuildEmodelConfiguration from '@/hooks/useNavigateToBuildEmodelConfiguration';

export default function Configuration() {
  const openConfigurationInBuild = useNavigateToBuildEmodelConfiguration();

  return (
    <div className="flex flex-col gap-6 pt-5">
      <EModelView showTitle={false} />
      <div className="flex w-full items-end justify-end">
        {/* Temporarily disable button for SfN */}
        <Button onClick={openConfigurationInBuild} disabled size="large">
          Open in build
        </Button>
      </div>
    </div>
  );
}
