import { Select } from 'antd';

interface OptionSelectProps {
  label: {
    title: string;
    numberOfAvailable: number;
  };
  value: string;
  handleChange: (value: string) => void;
  options: JSX.Element[] | null;
  hideWhenSingle?: boolean;
}

function OptionSelect({
  label: { numberOfAvailable, title },
  value,
  handleChange,
  options,
  hideWhenSingle = false,
}: OptionSelectProps) {
  if (hideWhenSingle && numberOfAvailable === 1) {
    return null;
  }
  return (
    <div className="flex flex-col gap-3">
      <label className="font-bold text-dark" htmlFor="optionSelect">
        {title}
        <small className="font-light text-sm">
          {numberOfAvailable > 1 && <>&nbsp;({numberOfAvailable} available)</>}
        </small>
      </label>
      {numberOfAvailable > 1 ? (
        <Select
          id="optionSelect"
          className="w-[222px]"
          value={value}
          placeholder="Please select"
          onChange={handleChange}
        >
          {options}
        </Select>
      ) : (
        <>:&nbsp;{value}</>
      )}
    </div>
  );
}

export default OptionSelect;
