import { useState, ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import { Collapse } from 'antd';
import { activeResourceBasedRulesAtom } from '@/state/explore-section/generalization';

const { Panel } = Collapse;

const customCollapseStyles = {
  color: 'text-primary-5',
  borderRight: 'none',
  borderLeft: 'none',
  borderTop: '1px text-primary-9 solid',
  borderBottom: '1px text-primary-9 solid',
  borderRadius: '0px',
  background: 'none',
};

const simRulesHeader: ReactNode = (
  <h1 className="text-primary-8">
    Similarity rules <span className="font-bold">by shape</span>
  </h1>
);

function SimilarityRules({ resourceId }: { resourceId: string }) {
  const [expanded, setExpanded] = useState(false);
  const activeResourceBasedRules = useAtomValue(activeResourceBasedRulesAtom(resourceId));

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="col-span-3 w-[38rem]">
      <Collapse
        style={customCollapseStyles}
        activeKey={expanded ? resourceId : ''}
        onChange={toggleExpand}
        expandIconPosition="end"
      >
        <Panel header={simRulesHeader} key={resourceId}>
          <ul>
            {activeResourceBasedRules.map((obj) => (
              <li key={`${obj.id}-${obj.name}`} className="mt-2">
                <h1 className="text-primary-8 font-bold">{obj.displayName}</h1>
                <p className="text-primary-8 pl-2">{obj.description}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </Collapse>
    </div>
  );
}

export default SimilarityRules;
