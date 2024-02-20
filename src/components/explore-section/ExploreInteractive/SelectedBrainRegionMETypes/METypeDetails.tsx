import { useCallback, useMemo, useState } from 'react';
import { arrayToTree } from 'performant-array-to-tree';
import { DensityOrCountToggle } from './DensityOrCountToggle';
import { handleNavValueChange } from '@/components/BrainTree/util';
import { NavValue } from '@/state/brain-regions/types';
import { AnalysedComposition } from '@/types/composition/calculation';
import TreeNav from '@/components/TreeNavItem';
import { ClassNexus } from '@/api/ontologies/types';
import { getMetric } from '@/components/build-section/BrainRegionSelector/util';
import METypeTreeItem from '@/components/common/METypeHierarchy/METypeTreeItem';
import { DensityOrCount } from '@/components/common/METypeHierarchy/METypeTreeItem/types';
import { metricToUnit } from '@/components/common/METypeHierarchy/MetricToUnit';

type Props = {
  composition: AnalysedComposition;
  meTypesMetadata: Record<string, ClassNexus> | undefined | null;
};

export function METypeDetails({ composition, meTypesMetadata }: Props) {
  const [meTypeNavValue, setNavValue] = useState<NavValue>({});
  const [densityOrCount, setDensityOrCount] = useState<DensityOrCount>('count');

  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(meTypeNavValue, setNavValue);

      return callback(newValue, path);
    },
    [meTypeNavValue, setNavValue]
  );

  const neurons = useMemo(() => {
    return (
      composition &&
      arrayToTree(
        composition.nodes.map(({ neuronComposition: nodeNeuronComposition, label, ...node }) => ({
          ...node,
          composition: nodeNeuronComposition[densityOrCount],
          title: label,
        })),
        {
          dataField: null,
          parentId: 'parentId',
          childrenField: 'items',
        }
      )
    );
  }, [composition, densityOrCount]);

  return (
    neurons && (
      <>
        <h2
          className="flex justify-between text-lg font-bold text-white"
          data-testid="total-count-or-density"
        >
          <span className="justify-self-start">Neurons [{metricToUnit[densityOrCount]}]</span>
          <small className="text-base font-normal text-gray-300">
            ~ {getMetric(composition.totalComposition.neuron, densityOrCount)}
          </small>
        </h2>

        <DensityOrCountToggle
          densityOrCount={densityOrCount}
          selectDensityOrCount={(v) => setDensityOrCount(v)}
        />

        <div className="secondary-scrollbar h-full overflow-y-auto border border-gray-500 p-8">
          <h6 className="text-sm font-normal text-gray-400">M-TYPES</h6>
          <TreeNav items={neurons} onValueChange={onValueChange} value={meTypeNavValue}>
            {({ composition: renderedComposition, content, title, trigger, id, isExpanded }) => (
              <METypeTreeItem
                content={content}
                title={title}
                metadata={meTypesMetadata?.[id]}
                trigger={trigger}
                composition={renderedComposition}
                isLeaf={false}
                id={id}
                isExpanded={isExpanded}
                densityOrCount={densityOrCount}
                isEditable={false}
              >
                {({
                  content: nestedContent,
                  composition: nestedComposition,
                  title: nestedTitle,
                  trigger: nestedTrigger,
                  id: nestedId,
                }) => (
                  <METypeTreeItem
                    content={nestedContent}
                    composition={nestedComposition}
                    title={nestedTitle}
                    trigger={nestedTrigger}
                    isLeaf
                    id={nestedId}
                    metadata={meTypesMetadata?.[nestedId]}
                    densityOrCount={densityOrCount}
                    isEditable={false}
                  />
                )}
              </METypeTreeItem>
            )}
          </TreeNav>
        </div>
      </>
    )
  );
}
