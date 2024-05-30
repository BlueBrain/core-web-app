import { Button } from 'antd';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export default function ActionPlugin() {
  useLexicalComposerContext();

  return (
    <div className="fixed bottom-4 right-14 flex items-center justify-end gap-3 py-4">
      <Button
        htmlType="button"
        type="primary"
        className="h-12 rounded-none bg-primary-8 px-12 text-lg"
      >
        Preview
      </Button>
      <Button
        htmlType="button"
        type="primary"
        className="h-12 rounded-none bg-primary-8 px-12 text-lg"
      >
        Export
      </Button>
    </div>
  );
}
