import ProjectItem from './ProjectItem';
import { getVirtualLabProjects } from '@/services/virtual-lab/projects';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

export default async function VirtualLabProjects({ id }: { id?: string }) {
  const virtualLabProjects = id ? (await getVirtualLabProjects(id, 3)).data.results : undefined;
  return (
    <div className="mt-10">
      <div className="my-5 text-lg font-bold uppercase">Highlighted Projects</div>
      <div className="flex flex-row gap-5">
        {virtualLabProjects?.map((project) => (
          <ProjectItem
            key={project.id}
            title={project.name}
            description={project.description}
            buttonHref={id && `${generateVlProjectUrl(id, project.id)}/home`}
          />
        ))}
      </div>
    </div>
  );
}
