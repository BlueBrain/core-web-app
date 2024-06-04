import { $getSelection, $isParagraphNode, $isRangeSelection } from 'lexical';

export default function isSelectionEntireParagraph() {
  let isFullParagraph = false;
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();

    // Ensure the anchor and focus nodes are within the same paragraph node
    const commonAncestor = anchorNode.getCommonAncestor(focusNode);
    if ($isParagraphNode(commonAncestor)) {
      const paragraphNode = commonAncestor;

      // Check if selection starts at the beginning and ends at the end of the paragraph node
      const paragraphText = paragraphNode.getTextContent();
      const selectedText = selection.getTextContent();

      // Ensure the selected text matches the paragraph's text
      if (selectedText === paragraphText) {
        isFullParagraph = true;
      }
    }
  }
  return isFullParagraph;
}
