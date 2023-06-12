import { SwapOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import {
  axesAtom,
  otherDimensionsAtom,
  selectedXDimensionAtom,
  selectedYDimensionAtom,
} from '@/components/explore-section/Simulations/state';
import DimensionBox from '@/components/explore-section/Simulations/DimensionBox';

export default function DimensionSelector() {
  const xAxisDimension = useAtomValue(selectedXDimensionAtom);
  const yAxisDimension = useAtomValue(selectedYDimensionAtom);
  const otherDimensions = useAtomValue(otherDimensionsAtom);
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
              dismissFunc={() => setAxes({ ...axes, xAxis: undefined })}
              dismissible
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
              dismissFunc={() => setAxes({ ...axes, yAxis: undefined })}
              dismissible
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
                />
              </div>
            ))}
        </div>
      </div>
      <hr className="mt-4" />
    </>
  );
}
