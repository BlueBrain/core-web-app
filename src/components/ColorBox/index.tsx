type ColorBoxProps = {
  color: string;
};

export default function ColorBox({ color }: ColorBoxProps) {
  // setting the background in inline style because tailwind classes cannot work on render
  return (
    <div
      className="m-[5px] w-[12px] h-[12px] rounded-sm flex-none grow-0"
      style={{ background: color }}
    />
  );
}
