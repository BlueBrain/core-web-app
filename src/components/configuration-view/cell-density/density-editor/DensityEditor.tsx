import DensityEditorTabLabel from './DensityEditorTabLabel';
import DensityEditorByLayer from './DensityEditorByLayer';
import DensityEditorByEType from './DensityEditorByEType';
import DensityEditorByMType from './DensityEditorByMType';
import DensityEditorBySynapseClass from './DensityEditorBySynapseClass';
import ContentTabs from '@/components/tabs/ContentTabs';

export default function DensityEditor() {
  return (
    <div>
      <ContentTabs
        items={[
          {
            label: <DensityEditorTabLabel text="By layer" />,
            key: 'by-layer',
            children: <DensityEditorByLayer />,
          },
          {
            label: <DensityEditorTabLabel text="By e-type" />,
            key: 'by-e-type',
            children: <DensityEditorByEType />,
          },
          {
            label: <DensityEditorTabLabel text="By m-type" />,
            key: 'by-m-type',
            children: <DensityEditorByMType />,
          },
          {
            label: <DensityEditorTabLabel text="By synapse class" />,
            key: 'by-synapse-class',
            children: <DensityEditorBySynapseClass />,
          },
        ]}
      />
    </div>
  );
}
