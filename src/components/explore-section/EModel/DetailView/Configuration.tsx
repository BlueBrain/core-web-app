import Link from '@/components/Link';
import EModelView from '@/components/build-section/cell-model-assignment/e-model/EModelView';

export default function Configuration() {
  return (
    <div className="-mt-7 h-full">
      <div className="mb-6 border border-primary-8 p-6">
        <EModelView showTitle={false} />
      </div>
      <div className="flex w-full items-end justify-end">
        <Link
          preserveLocationSearchParams
          href="/build/cell-model-assignment/e-model/configuration"
          className="border border-primary-8 bg-primary-8 px-16 py-3 text-xl font-bold leading-7 text-white hover:bg-white hover:text-primary-8"
        >
          Open in build
        </Link>
      </div>
    </div>
  );
}
