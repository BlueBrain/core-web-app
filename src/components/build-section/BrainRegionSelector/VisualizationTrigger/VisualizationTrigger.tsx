import { useAtom, useAtomValue } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { meshDistributionsAtom, visibleBrainRegionsAtom } from '@/state/brain-regions';
import { useAtlasVisualizationManager } from '@/state/atlas';
import Checkbox from '@/components/Checkbox';
import { sectionAtom } from '@/state/application';

/**
 * This component select a specific brain region to be displayed in 3D view.
 * @param VisualizationTrigger.colorCode color of brain region
 * @param VisualizationTrigger.id id of brain region
 * @returns a checkbox that allow to select a brain region
 */
export default function VisualizationTrigger({ colorCode, id }: { colorCode: string; id: string }) {
  const section = useAtomValue(sectionAtom);
  if (!section) {
    throw new Error('Section is not set');
  }

  const [visibleBrainRegions, setVisibleBrainRegions] = useAtom(visibleBrainRegionsAtom(section));
  const meshDistributions = useAtomValue(meshDistributionsAtom);
  const meshDistribution = meshDistributions && meshDistributions[id];
  const atlas = useAtlasVisualizationManager();
  const cell = atlas.findVisibleCell(id);
  const mesh = meshDistribution && atlas.findVisibleMesh(meshDistribution.contentUrl);
  const selected = visibleBrainRegions.includes(id);

  const handleOnCheck = () => {
    if (meshDistribution && colorCode) {
      // previously cell button
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
    // previously mesh button
    if (visibleBrainRegions.includes(id)) {
      setVisibleBrainRegions(visibleBrainRegions.filter((_id) => _id !== id));
    } else {
      setVisibleBrainRegions([...visibleBrainRegions, id]);
    }
  };

  if (meshDistributions === undefined) {
    return <LoadingOutlined style={{ fontSize: '16px' }} />;
  }

  return (
    <Tooltip
      title={
        <span className="text-sm text-gray-500 select-none">
          Show <span className="text-sm font-bold text-primary-8">Brain Region</span>
        </span>
      }
      trigger="hover"
      overlayClassName="[&>.ant-tooltip-content>.ant-tooltip-inner]:bg-white [&>.ant-tooltip-arrow]:before:bg-white"
    >
      {/* this fragement added to allow the tooltip to work */}
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      <>
        <Checkbox
          id={`checkbox-${id}`}
          onChange={handleOnCheck}
          checked={selected}
          bgColor={colorCode}
        />
      </>
    </Tooltip>
  );
}
