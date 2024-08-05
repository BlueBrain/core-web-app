export const SEGMENT_DETAILS_EVENT = 'SEGMENT_DETAILS_EVENT';

type SegmentDetailsEvent = {
  show: boolean;
  data?: any;
};
export class HoveredSegmentDetailsEvent extends Event {
  constructor(type: string, detail: SegmentDetailsEvent) {
    super(type);
    this.detail = detail;
  }

  detail: SegmentDetailsEvent;
}

export function sendSegmentDetailsEvent(detail: SegmentDetailsEvent) {
  const event = new HoveredSegmentDetailsEvent(SEGMENT_DETAILS_EVENT, detail);
  window.dispatchEvent(event);
}
