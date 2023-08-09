import React, { useState } from 'react';
import { Checkbox, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import InferenceRow from './InferenceRow';
import { findTitleAndCollectParentBrainRegions } from '@/components/Filter/util';
import { brainRegionsFilteredTreeAtom } from '@/state/brain-regions';
import useNotification from '@/hooks/notifications';
import { SIMILARITY_MODELS } from '@/constants/explore-section/kg-inference';

type InferenceTableProps = {
  brainRegionTitle: string;
};

const brainRegionsFilteredTreeLoadableAtom = loadable(brainRegionsFilteredTreeAtom);

function InferenceTable({ brainRegionTitle }: InferenceTableProps) {
  const [extendToParent, setExtendToParent] = useState(false);
  const notify = useNotification();

  const brainRegionsFilteredTree = useAtomValue(brainRegionsFilteredTreeLoadableAtom);

  const handleExtendToParentChange = (e: CheckboxChangeEvent) => {
    setExtendToParent(e.target.checked);
  };

  if (brainRegionsFilteredTree.state === 'hasError') {
    notify.error(brainRegionsFilteredTree.error as string);
    return null;
  }
  if (brainRegionsFilteredTree.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  const parentBrainRegions = findTitleAndCollectParentBrainRegions(
    brainRegionsFilteredTree.data,
    brainRegionTitle
  );

  return (
    <div className="p-4 text-white">
      <div className="flex items-center mb-4">
        <Checkbox
          className="mr-2 text-white text-sm p-0"
          checked={extendToParent}
          onChange={handleExtendToParentChange}
        >
          Extend to parent regions
        </Checkbox>
        <Checkbox className="text-white text-sm p-0">Extend to children regions</Checkbox>
      </div>

      {extendToParent && (
        <>
          {/* Row 2 */}
          <InferenceRow
            label="Go up to:"
            placeholder="Select parent.."
            options={parentBrainRegions}
          />

          {/* Row 3 */}
          <InferenceRow
            label="Exclude:"
            placeholder="Select parent.."
            options={parentBrainRegions}
          />

          {/* Row 4 */}
          <InferenceRow
            label="Similarity:"
            placeholder="Select model.."
            options={SIMILARITY_MODELS}
          />
        </>
      )}
    </div>
  );
}

export default InferenceTable;
