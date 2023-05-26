import { Dispatch, SetStateAction, useMemo } from 'react';
import { SwapOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { AxesState, DeltaResource } from '@/types/explore-section';
import DimensionBox from '@/components/explore-section/Simulations/DimensionBox';

type DimensionsProps = {
  resource: DeltaResource;
  axes: AxesState;
  setAxes: Dispatch<SetStateAction<AxesState>>;
};

export default function DimensionSelector({ resource, axes, setAxes }: DimensionsProps) {
  const xAxisDimension = useMemo(
    () => resource.dimensions?.find((dim) => dim.label === axes.xAxis),
    [axes.xAxis, resource.dimensions]
  );
  const yAxisDimension = useMemo(
    () => resource.dimensions?.find((dim) => dim.label === axes.yAxis),
    [axes.yAxis, resource.dimensions]
  );

  const otherDimensions = useMemo(
    () =>
      resource.dimensions?.filter((dim) => dim.label !== axes.xAxis && dim.label !== axes.yAxis),
    [axes.xAxis, axes.yAxis, resource.dimensions]
  );

  const dimensionOptions = otherDimensions
    ? otherDimensions.map((dim) => ({
        value: dim.label,
        label: dim.label,
      }))
    : [];

  const swapAxes = () => {
    setAxes({ xAxis: axes.yAxis, yAxis: axes.xAxis });
  };

  const swapVisible = axes.xAxis && axes.yAxis;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-row gap-4">
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
              className="flex-none top-1/2"
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
              <div key={dim.label}>
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
