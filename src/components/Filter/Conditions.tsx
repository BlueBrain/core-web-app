import * as Switch from '@radix-ui/react-switch';
import { classNames } from '@/util/utils';
import styles from './conditions.module.scss';

export default function Conditions() {
  const items = [
    { label: 'Data Validated', checked: true },
    { label: 'Biological source', checked: false },
    { label: 'Synthetic source', checked: true },
    { label: 'Associated literature', checked: false },
  ];

  return (
    <div>
      <span className="text-lg font-semibold text-primary-4">Conditions</span>
      <ul className="flex flex-col space-y-5">
        {items.map(({ checked, label }) => (
          <li className="flex items-center justify-between" key={label}>
            <span className="font-semibold text-white">{label}</span>
            <span>
              <Switch.Root
                defaultChecked={checked}
                className={classNames(
                  styles.switchRoot,
                  'h-[14px] w-[27px] rounded-full border border-primary-4 bg-transparent'
                )}
              >
                <Switch.Thumb
                  className={classNames(
                    styles.switchThumb,
                    'block h-[10px] w-[10px] translate-x-[1px] rounded-full bg-primary-4 transition-transform will-change-transform'
                  )}
                />
              </Switch.Root>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
