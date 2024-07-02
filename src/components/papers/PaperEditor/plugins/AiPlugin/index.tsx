import { createPortal } from 'react-dom';
import {
  ComponentProps,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { computePosition } from '@floating-ui/core';
import { platform } from '@floating-ui/dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import usePointerDown from './usePointerDown';
import { AI_EXPAND_FAILED, AI_SUMMARIZE_FAILED } from '@/components/papers/utils/messages';
import { classNames } from '@/util/utils';
import { TextdirectionVertical, TextdirectionLToR } from '@/components/icons/EditorIcons';
import useNotification from '@/hooks/notifications';
import handleAiSummarizeParagraph from '@/services/paper-ai/summarizeParagraphAi';
import handleAiExpandParagraph from '@/services/paper-ai/expandParagraphAi';

const AI_ANCHOR_ELT = document.body;

type FloatingCommandsPosition = { x: number; y: number } | undefined;
type AiCommandsProps = { pos: FloatingCommandsPosition };

type AiCommandButtonProps = ComponentProps<'button'> & {
  title: string;
  icon: ReactNode;
};

function AiCommandButton({ title, icon, onClick, className }: AiCommandButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'group flex items-center justify-center gap-2 rounded-none px-2 py-1 hover:bg-gray-100',
        className
      )}
    >
      {icon}
      <span className="text-base text-primary-8 group-hover:font-bold">{title}</span>
    </button>
  );
}

const AiCommands = forwardRef<HTMLDivElement, AiCommandsProps>(({ pos }, ref) => {
  const [editor] = useLexicalComposerContext();
  const displayFloatMenu = pos !== undefined;
  const { error: errorNotify } = useNotification();
  const [isExpanding, setIsExpanding] = useState(false);
  const [IsSummarizing, setIsSummarizing] = useState(false);

  const onSummarizeCommand = async () => {
    const selectionText = editor.getEditorState().read(() => $getSelection()?.getTextContent());
    if (selectionText) {
      setIsSummarizing(true);
      try {
        const response = await handleAiSummarizeParagraph(selectionText);
        editor.update(() => {
          const selection = $getSelection();
          selection?.insertText(response);
        });
      } catch (error) {
        errorNotify(AI_SUMMARIZE_FAILED, undefined, 'topRight');
      } finally {
        setIsSummarizing(false);
      }
    }
  };

  const onExpandCommand = async () => {
    const selectionText = editor.getEditorState().read(() => $getSelection()?.getTextContent());
    if (selectionText) {
      setIsExpanding(true);
      try {
        const response = await handleAiExpandParagraph(selectionText);
        editor.update(() => {
          const selection = $getSelection();
          selection?.insertText(response);
        });
      } catch (error) {
        errorNotify(AI_EXPAND_FAILED, undefined, 'topRight');
      } finally {
        setIsExpanding(false);
      }
    }
  };

  return (
    <div
      id="float-ai"
      ref={ref}
      className={classNames(
        'absolute bg-white shadow-md transition-all ease-out',
        displayFloatMenu ? 'visible opacity-100' : 'hidden opacity-0'
      )}
      aria-hidden={!displayFloatMenu}
      style={{ top: pos?.y, left: pos?.x }}
    >
      <div className="flex items-center justify-between border border-gray-300">
        <AiCommandButton
          title="Expand"
          icon={
            isExpanding ? (
              <Spin indicator={<LoadingOutlined className="text-sm" spin />} />
            ) : (
              <TextdirectionVertical className="h-5 w-5 text-primary-9" />
            )
          }
          className="w-24 min-w-max"
          onClick={onExpandCommand}
        />
        <AiCommandButton
          title="Summarize"
          onClick={onSummarizeCommand}
          icon={
            IsSummarizing ? (
              <Spin indicator={<LoadingOutlined className="text-sm" spin />} />
            ) : (
              <TextdirectionLToR className="h-5 w-5 text-primary-9" />
            )
          }
          className="w-24 min-w-max"
        />
      </div>
    </div>
  );
});

export default function FloatAiCommandsPlugin() {
  const [editor] = useLexicalComposerContext();
  const ref = useRef<HTMLDivElement>(null);
  const [aiPos, updateAiPos] = useState<FloatingCommandsPosition>(undefined);
  const { isPointerDown, isPointerReleased } = usePointerDown(editor.getRootElement());
  const displayFloatMenu = aiPos !== undefined;

  const calculateAiCommandsPosition = useCallback(() => {
    const domSelection = getSelection();
    const domRange = domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0);
    if (!domRange || !ref.current || isPointerDown) {
      return updateAiPos(undefined);
    }

    computePosition(domRange, ref.current, {
      placement: 'bottom-start',
      platform,
    })
      .then((pos) => {
        updateAiPos({ x: pos.x, y: pos.y + 10 });
      })
      .catch(() => {
        updateAiPos(undefined);
      });
  }, [isPointerDown]);

  const $handleParagraphSelectionChange = useCallback(() => {
    if (editor.isComposing() || editor.getRootElement() !== document.activeElement) {
      updateAiPos(undefined);
      return;
    }
    const selection = $getSelection();

    if ($isRangeSelection(selection) && !selection.anchor.is(selection.focus)) {
      calculateAiCommandsPosition();
    } else {
      updateAiPos(undefined);
    }
  }, [editor, calculateAiCommandsPosition]);

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => $handleParagraphSelectionChange());
    });
    return unregisterListener;
  }, [editor, $handleParagraphSelectionChange]);

  useEffect(() => {
    if (!displayFloatMenu && isPointerReleased) {
      editor.getEditorState().read(() => $handleParagraphSelectionChange());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPointerReleased, $handleParagraphSelectionChange, editor]);

  return createPortal(<AiCommands ref={ref} pos={aiPos} />, AI_ANCHOR_ELT);
}

AiCommands.displayName = 'AiCommands';
