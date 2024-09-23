const SOMA_COLOR = 0xf5f5f5;
const AXON_COLOR = 0x5c81ff;
const DEND_COLOR = 0xfe395b;
const APIC_COLOR = 0xa922a8;
const SPINE_COLOR = 0xff9900;
const EXC_COLOR = 0xff0000;
const INH_COLOR = 0x6699ff;

export function getSegmentColor(name: string) {
  let color = 0x888888;
  if (name.startsWith('soma')) {
    color = SOMA_COLOR;
  } else if (name.startsWith('axon')) {
    color = AXON_COLOR;
  } else if (name.startsWith('dend')) {
    color = DEND_COLOR;
  } else if (name.startsWith('apic')) {
    color = APIC_COLOR;
  } else if (name.startsWith('spine')) {
    color = SPINE_COLOR;
  } else if (name.startsWith('exc')) {
    color = EXC_COLOR;
  } else if (name.startsWith('inh')) {
    color = INH_COLOR;
  }
  return color;
}
