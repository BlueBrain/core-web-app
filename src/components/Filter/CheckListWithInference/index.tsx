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
        {options?.slice(0, renderLength)?.map(({ checked, count, key }) => (
          <div key={key}>
            <CheckListOption
              checked={checked}
              count={count}
              key={key}
              handleCheckedChange={handleCheckedChange}
              id={key}
              filterField={filterField}
            />
            {checked && <InferenceTable brainRegionTitle={key} />}
          </div>
        ))}
      </ul>
      {options && options.length > defaultRenderLength && loadMoreBtn()}
    </>
  );
}

export default listWithInference;
