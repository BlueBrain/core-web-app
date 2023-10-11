import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { AssignedDimensionBoxProps } from '@/components/explore-section/Simulations/types';
import DimensionBoxEditForm from '@/components/explore-section/Simulations/DimensionBoxEditForm';

export default function AssignedDimensionBox({ dimension, isAxis }: AssignedDimensionBoxProps) {
  const [editMode, setEditMode] = useState<boolean>(false);

  const dimensionValue = () => {
    if (dimension.value.type === 'value') {
      return dimension.value.value;
    }
    if (dimension.value.type === 'range') {
      return (
        <>
          {dimension.value.minValue} - {dimension.value.maxValue} ({dimension.value.step})
        </>
      );
    }
    return null;
  };

  const changeEditMode = () => {
    setEditMode(true);
  };
  return (
    <button type="submit" onClick={changeEditMode}>
      <div className="flex flex-row justify-between">
        <div className="text-primary-7 font-semibold">{dimension?.id}</div>
      </div>
      {editMode ? (
        <DimensionBoxEditForm dimension={dimension} setEditMode={setEditMode} isAxis={isAxis} />
      ) : (
        <div className="mt-3 h-min w-fit px-3 py-1 border border-primary-2 font-bold flex">
          {dimensionValue()}
          <span className="ml-3 text-primary-3">
            <EditOutlined />
          </span>
        </div>
      )}
    </button>
  );
}
