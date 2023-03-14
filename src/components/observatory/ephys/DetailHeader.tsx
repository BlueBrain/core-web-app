import { useAtomValue } from 'jotai';
import { format, parseISO } from 'date-fns';
import { find } from 'lodash';
import { detailAtom } from '@/state/ephys/detail';
import { EphysDeltaResource, AnnotationEntity } from '@/types/observatory';

const getEtype = (x: EphysDeltaResource) => {
  const entity = find(x.annotation, (o: AnnotationEntity) => o.name === 'E-type Annotation');
  return entity ? entity.hasBody.label : 'no EType';
};

export default function DetailHeader() {
  const detail = useAtomValue(detailAtom);

  if (!detail) return <>Not Found</>;

  return (
    <div className="p-7 bg-white">
      <div className="text-xs font-thin text-primary-7">Name</div>
      <div className="font-bold text-xl text-primary-7">{detail.name}</div>
      <div className="flex justify-between mt-10">
        <div className="flex-1 text-primary-7 text-xs mr-4">
          <div className="uppercase text-neutral-4">Description</div>
          <div className="mt-3 w-2/3 pr-6">{detail.description}</div>
        </div>

        <div className="flex-auto text-primary-7 text-xs mr-4">
          <div className="text-xs uppercase text-neutral-4">E Type</div>
          <div className="mt-3">{getEtype(detail)}</div>
          <div className="text-xs uppercase text-neutral-4 mt-4">Brain Location</div>
          <div className="mt-3">{detail.brainLocation?.brainRegion?.label}</div>
        </div>
      </div>
      <div className="flex mt-10">
        <div className="text-primary-7 text-xs mr-10">
          <div className="text-xs uppercase text-neutral-4">Contributor</div>
          <div className="mt-3 capitalize">{detail._createdBy.split('/').pop()}</div>
        </div>
        <div className="text-primary-7 text-xs mr-4">
          <div className="text-xs uppercase text-neutral-4">Added</div>
          <div className="mt-3">{format(parseISO(detail._createdAt), 'dd.MM.yyyy')}</div>
        </div>
      </div>
    </div>
  );
}
