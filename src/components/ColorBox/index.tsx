type ColorBoxProps = {
  color: string;
};

export default function ColorBox({ color }: ColorBoxProps) {
  // setting the background in inline style because tailwind classes cannot work on render
  return (
    <div
      className="m-[5px] shadow-[0px_0px_8px_rgba(0,0,0,0.35)] w-[12px] h-[12px] box-border border border-solid border-[#ffffff80] rounded-2px flex-none grow-0"
      style={{ background: color }}
    />
  );
}
