import { CSSProperties } from 'react';

type ArrowDownOutlinedIconProps = {
  className?: string;
  fill?: string;
  style?: CSSProperties;
};

export default function ArrowDownOutlinedIcon({
  className,
  fill = '#40A9FF',
  style,
}: ArrowDownOutlinedIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M28.5 14.3321H25.6071C25.4429 14.3321 25.2857 14.4036 25.175 14.5286L17.3571 23.5393V3.42857C17.3571 3.27142 17.2286 3.14285 17.0714 3.14285H14.9286C14.7714 3.14285 14.6429 3.27142 14.6429 3.42857V23.5393L6.825 14.5286C6.71786 14.4036 6.56071 14.3321 6.39286 14.3321H3.5C3.25714 14.3321 3.125 14.6214 3.28571 14.8036L15.1393 28.4643C15.2464 28.5879 15.3789 28.687 15.5277 28.755C15.6765 28.8229 15.8382 28.8581 16.0018 28.8581C16.1654 28.8581 16.327 28.8229 16.4759 28.755C16.6247 28.687 16.7571 28.5879 16.8643 28.4643L28.7143 14.8036C28.875 14.6179 28.7429 14.3321 28.5 14.3321Z" />
    </svg>
  );
}
