import { CSSProperties, useMemo } from 'react';
import { Col, Row } from 'antd';
import range from 'lodash/range';
import { useAtomValue } from 'jotai';
import { InfoCircleOutlined } from '@ant-design/icons';
import CenteredMessage from '@/components/CenteredMessage';
import SimulationDisplayCard from '@/components/explore-section/Simulations/SimulationDisplayCard';
import {
  otherDimensionsAtom,
  selectedXDimensionAtom,
  selectedYDimensionAtom,
} from '@/components/explore-section/Simulations/state';
import calculateDimensionValues from '@/api/explore-section/dimensions';
import findSimulation from '@/api/explore-section/simulations';
import NoSimulationFoundCard from '@/components/explore-section/Simulations/NoSimulationFoundCard';
import { useEnsuredPath, useUnwrappedValue } from '@/hooks/hooks';
import { simulationsFamily } from '@/state/explore-section/simulation-campaign';

type SimulationDisplayGridProps = {
  display?: string;
  customReportIds?: string[];
  status: string;
};

type DimensionHeaderProps = {
  label: string;
  value: number;
  orientation: 'horizontal' | 'vertical';
};

function DimensionHeader({ label, value, orientation }: DimensionHeaderProps) {
  const style: CSSProperties = (
    orientation === 'vertical'
      ? {
          writingMode: 'sideways-lr',
          textOrientation: 'mixed',
          position: 'relative',
          left: '25%',
        }
      : {}
  ) as CSSProperties;

  if (orientation === 'vertical' && label.length < 30) {
    style.top = '25%';
  }

  return (
    <div key={value} className="text-center" style={style}>
      <div className="text-xs text-neutral-4">{label}</div>
      <div>{value}</div>
    </div>
  );
}

export default function SimulationsDisplayGrid({
  display,
  status,
  customReportIds,
}: SimulationDisplayGridProps) {
  const path = useEnsuredPath();
  const simulations = useUnwrappedValue(simulationsFamily(path));
  const xDimension = useAtomValue(selectedXDimensionAtom);
  const yDimension = useAtomValue(selectedYDimensionAtom);
  const otherDimensions = useAtomValue(otherDimensionsAtom);
  const xDimensionValues = useMemo(() => {
    if (xDimension) {
      return calculateDimensionValues(xDimension.value);
    }

    return [];
  }, [xDimension]);

  const yDimensionValues = useMemo(() => {
    if (yDimension) {
      return calculateDimensionValues(yDimension.value);
    }

    return [];
  }, [yDimension]);

  const dataColSpan = useMemo(() => {
    // specific case where the x dimension has only one column
    // in that case we hardcode he first column span to 8 in order to be centered
    if (xDimensionValues.length === 1) {
      return 8;
    }

    const nums = range(22, 2, -1);
    const highest = nums.find((num) => num % xDimensionValues.length === 0);

    return highest ? highest / xDimensionValues.length : undefined;
  }, [xDimensionValues.length]);

  const firstColSpan = useMemo(() => {
    if (!dataColSpan) {
      return undefined;
    }

    // specific case where the x dimension has only one column
    // in that case we hardcode he first column span to 2
    if (xDimensionValues.length === 1) {
      return 2;
    }

    return 24 - dataColSpan * xDimensionValues.length;
  }, [dataColSpan, xDimensionValues.length]);

  if (!xDimension || !yDimension) {
    return (
      <CenteredMessage
        message="Select both an X and Y axes to display simulation"
        icon={<InfoCircleOutlined className="text-7xl" />}
      />
    );
  }

  return (
    <div className="mt-7">
      <Row gutter={[16, 24]}>
        <Col span={firstColSpan} />
        {xDimensionValues.map((x) => (
          <Col key={x} span={dataColSpan}>
            <DimensionHeader label={xDimension.id} value={x} orientation="horizontal" />
          </Col>
        ))}
      </Row>
      {[...yDimensionValues].map((y) => (
        <Row key={y} gutter={[16, 24]}>
          {[0, ...xDimensionValues].map((x, xIdx) => {
            if (xIdx === 0) {
              return (
                <Col key={x} span={firstColSpan}>
                  <DimensionHeader label={yDimension.id} value={y} orientation="vertical" />
                </Col>
              );
            }
            const simulation =
              simulations &&
              findSimulation(x, y, xDimension, yDimension, simulations, status, otherDimensions);

            return (
              <Col key={x} span={dataColSpan} className="mt-3 flex items-center justify-center">
                {simulation ? (
                  <SimulationDisplayCard
                    name={display}
                    simulation={simulation}
                    customReportIds={customReportIds}
                    xDimension={xDimension.id}
                    yDimension={yDimension.id}
                  />
                ) : (
                  <NoSimulationFoundCard />
                )}
              </Col>
            );
          })}
        </Row>
      ))}
    </div>
  );
}
