import * as Checkbox from '@radix-ui/react-checkbox';
import { format } from 'date-fns';
import { CheckIcon } from '@/components/icons';
import { CheckListDescription } from '@/components/Filter/CheckList/Description';

const DisplayLabel = (filterField: string, key: string): string | null => {
  switch (filterField) {
    case 'updatedAt':
      return format(new Date(Number(key)), 'dd.MM.yyyy');
    case 'createdBy':
      return key.substring(key.lastIndexOf('/') + 1);
    default:
      return key;
  }
};

export function CheckListOption({
  checked,
  count,
  handleCheckedChange,
  id: key,
  filterField,
  label,
}: {
  checked: string | boolean;
  count: number | null;
  handleCheckedChange: (key: string) => void;
  id: string;
  filterField: string;
  label: string;
}) {
  return (
    <li className="flex flex-col gap-2" key={key}>
      <div className="flex items-center justify-between pt-3">
        <span className="font-bold text-white">{DisplayLabel(filterField, label)}</span>
        <span className="flex items-center justify-between gap-2">
          {!!count && <span className="text-primary-5">{`${count} datasets`}</span>}
          <Checkbox.Root
            className="h-[14px] w-[14px] rounded border border-white bg-transparent"
            checked={!!checked}
            onCheckedChange={() => handleCheckedChange(key)}
          >
            <Checkbox.Indicator className="flex w-full items-center justify-center">
              <CheckIcon className="check" fill="#fff" />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </span>
      </div>
      <CheckListDescription label={label} filterField={filterField} />
    </li>
  );
}
