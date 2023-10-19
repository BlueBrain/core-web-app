import InferenceTable from './InferenceTable'; // Make sure to import InferenceTable after the other components and functions
import { CheckListOption } from '@/components/Filter/CheckList';
import { CheckListProps } from '@/types/explore-section/application';

function listWithInference({
  options,
  renderLength,
  handleCheckedChange,
  filterField,
  search,
  loadMoreBtn,
  defaultRenderLength,
}: CheckListProps) {
  return (
    <>
      {options && options.length > defaultRenderLength && search()}
      <ul className="divide-y divide-white/20 flex flex-col space-y-3">
        {options?.slice(0, renderLength)?.map(({ checked, count, id, label }) => (
          <div key={id}>
            <CheckListOption
              checked={checked}
              count={count}
              key={id}
              handleCheckedChange={handleCheckedChange}
              id={id}
              filterField={filterField}
              label={label}
            />
            {checked && <InferenceTable brainRegionTitle={label} />}
          </div>
        ))}
      </ul>
      {options && options.length > defaultRenderLength && loadMoreBtn()}
    </>
  );
}

export default listWithInference;
