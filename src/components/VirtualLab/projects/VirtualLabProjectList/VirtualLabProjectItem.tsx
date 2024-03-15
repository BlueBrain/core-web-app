import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Project } from './types';

type Props = {
  project: Project;
};

function ProjectDetail({ title, detail }: { title: string; detail: number | string }) {
  return (
    <div className="flex gap-3">
      <div className="text-primary-3">{title}</div>
      <div className="font-bold">{detail}</div>
    </div>
  );
}

export default function VirtualLabProjectItem({ project }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-primary-6 px-4 py-6">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{project.title}</h2>

        <div className="flex items-center justify-between gap-6">
          <div className="flex gap-2">
            <span className="text-primary-3">Latest update</span>
            <span className="font-bold">{project.latestUpdate}</span>
          </div>
          <div>
            {project.isFavorite ? (
              <StarFilled style={{ fontSize: '18px', color: '#FFD465' }} />
            ) : (
              <StarOutlined style={{ fontSize: '18px' }} />
            )}
          </div>
        </div>
      </div>
      {/* Description row */}
      <div className="max-w-[70%]">{project.description}</div>
      {/* Last row */}
      <div className="flex gap-5">
        <ProjectDetail title="Explore sessions" detail={project.exploreSessions} />
        <ProjectDetail title="Builds" detail={project.builds} />
        <ProjectDetail title="Simulation experiments" detail={project.simulationExperiments} />
        <ProjectDetail title="Members" detail={project.members} />
        <ProjectDetail title="Admin" detail={project.admin} />
        <ProjectDetail title="Creation date" detail={project.creationDate} />
      </div>
    </div>
  );
}
