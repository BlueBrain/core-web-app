export interface DetailProps {
  title: string;
  bold?: boolean;
  children: React.ReactNode;
}

export function Detail({ title, bold, children }: DetailProps) {
  return (
    <div className="mb-8">
      <div className="text-transparentBlack">{title}</div>
      <div className={`min-h-6 border-b pb-1 pt-1 text-dark font-${bold ? 'bold' : 'normal'}`}>
        {children}
      </div>
    </div>
  );
}
