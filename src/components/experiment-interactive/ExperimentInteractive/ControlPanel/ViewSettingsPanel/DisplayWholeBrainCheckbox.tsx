import { useAtom } from 'jotai';
import * as Checkbox from '@radix-ui/react-checkbox';

import { CheckIcon } from '@/components/icons';
import { isDisplayWholeBrainCheckedAtom } from '@/state/experiment-interactive';

export default function DisplayWholeBrainCheckbox() {
  const [isDisplayWholeBrainChecked, setIsDisplayWholeBrainChecked] = useAtom(
    isDisplayWholeBrainCheckedAtom
  );

  const handleCheckedChange = () => setIsDisplayWholeBrainChecked((prev) => !prev);

  return (
    <div className="flex flex-row justify-between p-3 py-5">
      <button type="button" className="" onClick={handleCheckedChange}>
        Display whole brain
      </button>

      <Checkbox.Root
        className="bg-transparent border border-white h-5 w-5 rounded"
        checked={isDisplayWholeBrainChecked}
        onCheckedChange={handleCheckedChange}
      >
        <Checkbox.Indicator className="flex items-center justify-center w-full">
          <CheckIcon className="check" />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  );
}
