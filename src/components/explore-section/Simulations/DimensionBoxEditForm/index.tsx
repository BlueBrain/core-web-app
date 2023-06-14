import { DimensionBoxEditFormProps } from '@/components/explore-section/Simulations/types';
import AxisDimensionBoxEditForm from '@/components/explore-section/Simulations/DimensionBoxEditForm/AxisDimensionBoxEditForm';
import OtherDimensionBoxEditForm from '@/components/explore-section/Simulations/DimensionBoxEditForm/OtherDimensionBoxEditForm';

export default function DimensionBoxEditForm({
  dimension,
  setEditMode,
  isAxis,
}: DimensionBoxEditFormProps) {
  if (isAxis) {
    return <AxisDimensionBoxEditForm dimension={dimension} setEditMode={setEditMode} />;
  }
  return <OtherDimensionBoxEditForm dimension={dimension} setEditMode={setEditMode} />;
}
