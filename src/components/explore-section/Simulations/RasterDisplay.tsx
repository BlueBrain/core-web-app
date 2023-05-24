import { CSSProperties, useMemo } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import range from 'lodash/range';
import rasterImage from './raster.jpg';
import { Dimension } from '@/types/explore-section';
import CenteredMessage from '@/components/CenteredMessage';

type RasterDisplayProps = {
  xDimension?: Dimension;
  yDimension?: Dimension;
};

type DimensionHeaderProps = {
  label: string;
  value: number;
  orientation: 'horizontal' | 'vertical';
};

function DimensionHeader({ label, value, orientation }: DimensionHeaderProps) {
  const style = (
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
      <div className="text-neutral-4 text-xs">{label}</div>
      <div>{value}</div>
    </div>
  );
}

export default function RasterDisplay({ xDimension, yDimension }: RasterDisplayProps) {
  const dataColSpan = useMemo(() => {
    if (!xDimension) {
      return undefined;
    }
    // specific case where the x dimension has only one column
    // in that case we hardcode he first column span to 8 in order to be centered
    if (xDimension.value.length === 1) {
      return 8;
    }
    const nums = range(22, 2, -1);
    const highest = nums.find((num) => num % xDimension.value.length === 0);
    return highest ? highest / xDimension.value.length : undefined;
  }, [xDimension]);

  const firstColSpan = useMemo(() => {
    if (!dataColSpan || !xDimension) {
      return undefined;
    }
    // specific case where the x dimension has only one column
    // in that case we hardcode he first column span to 2
    if (xDimension.value.length === 1) {
      return 2;
    }
    return 24 - dataColSpan * xDimension.value.length;
  }, [dataColSpan, xDimension]);

  if (!xDimension || !yDimension) {
    return (
      <CenteredMessage
        message="Select axes X and Y in order to display the spike rasters"
        icon={<InfoCircleOutlined className="text-6xl" />}
      />
    );
  }

  return (
    <div className="mt-7">
      <Row gutter={[16, 24]}>
        <Col span={firstColSpan} />
        {xDimension.value.map((x) => (
          <Col key={x} span={dataColSpan}>
            <DimensionHeader label={xDimension.label} value={x} orientation="horizontal" />
          </Col>
        ))}
      </Row>
      {[...yDimension.value].map((y) => (
        <Row key={y} gutter={[16, 24]}>
          {[0, ...xDimension.value].map((x, xIdx) => {
            if (xIdx === 0) {
              return (
                <Col key={x} span={firstColSpan}>
                  <DimensionHeader label={yDimension.label} value={y} orientation="vertical" />
                </Col>
              );
            }
            return (
              <Col key={x} span={dataColSpan}>
                <img src={rasterImage.src} alt="Displays a raster graph" />
              </Col>
            );
          })}
        </Row>
      ))}
    </div>
  );
}
