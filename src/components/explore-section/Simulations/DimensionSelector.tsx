import { SwapOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  axesAtom,
  modifyDimensionValue,
  otherDimensionsAtom,
  selectedXDimensionAtom,
  selectedYDimensionAtom,
} from '@/components/explore-section/Simulations/state';
import DimensionBox from '@/components/explore-section/Simulations/DimensionBox';
import { Dimension } from '@/components/explore-section/Simulations/types';

export default function DimensionSelector({ coords }: { coords?: { [id: string]: number[] } }) {
  const xAxisDimension = useAtomValue(selectedXDimensionAtom);
  const yAxisDimension = useAtomValue(selectedYDimensionAtom);
  const otherDimensions = useAtomValue(otherDimensionsAtom);
  const dimensionModifier = useSetAtom(modifyDimensionValue);
  const [axes, setAxes] = useAtom(axesAtom);

  const dimensionOptions = otherDimensions
    ? otherDimensions.map((dim) => ({
        value: dim.id,
        label: dim.id,
      }))
    : [];

  const swapAxes = () => {
    setAxes({ xAxis: axes.yAxis, yAxis: axes.xAxis });
  };

  /**
   * Function that modifies the dimension value.
   *
   * If the currently selected dimension value is a range, sets the value to be the min value
   * If the currently selected dimension value is a comma-separated value, sets the value to be the first element
   * @param dimension
   */
  const modifyValue = (dimension: Dimension) => {
    let newValue: string = '';
    if (dimension.value.type === 'range') {
      newValue = dimension.value.minValue;
    } else if (dimension.value.type === 'value') {
      [newValue] = dimension.value.value.split(',');
    }
    dimensionModifier(dimension.id, {
      type: 'value',
      value: newValue,
    });
  };

  /**
   * Function to dismiss the axis dimension. Before dismissing it, it changes the value
   * to a single value since the dimension will belong to "other dimension" which
   * requires single value
   *
   * @param dismissedAxis x or y axis that changes
   */
  const dismissAxisDimension = (dismissedAxis: 'x' | 'y') => {
    if (dismissedAxis === 'x' && xAxisDimension) {
      modifyValue(xAxisDimension);
      setAxes({ ...axes, xAxis: undefined });
    } else if (dismissedAxis === 'y' && yAxisDimension) {
      modifyValue(yAxisDimension);
      setAxes({ ...axes, yAxis: undefined });
    }
  };

  const swapVisible = axes.xAxis && axes.yAxis;
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-row gap-4 h-fit">
          <div className="flex-1">
            <DimensionBox
              dimension={xAxisDimension}
              title="Axis X"
              dimensionOptions={dimensionOptions}
              setAxis={(value: string) => setAxes({ ...axes, xAxis: value })}
              dismissFunc={() => dismissAxisDimension('x')}
              dismissible
              isAxis
              possibleValues={xAxisDimension && coords?.[xAxisDimension?.id]}
            />
          </div>
          {swapVisible && (
            <Button
              className="flex-none top-1/2 h-auto"
              type="link"
              icon={<SwapOutlined />}
              onClick={swapAxes}
            />
          )}
          <div className="flex-1">
            <DimensionBox
              dimension={yAxisDimension}
              title="Axis Y"
              dimensionOptions={dimensionOptions}
              setAxis={(value: string) => setAxes({ ...axes, yAxis: value })}
              dismissFunc={() => dismissAxisDimension('y')}
              dismissible
              isAxis
              possibleValues={yAxisDimension && coords?.[yAxisDimension?.id]}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {otherDimensions &&
            otherDimensions.map((dim, idx) => (
              <div key={dim.id}>
                <DimensionBox
                  dimension={dim}
                  title={idx === 0 ? 'Other Dimensions' : undefined}
                  dimensionOptions={dimensionOptions}
                  dismissible={false}
                  isAxis={false}
                  possibleValues={coords?.[dim.id]}
                />
              </div>
            ))}
        </div>
      </div>
      <hr className="mt-4" />
    </>
  );
}
