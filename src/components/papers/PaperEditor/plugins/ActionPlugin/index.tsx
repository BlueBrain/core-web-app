import { useState } from 'react';
import { Button } from 'antd';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { PAPER_UPDATED_FAILED, PAPER_UPDATED_SUCCESS } from '../../utils/messages';
import { PaperResource } from '@/types/nexus';
import useNotification from '@/hooks/notifications';

type Props = {
  paper: PaperResource;
};

export default function ActionPlugin({ paper }: Props) {
  const [editor] = useLexicalComposerContext();
  const [saving, setSaving] = useState(false);
  const { error: errorNotify, success: successNotify } = useNotification();
  const onSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/paper-ai/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper,
          state: editor.getEditorState().toJSON(),
        }),
      });
      if (response.ok) {
        successNotify(PAPER_UPDATED_SUCCESS, undefined, 'topRight');
      } else {
        errorNotify(PAPER_UPDATED_FAILED, undefined, 'topRight');
      }
    } catch (error) {
      errorNotify(PAPER_UPDATED_FAILED, undefined, 'topRight');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-[3.3rem] z-50 flex items-center justify-end gap-3 py-4">
      <Button
        disabled={saving}
        loading={saving}
        htmlType="button"
        type="primary"
        className="h-12 rounded-none bg-primary-8 px-12 text-lg"
        onClick={onSave}
      >
        Save
      </Button>
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
