import { IdLabel } from '@/types/explore-section/fields';

export default function ListField({ items }: { items: IdLabel[] | undefined | null }) {
  if (!items) return null;

  return (
    <ul>
      {items?.map((item) => (
        <li key={item.id} className="break-words">
          {item.label}
        </li>
      ))}
    </ul>
  );
}
