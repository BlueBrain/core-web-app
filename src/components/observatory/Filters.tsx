import * as Accordion from '@radix-ui/react-accordion';
import * as Switch from '@radix-ui/react-switch';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, ChevronIcon, EyeIcon, GripDotsVerticalIcon } from '@/components/icons';

function Filters() {
  const expandedStateStyle = `
.accordion-trigger .chevron {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.accordion-trigger[data-state='open'] .chevron {
  transform: rotate(90deg);
}

.checkbox[data-state='checked'] {
  background-color: white;
}
`;

  const filters = [
    { label: 'name' },
    { label: 'description' },
    { label: 'tags' },
    { label: 'status' },
    { label: 'date' },
    { label: 'updated_at' },
    { label: 'contributors' },
    {
      label: 'e-type',
      content: (
        <ul className="divide-y divide-white/20 flex flex-col space-y-3">
          {[
            { label: 'L5_NBC', value: 46 },
            { label: 'L23_LBC', value: 84 },
            { label: 'L5_MC', value: 78 },
          ].map(({ label: itemLabel, value }) => (
            <li className="flex items-center justify-between pt-3" key={itemLabel}>
              <span className="font-bold text-white">{itemLabel}</span>
              <span className="flex items-center justify-between gap-2">
                <span className="text-primary-5">{`${value} datasets`}</span>
                <Checkbox.Root
                  className="checkbox bg-transparent border border-white h-[14px] rounded w-[14px]"
                  name="e-type"
                >
                  <Checkbox.Indicator className="flex items-center justify-center w-full">
                    <CheckIcon className="check" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </span>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <Accordion.Root
      className="divide-y divide-primary-7 flex flex-col space-y-5"
      defaultValue={['e-type']}
      type="multiple"
    >
      {filters.map(({ label, content }) =>
        content ? (
          <Accordion.Item className="pt-5" value={label} key={label}>
            <style>{expandedStateStyle}</style>
            <Accordion.Trigger className="accordion-trigger flex items-center justify-between w-full">
              <div className="flex gap-3 items-center justify-between text-lg text-white">
                <GripDotsVerticalIcon fill="#1890FF" />
                <EyeIcon fill="white" />
                <span className="font-bold">
                  {label.replace(/^_*(.)|_+(.)/g, (_s, c, d) =>
                    c ? c.toUpperCase() : ` ${d.toUpperCase()}`
                  )}
                </span>
              </div>
              <ChevronIcon className="chevron" />
            </Accordion.Trigger>
            <Accordion.Content className="py-4">{content}</Accordion.Content>
          </Accordion.Item>
        ) : (
          <div className="flex gap-3 items-center pt-5 text-lg text-white" key={label}>
            <GripDotsVerticalIcon fill="#1890FF" />
            <EyeIcon fill="white" />
            <span className="font-bold">
              {label.replace(/^_*(.)|_+(.)/g, (_s, c, d) =>
                c ? c.toUpperCase() : ` ${d.toUpperCase()}`
              )}
            </span>
          </div>
        )
      )}
    </Accordion.Root>
  );
}

function Conditions() {
  const switchStyle = `
.SwitchRoot[data-state='checked'] {
  background-color: white;
}

.SwitchThumb[data-state='checked'] {
  background-color: #003A8C;
  transform: translateX(13px);
}
`;

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
        <style>{switchStyle}</style>
        {items.map(({ checked, label }) => (
          <li className="flex items-center justify-between" key={label}>
            <span className="font-semibold text-white">{label}</span>
            <span>
              <Switch.Root
                defaultChecked={checked}
                className="SwitchRoot bg-transparent border border-primary-4 h-[14px] rounded-full w-[27px]"
              >
                <Switch.Thumb className="SwitchThumb bg-primary-4 block h-[10px] rounded-full transition-transform translate-x-[1px] w-[10px] will-change-transform" />
              </Switch.Root>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ControlPanel() {
  return (
    <div className="bg-primary-9 flex flex-col space-y-4 pl-8 pr-16 py-10 w-[480px]">
      <span className="flex font-bold gap-2 items-baseline text-2xl text-white">
        Filters<small className="font-light text-base text-primary-3">10 Active Columns</small>
      </span>

      <p className="text-white">
        Sed risus pretium quam vulputate dignissim. Sollicitudin aliquam ultrices sagittis orci a
        scelerisque.
      </p>

      <Filters />

      <Conditions />
    </div>
  );
}
