import { classNames } from '@/util/utils';

const spinnerClassName =
  'box-border block absolute animate-rotate m-2 rounded-[50%] border-8 border-solid border-transparent border-t-current';

function NeuronLoader({ text, w, h }: { text: string; w?: number; h?: number }) {
  return (
    <div className={classNames('relative z-30', !w && 'w-52', !h && 'h-52')}>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-[calc(50%-8px)] -translate-y-1/2 items-center justify-center text-center text-[1.5vw] font-bold text-white">
        {text}
      </div>
      <div
        className={classNames(
          'relative box-border inline-block text-white',
          !w && 'w-52',
          !h && 'h-52'
        )}
        style={{ width: w, height: h }}
      >
        <div
          className={classNames(spinnerClassName, !w && 'w-52', !h && 'h-52')}
          style={{
            animationDelay: '-0.45s',
          }}
        />
        <div
          className={classNames(spinnerClassName, !w && 'w-52', !h && 'h-52')}
          style={{
            animationDelay: '-0.3s',
          }}
        />
        <div
          className={classNames(spinnerClassName, !w && 'w-52', !h && 'h-52')}
          style={{
            animationDelay: '-0.15s',
          }}
        />
        <div />
      </div>
    </div>
  );
}

export default NeuronLoader;
