type Props = {
  total: number;
  totalSpent: number;
  remaining: number;
};

export default function BudgetPanel({ total, totalSpent, remaining }: Props) {
  return (
    <div className="mt-[3px] flex flex-col gap-5 bg-primary-8 p-8">
      {/* Title + total */}
      <div className="flex justify-between">
        <h4 className="font-semibold">Budget</h4>
        <div className="text-primary-2">
          Total budget: <span>$1650</span>
        </div>
      </div>
      {/* budget loader */}
      <div className="h-3 overflow-hidden rounded-full bg-primary-3">
        <div className="h-full w-[60%] bg-white" />
      </div>
      {/* Total spent + remaining */}
      <div className="flex justify-between">
        <div className="flex flex-row gap-3">
          <div>Total spent</div>
          <span className="font-bold">$1300</span>
        </div>
        <div className="text-primary-3">
          Remaining: <span>$350</span>
        </div>
      </div>
    </div>
  );
}
