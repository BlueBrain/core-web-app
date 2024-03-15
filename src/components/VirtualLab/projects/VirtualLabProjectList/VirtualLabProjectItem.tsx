import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Project } from './types';

type Props = {
  project: Project;
};

export default function VirtualLabProjectItem({ project }: Props) {
  return (
    <div className="rounded-md border border-primary-6 px-4 py-6">
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
    </div>
  );
}
