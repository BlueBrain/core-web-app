/* eslint-disable @next/next/no-img-element */

type Props = {
  className?: string;
};

const titleStyle = 'ml-8 font-bold text-primary-8 text-xl';
const imgBase = '/images/build-section/m-model';

export default function MModelPreviewImages({ className }: Props) {
  return (
    <div className={className}>
      <div className="flex flex-col w-1/2">
        <div>
          <h2 className={titleStyle}>Persistence barcode</h2>
          <img
            style={{ objectFit: 'contain' }}
            src={`${imgBase}/Persistence-barcode.png`}
            alt="Persistence barcode"
          />
        </div>
        <div>
          <h2 className={titleStyle}>Persistence diagram</h2>
          <img
            style={{ objectFit: 'contain' }}
            src={`${imgBase}/Persistence-diagram.png`}
            alt="Persistence diagram"
          />
        </div>
        <div>
          <h2 className={titleStyle}>Persistence image</h2>
          <img
            style={{ objectFit: 'contain' }}
            src={`${imgBase}/Persistence-image.png`}
            alt="Persistence plot"
          />
        </div>
      </div>

      <div className="w-1/2">
        <h2 className={titleStyle}>Synthesis / test h5</h2>
        <img
          style={{ objectFit: 'contain' }}
          src={`${imgBase}/Synthesis_test_h5.png`}
          alt="Synthesis / test h5"
        />
      </div>
    </div>
  );
}
