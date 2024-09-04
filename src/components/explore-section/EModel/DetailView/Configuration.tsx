import { Button } from 'antd';
import EModelView from '@/components/build-section/cell-model-assignment/e-model/EModelView';
import useNavigateToBuildEmodelConfiguration from '@/hooks/useNavigateToBuildEmodelConfiguration';

export default function Configuration() {
  const openConfigurationInBuild = useNavigateToBuildEmodelConfiguration();

  return (
    <div className="-mt-7">
      <div className="mb-6 border border-primary-8 p-6">
        <EModelView showTitle={false} />
      </div>
      <div className="flex w-full items-end justify-end">
        {/* Temporarily disable button for SfN */}
        <Button onClick={openConfigurationInBuild} disabled size="large">
          Open in build
        </Button>
      </div>
    </div>
  );
}
