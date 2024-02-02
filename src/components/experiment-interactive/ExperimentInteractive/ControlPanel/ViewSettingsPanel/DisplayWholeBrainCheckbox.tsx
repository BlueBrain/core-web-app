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
        className="h-5 w-5 rounded border border-white bg-transparent"
        checked={isDisplayWholeBrainChecked}
        onCheckedChange={handleCheckedChange}
      >
        <Checkbox.Indicator className="flex w-full items-center justify-center">
          <CheckIcon className="check" />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  );
}
