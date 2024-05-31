import { $getSelection } from 'lexical';

export function isSelectionEntireParagraph() {
  let ruleFailed = false;
  const selection = $getSelection();

  if (selection) {
    const selectedNodesCount = selection.getNodes().length;
    const nodes = selection.getNodes();

    for (const node of nodes) {
      const isParentParagraph = node?.getParent()?.getType() === 'paragraph';
      const parentChildrenSize = node?.getParent()?.getChildrenSize();
      if (!(isParentParagraph && selectedNodesCount === parentChildrenSize)) {
        ruleFailed = true;
        break;
      }
    }
    return !ruleFailed;
  }

  return false;
}
