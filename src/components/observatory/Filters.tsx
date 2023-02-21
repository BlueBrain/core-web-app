import * as Accordion from '@radix-ui/react-accordion';
import { ArrowDownOutlinedIcon, EyeIcon, GripDotsVerticalIcon } from '@/components/icons';

const expandedStateStyle = `
.accordion-trigger svg {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.accordion-trigger[data-state='open'] svg {
  transform: rotate(180deg);
}
`;

export default function Filters() {
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
      items: [
        { label: 'L5_NBC', value: 46 },
        { label: 'L23_LBC', value: 84 },
        { label: 'L5_MC', value: 78 },
      ],
    },
  ].map(({ label, items }) => (
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
        <ArrowDownOutlinedIcon fill="white" />
      </Accordion.Trigger>
      <Accordion.Content className="py-4">
        {items && (
          <ul className="divide-y divide-white flex flex-col space-y-3">
            {items.map(({ label: itemLabel, value }) => (
              <li className="flex items-center justify-between pt-3" key={itemLabel}>
                <span className="font-bold text-white">{itemLabel}</span>
                <span className="text-primary-5">{value}</span>
              </li>
            ))}
          </ul>
        )}
      </Accordion.Content>
    </Accordion.Item>
  ));

  return (
    <div className="bg-primary-9 px-8 py-10 w-[480px]">
      <span className="flex font-bold gap-2 items-baseline text-2xl text-white">
        Filters<small className="font-light text-base text-primary-3">10 Active Columns</small>
      </span>

      <p className="text-white py-3">
        Sed risus pretium quam vulputate dignissim. Sollicitudin aliquam ultrices sagittis orci a
        scelerisque.
      </p>

      <Accordion.Root
        className="divide-y divide-primary-7 flex flex-col space-y-5"
        defaultValue={['e-type']}
        type="multiple"
      >
        {filters}
      </Accordion.Root>
    </div>
  );
}
