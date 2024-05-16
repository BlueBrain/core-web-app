import { basePath } from '@/config';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';

export default function Custom404() {
  const availableUrls = Object.values(EXPERIMENT_DATA_TYPES).map(
    (dt) => `${basePath}/virtual-lab/sandbox/explore/interactive/experimental/${dt.name}`
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-primary-8 p-10  shadow-lg">
        <h1 className="mb-4 text-center text-3xl font-bold text-primary-3">
          404 - Data type not Found
        </h1>
        <div className="text-white">
          <p className="my-4 text-center">
            The data type you are looking for does not exist. The available data types are:
          </p>
          <ul className="list-disc">
            {availableUrls.map((url) => (
              <li key={url}>{url}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
