import { useState } from 'react';
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
        <div>
          {dimension.value.minValue} - {dimension.value.maxValue}
        </div>
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
        <div>{dimension?.id}</div>
      </div>
      {editMode ? (
        <DimensionBoxEditForm dimension={dimension} setEditMode={setEditMode} isAxis={isAxis} />
      ) : (
        <div className="mt-3 h-min w-fit px-2 py-1 bg-sky-100 font-bold">{dimensionValue()}</div>
      )}
    </button>
  );
}
