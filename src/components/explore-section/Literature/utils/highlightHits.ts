import { HighlightHit } from '@/types/literature';

const charsBeforeStart = 50;
const charsAfterEnd = 200;
const highlightHits = ({ description, hits }: { description: string; hits: HighlightHit[] }) => {
  // Sort the highlights array based on the start position to handle overlaps correctly
  hits.sort((a, b) => a.start - b.start);
  let highlightedText = '';

  // Iterate through each highlight and construct the highlighted text
  for (let i = 0; i < hits.length; i += 1) {
    const { start, end } = hits[i];

    const highlightStart = Math.max(0, start - charsBeforeStart);
    const highlightEnd = Math.min(description.length, end + charsAfterEnd);

    // Append the text before the start position and the highlighted portion with <b> tags
    highlightedText += description.substring(highlightStart, start);
    highlightedText += `<b> ${description.substring(start, end)} </b>`;

    // If there's another highlight after this, add the text between the current end and the next start
    if (hits[i + 1]) {
      const nextStart = hits[i + 1].start;
      highlightedText += description.substring(end, nextStart);
    } else {
      // If it's the last highlight, add the text after the end position
      highlightedText += description.substring(end, highlightEnd);
    }
  }
  return `... ${highlightedText} ...`;
};

export default highlightHits;
