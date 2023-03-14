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
    <div className="option-select">
      <label htmlFor="optionSelect">
        <b>{title}</b>
        {numberOfAvailable > 1 && <>&nbsp;({numberOfAvailable} available)</>}
      </label>
      {numberOfAvailable > 1 ? (
        <Select
          id="optionSelect"
          className="w-100"
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
