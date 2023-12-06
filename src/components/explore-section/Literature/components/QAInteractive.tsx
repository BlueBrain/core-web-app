import QAResultList from './GenerativeQAResults';
import QAInput from './GenerativeQAInput';
import QAFilterPanel from './FilterPanel';

export default function QAInteractive() {
  return (
    <div className="relative flex flex-col w-full overflow-hidden transition-all duration-300 ease-in-out max-w-ful">
      <main className="flex flex-col items-stretch flex-1 w-full h-full">
        <QAResultList />
        <QAInput />
        <QAFilterPanel />
      </main>
    </div>
  );
}
