import {
  MModelPreviewImages,
  ParameterSliders,
} from '@/components/build-section/cell-model-assignment/';

export default function ConfigurationPage() {
  return (
    <div className="m-5 flex">
      <ParameterSliders />
      <MModelPreviewImages className="ml-5 flex-grow flex" />
    </div>
  );
}
