import { Radio, Dropdown, Menu } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { cardsMetricsAtom, selectedCardsMetricAtom } from '@/state/explore-section/generalization';
import CardOptions from '@/components/icons/CardOptions';

function CardsControl() {
  const cardsMetrics = useAtomValue(cardsMetricsAtom);

  const [selectedCardsMetric, setSelectedCardsMetric] = useAtom(selectedCardsMetricAtom);

  if (!cardsMetrics) return null;

  const menu = (
    <Menu>
      <p className="text-gray-500 font-thin ml-4 pt-2">Parameters to display in cards:</p>
      {cardsMetrics.map((metric) => (
        <Menu.Item key={metric.id} onClick={() => setSelectedCardsMetric(metric.id)}>
          <Radio
            checked={selectedCardsMetric === metric.id}
            value={metric.id}
            className="text-primary-9 font-semibold"
          >
            {metric.name}
          </Radio>
          <p className="text-gray-500 font-thin ml-7">{metric.description}</p>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      placement="bottomRight"
      className="cursor-pointer	ml-5 min-w-[16rem] bg-white flex gap-10 items-center justify-between max-h-[56px] rounded-md p-5 border-gray-200 border"
    >
      <span className="flex items-center">
        <span className="mr-2 text-primary-9 font-semibold">Cards</span>
        <CardOptions className="mt-[2px]" />
      </span>
    </Dropdown>
  );
}

export default CardsControl;
