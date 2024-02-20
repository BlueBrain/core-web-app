import { ConfigProvider, Spin, Tooltip } from 'antd';
import { ClassNexus } from '@/api/ontologies/types';
import { ETYPE_NEXUS_TYPE, MTYPE_NEXUS_TYPE } from '@/constants/ontologies';

export function METypeTooltip({
  metadata,
  isLeaf,
  title,
}: {
  metadata?: ClassNexus;
  isLeaf: boolean;
  title?: string;
}) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tooltip: {
            borderRadius: 0,
            paddingSM: 15,
            paddingXS: 15,
          },
        },
      }}
    >
      <Tooltip
        overlayStyle={{ width: 'fit-content', maxWidth: '500px' }}
        color="#FFF"
        title={
          metadata ? (
            <CompositionTooltip title={metadata.prefLabel} subclasses={metadata.subClassOf} />
          ) : (
            <Spin />
          )
        }
      >
        <span
          className={`font-bold ${isLeaf ? 'whitespace-nowrap text-secondary-4' : 'text-white'}`}
        >
          {title}
        </span>
      </Tooltip>
    </ConfigProvider>
  );
}

function CompositionTooltip({ title, subclasses }: { title?: string; subclasses?: string[] }) {
  const renderType = () => {
    if (subclasses?.includes(MTYPE_NEXUS_TYPE)) {
      return 'M-type';
    }
    if (subclasses?.includes(ETYPE_NEXUS_TYPE)) {
      return 'E-type';
    }
    return undefined;
  };

  if (!title || !subclasses) {
    return <div className="text-primary-8">Cell type information could not be retrieved</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="grow font-bold text-primary-8">{title}</div>
      <div className="flex-none text-neutral-4">{renderType()}</div>
    </div>
  );
}
