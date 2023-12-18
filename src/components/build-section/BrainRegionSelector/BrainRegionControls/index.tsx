import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { unwrap } from 'jotai/utils';
import map from 'lodash/map';
import omit from 'lodash/omit';
import intersection from 'lodash/intersection';

import {
  dataBrainRegionsAtom,
  meshDistributionsAtom,
  selectedBrainRegionsWithChildrenAtom,
  visibleBrainRegionsAtom,
} from '@/state/brain-regions';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { sectionAtom } from '@/state/application';
import Checkbox from '@/components/Checkbox';
import { EyeIcon } from '@/components/icons';
import EyeSlashIcon from '@/components/icons/EyeSlashIcon';
import { getBrainRegionDescendants } from '@/state/brain-regions/descendants';

function InfoTooltip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Tooltip
      title={<span className="text-sm font-bold text-primary-8">{title}</span>}
      trigger="hover"
      overlayClassName="[&>.ant-tooltip-content>.ant-tooltip-inner]:bg-white [&>.ant-tooltip-arrow]:before:bg-white"
    >
      {children}
    </Tooltip>
  );
}

/**
 * This component select a specific brain region to be displayed in 3D view.
 * @param BrainRegionControls.colorCode color of brain region
 * @param BrainRegionControls.id id of brain region
 * @returns a checkbox that allow to select a brain region
 */
export default function BrainRegionControls({ colorCode, id }: { colorCode: string; id: string }) {
  const section = useAtomValue(sectionAtom);
  if (!section) {
    throw new Error('Section is not set');
  }
  const [visibleBrainRegions, setVisibleBrainRegions] = useAtom(visibleBrainRegionsAtom(section));
  const brainRegions = useAtomValue(useMemo(() => unwrap(getBrainRegionDescendants([id])), [id]));
  const [dataBrainRegions, setDataBrainRegions] = useAtom(dataBrainRegionsAtom);
  const selectedBrainRegionsAndChildren = useAtomValue(selectedBrainRegionsWithChildrenAtom);
  const meshDistributions = useAtomValue(meshDistributionsAtom);
  const meshDistribution = meshDistributions && meshDistributions[id];
  const atlas = useAtlasVisualizationManager();
  const cell = atlas.findVisibleCell(id);
  const mesh = meshDistribution && atlas.findVisibleMesh(meshDistribution.contentUrl);
  const displayed = visibleBrainRegions.includes(id);
  const selected = selectedBrainRegionsAndChildren.includes(id);
  const showCheckbox = section === 'explore';

  const handleOnAddVisibleRegionsEntry = () => {
    if (meshDistribution && colorCode) {
      if (cell) {
        atlas.removeVisibleCells(cell.regionID);
      } else {
        atlas.addVisibleObjects({
          type: 'cell',
          regionID: id,
          color: colorCode,
          isLoading: false,
          hasError: false,
        });
      }
      if (mesh) {
        atlas.removeVisibleMeshesOrPointClouds(mesh.contentURL, id);
      } else {
        atlas.addVisibleObjects(
          {
            type: 'mesh',
            contentURL: meshDistribution.contentUrl,
            color: colorCode,
            isLoading: false,
            hasError: false,
          },
          {
            type: 'pointCloud',
            regionID: id,
            color: colorCode,
            isLoading: false,
            hasError: false,
          }
        );
      }
    }

    if (visibleBrainRegions.includes(id)) {
      setVisibleBrainRegions(visibleBrainRegions.filter((_id) => _id !== id));
    } else {
      setVisibleBrainRegions([...visibleBrainRegions, id]);
    }
  };

  const handleOnAddDataRegionsEntry = async () => {
    const childrenOfCurrent = map(brainRegions, 'id');

    let updatedDataBrainRegions: Record<string, string[]>;

    if (selectedBrainRegionsAndChildren.includes(id)) {
      const brainRegionsToRemove = [id, ...childrenOfCurrent];

      // Remove manually selected brainRegions
      updatedDataBrainRegions = omit(dataBrainRegions, brainRegionsToRemove);

      // Remove automatically selected brainRegions (which are present inside the arrays of `dataBrainRegions`)
      Object.entries(updatedDataBrainRegions).forEach(([parent, children]) => {
        if (intersection(children, brainRegionsToRemove).length > 0) {
          updatedDataBrainRegions[parent] = children.filter(
            (child) => !brainRegionsToRemove.includes(child)
          );
        }
      });
    } else {
      updatedDataBrainRegions = { ...dataBrainRegions, [id]: [...childrenOfCurrent] };
    }
    setDataBrainRegions(updatedDataBrainRegions);
  };

  if (meshDistributions === undefined) {
    return <LoadingOutlined style={{ fontSize: '16px' }} />;
  }

  return (
    <div className="flex gap-2">
      <InfoTooltip title="Visualize brain region mesh">
        <button
          id={`eye-${id}`}
          type="button"
          onClick={handleOnAddVisibleRegionsEntry}
          aria-label="visualize brain region mesh"
          className="group"
        >
          {displayed ? (
            <EyeSlashIcon
              className="w-5 h-5 group-hover:!text-white"
              style={{ color: colorCode }}
            />
          ) : (
            <EyeIcon className="w-5 h-5 group-hover:!text-white" style={{ color: colorCode }} />
          )}
        </button>
      </InfoTooltip>
      {showCheckbox && (
        <InfoTooltip title="Show region-specific data">
          <Checkbox
            id={`data-checkbox-${id}`}
            onChange={handleOnAddDataRegionsEntry}
            checked={selected}
            bgColor={colorCode}
          />
        </InfoTooltip>
      )}
    </div>
  );
}
