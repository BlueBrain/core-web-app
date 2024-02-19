import { useMemo } from 'react';
import { METypeTreeItemProps } from './types';
import { ETYPE_NEXUS_TYPE, MTYPE_NEXUS_TYPE } from '@/constants/ontologies';
import { formatNumber } from '@/util/common';
import { classNames } from '@/util/utils';

export function METypeTreeItem({
  composition,
  title,
  trigger, // A callback that returns the <Accordion.Trigger/>
  content, // A callback that returns the <Accordion.Content/>
  isLeaf,
  id,
  isExpanded,
  metadata,
}: METypeTreeItemProps) {
  const metadataTitle = useMemo(() => {
    if (!metadata?.prefLabel || !metadata.subClassOf) {
      return 'Cell type information could not be retrieved';
    }
    if (metadata.subClassOf.includes(MTYPE_NEXUS_TYPE)) {
      return `${metadata.prefLabel} (MType)`;
    }
    if (metadata.subClassOf.includes(ETYPE_NEXUS_TYPE)) {
      return `${metadata.prefLabel} (EType)`;
    }
    return metadata.prefLabel;
  }, [metadata?.prefLabel, metadata?.subClassOf]);

  return (
    <>
      <div
        key={id}
        className={classNames(
          'flex items-center justify-between whitespace-nowrap text-white',
          isLeaf ? 'mt-5 gap-3 pb-0 text-secondary-4' : 'w-full gap-2 py-3 text-left text-primary-3'
        )}
      >
        <div className="flex items-center gap-3 font-bold" title={`${metadataTitle}`}>
          {title}
        </div>
        <div className={`flex items-center ${isLeaf ? 'gap-3' : 'gap-2'}`}>
          <span className="ml-auto text-white">{formatNumber(composition)}</span>
          {!isLeaf && trigger?.()}
        </div>
      </div>
      {isLeaf && trigger?.()}
      {!isLeaf && isExpanded && <h6 className="ml-4 text-sm font-normal text-gray-400">E-TYPES</h6>}
      {isLeaf ? content?.() : content?.({ className: '-mt-3' })}
    </>
  );
}
