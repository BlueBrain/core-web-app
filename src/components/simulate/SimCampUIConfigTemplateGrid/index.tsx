import { EyeIcon } from '@/components/icons';
import CloneIcon from '@/components/icons/Clone';

function TemplateBlock({ name }: { name: string }) {
  return (
    <div className="border p-6 border-primary-4">
      <div className="flex justify-between">
        <div className="font-bold text-2xl">{name}</div>
        <div className="flex items-center gap-2">
          <EyeIcon fill="white" />
          <CloneIcon />
        </div>
      </div>
      <div>Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet.</div>
    </div>
  );
}

export default function SimCampUIConfigTemplateGrid() {
  return (
    <div className="grid grid-cols-2 gap-10 mt-10">
      <TemplateBlock name="Template n°1" />
      <TemplateBlock name="Template n°2" />
      <TemplateBlock name="Template n°3" />
      <TemplateBlock name="Template n°4" />
    </div>
  );
}
