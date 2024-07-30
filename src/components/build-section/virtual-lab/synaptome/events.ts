/* eslint-disable max-classes-per-file */
import { SynapseBubble } from '@/services/bluenaas-single-cell/renderer';

export const DISPLAY_SYNAPSES_3D_EVENT = 'DISPLAY_SYNAPSES_3D';
export const REMOVE_SYNAPSES_3D_EVENT = 'REMOVE_SYNAPSES_3D';
export const NEURITE_TYPES_EVENT = 'NEURITE_TYPES';

export class DisplaySynapses3DEvent extends Event {
  constructor(
    type: string,
    detail: {
      id: string;
      objects: Array<SynapseBubble>;
    }
  ) {
    super(type);
    this.detail = detail;
  }

  detail: {
    id: string;
    objects: Array<SynapseBubble>;
  };
}

export class RemoveSynapses3DEvent extends Event {
  constructor(
    type: string,
    detail: {
      id: string;
      objects: Array<SynapseBubble>;
    }
  ) {
    super(type);
    this.detail = detail;
  }

  detail: {
    id: string;
    objects: Array<SynapseBubble>;
  };
}

export class NeuriteTypesEvent extends Event {
  constructor(
    type: string,
    detail: {
      types: Array<string>;
    }
  ) {
    super(type);
    this.detail = detail;
  }

  detail: {
    types: Array<string>;
  };
}

export function sendDisplaySynapses3DEvent(id: string, objects: Array<SynapseBubble>) {
  if (objects.length) {
    const event = new DisplaySynapses3DEvent(DISPLAY_SYNAPSES_3D_EVENT, {
      id,
      objects,
    });
    window.dispatchEvent(event);
  }
}

export function sendRemoveSynapses3DEvent(id: string, objects: Array<SynapseBubble>) {
  if (objects.length) {
    const event = new RemoveSynapses3DEvent(REMOVE_SYNAPSES_3D_EVENT, {
      id,
      objects,
    });
    window.dispatchEvent(event);
  }
}

export function sendNeuriteTypesEvent(types: Array<string>) {
  if (types.length) {
    const event = new NeuriteTypesEvent(NEURITE_TYPES_EVENT, {
      types,
    });
    window.dispatchEvent(event);
  }
}
