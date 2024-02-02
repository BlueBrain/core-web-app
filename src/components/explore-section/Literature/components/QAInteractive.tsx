import QAResultList from './GenerativeQAResults';
import QAInput from './GenerativeQAInput';
import QAFilterPanel from './FilterPanel';

export default function QAInteractive() {
  return (
    <div className="max-w-ful relative flex w-full flex-col overflow-hidden transition-all duration-300 ease-in-out">
      <main className="flex h-full w-full flex-1 flex-col items-stretch">
        <QAResultList />
        <QAInput />
        <QAFilterPanel />
      </main>
    </div>
  );
}
