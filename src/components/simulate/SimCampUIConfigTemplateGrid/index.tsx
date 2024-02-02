import CloneIcon from '@/components/icons/Clone';

function TemplateBlock({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-2 border border-primary-6 p-5">
      <div className="flex justify-between">
        <div className="text-xl font-bold">{name}</div>
        <div className="flex items-center gap-2">
          <CloneIcon />
        </div>
      </div>
      <div className="max-w-[300px] text-primary-2">
        Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet.
      </div>
    </div>
  );
}

export default function SimCampUIConfigTemplateGrid() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <TemplateBlock name="Template n°1" />
      <TemplateBlock name="Template n°2" />
      <TemplateBlock name="Template n°3" />
      <TemplateBlock name="Template n°4" />
    </div>
  );
}
