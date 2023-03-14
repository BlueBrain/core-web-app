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
      <span className="font-semibold text-primary-4 text-lg">Conditions</span>
      <ul className="flex flex-col space-y-5">
        {items.map(({ checked, label }) => (
          <li className="flex items-center justify-between" key={label}>
            <span className="font-semibold text-white">{label}</span>
            <span>
              <Switch.Root
                defaultChecked={checked}
                className={classNames(
                  styles.switchRoot,
                  'bg-transparent border border-primary-4 h-[14px] rounded-full w-[27px]'
                )}
              >
                <Switch.Thumb
                  className={classNames(
                    styles.switchThumb,
                    'bg-primary-4 block h-[10px] rounded-full transition-transform translate-x-[1px] w-[10px] will-change-transform'
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
