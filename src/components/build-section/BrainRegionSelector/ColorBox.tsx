type ColorBoxProps = {
  color: string;
};

export default function ColorBox({ color }: ColorBoxProps) {
  // setting the background in inline style because tailwind classes cannot work on render
  return (
    <span className="h-[12px] w-[12px] flex-none grow-0 rounded-sm" style={{ background: color }} />
  );
}
