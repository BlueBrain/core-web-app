import Link from '@/components/Link';

type Props = {
  title: string;
  text: string;
  url: string;
};

export default function ObservatoryNavItem({ title, text, url }: Props) {
  return (
    <Link href={url}>
      <div>
        <h1>{title}</h1>
        <span>+</span>
      </div>
      <p>{text}</p>
      <button type="button">Browse</button>
    </Link>
  );
}
