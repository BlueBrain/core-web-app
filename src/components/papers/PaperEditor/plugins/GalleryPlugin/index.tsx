import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';

import {
  $createGalleryNode,
  INSERT_GALLERY_COMMAND,
  InsertGalleryPayload,
} from '../ImagePlugin/utils';
import GalleryNode from './Node';

export default function GalleryPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([GalleryNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertGalleryPayload>(
        INSERT_GALLERY_COMMAND,
        ({ title, description, images }) => {
          const galleryNode = $createGalleryNode(title, description, images);
          $insertNodes([galleryNode]);
          if ($isRootOrShadowRoot(galleryNode.getParentOrThrow())) {
            $wrapNodeInElement(galleryNode, $createParagraphNode).selectEnd();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
