import VirtualLabProjectItem from './VirtualLabProjectItem';
import { mockProjects } from './mockData';

export default function VirtualLabProjectList() {
  const projects = mockProjects;
  return (
    <div className="my-5 flex flex-col gap-4">
      {projects.map((project) => (
        <VirtualLabProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
}
