import { useRouter } from 'next/navigation';
import { classNames } from '@/util/utils';
import { DisplayMessages } from '@/constants/display-messages';
import Link from '@/components/Link';
import { EModel, NeuronMorphology } from '@/types/e-model';

const subtitleStyle = 'uppercase font-thin text-slate-600';

type Detail = {
  label: string;
  value: string | undefined;
};

type ModelDetailsProps = {
  details: Detail[];
};

type Props = {
  model: EModel | NeuronMorphology | undefined;
  modelType: string;
  selectUrl: string;
  generateDetailUrl: () => string;
  modelDetails: Detail[];
  reselectLink?: boolean;
};

export default function ModelCard({
  model,
  modelType,
  selectUrl,
  generateDetailUrl,
  modelDetails,
  reselectLink = false,
}: Props) {
  const router = useRouter();

  if (!model)
    return (
      <button
        type="button"
        onClick={() => {
          router.push(selectUrl);
        }}
        className="flex h-48 w-full items-center rounded-lg border border-neutral-2 pl-32 text-4xl text-neutral-4 hover:bg-primary-7 hover:text-white"
      >
        Select {modelType.toLowerCase()}
      </button>
    );

  const cardLink = reselectLink ? (
    <Link href={selectUrl} className="font-bold text-primary-8">
      Select a different {modelType.toLowerCase()}
    </Link>
  ) : (
    <Link href={generateDetailUrl()} target="_blank" className="font-bold text-primary-8">
      More details
    </Link>
  );

  return (
    <div className="w-full rounded-lg border p-10">
      <div className="flex justify-between">
        <div className={classNames('text-2xl', subtitleStyle)}>{modelType}</div>
        {cardLink}
      </div>

      <div className="mt-2 flex gap-10">
        <div className="flex-grow">
          <div className={subtitleStyle}>NAME</div>
          <div className="my-1 text-3xl font-bold text-primary-8">{model.name}</div>
          <ModelDetails details={modelDetails} />
        </div>
      </div>
    </div>
  );
}

export function ModelDetails({ details }: ModelDetailsProps) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-4 text-primary-8">
      {details.map((detail) => (
        <div key={`${detail.label}-${detail.value?.toString()}`}>
          <div className={subtitleStyle}>{detail.label}</div>
          <div>{detail.value || DisplayMessages.NO_DATA_STRING}</div>
        </div>
      ))}
    </div>
  );
}
