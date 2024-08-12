/* eslint-disable max-classes-per-file */

import { InstancedBufferGeometry, Mesh, ShaderMaterial } from 'three';

export const DISPLAY_SYNAPSES_3D_EVENT = 'DISPLAY_SYNAPSES_3D';
export const REMOVE_SYNAPSES_3D_EVENT = 'REMOVE_SYNAPSES_3D';
export const NEURITE_TYPES_EVENT = 'NEURITE_TYPES';

export type SynapsesMesh = Mesh<InstancedBufferGeometry, ShaderMaterial>;

export class DisplaySynapses3DEvent extends Event {
  constructor(
    type: string,
    detail: {
      id: string;
      mesh: SynapsesMesh;
    }
  ) {
    super(type);
    this.detail = detail;
  }

  detail: {
    id: string;
    mesh: SynapsesMesh;
  };
}

export class RemoveSynapses3DEvent extends Event {
  constructor(
    type: string,
    detail: {
      id: string;
      meshId: string;
    }
  ) {
    super(type);
    this.detail = detail;
  }

  detail: {
    id: string;
    meshId: string;
  };
}

export function sendDisplaySynapses3DEvent(id: string, mesh: SynapsesMesh) {
  if (mesh) {
    const event = new DisplaySynapses3DEvent(DISPLAY_SYNAPSES_3D_EVENT, {
      id,
      mesh,
    });
    window.dispatchEvent(event);
  }
}

export function sendRemoveSynapses3DEvent(id: string, meshId: string) {
  if (meshId) {
    const event = new RemoveSynapses3DEvent(REMOVE_SYNAPSES_3D_EVENT, {
      id,
      meshId,
    });
    window.dispatchEvent(event);
  }
}
